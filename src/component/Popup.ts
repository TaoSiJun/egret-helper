namespace h {
    export abstract class Popup extends Component implements IComponent {
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
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.$onRemovedFromStage, this);
            if (this.closeButton) {
                this.closeButton.tap = () => {
                    pop.hide(this);
                };
            }
        }

        public $onRemovedFromStage() {
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.$onRemovedFromStage, this);
            pop.hide(this);
        }

        public onDispose() {
            super.onDispose();
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.$onRemovedFromStage, this);
            if (this.closeButton) {
                this.closeButton.onDispose();
            }
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
                    this.removeFromStage();
                };
            }
            if (this.cancelButton) {
                this.cancelButton.tap = () => {
                    if (this.data.cancel) {
                        this.data.cancel();
                    }
                    this.removeFromStage();
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
    export class Remind extends Popup {
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
            egret.setTimeout(this.removeFromStage, this, delay);
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
