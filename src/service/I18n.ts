namespace h {
    export class i18n {
        private static metadata: { [key: string]: string };

        /**
         * 设置本地化数据
         * @param data
         */
        public static setData(data: any) {
            this.metadata = data;
        }

        /**
         * 本地化
         * @param key
         * @param args 占位符参数 `{0} {1} ...`
         * @returns
         */
        public static localize(key: string, ...args: any[]) {
            try {
                if (!this.metadata) {
                    throw `i18n metadata undefined`;
                }
                let s = this.metadata[key];
                if (!s) {
                    throw `i18n '${key}' not found`;
                }
                for (let i = 0; i < args.length; ++i) {
                    s = s.replace("{" + i + "}", args[i]);
                }
                return s;
            } catch (error) {
                console.warn(error);
            }
        }
    }
}
