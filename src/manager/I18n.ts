namespace h {
    export class I18n {
        private _data: { [key: string]: string };

        public setData(value: any) {
            this._data = value;
        }

        /**
         * @example
         * {key:'hello {0} {1}'}
         * i18n.localize('key','world1','world2') //'hello world1 world2'
         */
        public localize(key: string, ...args: any[]) {
            try {
                let s = this._data[key];
                if (!s) {
                    throw key;
                }
                for (let i = 0; i < args.length; ++i) {
                    s = s.replace("{" + i + "}", args[i]);
                }
                return s;
            } catch (error) {
                console.warn(`i18n ${key} not found`);
            }
        }
    }

    /**
     * 国际化
     * @method setData 初始化本地语言数据
     * @method localize 通过key获取本地语言
     */
    export const i18n = new I18n();
}
