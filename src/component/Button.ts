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
         * 缩放效果
         * @default true
         */
        public scale: boolean = true;
        public tap: (e: egret.TouchEvent) => void;
        public begin: (e: egret.TouchEvent) => void;
        public end: (e: egret.TouchEvent) => void;

        protected createChildren() {
            super.createChildren();
            this.x += this.width / 2;
            this.y += this.height / 2;
            this.anchorOffsetX = this.width / 2;
            this.anchorOffsetY = this.height / 2;
            this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        }

        private onTouchTap(e: egret.TouchEvent) {
            if (this.enable) {
                if (this.tap) {
                    this.tap(e);
                }
                if (!this.quite) {
                    sound.playSound(this.sound);
                }
            }
        }

        private onTouchBegin(e: egret.TouchEvent) {
            if (this.enable) {
                this.addEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
                this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onOutside, this);
                if (this.begin) {
                    this.begin(e);
                }
                if (this.scale) {
                    egret.Tween.get(this).to({ scaleX: 0.95, scaleY: 0.95 }, 100);
                }
            }
        }

        private onTouchEnd(e: egret.TouchEvent) {
            if (this.enable) {
                this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
                this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onOutside, this);
                if (this.end) {
                    this.end(e);
                }
                if (this.scale) {
                    egret.Tween.get(this)
                        .to({ scaleX: 1, scaleY: 1 }, 100)
                        .call(() => {
                            this.scaleX = 1;
                            this.scaleY = 1;
                        });
                }
            }
        }

        private onOutside() {
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
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        }
    }
}
