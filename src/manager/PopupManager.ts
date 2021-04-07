namespace h {
    /**
     * @private
     */
    class PopupWrapper extends eui.Group {
        private _shp: egret.Shape;
        private _pop: Popup;
        constructor(pop: Popup) {
            super();
            this.touchEnabled = false;
            pop.width = app.stage.stageWidth;
            pop.height = app.stage.stageHeight;
            if (pop.showBackground) {
                this._shp = new egret.Shape();
                this._shp.touchEnabled = true;
                this._shp.graphics.beginFill(0x000000, pop.opacity);
                this._shp.graphics.drawRect(0, 0, app.stage.stageWidth, app.stage.stageHeight);
                this._shp.graphics.endFill();
                this.addChild(this._shp);
            }
            this._pop = pop;
            this.addChild(pop);
        }
        public get pop() {
            return this._pop;
        }
    }
    /**
     * @private
     */
    class PopupManager extends eui.UILayer {
        private _wrapperList: PopupWrapper[] = [];
        private _remind: Remind;

        public constructor() {
            super();
            this.touchEnabled = false;
            egret.registerClass(Alert, "h.Alert");
            egret.registerClass(Remind, "h.Remind");
            egret.registerClass(Wait, "h.Wait");
        }
        /**
         * 显示一个弹窗
         * @param pop 继承BasePopup的实例
         * @param data 弹窗数据
         * @param skinName 弹窗皮肤
         */
        public show(pop: Popup, data?: any, skinName?: string) {
            if (!this.parent) {
                app.stage.addChild(this);
            }
            if (data) {
                pop.data = data;
            }
            if (skinName) {
                pop.skinName = skinName;
            }
            let index = this._wrapperList.findIndex((value) => value.pop === pop);
            let wrapper = index > -1 ? this._wrapperList[index] : new PopupWrapper(pop);
            if (index > -1) {
                wrapper.removeFromStage();
            } else {
                this._wrapperList.push(wrapper);
            }
            this.addChild(wrapper);
        }
        /**
         * 关闭一个弹窗
         * @param pop
         */
        public hide(pop: Popup) {
            if (!pop) {
                throw "Popup Type Error";
            }
            for (let i = this._wrapperList.length - 1; i >= 0; --i) {
                if (this._wrapperList[i].pop === pop) {
                    this._wrapperList[i].removeFromStage();
                    this._wrapperList[i].pop.onDispose();
                    this._wrapperList.splice(i, 1);
                    break;
                }
            }
        }
        /**
         * 关闭所有弹窗
         */
        public hideAll() {
            for (let wrapper of this._wrapperList) {
                wrapper.removeFromStage();
                wrapper.pop.onDispose();
            }
            this._wrapperList = [];
        }
        /**
         * 从舞台上删除一个弹窗
         */
        public remove(pop: Popup) {
            if (!pop) {
                throw "Popup Type Error";
            }
            for (let i = this._wrapperList.length - 1; i >= 0; --i) {
                if (this._wrapperList[i].pop === pop) {
                    this._wrapperList[i].removeFromStage();
                    // this._wrapperList[i].pop.onDispose();
                    // this._wrapperList.splice(i, 1);
                    break;
                }
            }
        }
        /**
         * 显示一个提示弹窗
         * @param message
         * @param delay 移除延迟(ms)
         */
        public remind(message: string, delay: number = 3000, skinName?: string) {
            this.show((this._remind = this._remind || new Remind()), { message, delay }, skinName);
            this._remind.setMessage();
        }
        /**
         * 显示一个警告弹窗
         * @param options
         */
        public alert(options: AlertOptions, skinName?: string) {
            this.show(new Alert(), options, skinName);
        }
    }
    export const pop = new PopupManager();

    /**
     * @param confirmText
     * @param cancelText
     */
    export type AlertOptions = { title?: string; content?: string; confirm?: Function; cancel?: Function; confirmText?: string; cancelText?: string };
}
