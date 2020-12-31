namespace h {
    /**
     * 加一个颜色滤镜
     * @param display 要添加的显示对象
     * @param color 16进制颜色
     * @param alpha 透明度 默认1
     */
    export function addColorFilter(display: egret.DisplayObject, color: number, alpha: number = 1) {
        let spliceColor = (color: number) => {
            return { r: Math.floor(color / 256 / 256), g: Math.floor(color / 256) % 256, b: color % 256 };
        };
        let result = spliceColor(color);
        let mat = [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0];
        mat[0] = result.r / 255;
        mat[6] = result.g / 255;
        mat[12] = result.b / 255;
        mat[18] = alpha;
        display.filters = [new egret.ColorMatrixFilter(mat)];
    }
}
