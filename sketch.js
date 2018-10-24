let particles = [];

function setup() {
	createCanvas(100, 100);

	for (let i = 0; i < width; i++) {
		for (let j = 0; j < height; j++) {
			particles[i + j * height] = new Particle(i, j, getH());
		}
	}
}

let lastEmmit = 0;
let sign = 1;
function draw() {
	background(0);

	// lastEmmit++;
	// if(lastEmmit > 5) {
	// 	particles[Math.abs(width / 2) + Math.abs(height / 2) * height].vel = 0.5 * sign;
	// 	lastEmmit = 0;
	// 	sign *= -1;
	// }


	for (let i = 0; i < particles.length; i++) {
		particles[i].update();
	}

	for (let i = 0; i < particles.length; i++) {
		particles[i].render();
	}
}

function getH() {
	// return random(-HEIGHT_MAX, HEIGHT_MAX);
	// return 5;
	return 0;
}

function mousePressed() {
	particles[mouseX + mouseY * height].vel -= 0.1;
}


const HEIGHT_MAX = 500;
const POWER = 1;
const SUBST = 1000;

class Particle {
	constructor(x, y, h) {
		this.x = x;
		this.y = y;
		this.h = h;
		this.m = 1;

		this.acc = 0;
		this.vel = 0;
	}

	update() {
		let H = this.calcAverageH();
		this.acc = Math.sign(H - this.h) * Math.pow(Math.abs(H - this.h), POWER) / this.m;
		this.acc -= this.vel / SUBST;

		this.vel += this.acc;
		this.h += this.vel;

		if(this.h < -HEIGHT_MAX)
			this.h = -HEIGHT_MAX;
		else if(this.h > HEIGHT_MAX)
			this.h = HEIGHT_MAX;
	}

	render() {
		stroke(this.getColor());
		point(this.x, this.y);
	}


	getColor() {
		let r = this.h >= 0 ? 255 : 0;
		let g = 0;
		let b = this.h < 0 ? 255 : 0;
		let a = 1 - (HEIGHT_MAX - Math.abs(this.h)) / HEIGHT_MAX;

		return "rgba(" + r + "," + g + "," + b + "," + a + ")";
	}

	calcAverageH() {
		let calc = [0, 0];

		calc = this.addForNb(this.x - 1, this.y - 1, calc);
		calc = this.addForNb(this.x    , this.y - 1, calc);
		calc = this.addForNb(this.x + 1, this.y - 1, calc);

		calc = this.addForNb(this.x - 1, this.y, calc);
		calc = this.addForNb(this.x + 1, this.y, calc);

		calc = this.addForNb(this.x - 1, this.y + 1, calc);
		calc = this.addForNb(this.x    , this.y + 1, calc);
		calc = this.addForNb(this.x + 1, this.y + 1, calc);

		return calc[0] / calc[1];
	}

	addForNb(x, y, calc) {
		let particule = x + y * height;

		if(x >= 0 && y >= 0 && x <= width - 1 && y <= height - 1 && particles[particule]) {
			calc[0] += particles[particule].h;
			calc[1]++;
		}

		return calc;
	}
}
