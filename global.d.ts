namespace global {
    class Go {
        run: (instance: WebAssembly.Instance) => Promise<any>;
        importObject: Record<string, any>;
    }
}