namespace h {
    export class Emitter<T extends string = string> {
        private _cache: Record<string, { func: Function; funcTarget: any }[]>;

        public constructor() {
            this._cache = {};
        }

        public has(type: T, func: Function, funcTarget: any) {
            if (this._cache[type]) {
                for (let i of this._cache[type]) {
                    if (i.func === func && i.funcTarget === funcTarget) {
                        return true;
                    }
                }
            }
            return false;
        }

        public on(type: T, func: Function, funcTarget: any) {
            if (!this.has(type, func, funcTarget)) {
                let list = this._cache[type] || (this._cache[type] = []);
                list.push({ func, funcTarget });
            }
        }

        public off(type: T, func: Function, funcTarget: any) {
            let list = this._cache[type];
            if (list) {
                for (let i = list.length - 1; i >= 0; --i) {
                    let target = list[i];
                    if (target.func === func && target.funcTarget === funcTarget) {
                        list.splice(i, 1);
                        break;
                    }
                }
            }
        }

        public emit(type: T, func: Function, funcTarget: any, ...args: any) {
            let list = this._cache[type];
            if (list) {
                for (let i = 0; i >= 0; --i) {
                    let target = list[i];
                    if (target.func === func && target.funcTarget === funcTarget) {
                        target.func.call(funcTarget, ...args);
                        break;
                    }
                }
            }
        }
    }
}
