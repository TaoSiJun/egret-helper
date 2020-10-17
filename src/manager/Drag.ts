namespace h {
    /**
     * @param offset 移动偏移坐标
     * @param dragMoveObject 移动中的显示对象
     */
    export interface IDragOptions {
        thisObj: any;
        offset: { x: number; y: number };
        onDragStart: (e: egret.TouchEvent) => void;
        onDragEnd: (e: egret.TouchEvent) => void;
        onDragTarget: (target: any) => void;
        dragMoveObject: () => egret.DisplayObject;
    }

    export interface IDragTarget {
        name: string;
        display: egret.DisplayObject;
        options: IDragOptions;
    }

    class DragManager {
        private dragTargetArray: IDragTarget[];
        private dragAreaArray: egret.DisplayObjectContainer[];
        private currentDragTarget: IDragTarget;
        private currentMove: egret.DisplayObject;
        private stagePoint: egret.Point;
        private offsetPoint: egret.Point;

        constructor() {
            this.stagePoint = new egret.Point();
            this.offsetPoint = new egret.Point();
            this.dragTargetArray = [];
            this.dragAreaArray = [];
        }

        private onBegin(e: egret.TouchEvent) {
            let currentTarget = e.currentTarget as egret.DisplayObjectContainer;
            currentTarget.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
            currentTarget.addEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
            currentTarget.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onOutside, this);
            currentTarget.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
            for (let i = 0; i < this.dragTargetArray.length; ++i) {
                let dragTarget = this.dragTargetArray[i];
                let options = dragTarget.options;
                let display = dragTarget.display;
                display.localToGlobal(0, 0, this.stagePoint);
                if (this.checkPosition(e.stageX, e.stageY, this.stagePoint.x, this.stagePoint.y, display)) {
                    let offset = options.offset || { x: 0, y: 0 };
                    this.currentDragTarget = dragTarget;
                    this.offsetPoint.setTo((display.width * display.scaleX) / 2 + offset.x, (display.height * display.scaleY) / 2 + offset.y);
                    if (typeof options.onDragStart === 'function') {
                        options.onDragStart.call(options.thisObj, e);
                    }
                    if (typeof options.dragMoveObject === 'function') {
                        this.currentMove = options.dragMoveObject.call(options.thisObj);
                        if (this.currentMove) {
                            currentTarget.addChild(this.currentMove);
                            this.onMove(e);
                        }
                    }
                    break;
                }
            }
        }

        private onEnd(e: egret.TouchEvent) {
            let currentTarget = e.currentTarget as egret.DisplayObjectContainer;
            currentTarget.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
            currentTarget.removeEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
            currentTarget.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onOutside, this);
            currentTarget.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
            if (this.currentDragTarget) {
                let options = this.currentDragTarget.options;
                if (typeof options.onDragEnd === 'function') {
                    options.onDragEnd.call(options.thisObj, e);
                }
                for (let i = 0; i < this.dragTargetArray.length; ++i) {
                    let dragTarget = this.dragTargetArray[i];
                    if (dragTarget === this.currentDragTarget) {
                        continue;
                    }
                    let display = dragTarget.display;
                    display.localToGlobal(0, 0, this.stagePoint);
                    if (this.checkPosition(e.stageX, e.stageY, this.stagePoint.x, this.stagePoint.y, display)) {
                        let options = this.currentDragTarget.options;
                        if (typeof options.onDragTarget === 'function') {
                            options.onDragTarget.call(options.thisObj, dragTarget);
                        }
                        break;
                    }
                }
            }
            this.remove(this.currentMove);
            this.currentMove = null;
            this.currentDragTarget = null;
        }

        private onOutside(e: egret.TouchEvent) {
            let currentTarget = e.currentTarget as egret.DisplayObjectContainer;
            currentTarget.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
            currentTarget.removeEventListener(egret.TouchEvent.TOUCH_END, this.onEnd, this);
            currentTarget.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onOutside, this);
            currentTarget.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onMove, this);
            if (this.currentDragTarget) {
                let options = this.currentDragTarget.options;
                if (typeof options.onDragEnd === 'function') {
                    options.onDragEnd.call(options.thisObj, e);
                }
            }
            this.remove(this.currentMove);
            this.currentMove = null;
            this.currentDragTarget = null;
        }

        private onMove(e: egret.TouchEvent) {
            if (this.currentMove) {
                this.currentMove.x = e.stageX - this.offsetPoint.x;
                this.currentMove.y = e.stageY - this.offsetPoint.y;
            }
        }

        private checkPosition(stageX: number, stageY: number, x: number, y: number, display: egret.DisplayObject) {
            if (stageX > x && stageY > y && stageX < x + display.width * display.scaleX && stageY < y + display.height * display.scaleY) {
                return true;
            }
            return false;
        }

        /**
         * 添加一个拖拽目标
         * @param display
         * @param name
         * @param options
         */
        public addTarget(display: egret.DisplayObject, name: string, options: Required<IDragOptions>) {
            let ok = true;
            let dragTargetArray = this.dragTargetArray;
            for (let i = 0; i < dragTargetArray.length; ++i) {
                let dragTarget = dragTargetArray[i];
                if (dragTarget.display === display) {
                    ok = false;
                    break;
                }
            }
            if (ok) {
                dragTargetArray.push({ display, name, options });
            }
        }

        public removeTarget(display: egret.DisplayObject) {
            for (let i = 0; i < this.dragTargetArray.length; ++i) {
                let dragTarget = this.dragTargetArray[i];
                if (dragTarget.display === display) {
                    this.dragTargetArray.splice(i, 1);
                    break;
                }
            }
        }

        /**
         * 添加一个拖拽容器
         * @param area
         */
        public addArea(area: egret.DisplayObjectContainer) {
            let ok = true;
            for (let i = 0; i < this.dragAreaArray.length; ++i) {
                let dragAre = this.dragAreaArray[i];
                if (dragAre === area) {
                    ok = false;
                    break;
                }
            }
            if (ok) {
                area.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
                this.dragAreaArray.push(area);
            }
        }

        public removeArea(area: egret.DisplayObjectContainer) {
            for (let i = 0; i < this.dragAreaArray.length; ++i) {
                let dragAre = this.dragAreaArray[i];
                if (dragAre === area) {
                    dragAre.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onBegin, this);
                    this.dragAreaArray.splice(i, 1);
                    break;
                }
            }
        }

        private remove(display: egret.DisplayObject) {
            if (display && display.parent) {
                display.parent.removeChild(display);
            }
        }
    }
    /**
     * 拖拽
     */
    export const drag = new DragManager();
}
