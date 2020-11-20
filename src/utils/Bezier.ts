namespace h {
    interface IPoint {
        x: number;
        y: number;
    }

    export class Bezier {
        private _factor: number;
        private _p: IPoint;
        private _p1: IPoint;
        private _p2: IPoint;
        private _p3: IPoint;

        constructor() {
            this._factor = 0;
            this._p = { x: 0, y: 0 };
            this._p1 = { x: 0, y: 0 };
            this._p2 = { x: 0, y: 0 };
            this._p3 = { x: 0, y: 0 };
        }

        public get p() {
            return this._p;
        }

        public set factor(value: number) {
            this._factor = value;
            this._p.x = (1 - value) * (1 - value) * this._p1.x + 2 * value * (1 - value) * this._p2.x + value * value * this._p3.x;
            this._p.y = (1 - value) * (1 - value) * this._p1.y + 2 * value * (1 - value) * this._p2.y + value * value * this._p3.y;
        }

        public get factor() {
            return this._factor;
        }

        public set p1(value: IPoint) {
            this._p1 = value;
        }

        public get p1() {
            return this._p1;
        }

        public set p2(value: IPoint) {
            this._p2 = value;
        }

        public get p2() {
            return this._p2;
        }

        public set p3(value: IPoint) {
            this._p3 = value;
        }

        public get p3() {
            return this._p3;
        }
    }
}
