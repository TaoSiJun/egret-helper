namespace h {
    /**
     * @private
     */
    class PopupSprite extends egret.Sprite {
        private _pop: Popup;

        constructor(pop: Popup) {
            super();
            this._pop = pop;
            this._pop.width = app.main.width;
            this._pop.height = app.main.height;
            if (this._pop.showBackground) {
                this.touchEnabled = true;
                this.graphics.beginFill(0x000000, this._pop.opacity);
                this.graphics.drawRect(0, 0, app.main.width, app.main.height);
                this.graphics.endFill();
            }
            this.addChild(this._pop);
        }

        public get pop() {
            return this._pop;
        }
    }
    /**
     * @private
     * @extends eui.UILayer
     */
    class PopupManager extends eui.UILayer {
        private spriteList: PopupSprite[] = [];

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
        public show(pop: Popup, data?: { [key: string]: any }, skinName?: string) {
            if (!this.parent) {
                app.stage.addChild(this);
            }
            if (data) {
                pop.data = data;
            }
            if (skinName) {
                pop.skinName = skinName;
            }
            let spr = new PopupSprite(pop);
            this.addChild(spr);
            this.spriteList.push(spr);
        }

        /**
         * 关闭一个弹窗
         * @param pop
         */
        public hide(pop: Popup) {
            if (pop) {
                for (let i = this.spriteList.length - 1; i >= 0; --i) {
                    if (this.spriteList[i].pop === pop) {
                        this.spriteList[i].pop.onDispose();
                        this.spriteList[i].removeFromStage();
                        this.spriteList.splice(i, 1);
                        break;
                    }
                }
            }
        }

        /**
         * 关闭所有弹窗
         */
        public hideAll() {
            for (let i = this.spriteList.length - 1; i >= 0; --i) {
                this.spriteList[i].pop.onDispose();
                this.spriteList[i].removeFromStage();
            }
            this.spriteList.length = 0;
        }

        /**
         * 显示一个提示弹窗
         * @param message
         * @param delay 多久毫秒后删除
         */
        public remind(message: string, delay: number = 3000, skinName?: string) {
            this.show(new Remind(), { message, delay }, skinName);
        }

        /**
         * 显示一个警告弹窗
         * @param options
         */
        public alert(options: { title?: string; content?: string; confirm?: Function; cancel?: Function }, skinName?: string) {
            this.show(new Alert(), options, skinName);
        }
    }
    export const pop = new PopupManager();
}
