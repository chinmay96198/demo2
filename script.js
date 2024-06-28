// script.js

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const audio = document.getElementById('audio');
const foodItems = document.getElementById('foodItems');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const numParticles = 1000;
const particles = [];
const durationRandomMotion = 100;
const durationShapeFormation = 100;
const imageUrl = 'path/to/your/image.jpg';
let frame = 0;
let animationStarted = false;
let imageLoaded = false;
let phase = 0;  // 0: initial, 1: first message, 2: second message

const image = new Image();
image.src = imageUrl;

image.onload = () => {
    imageLoaded = true;
    console.log('Image loaded');
};

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 5;
        this.vy = (Math.random() - 0.5) * 5;
        this.tx = x;
        this.ty = y;
        this.color = color || 'white';
    }
    update() {
        if (frame < durationRandomMotion) {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        } else {
            this.x += (this.tx - this.x) * 0.05;
            this.y += (this.ty - this.y) * 0.05;
        }
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 2, 2);
    }
}

function createParticles() {
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    }
}

function getCakeAndTextPositions() {
    const positions = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const cakeWidth = 200;
    const cakeHeight = 100;
    const candleWidth = 10;
    const candleHeight = 50;

    // Base of the cake (rectangle)
    for (let x = centerX - cakeWidth / 2; x <= centerX + cakeWidth / 2; x += 6) {
        for (let y = centerY - cakeHeight / 2; y <= centerY + cakeHeight / 2; y += 6) {
            positions.push({x: x, y: y, color: 'pink'});
        }
    }

    // Candle (rectangle)
    for (let x = centerX - candleWidth / 2; x <= centerX + candleWidth / 2; x += 4) {
        for (let y = centerY - cakeHeight / 2 - candleHeight; y <= centerY - cakeHeight / 2; y += 4) {
            positions.push({x: x, y: y, color: 'red'});
        }
    }

    // "Happy Birthday" text
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText("Happy Birthday", centerX, centerY - cakeHeight - 60);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    
    for (let y = 0; y < canvas.height; y += 6) {
        for (let x = 0; x < canvas.width; x += 6) {
            const index = (y * canvas.width + x) * 4;
            if (data[index + 3] > 128) {  // Check the alpha value
                positions.push({x: x, y: y, color: 'white'});
            }
        }
    }

    return positions;
}

function getMessagePositions(message) {
    const positions = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(message, centerX, centerY);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let y = 0; y < canvas.height; y += 6) {
        for (let x = 0; x < canvas.width; x += 6) {
            const index = (y * canvas.width + x) * 4;
            if (data[index + 3] > 128) {  // Check the alpha value
                positions.push({x: x, y: y, color: 'white'});
            }
        }
    }

    return positions;
}

function assignTargetPositions(positions) {
    for (let i = 0; i < particles.length; i++) {
        const pos = positions[i % positions.length];
        particles[i].tx = pos.x;
        particles[i].ty = pos.y;
        particles[i].color = pos.color;
    }
}

// Fireworks effect
class Firework {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.sparks = [];
        for (let i = 0; i < 100; i++) {
            this.sparks.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                alpha: 1,
                color: `hsl(${Math.random() * 360}, 100%, 50%)`
            });
        }
    }
    update() {
        this.sparks.forEach(spark => {
            spark.vx *= 0.95;
            spark.vy *= 0.95;
            spark.alpha -= 0.02;
            spark.x += spark.vx;
            spark.y += spark.vy;
        });
        this.sparks = this.sparks.filter(spark => spark.alpha > 0);
    }
    draw() {
        this.sparks.forEach(spark => {
            ctx.fillStyle = `rgba(${parseInt(spark.color.slice(4, spark.color.indexOf(',')))},${parseInt(spark.color.slice(spark.color.indexOf(',') + 1, spark.color.lastIndexOf(',')))},${parseInt(spark.color.slice(spark.color.lastIndexOf(',') + 1, spark.color.indexOf(')')))},${spark.alpha})`;
            ctx.beginPath();
            ctx.arc(spark.x, spark.y, 2, 0, Math.PI * 2);
            ctx.fill();
        });
    }
}

const fireworks = [];

function createFireworks() {
    for (let i = 0; i < 10; i++) {
        fireworks.push(new Firework(Math.random() * canvas.width, Math.random() * canvas.height));
    }
}

function animate() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    
    if (frame >= durationRandomMotion + durationShapeFormation && !animationStarted) {
        if (imageLoaded) {
            ctx.drawImage(image, canvas.width / 2 - image.width / 2, canvas.height / 2 - image.height / 2);
            console.log('Image drawn');
        }
        if (!audio.playing) {
            audio.play();
            audio.playing = true;
            console.log('Audio playing');
        }

        animationStarted = true;

        setTimeout(() => {
            const firstMessagePositions = getMessagePositions("Have a Great Day!");
            assignTargetPositions(firstMessagePositions);
            phase = 1;
            createFireworks();
        }, 5000); // 5 seconds delay before displaying the first message

        setTimeout(() => {
            const secondMessagePositions = getMessagePositions("Enjoy Your Special Day!");
            assignTargetPositions(secondMessagePositions);
            phase = 2;
        }, 10000); // Additional 5 seconds delay before displaying the second message (10 seconds total)

        setTimeout(() => {
            canvas.style.display = 'none';
            foodItems.style.display = 'flex';
            startFoodSlider();
        }, 15000); // Additional 5 seconds delay before showing the food items (15 seconds total)
    }

    // Draw and update fireworks
    if (phase === 1) {
        fireworks.forEach(firework => {
            firework.update();
            firework.draw();
        });
    }
    
    requestAnimationFrame(animate);
}

function startFoodSlider() {
    foodItems.style.display = 'flex';

    // Auto slide every 5 seconds
    setInterval(() => {
        slideToNext();
    }, 5000);
}

const foodSliderWrapper = document.querySelector('.food-slider-wrapper');
const foodItemsList = document.querySelectorAll('.food-item');
let currentSlide = 0;
const slideWidth = foodItemsList[0].clientWidth;

function slideToNext() {
    currentSlide++;
    if (currentSlide >= foodItemsList.length) {
        currentSlide = 0;
    }
    updateSliderPosition();
}

function updateSliderPosition() {
    const translateValue = -currentSlide * slideWidth;
    foodSliderWrapper.style.transform = `translateX(${translateValue}px)`;
}

startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    createParticles();
    const initialPositions = getCakeAndTextPositions();
    assignTargetPositions(initialPositions);
    animate();
    audio.playing = false;  // Reset playing status
});
