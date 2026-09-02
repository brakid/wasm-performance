const wasmFile = Bun.file("./go/goroutineapp.wasm");
const wasmBuffer = await wasmFile.arrayBuffer();

const sleep = async (timeout: number) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

require("./wasm_exec");
const go = new global.Go();

const wasmModule = await WebAssembly.instantiate(wasmBuffer, go.importObject);

type Exports = {
  memory: WebAssembly.Memory;
  getCellPtr: () => number;
};

const { memory, getCellPtr } = wasmModule.instance.exports as Exports;

const main = go.run(wasmModule.instance);
const dataView = new DataView(memory.buffer);

dataView.setUint32(getCellPtr(), 42, true);
await sleep(100);
dataView.setUint32(getCellPtr(), 43, true);
await sleep(100);
dataView.setUint32(getCellPtr(), 44, true);
await sleep(100);
dataView.setUint32(getCellPtr(), 45, true);
await sleep(100);
dataView.setUint32(getCellPtr(), 0), true;
await main;