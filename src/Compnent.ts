namespace h {
    export interface IComponent {
        /**
         * 释放时请调用super.onDispose()
         * @implements IComponent
         */
        onDispose(): void;
    }
    /**
     * @extends eui.Component
     * @method onAddedToStage
     * @method onComplete
     * @method createChildren
     * @method onDispose
     */
    export class Component extends eui.Component implements IComponent {
        public constructor() {
            super();
            this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.addEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            this.addEventListener(egret.Event.COMPLETE, this.onComplete, this);
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
         * 加载并解析EXML完成
         */
        public onComplete() {}
        /**
         * 舞台或组件发生尺寸变化
         */
        public onResize() {}
        
        public onDispose() {
            this.removeEventListener(egret.Event.ADDED_TO_STAGE, this.onAddedToStage, this);
            this.removeEventListener(egret.Event.REMOVED_FROM_STAGE, this.onRemovedFromStage, this);
            this.removeEventListener(egret.Event.COMPLETE, this.onComplete, this);
            this.removeEventListener(egret.Event.RESIZE, this.onResize, this);
        }
    }
}
