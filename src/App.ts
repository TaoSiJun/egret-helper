namespace h {
    class App {
        private _scene: Scene;
        private _sceneList: Scene[];
        private _main: egret.DisplayObjectContainer;

        public constructor() {
            this._sceneList = [];
        }

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
            if (this.main) {
                this.main.once(
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
            return this._scene;
        }

        private disposeScene(value: Scene) {
            this.removeFromStage(value);
            value.onDispose();
            value.$dispose();
        }

        /**
         * 加载一个场景
         * 移除当前场景后添加
         * 场景宽高将设置为当前舞台宽高
         * @param scene 场景实例
         * @param onBefore 加载前调用
         * @param onAfter 加载后调用
         */
        public loadScene(scene: Scene, onBefore?: Function, onAfter?: Function) {
            if (!scene) {
                throw new Error('Scene Type Error');
            }
            if (!this.main) {
                throw new Error('Main is undefined');
            }
            if (onBefore) {
                onBefore();
            }
            let old = this._scene;
            if (old && old.allowDispose) {
                this.disposeScene(old);
                this._scene = null;
            }
            this._scene = scene;
            this._scene.width = this._main.width;
            this._scene.height = this._main.height;
            this.main.addChild(scene);
            if (!scene.allowDispose) {
                this._sceneList.unshift(scene);
            }
            if (onAfter) {
                onAfter();
            }
        }

        /**
         * 移除一个场景
         * 不允许释放的场景将会被释放掉
         * @param scene 场景实例
         * @param onBefore 移除前调用
         * @param onAfter 移除后调用
         */
        public removeScene(scene: Scene, onBefore?: Function, onAfter?: Function) {
            if (!scene) {
                throw new Error('Scene Type Error');
            }
            if (!this.main) {
                throw new Error('Main is undefined');
            }
            if (onBefore) {
                onBefore();
            }
            this.disposeScene(scene);
            if (!scene.allowDispose) {
                for (let i = 0; i < this._sceneList.length; ++i) {
                    if (this._sceneList[i] === scene) {
                        this._sceneList.splice(i, 1);
                        break;
                    }
                }
            }
            if (scene === this._scene) {
                let len = this._sceneList.length;
                let i = len ? len - 1 : 0;
                this._scene = this._sceneList[i];
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
        public removeSceneAll(onBefore?: Function, onAfter?: Function) {
            if (onBefore) {
                onBefore();
            }
            while (this._sceneList.length > 0) {
                let scene = this._sceneList.pop();
                this.disposeScene(scene);
            }
            this._scene = null;
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
