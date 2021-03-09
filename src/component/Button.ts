namespace h {
    /**
     * 按钮
     * @extends eui.Group
     * @implements IComponent
     */
    export class Button extends eui.Group implements IComponent {
        /**
         * 所有按钮默认音效
         * @default 'click'
         */
        public static Sound: string = "click";
        /**
         * 所有按钮默认(TOUCH_TAP)间隔
         * @default 500
         */
        public static Space: number = 500;
        /**
         * 按钮能否点击
         * @default true
         */
        public enable: boolean = true;
        /**
         * 点击声音
         * @default false
         */
        public quite: boolean = false;
        /**
         * 缩放效果
         * @default true
         */
        public scale: boolean = true;
        /**
         * 这个按钮的点击音效
         */
        public sound: string;
        /**
         * 这个按钮的点击(TOUCH_TAP)间隔
         */
        public space: number;
        /**
         * @event egret.Event.TouchEvent.TOUCH_TAP
         */
        public tap: (e: egret.TouchEvent) => void;
        /**
         * @event egret.Event.TouchEvent.TOUCH_BEGIN
         */
        public begin: (e: egret.TouchEvent) => void;
        /**
         * @event egret.Event.TouchEvent.TOUCH_END
         */
        public end: (e: egret.TouchEvent) => void;
        /**
         * @event egret.Event.TouchEvent.TOUCH_RELEASE_OUTSIDE
         */
        public out: (e: egret.TouchEvent) => void;

        private _time: number;

        private get tapSpace() {
            return this.space || Button.Space;
        }

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
            if (this.enable && this.tap) {
                if (this._time == null || egret.getTimer() - this._time > this.tapSpace) {
                    this._time = egret.getTimer();
                    this.tap(e);
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
                    egret.Tween.get(this).to({ scaleX: 0.95, scaleY: 0.95 }, 100).set({ scaleX: 0.95, scaleY: 0.95 });
                }
                if (!this.quite) {
                    sound.playSound(this.sound || Button.Sound);
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
                    egret.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 100).set({ scaleX: 1, scaleY: 1 });
                }
            }
        }

        private onOutside(e: egret.TouchEvent) {
            if (this.enable) {
                this.removeEventListener(egret.TouchEvent.TOUCH_END, this.onTouchEnd, this);
                this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onOutside, this);
                if (this.out) {
                    this.out(e);
                }
                if (this.scale) {
                    egret.Tween.get(this).to({ scaleX: 1, scaleY: 1 }, 100).set({ scaleX: 1, scaleY: 1 });
                }
            }
        }

        public onDispose() {
            egret.Tween.removeTweens(this);
            this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
            this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
        }
    }
}
