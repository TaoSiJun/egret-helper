namespace h {
    export interface IComponent {
        /**
         * 从舞台删除释放
         */
        onDispose: () => void;
    }

    export abstract class Component extends eui.Component implements IComponent {
        /**
         * 组件是否允许释放
         * @override 重写设置
         * @default true
         */
        public allowDispose = true;
        /**
         * @method onAdded
         * @method onComplete
         * @method createChildren
         * @method onRemoved
         * @extends eui.Component
         */
        public constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
            this.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
        }

        /**
         * 组件添加到舞台
         */
        protected onAdded() {}

        /**
         * 加载并解析EXML完成
         */
        protected onComplete() {}

        protected onResize() {
            this.x = this.stage.stageWidth / 2 - this.width / 2;
            this.y = this.stage.stageHeight / 2 - this.height / 2;
        }

        public onDispose() {}

        public $dispose() {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
            this.removeEventListener(egret.Event.RESIZE, this.onResize, this);
            this.removeEventListener(egret.Event.COMPLETE, this.onComplete, this);
            //释放按钮组件
            for (let i of this.$children) {
                if (i instanceof Button) {
                    i.onDispose();
                }
            }
        }
    }
}
