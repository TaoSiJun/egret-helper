namespace h {
    type ResourceCallback = (e: RES.ResourceEvent) => void;

    type LoadParams = {
        groupName: string;
        complete: ResourceCallback;
        error: ResourceCallback;
    };
    /**
     * egret相关资源管理
     * @private
     */
    export class AssetsManager {
        private _movieClipFactory: { [name: string]: egret.MovieClipDataFactory } = {};
        private _dbFactory: { [srcName: string]: dragonBones.EgretFactory } = {};
        private _queue: LoadParams[] = [];
        private _loading: boolean;
        private _retryTimes: number;
        private _loadingView: any;
        private _loadingTimeid: number;
        private _groupName: string;
        private _complete: ResourceCallback;
        private _error: ResourceCallback;

        constructor() {
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onGroupComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onGroupLoadError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onGroupProgress, this);
        }

        private createMcFactory(name: string): egret.MovieClipDataFactory {
            if (!this._movieClipFactory[name]) {
                let texture = RES.getRes(name + "_png");
                let data = RES.getRes(name + "_json");
                let factory = new egret.MovieClipDataFactory(data, texture);
                this._movieClipFactory[name] = factory;
            }
            return this._movieClipFactory[name];
        }

        private createDbFactory(srcName: string, split: number) {
            let factory = new dragonBones.EgretFactory();
            let ske = RES.getRes(srcName + "_ske_json") || RES.getRes(srcName + "_ske_dbbin");
            if (split) {
                while (split-- > 0) {
                    let json = RES.getRes(srcName + "_tex_" + split + "_json");
                    let png = RES.getRes(srcName + "_tex_" + split + "_png");
                    factory.parseTextureAtlasData(json, png);
                }
            } else {
                let json = RES.getRes(srcName + "_tex_json");
                let png = RES.getRes(srcName + "_tex_png");
                factory.parseTextureAtlasData(json, png);
            }
            factory.parseDragonBonesData(ske);
            return factory;
        }

        /**
         * 创建一个骨架显示对象
         * @param srcName 资源名字
         * @param armatureName 骨架名字
         * @param split 图集资源分割数量
         */
        public buildArmatureDisplay(srcName: string, armatureName: string, split?: number) {
            if (!this._dbFactory[srcName]) {
                this._dbFactory[srcName] = this.createDbFactory(srcName, split);
            }
            return this._dbFactory[srcName].buildArmatureDisplay(armatureName);
        }

        /**
         * 创建一个粒子
         * @param name JSON file name
         * @param textureName
         */
        public createParticle(name: string, textureName?: string): particle.GravityParticleSystem {
            let data = RES.getRes(name + "_json");
            let texture = RES.getRes((textureName || name) + "_png");
            let system = new particle.GravityParticleSystem(texture, data);
            return system;
        }

        /**
         * 创建一个序列帧
         * @param name 资源名字
         * @param movieClipName 序列帧名字
         */
        public createMovieClip(name: string, movieClipName?: string): egret.MovieClip {
            if (movieClipName === undefined) {
                movieClipName = name;
            }
            let factory = this.createMcFactory(name);
            let movieclip = new egret.MovieClip(factory.generateMovieClipData(movieClipName));
            return movieclip;
        }

        public clearMovieClipFactory(): void {
            for (let k in this._movieClipFactory) {
                this._movieClipFactory[k].clearCache();
                delete this._movieClipFactory[k];
            }
        }

        /**
         * 加载界面
         */
        public set loadingView(value: any) {
            this._loadingView = value;
        }

        public get loadingView() {
            return this._loadingView;
        }

        private onGroupComplete(e: RES.ResourceEvent) {
            this._complete && this._complete(e);
            this.resetNull();
            this.hideLoading();
            this.loadNext();
        }

        private onGroupLoadError(e: RES.ResourceEvent) {
            if (this._retryTimes-- > 0) {
                this.loadGroup(this._groupName, this._complete, this._error);
            } else {
                this._error && this._error(e);
                this.resetNull();
                this.hideLoading();
                this.loadNext();
                throw new Error("Group Load Error:" + e.groupName);
            }
        }

        private onGroupProgress(e: RES.ResourceEvent) {
            if (this._loadingView) {
                this._loadingView.onProgress(e.itemsLoaded, e.itemsTotal, e.resItem);
            }
        }

        private resetNull() {
            this._loading = false;
            this._groupName = null;
            this._complete = null;
            this._error = null;
        }

        private showLoading() {
            if (this._loadingView) {
                app.stage.addChild(this._loadingView);
            }
        }

        private hideLoading() {
            egret.clearTimeout(this._loadingTimeid);
            if (this._loadingView) {
                this._loadingView.removeFromStage();
            }
        }

        private loadNext() {
            if (this._queue.length > 0) {
                let i = this._queue.shift();
                this.loadGroup(i.groupName, i.complete, i.error);
            }
        }

        /**
         * 加载一组资源
         * @param groupName 
         * @param complete 
         * @param error 
         * @returns 
         */
        public loadGroup(groupName: string, complete?: ResourceCallback, error?: ResourceCallback) {
            if (this._loading) {
                this._queue.push({ groupName, complete, error });
            } else {
                this._loading = true;
                this._retryTimes = 3;
                this._groupName = groupName;
                this._complete = complete;
                this._error = error;
                this._loadingTimeid = egret.setTimeout(this.showLoading, this, 500);
                return RES.loadGroup(groupName, 0, this._loadingView);
            }
        }
    }
}
