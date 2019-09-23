export default class Sprite {
    constructor(props) {
        this.x = 0;
        this.y = 0;
        this.vx = 0;
        this.vy = 0;
        this.a = 0;
        this.va = 0;
        this.vm = 0;
        this.ctx = null;
        this.canvas = null;
        this.sensors = {
            l: {s:10, x: 0, y: 0, a: -0.2 * Math.PI },
            f: {s:15, x: 0, y: 0, a: 0 },
            r: {s:10, x: 0, y: 0, a: +0.2 * Math.PI },
        };
        this.bgcolor= "yellow";
        Object.assign(this, props);
    }

    step(dt) {
        this.a = this.a + this.va * dt;

        this.vx = this.vm * Math.cos(this.a);
        this.vy = this.vm * Math.sin(this.a);

        this.x = this.x + this.vx * dt;
        this.y = this.y + this.vy * dt;

        for (let s in this.sensors) {
            this.sensors[s].lx = this.sensors[s].s * Math.cos(this.a + this.sensors[s].a);
            this.sensors[s].ly = this.sensors[s].s * Math.sin(this.a + this.sensors[s].a);
            this.sensors[s].x = this.x + this.sensors[s].s * Math.cos(this.a + this.sensors[s].a);
            this.sensors[s].y = this.y + this.sensors[s].s * Math.sin(this.a + this.sensors[s].a);
        }

    }

    draw() {


        this.ctx.save();
        this.ctx.translate(this.x, this.y);
        this.ctx.rotate((this.a +0.5)*Math.PI);
        this.ctx.strokeStyle = "orange";
        this.ctx.fillStyle = this.bgcolor;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.stroke();


        for (let s in this.sensors) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = "red";
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(this.sensors[s].lx, this.sensors[s].ly);
            this.ctx.stroke();
        }

        this.ctx.restore();
    }

    getSensorXY(s) {
        let pos = { x: this.x, y: this.y };
        pos.x += 10 * Math.cos(this.sensors[s].a + this.a);
        pos.y += 10 * Math.sin(this.sensors[s].a + this.a);
        return pos;
    }

    behave() {


        this.va = 1 - 2 * Math.random();
    }
}