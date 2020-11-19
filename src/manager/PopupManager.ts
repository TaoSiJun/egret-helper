namespace h {
    /**
     * 弹窗基类
     */
    export class BasePopup extends eui.Component implements h.IComponent {
        /**
         * 关闭按钮
         */
        protected closeButton: Button;
        /**
         * 是否显示遮罩
         * @default true
         */
        public showBackground: boolean = true;
        /**
         * 遮罩透明度
         * @default 0.35
         */
        public opacity: number = 0.35;
        /**
         * 弹窗数据
         */
        public data: any;

        protected createChildren() {
            super.createChildren();
            this.x = this.stage.stageWidth / 2 - this.width / 2;
            this.y = this.stage.stageHeight / 2 - this.height / 2;
            if (this.closeButton) {
                this.closeButton.onClick = () => {
                    this.hide();
                };
            }
        }

        /**
         * 关闭弹窗
         */
        public hide() {
            pop.hide(this);
        }

        public onDispose() {
            if (this.closeButton) {
                this.closeButton.onDispose();
            }
        }
    }

    /**
     * 警告
     */
    export class Alert extends BasePopup {
        /**
         * 确认按钮
         */
        protected confirmButton: Button;
        /**
         * 取消按钮
         */
        protected cancelButton: Button;
        /**
         * 标题文本
         */
        protected titleLabel: eui.Label;
        /**
         * 内容文本
         */
        protected contentLabel: eui.Label;

        protected createChildren() {
            super.createChildren();
            if (this.confirmButton) {
                this.confirmButton.onClick = () => {
                    if (this.data.confirm) {
                        this.data.confirm();
                    }
                    this.hide();
                };
            }
            if (this.cancelButton) {
                this.cancelButton.onClick = () => {
                    if (this.data.cancel) {
                        this.data.cancel();
                    }
                    this.hide();
                };
            }
            if (this.titleLabel) {
                this.titleLabel.text = this.data?.title;
            }
            if (this.contentLabel) {
                this.contentLabel.text = this.data?.content;
            }
        }

        public onDispose() {
            super.onDispose();
            if (this.confirmButton) {
                this.confirmButton.onDispose();
            }
            if (this.cancelButton) {
                this.cancelButton.onDispose();
            }
        }
    }

    /**
     * 文本提示
     */
    export class Remind extends BasePopup {
        /**
         * 提示文本Label
         */
        protected messageLabel: eui.Label;

        constructor() {
            super();
            this.showBackground = false;
            this.touchEnabled = false;
            this.touchChildren = false;
        }

        protected createChildren() {
            super.createChildren();
            if (this.messageLabel && this.data && this.data.message) {
                this.messageLabel.textFlow = new egret.HtmlTextParser().parser(this.data.message);
            }
            egret.setTimeout(
                () => {
                    pop.hide(this);
                },
                this,
                (this.data && this.data.delay) || 3000
            );
        }
    }

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
        public hide(pop: Alert | Remind | BasePopup) {
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
         * @param wait 继承BasePopup的实例
         * @param callback 需要等待的异步函数
         */
        public async wait(wait: BasePopup, callback: () => Promise<any>) {
            try {
                this.show(wait);
                const result = await callback();
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
