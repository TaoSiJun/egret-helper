namespace h {
    /**
     * 弹窗基类
     */
    export abstract class BasePopup extends eui.Component implements h.IComponent {
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
                this.closeButton.tap = () => {
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
                this.confirmButton.tap = () => {
                    if (this.data.confirm) {
                        this.data.confirm();
                    }
                    this.hide();
                };
            }
            if (this.cancelButton) {
                this.cancelButton.tap = () => {
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
            let delay = 3000;
            if (this.data && this.data.delay) {
                delay = this.data.delay;
            }
            egret.setTimeout(pop.hide, this, delay, this);
        }
    }

    /**
     * 等待提示
     */
    export class Wait extends BasePopup {
        protected createChildren() {
            super.createChildren();
        }
    }
}
