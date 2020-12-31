namespace h {
    /**
     * @private
     * @extends eui.UILayer
     */
    class PopupManager extends eui.UILayer {
        private popupList: BasePopup[] = [];
        private background: egret.Shape;

        public constructor() {
            super();
            this.touchEnabled = false;
            this.background = new egret.Shape();
            this.background.touchEnabled = true;
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
        public show(pop: BasePopup, data?: { [key: string]: any }, skinName?: string) {
            if (!this.parent) {
                app.stage.addChild(this);
            }
            if (data) {
                pop.data = data;
            }
            if (skinName) {
                pop.skinName = skinName;
            }
            pop.width = this.stage.stageWidth;
            pop.height = this.stage.stageHeight;
            this.addChild(pop);
            this.popupList.push(pop);
            if (pop.showBackground) {
                pop.addChildAt(this.createBackground(pop.opacity), 0);
            }
        }

        /**
         * 关闭一个弹窗
         * @param pop 继承BasePopup的实例
         */
        public hide(pop: BasePopup) {
            if (pop) {
                pop.removeFromStage();
                for (let i = this.popupList.length; i >= 0; --i) {
                    if (this.popupList[i] === pop) {
                        this.popupList.splice(i, 1);
                        break;
                    }
                }
            }
        }

        /**
         * 关闭所有弹窗
         */
        public hideAll() {
            this.removeChildren();
            this.popupList.length = 0;
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

        private createBackground(alpha: number) {
            let shp = new egret.Shape();
            shp.graphics.beginFill(0x000000, alpha);
            shp.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
            shp.graphics.endFill();
            return shp;
        }
    }
    export const pop = new PopupManager();
}
