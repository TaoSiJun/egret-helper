namespace h {
    class App {
        private _component: Component;
        private _componentList: Component[] = [];
        private _main: egret.DisplayObjectContainer;

        /**
         * 下一帧调用
         * @param callback
         * @param thisObj
         */
        public callNextFrame(callback: Function, thisObj: any) {
            if (this._main) {
                this._main.once(
                    egret.Event.ENTER_FRAME,
                    () => {
                        callback.call(thisObj);
                    },
                    this
                );
            }
        }

        /**
         * 游戏入口容器 需要在初始化时赋值
         */
        public initMain(value: egret.DisplayObjectContainer) {
            this._main = value;
        }

        public get main() {
            return this._main;
        }

        public get currentComponent() {
            return this._component;
        }

        private disposeComponent(value: Component) {
            value.removeFromStage();
            value.onDispose();
            value.$dispose();
        }

        /**
         * 加载一个皮肤组件
         * @param comp 组件实例
         * @param onComplete 完成回调
         */
        public loadComponent(comp: Component, onComplete?: (comp: Component) => void) {
            if (!comp) {
                throw new Error("Component Type Error");
            }
            if (!this.main) {
                throw new Error("Main is undefined");
            }
            let old = this._component;
            if (old && old.allowDispose) {
                this.disposeComponent(old);
                this._component = null;
            }
            this._component = comp;
            this._component.width = this._main.width;
            this._component.height = this._main.height;
            this.main.addChild(comp);
            if (!comp.allowDispose) {
                this._componentList.unshift(comp);
            }
            if (onComplete) {
                onComplete(comp);
            }
        }

        /**
         * 移除一个皮肤组件
         * @param comp 组件实例
         * @param onComplete 完成回调
         */
        public removeComponent(comp: Component, onComplete?: (comp: Component) => void) {
            if (!comp) {
                throw new Error("Component Type Error");
            }
            if (!this.main) {
                throw new Error("Main is undefined");
            }
            this.disposeComponent(comp);
            if (!comp.allowDispose) {
                for (let i = 0; i < this._componentList.length; ++i) {
                    if (this._componentList[i] === comp) {
                        this._componentList.splice(i, 1);
                        break;
                    }
                }
            }
            if (comp === this._component) {
                this._component = null;
                if (this._componentList.length > 0) {
                    this._component = this._componentList[0];
                }
            }
            if (onComplete) {
                onComplete(comp);
            }
        }

        /**
         * 删除当前所有组件
         */
        public removeComponentAll() {
            while (this._componentList.length > 0) {
                this.disposeComponent(this._componentList.pop());
            }
            this._component = null;
        }
    }
    /**
     * 全局控制
     */
    export const app = new App();
}
