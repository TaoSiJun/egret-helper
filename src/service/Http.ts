namespace h {
    type HttpMethod = "POST" | "GET";

    type ResponseType = "json" | "text" | "arraybuffer";

    type ReturnObject = { [key: string]: any };

    export class Http {
        /**
         * 在请求被终止前的时间（毫秒）
         * @default 0
         */
        public timeout: number = 0;
        /**
         * 返回数据格式
         */
        public responseType: ResponseType = "json";
        /**
         * @override 重写此方法获取host
         */
        protected get host(): string {
            return "";
        }
        /**
         * @override 重写此方法获取headers
         */
        protected get headers(): ReturnObject {
            return {};
        }
        /**
         * @override 重写此方法获取body
         */
        protected get body(): ReturnObject {
            return {};
        }

        public send(url: string, data: any, method: HttpMethod) {
            return new Promise<any>((resolve, reject) => {
                let onComplete = (e: egret.Event) => {
                    resolve(e.currentTarget.response);
                };
                let onIOError = (e: egret.Event) => {
                    reject(e.currentTarget.response);
                };
                let request = new egret.HttpRequest();
                request.timeout = this.timeout;
                request.responseType = this.responseType;
                switch (method) {
                    case "GET":
                        let params = this.getParams(data);
                        if (params !== "") {
                            url += "?" + params;
                        }
                        data = null;
                        break;
                    case "POST":
                        if (typeof data === "object") {
                            data = JSON.stringify(data);
                        }
                        break;
                }
                request.open(this.host + url, method);
                request.setRequestHeader("Content-type", "application/json");
                for (let key in this.headers) {
                    request.setRequestHeader(key, this.headers[key] + "");
                }
                request.addEventListener(egret.Event.COMPLETE, onComplete, null);
                request.addEventListener(egret.IOErrorEvent.IO_ERROR, onIOError, null);
                request.send(data);
            });
        }

        protected resolve(value: any) {
            return value;
        }

        protected reject(value: any) {
            throw value;
        }

        protected getParams(object: any) {
            let params = "";
            for (let key in object) {
                params += `${key}=${object[key]}&`;
            }
            return params;
        }

        /**
         * 发送POST请求
         * @param url
         * @param data
         */
        public async post(url: string, data: any = {}) {
            try {
                let response = await this.send(url, Object.assign(this.body, data), "POST");
                return this.resolve(response);
            } catch (error) {
                return this.reject(error);
            }
        }

        /**
         * 发送GET请求
         * @param url
         */
        public async get(url: string, data?: any) {
            try {
                let response = await this.send(url, data, "GET");
                return this.resolve(response);
            } catch (error) {
                return this.reject(error);
            }
        }
    }
}
