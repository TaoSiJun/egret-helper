namespace h {
    export class Test {
        public testEmitter() {
            let emitter = new EventEmitter<"test1" | "test2">();
            emitter.on("test1", test1, this);
            emitter.on("test2", test2, this);
            emitter.off("test2");
            function test1() {
                console.log("Test EventEmitter test1");
            }
            function test2() {
                console.log("Test EventEmitter test2");
            }
        }
    }
}
new h.Test().testEmitter();
