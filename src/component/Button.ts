namespace h {
    export class Button extends eui.Group implements IComponent {
        /**
         * 按钮能否点击
         * @default false
         */
        public enable: boolean = true;
        /**
         * 点击声音
         * @default false
         */
        public quite: boolean = false;
        /**
         * 默认点击声音资源名字
         * @default 'click'
         */
        public sound: string = "click";
        /**
         * TOUCH_END事件触发
         */
        public onClick: (e: egret.TouchEvent) => void;
        /**
         * TOUCH_BEGIN事件触发
         */
        public onBegin: (e: egret.TouchEvent) => void;
        /**
         * 按钮组件
         */
        public constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this._onAdded, this);
            this.once(egret.Event.ENTER_FRAME, this._setAnchorCenter, this);
        }
        private _setAnchorCenter() {
            this.x += this.width / 2;
            this.y += this.height / 2;
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
        }
        private _onAdded() {
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemoved, this);
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onBegin, this);
        }
        private _onRemoved() {
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this._onRemoved, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this._onBegin, this);
        }
        private _onBegin(e: egret.TouchEvent) {
            if (this.enable) {
                this.addEventListener(egret.TouchEvent.TOUCH_END, this._onEnd, this);
                this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onOutside, this);
                egret.Tween.get(this).to({ scaleX: 0.95, scaleY: 0.95 }, 100);
                if (this.onBegin) {
                    this.onBegin(e);
                }
            }
        }
        private _onEnd(e: egret.TouchEvent) {
            if (this.enable) {
                this.removeEventListener(egret.TouchEvent.TOUCH_END, this._onEnd, this);
                this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this._onOutside, this);
                egret.Tween.get(this)
                    .to({ scaleX: 1, scaleY: 1 }, 100)
                    .call(() => {
                        this.scaleX = 1;
                        this.scaleY = 1;
                    });
                if (this.onClick) {
                    this.onClick(e);
                }
                if (this.sound && !this.quite) {
                    sound.playSound(this.sound);
                }
            }
        }
        private _onOutside() {
            if (this.enable) {
                egret.Tween.get(this)
                    .to({ scaleX: 1, scaleY: 1 }, 100)
                    .call(() => {
                        this.scaleX = 1;
                        this.scaleY = 1;
                    });
            }
        }
        public onDispose() {
            egret.Tween.removeTweens(this);
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this._onAdded, this);
            this.onClick = null;
            this.onBegin = null;
        }
    }
}
