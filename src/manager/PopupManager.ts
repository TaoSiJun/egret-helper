namespace h {
    /**
     * @private
     */
    class PopupManager extends eui.Group {
        private popupList: BasePopup[] = [];
        /**
         * 遮罩
         */
        private background: egret.Shape;

        public constructor() {
            super();
            this.touchEnabled = false;
            egret.registerClass(Alert, "h.Alert");
            egret.registerClass(Remind, "h.Remind");
            egret.registerClass(Wait, "h.Wait");
        }

        protected createChildren() {
            super.createChildren();
            this.background = new egret.Shape();
            this.background.touchEnabled = true;
        }

        /**
         * 显示一个弹窗
         * @param pop 继承BasePopup的实例
         */
        public show(pop: BasePopup, data?: { [key: string]: any; skinName?: string }) {
            if (data) {
                pop.data = data;
                pop.skinName = data.skinName;
            }
            if (this.contains(this.background)) {
                this.setChildIndex(this.background, -1);
            } else if (pop.showBackground) {
                this.showBackground(pop.opacity);
            } else {
                this.removeBackground();
            }
            this.addChild(pop);
            this.popupList.push(pop);
        }

        /**
         * 关闭一个弹窗
         * @param pop 继承BasePopup的实例
         */
        public hide(pop: BasePopup) {
            if (pop) {
                this.removeChild(pop);
                for (let i = this.popupList.length; i >= 0; --i) {
                    if (this.popupList[i] === pop) {
                        this.popupList.splice(i, 1);
                        break;
                    }
                }
                if (this.popupList.length > 0) {
                    this.setChildIndex(this.background, this.popupList.length - 1);
                } else {
                    this.removeBackground();
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
         * 等待提示
         * @param wait
         * @param callback
         * @param data
         */
        public async wait(wait: BasePopup, callback: () => Promise<any>, data?: any) {
            try {
                this.show(wait, data);
                let result = await callback();
                this.hide(wait);
                return result;
            } catch (error) {
                this.hide(wait);
                throw error;
            }
        }

        /**
         * 显示一个提示弹窗
         * @param message
         * @param delay 多久毫秒后删除
         */
        public remind(message: string, delay: number = 3000) {
            this.show(new Remind(), { message, delay });
        }

        /**
         * 显示一个警告弹窗
         * @param title
         * @param content
         * @param confirm
         * @param cancel
         */
        public alert(options: { title?: string; content?: string; confirm?: Function; cancel?: Function }) {
            this.show(new Alert(), options);
        }

        private removeBackground() {
            if (this.background.parent) {
                this.background.parent.removeChild(this.background);
            }
        }

        private showBackground(alpha: number) {
            this.background.graphics.clear();
            this.background.graphics.beginFill(0x000000, alpha);
            this.background.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
            this.background.graphics.endFill();
            this.addChild(this.background);
        }
    }

    /**
     * 弹窗管理
     * 调用前需要手动添加到舞台上
     */
    export const pop = new PopupManager();
}
