export default class Map {
    constructor(props) {
        this.SIZE = 5;
        this.LINES = 50;

        this.COLUMNS = 60;
        this.D = 10.5; //Diffusion
        this.F = 0.055; //Feed
        this.K = 0.0000; //Decay
        this.MIN = 0.0;
        this.MAX = 1.0;
        this.drawing = false;
        this.dt = 0;
        this.to = 0;
        this.t = 0;
        this.plot = 0;
        Object.assign(this, props);

        this.A = [];
        this.B = [];
        for (let l = 0; l < this.LINES; l++) {
            this.A[l] = [];
            this.B[l] = [];
            for (let c = 0; c < this.COLUMNS; c++) {
                this.A[l][c] = 0;//Math.random();
                this.B[l][c] = 0;
            }
        }

        for (let l = this.LINES / 2; l < this.LINES / 2 + 3; l++) {
            for (let c = this.COLUMNS / 2; c < this.COLUMNS / 2 + 3; c++) {
                this.A[l][c] = 1.0;
            }
        }

        this.A[5][5] = 1.0;
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        document.body.appendChild(canvas);
        canvas.width = this.COLUMNS * this.SIZE;
        canvas.height = this.LINES * this.SIZE;
    }



    draw() {
        for (let l = 0; l < this.LINES; l++) {
            for (let c = 0; c < this.COLUMNS; c++) {
                this.ctx.fillStyle = `hsl(120,100%,${((this.A[l][c] - this.MIN) / (this.MAX - this.MIN)) * 100}%)`;
                this.ctx.fillRect(c * this.SIZE, l * this.SIZE, this.SIZE, this.SIZE);
            }
        }
    }

    diffuse(dt) {

        for (let l = 0; l < this.LINES; l++) {
            for (let c = 0; c < this.COLUMNS; c++) {
                const a = this.A[l][c];
                this.B[l][c] = a + (this.D * this.laplace(l, c) - this.K * a) * this.dt;
                if (this.B[l][c] > this.MAX) { this.MAX = this.B[l][c]; }
                if (this.B[l][c] < this.MIN) { this.MIN = this.B[l][c]; }
            }
        }
    }

    swap() {
        let C = this.A;
        this.A = this.B;
        this.B = C;
    }

    step(t) {
        this.dt = (t - this.to) / 1000;
        this.plot -= this.dt;
        if (this.plot < 0) {
            this.diffuse(0.02);
            this.swap();
            this.A[5][5] = 1.0;
            this.draw();
            this.plot = 0.02;
        }
        this.to = t;
        requestAnimationFrame(this.step);
    }

    laplace(l, c) {
        const OC = 0.2;
        const DC = 0.05
        let sum = 0;
        if (l - 1 > 0) sum += this.A[l - 1][c] * OC;
        if (l + 1 < this.LINES) sum += this.A[l + 1][c] * OC;
        if (c - 1 > 0) sum += this.A[l][c - 1] * OC;
        if (c + 1 < this.COLUMNS) sum += this.A[l][c + 1] * OC;
        if (l - 1 > 0 && c - 1 > 0) sum += this.A[l - 1][c - 1] * DC;
        if (l - 1 > 0 && c + 1 < this.COLUMNS) sum += this.A[l - 1][c + 1] * DC;
        if (l + 1 < this.LINES && c - 1 > 0) sum += this.A[l + 1][c - 1] * DC;
        if (l + 1 < this.LINES && c + 1 < this.COLUMNS) sum += this.A[l + 1][c + 1] * DC;

        sum += this.A[l][c] * -1;

        return sum;
    }

    setValue(e) {
        const box = e.target.getBoundingClientRect();
        const x = e.clientX - box.left;
        const y = e.clientY - box.top;
        const l = Math.floor(y / this.SIZE);
        const c = Math.floor(x / this.SIZE);
        this.A[l][c] = 1.0;
    }

    getValueXY(x, y) {
        const l = Math.floor(y / this.SIZE);
        const c = Math.floor(x / this.SIZE);
        if (l < 0 || l >= this.LINES || c < 0 || c >= this.COLUMNS) return 0.0;
        return this.A[l][c];
    }

}