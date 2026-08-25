const decoder = new TextDecoder("utf-8");
const wasmFile = Bun.file("./dist/bounce.wasm");
const wasmBuffer = await wasmFile.arrayBuffer();

const importObject = {
    wasi_snapshot_preview1: {
        fd_write: (fileDescriptor: number, messagesPtr: number, messagesLength: number, bytesWrittenPtr: number): number => {
            const messages = [];
            for (let i = 0; i < messagesLength; i++) {
                messages.push(getString(getInt32(messagesPtr + i * 8), getInt32(messagesPtr + 4 + i * 8)));
            }
            const bytesWritten = messages.map(value => value.length).reduce((prev, length) => prev + length, 0)
            console.log("File Descriptor", fileDescriptor, messages, bytesWritten);
            setInt32(bytesWrittenPtr, bytesWritten);
            return 0;
        },
        random_get: (bufferPtr: number, bufferLength: number) => {
            console.log("random_get", bufferPtr, bufferLength);
            for (let i = 0; i < bufferLength; i++) {
                setInt8(bufferPtr + i, Math.random() * 255);
            }
            return 0;
        }
    },
};

const wasmModule = await WebAssembly.instantiate(wasmBuffer, importObject);

type Exports = {
  memory: WebAssembly.Memory;
  _initialize: () => void,
  updateAndRender: (timeDelta: number) => void,
};

const { memory, _initialize, updateAndRender } = wasmModule.instance.exports as Exports;

const getInt32 = (pointer: number): number => {
    const dataView = new DataView(memory.buffer);
    return dataView.getInt32(pointer, true);
};

const getUint8Array = (pointer: number, length: number): Uint8ClampedArray => {
    return new Uint8ClampedArray(memory.buffer, pointer, length);
};

const getString = (pointer: number, length: number): string => {
    return decoder.decode(getUint8Array(pointer, length));
};

const setInt8 = (pointer: number, value: number) => {
    const dataView = new DataView(memory.buffer);
    dataView.setInt8(pointer, value);
};

const setInt32 = (pointer: number, value: number) => {
    const dataView = new DataView(memory.buffer);
    dataView.setInt32(pointer, value);
};

_initialize();

const latencies = [];
for (let i = 0; i < 100000; i++) {
    const start = Bun.nanoseconds();
    updateAndRender(10 / 1000);
    const end = Bun.nanoseconds();
    latencies.push(end - start);
}
console.log("Average duration (in ns):", latencies.reduce((prev, latency) => prev+latency, 0) / latencies.length);