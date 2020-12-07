namespace h {
    class App {
        private _component: Component;
        private _componentList: Component[] = [];
        private _main: egret.DisplayObjectContainer;

        /**
         * 从舞台中删除一个显示对象
         * @param display 要删除的显示对象
         */
        public removeFromStage(display: egret.DisplayObject) {
            if (display && display.parent) {
                display.parent.removeChild(display);
            }
        }

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
         * 游戏入口容器
         * 需要在初始化时赋值
         */
        public initMain(value: egret.DisplayObjectContainer) {
            this._main = value;
        }

        public get main() {
            return this._main;
        }

        /**
         * 获取当前场景
         */
        public get currentScene() {
            return this._component;
        }

        private disposeComponent(value: Component) {
            this.removeFromStage(value);
            value.onDispose();
            value.$dispose();
        }

        /**
         * 加载一个组件
         * 移除当前场景后添加
         * 场景宽高将设置为当前舞台宽高
         * @param comp 组件实例
         * @param onBefore 加载前调用
         * @param onAfter 加载后调用
         */
        public loadComponent(comp: Component, onBefore?: Function, onAfter?: Function) {
            if (!comp) {
                throw new Error("Component Type Error");
            }
            if (!this.main) {
                throw new Error("Main is undefined");
            }
            if (onBefore) {
                onBefore();
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
            if (onAfter) {
                onAfter();
            }
        }

        /**
         * 移除一个组件
         * 不允许释放的场景将会被释放掉
         * @param comp 组件实例
         * @param onBefore 移除前调用
         * @param onAfter 移除后调用
         */
        public removeComponent(comp: Component, onBefore?: Function, onAfter?: Function) {
            if (!comp) {
                throw new Error("Component Type Error");
            }
            if (!this.main) {
                throw new Error("Main is undefined");
            }
            if (onBefore) {
                onBefore();
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
                let len = this._componentList.length;
                let i = len ? len - 1 : 0;
                this._component = this._componentList[i];
            }
            if (onAfter) {
                onAfter();
            }
        }

        /**
         * 移除所有的场景
         * @param onBefore
         * @param onAfter
         */
        public removeComponentAll(onBefore?: Function, onAfter?: Function) {
            if (onBefore) {
                onBefore();
            }
            while (this._componentList.length > 0) {
                let scene = this._componentList.pop();
                this.disposeComponent(scene);
            }
            this._component = null;
            if (onAfter) {
                onAfter();
            }
        }
    }
    /**
     * 全局控制
     */
    export const app = new App();
}
