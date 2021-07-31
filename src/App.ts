namespace h {
    class App {
        private _currentScene: Scene;
        private _sceneList: Scene[] = [];
        private _main: egret.DisplayObjectContainer;
        private _stage: egret.Stage;
        private _soundManager: SoundManager;
        private _timerManager: TimerManager;
        private _assetsManager: AssetsManager;
        private _popupManager: PopupManager;
        private _dragManager: DragManager;

        public get stage() {
            return this._stage;
        }

        public get currentScene() {
            return this._currentScene;
        }

        public get sound() {
            if (this._soundManager == void 0) {
                this._soundManager = new SoundManager();
            }
            return this._soundManager;
        }

        public get timer() {
            if (this._timerManager == void 0) {
                this._timerManager = new TimerManager();
            }
            return this._timerManager;
        }

        public get assets() {
            if (this._assetsManager == void 0) {
                this._assetsManager = new AssetsManager();
            }
            return this._assetsManager;
        }

        public get pop() {
            if (this._popupManager == void 0) {
                this._popupManager = new PopupManager();
            }
            return this._popupManager;
        }

        public get drag() {
            if (this._dragManager == void 0) {
                this._dragManager = new DragManager();
            }
            return this._dragManager;
        }

        public callNextFrame(callback: Function, thisObj: any) {
            if (this.stage) {
                this.stage.once(egret.Event.ENTER_FRAME, callback, thisObj);
            }
        }

        public init(stage: egret.Stage, main: egret.DisplayObjectContainer) {
            this._stage = stage;
            this._main = main;
        }

        public loadScene(value: Scene, data?: any) {
            if (!value) {
                throw new Error("Scene Type Error");
            }
            let old = this._currentScene;
            if (old && old.allowDispose) {
                this.disposeScene(old);
                this._currentScene = null;
            }
            this._currentScene = value;
            this._currentScene.data = data;
            this._main.addChild(value);
            if (this._sceneList.findIndex((scene) => scene === value) === -1) {
                this._sceneList.unshift(value);
            }
        }

        public removeScene(value: Scene) {
            if (!value) {
                throw new Error("Scene Type Error");
            }
            this.disposeScene(value);
            for (let i = 0; i < this._sceneList.length; ++i) {
                if (this._sceneList[i] === value) {
                    this._sceneList.splice(i, 1);
                    break;
                }
            }
            if (value === this._currentScene) {
                this._currentScene = null;
                if (this._sceneList.length > 0) {
                    this._currentScene = this._sceneList[0];
                }
            }
        }

        public removeSceneAll() {
            while (this._sceneList.length > 0) {
                this.disposeScene(this._sceneList.pop());
            }
            this._currentScene = null;
        }

        private disposeScene(value: Scene) {
            value.removeFromStage();
            value.onDispose();
        }
    }
    export const app = new App();
}
