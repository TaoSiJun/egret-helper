namespace h.i18n {
    let i18nMetadata: { [key: string]: string };

    /**
     * 设置语言包数据
     * @param data
     */
    export function setData(data: any) {
        i18nMetadata = data;
    }

    /**
     * 本地化
     * @param key 语言包key
     * @param args 占位符参数
     */
    export function localize(key: string, ...args: any[]) {
        try {
            if (!i18nMetadata) {
                throw "i18n metadata is undefined";
            }
            let s = i18nMetadata[key];
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
