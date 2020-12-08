namespace h {
    export class Http {
        private send(url: string, data: any, method: "POST" | "GET") {
            return new Promise((resolve, reject) => {
                let request = new egret.HttpRequest();
                request.timeout = this.timeout;
                request.responseType = "json";
                request.open(this.host + url, method);
                this.headers["Content-type"] = "application/json";
                for (let key in this.headers) {
                    request.setRequestHeader(key, this.headers[key]);
                }
                request.send(data);
                request.addEventListener(
                    egret.Event.COMPLETE,
                    () => {
                        resolve(request.response);
                    },
                    Http
                );
                request.addEventListener(
                    egret.IOErrorEvent.IO_ERROR,
                    () => {
                        reject(request.response);
                    },
                    Http
                );
            });
        }

        /**
         * 在请求被终止前的时间（毫秒）
         * @default 60000
         */
        public timeout: number = 6000;

        public headers: any = {};

        public body: any = {};

        public host: string = "";

        /**
         * 处理返回
         * @param response
         */
        protected resolve(response: any) {
            console.log(response);
        }

        /**
         * 处理报错
         * @param response
         */
        protected reject(response: any) {
            console.log(response);
        }

        /**
         * 发送POST请求
         * @param url
         * @param data
         */
        public async post(url: string, data?: any) {
            try {
                let body = data || {};
                for (let k in this.body) {
                    body[k] = this.body[k];
                }
                return this.resolve(await this.send(url, JSON.stringify(body), "POST"));
            } catch (error) {
                this.reject(error);
                throw error;
            }
        }

        /**
         * 发送GET请求
         * @param url
         */
        public async get(url: string) {
            try {
                return this.resolve(await this.send(url, null, "GET"));
            } catch (error) {
                this.reject(error);
                throw error;
            }
        }
    }
}
