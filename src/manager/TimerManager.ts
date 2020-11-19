namespace h {
    class TimerManager {
        private _timers: { listener: Function; thisObj: any; timer: egret.Timer }[];

        public constructor() {
            this._timers = [];
        }

        /**
         * 添加一个计时器 调用结束后移除
         * @param delay 间隔时间
         * @param repeat 重复次数
         * @param listener 监听回调
         * @param thisObj 监听回调this
         */
        public add(delay: number, repeat: number, listener: Function, thisObj: any) {
            let timer = new egret.Timer(delay, repeat);
            timer.addEventListener(egret.TimerEvent.TIMER, listener, thisObj);
            timer.once(
                egret.TimerEvent.TIMER_COMPLETE,
                () => {
                    this.remove(listener, thisObj);
                },
                this
            );
            timer.start();
            this._timers.push({ listener, thisObj, timer });
        }

        /**
         * 移除一个计时器
         * @param listener 
         * @param thisObj 
         */
        public remove(listener: Function, thisObj: any) {
            let timers = this._timers;
            for (let i = timers.length - 1; i >= 0; --i) {
                let obj = timers[i];
                if (obj.listener === listener && obj.thisObj === thisObj) {
                    obj.timer.removeEventListener(egret.TimerEvent.TIMER, obj.listener, obj.thisObj);
                    obj.timer.stop();
                    timers.splice(i, 1);
                    break;
                }
            }
        }
    }
    /**
     * 计时器管理
     */
    export const timer = new TimerManager();
}
