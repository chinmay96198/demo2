const textCanvas = document.getElementById('particlesCanvas');
const textCtx = textCanvas.getContext('2d');
textCanvas.width = window.innerWidth;
textCanvas.height = window.innerHeight;

const text = "Happy Birthday!";
const fontSize = 48;
const particles = [];

class TextParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.origX = x;
        this.origY = y;
        this.vx = Math.random() * 2 - 1;
        this.vy = Math.random() * 2 - 1;
        this.alpha = 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= 0.005;
        if (this.alpha <= 0) {
            this.x = this.origX;
            this.y = this.origY;
            this.alpha = 1;
            this.vx = Math.random() * 2 - 1;
            this.vy = Math.random() * 2 - 1;
        }
    }

    draw() {
        textCtx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
        textCtx.fillRect(this.x, this.y, 2, 2);
    }
}

function createTextParticles() {
    textCtx.font = `${fontSize}px Arial`;
    textCtx.fillStyle = 'white';
    textCtx.fillText(text, (textCanvas.width / 2) - (textCtx.measureText(text).width / 2), textCanvas.height / 2);

    const textData = textCtx.getImageData(0, 0, textCanvas.width, textCanvas.height).data;

    for (let y = 0; y < textCanvas.height; y += 4) {
        for (let x = 0; x < textCanvas.width; x += 4) {
            const index = (y * textCanvas.width + x) * 4;
            if (textData[index + 3] > 128) {
                particles.push(new TextParticle(x, y));
            }
        }
    }

    textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
}

function animateParticles() {
    requestAnimationFrame(animateParticles);
    textCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
}

createTextParticles();
animateParticles();
