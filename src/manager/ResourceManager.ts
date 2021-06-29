namespace h {
    type ResourceCallback = (e: RES.ResourceEvent) => void;

    type LoadParams = {
        groupName: string;
        complete: ResourceCallback;
        error: ResourceCallback;
    };

    class ResourceManager {
        private _queue: LoadParams[];
        private _loading: boolean;
        private _retryTimes: number;
        private _loadingView: any;
        private _loadingTimeid: number;
        private _groupName: string;
        private _complete: ResourceCallback;
        private _error: ResourceCallback;

        public set loadingView(value: any) {
            this._loadingView = value;
        }

        public get loadingView() {
            return this._loadingView;
        }

        constructor() {
            this._queue = [];
            RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onGroupComplete, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onGroupLoadError, this);
            RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onGroupProgress, this);
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

    export const resource = new ResourceManager();
}
