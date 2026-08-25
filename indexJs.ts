import { updateAndRender } from './dist/bounce.js';

let lastTimestamp = Date.now();

const latencies = [];
for (let i = 0; i < 100000; i++) {
    const start = Bun.nanoseconds();
    updateAndRender(10 / 1000);
    const end = Bun.nanoseconds();
    latencies.push(end - start);
}
console.log("Average duration (in ns):", latencies.reduce((prev, latency) => prev+latency, 0) / latencies.length);