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
            return this._soundManager || (this._soundManager = new SoundManager());
        }

        public get timer() {
            return this._timerManager || (this._timerManager = new TimerManager());
        }

        public get assets() {
            return this._assetsManager || (this._assetsManager = new AssetsManager());
        }

        public get pop() {
            return this._popupManager || (this._popupManager = new PopupManager());
        }

        public get drag() {
            return this._dragManager || (this._dragManager = new DragManager());
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
