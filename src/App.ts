namespace h {
    class App {
        private _scene: Scene;
        private _sceneList: Scene[] = [];
        private _main: egret.DisplayObjectContainer;
        private _stage: egret.Stage;

        /**
         * 下一帧调用
         * @param callback
         * @param thisObj
         */
        public callNextFrame(callback: Function, thisObj: any) {
            if (this.stage) {
                this.stage.once(egret.Event.ENTER_FRAME, callback, thisObj);
            }
        }

        public init(stage: egret.Stage, main: egret.DisplayObjectContainer) {
            this._stage = stage;
            this._main = main;
        }

        public get stage() {
            return this._stage;
        }

        public get currentScene() {
            return this._scene;
        }

        private dispose(value: Scene) {
            value.removeFromStage();
            value.onDispose();
        }

        /**
         * @param value
         * @param data
         */
        public loadScene(value: Scene, data?: any) {
            if (!value) {
                throw new Error("Scene Type Error");
            }
            let old = this._scene;
            if (old && old.allowDispose) {
                this.dispose(old);
                this._scene = null;
            }
            this._scene = value;
            if (data) {
                this._scene.data = data;
            }
            this._main.addChild(value);
            if (!value.allowDispose) {
                this._sceneList.unshift(value);
            }
        }

        /**
         * @param value
         */
        public removeScene(value: Scene) {
            if (!value) {
                throw new Error("Scene Type Error");
            }
            this.dispose(value);
            if (!value.allowDispose) {
                for (let i = 0; i < this._sceneList.length; ++i) {
                    if (this._sceneList[i] === value) {
                        this._sceneList.splice(i, 1);
                        break;
                    }
                }
            }
            if (value === this._scene) {
                this._scene = null;
                if (this._sceneList.length > 0) {
                    this._scene = this._sceneList[0];
                }
            }
        }

        /**
         * 删除当前所有场景
         */
        public removeSceneAll() {
            while (this._sceneList.length > 0) {
                this.dispose(this._sceneList.pop());
            }
            this._scene = null;
        }
    }
    export const app = new App();
}
