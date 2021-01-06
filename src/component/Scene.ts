namespace h {
    export abstract class Scene extends Component implements IComponent {
        /**
         * 是否允许组件释放 false会一直在舞台上
         * @default true
         */
        public allowDispose = true;
        /**
         * 数据 组件初始化完成后赋值
         */
        public data: any;

        /**
         * (默认垂直居中)
         */
        public onResize() {
            this.x = this.stage.stageWidth / 2 - this.width / 2;
            this.y = this.stage.stageHeight / 2 - this.height / 2;
        }

        /**
         * 释放
         */
        public $dispose() {
            this.data = null;
            //释放按钮组件
            for (let i of this.$children) {
                if (i instanceof Button) {
                    i.onDispose();
                }
            }
        }
    }
}
