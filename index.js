const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particleArray = [];

// Adjust the placement of text
let adjustX = 20;
let adjustY = -5;

// Mouse movement Handler
const mouse = {
	x: null,
	y: null,
	radius: 150,
};

window.addEventListener("mousemove", (e) => {
	mouse.x = e.x;
	mouse.y = e.y;
});

ctx.fillStyle = "white";
ctx.font = "50px Verdana";
ctx.fillText("S", 5, 44);
const textCoordinates = ctx.getImageData(0, 0, 150, 100);

// Particle maker (sort of)
class Particle {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.size = 2;
		this.baseX = this.x;
		this.baseY = this.y;
		this.density = Math.random() * 30 + 1;
	}

	draw() {
		ctx.fillStyle = "white";
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size * 0.8, 0, Math.PI * 2);
		ctx.closePath();
		ctx.fill();
	}

	update() {
		let dx = mouse.x - this.x;
		let dy = mouse.y - this.y;
		let distance = Math.sqrt(dx * dx + dy * dy);
		let forceDirectionX = dx / distance;
		let forceDirectionY = dy / distance;
		let maxDistance = mouse.radius;
		let force = (maxDistance - distance) / maxDistance;
		let directionX = forceDirectionX * force * this.density;
		let directionY = forceDirectionY * force * this.density;

		if (distance < mouse.radius) {
			this.x -= directionX;
			this.y -= directionY;
		} else {
			if (this.x !== this.baseX) {
				let dx = this.x - this.baseX;
				this.x -= dx / 25;
			}
			if (this.y !== this.baseY) {
				let dy = this.y - this.baseY;
				this.y -= dy / 25;
			}
		}
	}
}

const init = () => {
	particleArray = [];

	for (let y = 0, y2 = textCoordinates.height; y < y2; y++) {
		for (let x = 0, x2 = textCoordinates.width; x < x2; x++) {
			if (
				textCoordinates.data[y * 4 * textCoordinates.width + x * 4 + 3] > 130
			) {
				let posX = x + adjustX;
				let posY = y + adjustY;
				particleArray.push(new Particle(posX * 10, posY * 10));
			}
		}
	}
};

init();

// Creating constellation effect
const connect = () => {
	for (let a = 0; a < particleArray.length; a++) {
		for (let b = a; b < particleArray.length; b++) {
			let dx = particleArray[a].x - particleArray[b].x;
			let dy = particleArray[a].y - particleArray[b].y;
			let distance = Math.sqrt(dx * dx + dy * dy);

			if (distance < 20) {
				ctx.strokeStyle = "grey";
				ctx.lineWidth = 1;
				ctx.beginPath();
				ctx.moveTo(particleArray[a].x, particleArray[a].y);
				ctx.lineTo(particleArray[b].x, particleArray[b].y);

				ctx.stroke();
			}
		}
	}
};

// Making whole thing animate
const animate = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for (let i = 0; i < particleArray.length; i++) {
		particleArray[i].draw();
		particleArray[i].update();
	}
	connect();
	requestAnimationFrame(animate);
};

animate();
