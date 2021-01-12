namespace h {
    class TimerManager {
        public add(delay: number, repeat: number, data: { timer: Function; timerComplete?: Function; thisObj: any }) {
            let timer = new egret.Timer(delay, repeat);
            timer.addEventListener(egret.TimerEvent.TIMER, data.timer, data.thisObj);
            if (data.timerComplete) {
                timer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, data.timerComplete, data.thisObj);
            }
            timer.start();
            return timer;
        }
    }
    export const timer = new TimerManager();
}
