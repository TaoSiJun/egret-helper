namespace h {
    class PopupManager extends eui.Group {
        private popupList: BasePopup[] = [];
        /**
         * 遮罩
         */
        private background: egret.Sprite;
        /**
         * 遮罩透明度
         * @default 0.65
         */
        public opacity: number = 0.65;

        protected createChildren() {
            super.createChildren();
            this.background = new egret.Sprite();
            this.background.graphics.beginFill(0x000000, 0.75);
            this.background.graphics.drawRect(0, 0, this.stage.stageWidth, this.stage.stageHeight);
            this.background.graphics.endFill();
            this.background.touchEnabled = true;
        }

        /**
         * 显示一个弹窗
         * @param pop 继承BasePopup的实例
         */
        public show(pop: BasePopup, data?: Partial<IPopupData>) {
            if (data) {
                pop.data = data;
            }
            // let index = -1;
            // for (let i = 0; i < this.popupList.length; ++i) {
            //     if (index === -1 && pop.priority > this.popupList[i].priority) {
            //         index = i;
            //         break;
            //     }
            // }
            // if (index > -1) {
            //     this.popupList.splice(index, 0, pop);
            // } else {
            //     this.popupList.push(pop);
            // }
            if (this.contains(this.background)) {
                this.setChildIndex(this.background, -1);
            } else if (pop.showBackground) {
                this.background.alpha = this.opacity;
                this.addChild(this.background);
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
                this.removeBackground();
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
         * 等待提示 异步函数完成后移除等待
         * @param wait 继承BasePopup的实例
         * @param func 需要等待的异步函数
         */
        public async wait(wait: BasePopup, func: () => Promise<any>) {
            let removeWait = () => {
                if (this.popupList.length > 0) {
                    this.setChildIndex(this.background, 0);
                } else {
                    this.removeBackground();
                }
                this.removeChild(wait);
            };
            let addWait = () => {
                if (this.popupList.length > 0) {
                    this.setChildIndex(this.background, -1);
                } else if (wait.showBackground) {
                    this.background.alpha = this.opacity;
                    this.addChild(this.background);
                }
                this.addChild(wait);
            };
            try {
                addWait();
                const result = await func();
                removeWait();
                return result;
            } catch (error) {
                removeWait();
                throw error;
            }
        }

        private removeBackground() {
            if (this.background.parent) {
                this.background.parent.removeChild(this.background);
            }
        }
    }
    /**
     * 弹窗管理 调用前需要手动添加到舞台上
     */
    export const pop = new PopupManager();

    interface IPopupData {
        title: string;
        content: string;
        message: string;
    }

    /**
     * 弹窗基类
     */
    export abstract class BasePopup extends eui.Component implements h.IComponent {
        /**
         * 关闭按钮
         */
        protected closeButton: Button;
        /**
         * 显示权重
         * @default 0
         */
        // public priority: number = 0;
        /**
         * 是否显示遮罩
         */
        public showBackground: boolean = true;
        /**
         * 弹窗数据
         * @param title Alert
         * @param content Alert
         * @param message Remind
         */
        public data: Partial<IPopupData>;

        protected createChildren() {
            super.createChildren();
            this.x = this.stage.stageWidth / 2 - this.width / 2;
            this.y = this.stage.stageHeight / 2 - this.height / 2;
            if (this.closeButton) {
                this.closeButton.onClick = () => {
                    if (this.parent) {
                        this.parent.removeChild(this);
                        this.onDispose();
                    }
                };
            }
        }

        public onDispose() {
            if (this.closeButton) {
                this.closeButton.onDispose();
            }
        }
    }
    /**
     * 警告
     * 确认按钮ID (confirmButton)
     * 取消按钮ID (cancelButton)
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
                    this.confirm();
                };
            }
            if (this.cancelButton) {
                this.cancelButton.onClick = () => {
                    this.cancel();
                };
            }
            if (this.titleLabel) {
                this.titleLabel.text = this.data?.title;
            }
            if (this.contentLabel) {
                this.contentLabel.text = this.data?.content;
            }
        }

        /**
         * @override 点击确认回调函数
         */
        protected confirm() {}

        /**
         * @override 点击取消回调函数
         */
        protected cancel() {}

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
     * 提示文本ID (messageLabel)
     */
    export class Remind extends BasePopup {
        /**
         * 提示文本Label
         */
        protected messageLabel: eui.Label;

        protected createChildren() {
            super.createChildren();
            this.showBackground = false;
            if (this.data) {
                if (this.messageLabel) {
                    this.messageLabel.text = this.data.message;
                }
                this.touchEnabled = false;
                this.touchChildren = false;
            }
        }
    }
}
