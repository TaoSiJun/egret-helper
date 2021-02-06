namespace h {
    export interface IComponent {
        onDispose(): void;
    }
    /**
     * 基础组件
     * @extends eui.Component
     * @method onAddedToStage
     * @method createChildren
     * @method onRemovedFromStage
     * @method onDispose
     */
    export class Component extends eui.Component implements IComponent {
        /**
         * 组件数据
         */
        public data: any;

        constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            this.addEventListener(egret.Event.RESIZE, this.onResize, this);
        }
        /**
         * 添加到舞台
         */
        public onAddedToStage() {}
        /**
         * 从舞台中删除
         */
        public onRemovedFromStage() {}
        /**
         * 舞台或组件发生尺寸变化
         */
        public onResize() {}
        /**
         * 释放
         */
        public disposeChildren() {
            for (let i of this.$children) {
                if (i instanceof Button || i instanceof Component) {
                    i.onDispose();
                }
            }
        }
        /**
         * 请调用super.onDispose()完成父类释放
         */
        public onDispose() {
            this.data = null;
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            this.removeEventListener(egret.Event.RESIZE, this.onResize, this);
            this.disposeChildren();
        }
    }
}
