# Performance comparison councing ball - WASM vs Javascript

* Webassembly: [https://webassembly.org/](https://webassembly.org/) - compiled, binary - designed for speed
* Tinygo: [https://tinygo.org/](https://tinygo.org/) - Golang compiler, can target WASM

Setting: 100000 render calls

### Javascript performance
```
bun run compile
bun run indexJs.ts 
Average duration (in ns): 436120.1897
```

### Golang/WASM performance
```
bun run compilego
bun run index.ts 
Average duration (in ns): 102870.8583
```

WASM performs ~4x faster than Javascript, however part of the performance gain can be lost again due to the Javascript <-> WASM boundary - especially when retrieving the next frame buffer compared to staying natively in Javascript.