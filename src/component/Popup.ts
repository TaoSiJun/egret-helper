namespace h {
    /**
     * 弹窗基类
     * @extends Component
     */
    export class Popup extends Component implements IComponent {
        /**
         * 关闭按钮
         */
        protected closeButton: Button;
        /**
         * 背景
         */
        public shape: egret.Shape;
        /**
         * 是否显示遮罩
         * @default true
         */
        public showBackground: boolean = true;
        /**
         * 遮罩透明度
         * @default 0.5
         */
        public opacity: number = 0.5;
        /**
         * 触摸遮罩关闭
         */
        public tapShape: boolean = false;

        protected createChildren() {
            super.createChildren();
            this.setCloseButton();
            if (this.tapShape) {
                this.shape && this.shape.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapShape, this);
            }
        }

        public onAddedToStage() {
            this.setCloseButton();
        }

        protected setCloseButton() {
            if (this.closeButton) {
                this.closeButton.tap = () => {
                    this.hide();
                };
            }
        }

        protected onTapShape() {
            this.hide();
        }

        /**
         * 关掉这个弹窗
         */
        public hide() {
            app.pop.hide(this);
        }

        public onDispose() {
            super.onDispose();
            this.shape && this.shape.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTapShape, this);
        }
    }

    /**
     * 警告
     */
    export class Alert extends Popup {
        /**
         * 确认按钮
         */
        protected confirmButton: Button;
        /**
         * 确认按钮文本
         */
        protected confirmLabel: eui.Label;
        /**
         * 取消按钮
         */
        protected cancelButton: Button;
        /**
         * 取消按钮文本
         */
        protected cancelLabel: eui.Label;
        /**
         * 标题文本
         */
        protected titleLabel: eui.Label;
        /**
         * 内容文本
         */
        protected contentLabel: eui.Label;

        public data: AlertOptions;

        protected createChildren() {
            super.createChildren();
            if (this.titleLabel) {
                this.titleLabel.text = this.data?.title;
            }
            if (this.contentLabel) {
                this.contentLabel.text = this.data?.content;
            }
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
            if (this.confirmLabel) {
                this.confirmLabel.text = this.data?.confirmText;
            }
            if (this.cancelLabel) {
                this.cancelLabel.text = this.data?.cancelText;
            }
        }

        public onDispose() {
            super.onDispose();
            this.confirmButton && this.confirmButton.onDispose();
            this.cancelButton && this.cancelButton.onDispose();
        }
    }

    /**
     * 文本提示
     */
    export class Remind extends Popup {
        /**
         * 提示文本Label
         */
        protected messageLabel: eui.Label;
        protected delayId: number;

        constructor() {
            super();
            this.showBackground = false;
            this.touchEnabled = false;
            this.touchChildren = false;
        }

        public setMessage() {
            egret.clearTimeout(this.delayId);
            this.delayId = egret.setTimeout(this.remove, this, this.data.delay || 3000);
            this.messageLabel.textFlow = new egret.HtmlTextParser().parser(this.data.message || "");
        }

        public remove() {
            this.hide();
        }
    }

    /**
     * 等待提示
     */
    export class Wait extends Popup {
        protected createChildren() {
            super.createChildren();
        }
    }
}
