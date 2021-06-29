namespace h {
    type HttpMethod = "POST" | "GET";

    type ResponseType = "json" | "text" | "arraybuffer";

    export class Http {
        /**
         * 在请求被终止前的时间（毫秒）
         * @default 0
         */
        public timeout: number = 0;
        /**
         * 默认消息头
         */
        public headers: any = {};
        /**
         * 默认消息体
         */
        public body: any = {};
        /**
         * 主机地址
         */
        public host: string = "";
        /**
         * 返回数据格式
         */
        public responseType: ResponseType = "json";

        public send(url: string, data: any, method: HttpMethod) {
            return new Promise<any>((resolve, reject) => {
                let request = new egret.HttpRequest();
                request.timeout = this.timeout;
                request.responseType = this.responseType;
                if (method === "GET") {
                    let params = this.getParams(data);
                    if (params !== "") url += "?" + params;
                }
                request.open(this.host + url, method);
                this.headers["Content-type"] = "application/json";
                for (let key in this.headers) {
                    request.setRequestHeader(key, this.headers[key]);
                }
                request.send(data);
                request.addEventListener(egret.Event.COMPLETE, () => resolve(request.response), null);
                request.addEventListener(egret.IOErrorEvent.IO_ERROR, () => reject(request.response), null);
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
                let body = data;
                for (let k in this.body) {
                    body[k] = this.body[k];
                }
                let response = await this.send(url, JSON.stringify(body), "POST");
                return this.resolve(response);
            } catch (error) {
                this.reject(error);
            }
        }

        /**
         * 发送GET请求
         * @param url
         */
        public async get(url: string) {
            try {
                let response = await this.send(url, null, "GET");
                return this.resolve(response);
            } catch (error) {
                this.reject(error);
            }
        }
    }
}
