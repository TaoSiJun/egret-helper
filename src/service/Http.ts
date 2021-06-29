namespace h {
    type HttpMethod = "POST" | "GET";

    type ResponseType = "json" | "text" | "arraybuffer";

    export class Http {
        /**
         * 在请求被终止前的时间（毫秒）
         * @default 0
         */
        public timeout: number = 0;

        public headers: any = {};

        public body: any = {};

        public host: string = "";

        public responseType: ResponseType = "json";

        private send(url: string, data: any, method: HttpMethod) {
            return new Promise<string>((resolve, reject) => {
                let request = new egret.HttpRequest();
                request.timeout = this.timeout;
                request.responseType = this.responseType;
                request.open(this.host + url, method);
                this.headers["Content-type"] = "application/json";
                for (let header in this.headers) request.setRequestHeader(header, this.headers[header]);
                request.send(data);
                request.addEventListener(egret.Event.COMPLETE, () => resolve(request.response), this);
                request.addEventListener(egret.IOErrorEvent.IO_ERROR, () => reject(new Error(request.response)), this);
            });
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
                return await this.send(url, JSON.stringify(body), "POST");
            } catch (error) {
                throw error;
            }
        }

        /**
         * 发送GET请求
         * @param url
         */
        public async get(url: string) {
            try {
                return await this.send(url, null, "GET");
            } catch (error) {
                throw error;
            }
        }
    }
}
