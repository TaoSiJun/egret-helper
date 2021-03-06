namespace h {
    /**
     * 场景基类
     * @abstract
     * @extends Component
     */
    export abstract class Scene extends Component implements IComponent {
        /**
         * 加载另一个新场景后是否释放
         * @default true
         */
        public allowDispose = true;

        protected createChildren() {
            super.createChildren();
            this.width = this.stage.stageWidth;
            this.height = this.stage.stageHeight;
        }

        /**
         * (默认垂直居中)
         */
        public onResize() {
            this.x = this.stage.stageWidth / 2 - this.width / 2;
            this.y = this.stage.stageHeight / 2 - this.height / 2;
        }
    }
}
