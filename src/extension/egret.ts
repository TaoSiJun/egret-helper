declare namespace egret {
    interface DisplayObject {
        /**
         * Remove a egret.DisplayObject from stage
         * @returns remove successfully
         */
        removeFromStage: () => boolean;
    }
}

egret.DisplayObject.prototype.removeFromStage = function () {
    if (this.parent) {
        this.parent.removeChild(this);
        return true;
    }
    return false;
};
