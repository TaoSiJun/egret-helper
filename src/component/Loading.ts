namespace h {
    export class Loading extends eui.Component implements RES.PromiseTaskReporter {
        public onProgress(current: number, total: number, resItem: RES.ResourceInfo | undefined) {
            console.log(current, total, resItem);
        }
    }
}
