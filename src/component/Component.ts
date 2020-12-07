namespace h {
    export interface IComponent {
        /**
         * 从舞台删除释放
         */
        onDispose: () => void;
    }

    export abstract class Component extends eui.Component implements IComponent {
        /**
         * 场景类是否允许释放
         * @override 重写设置
         * @default true
         */
        public allowDispose = true;
        /**
         * 场景基类
         * @method onAdded
         * @method onComplete
         * @method createChildren
         * @method onRemoved
         * @extends eui.Component
         */
        public constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoved, this);
            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
            this.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
        }

        /**
         * 添加到舞台
         */
        protected onAdded() {}

        /**
         * 从舞台中移除
         */
        protected onRemoved() {}

        /**
         * 舞台尺寸发生改变 默认垂直居中
         */
        protected onResize() {
            this.x = this.stage.stageWidth / 2 - this.width / 2;
            this.y = this.stage.stageHeight / 2 - this.height / 2;
        }

        /**
         * 加载并解析EXML完成
         */
        protected onComplete() {}

        public onDispose() {}

        public $dispose() {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAdded, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemoved, this);
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
