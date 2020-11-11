namespace h.i18n {
    let i18nMetadata: { [key: string]: string };

    /**
     * 设置语言包数据
     * @param data
     */
    export function setI18nMetadata(data: any) {
        i18nMetadata = data;
    }

    /**
     * 本地化
     * @param key 语言包key
     * @param args 占位符参数
     */
    export function localize(key: string, ...args: any[]) {
        try {
            let s = i18nMetadata[key];
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
