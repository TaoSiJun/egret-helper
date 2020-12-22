declare namespace egret {
    interface DisplayObject {
        /**
         * Remove a egret.DisplayObject from stage
         * @returns remove successfully
         */
        removeFromStage(): boolean;
        /**
         * Called when egret.DisplayObject call removeFromStage()
         */
        onRemovedFromStage(): void;
    }
}

egret.DisplayObject.prototype.removeFromStage = function () {
    if (this.parent) {
        this.parent.removeChild(this);
        if (this.onRemovedFromStage) {
            this.onRemovedFromStage();
        }
        return true;
    }
    return false;
};
