FLAGS = -target=wasm -buildmode=c-shared -no-debug -opt=2 -gc=leaking -scheduler=none

bounce.wasm: bounce.go
	tinygo build $(FLAGS) -o ../dist/bounce.wasm ./bounce.go

goroutineapp.wasm: goroutineapp.go
	tinygo build -target=wasm -o goroutineapp.wasm goroutineapp.go