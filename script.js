const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('startButton');
const content = document.getElementById('content');
const birthdaySong = document.getElementById('birthdaySong');
const playBtn = document.getElementById('playBtn');
const pauseBtn = document.getElementById('pauseBtn');
const nextBtn = document.getElementById('nextBtn');
const prevBtn = document.getElementById('prevBtn');
const player = document.getElementById('player');
const playerSource = document.getElementById('player-source');
const progressBar = document.getElementById('progress');
const volumeControl = document.getElementById('volume');

const musicFiles = ["path/to/music1.mp3", "path/to/music2.mp3", "path/to/music3.mp3"];
let currentAudioIndex = 0;

playerSource.src = musicFiles[currentAudioIndex];

const particles = [];
const numParticles = 4000;
let animationStarted = false;
let frame = 0;
const durationRandomMotion = 500; // Increased duration for random motion
const durationShapeFormation = 200;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.tx = Math.random() * canvas.width;
        this.ty = Math.random() * canvas.height;
        this.vx = Math.random() * 2 - 1; // Random velocity for random motion
        this.vy = Math.random() * 2 - 1; // Random velocity for random motion
        this.color = getGradientColor(x, y);
    }

    update() {
        if (frame < durationRandomMotion) {
            // Random motion phase
            this.x += this.vx;
            this.y += this.vy;
        } else {
            // Smooth movement towards target
            this.x += (this.tx - this.x) * 0.05;
            this.y += (this.ty - this.y) * 0.05;
        }

        
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, 2, 2); // Adjusted particle size
    }
}

function createParticles() {
    for (let i = 0; i < numParticles; i++) {
        particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height));
    }
}

function getGradientColor(x, y) {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop("0.0", "red");
    gradient.addColorStop("0.5", "orange");
    gradient.addColorStop("0.8", "yellow");
    gradient.addColorStop("1.0", "green");
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, 1, 1);
    const data = ctx.getImageData(x, y, 1, 1).data;
    return `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
}

function getCakeAndTextPositions() {
    const positions = [];
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const cakeWidth = 200;
    const cakeHeight = 100;
    const candleWidth = 10;
    const candleHeight = 50;

    for (let x = centerX - cakeWidth / 2; x <= centerX + cakeWidth / 2; x += 4) {
        for (let y = centerY - cakeHeight / 2; y <= centerY + cakeHeight / 2; y += 4) {
            positions.push({ x: x, y: y, color: getGradientColor(x, y) });
        }
    }

    for (let x = centerX - candleWidth / 2; x <= centerX + candleWidth / 2; x += 4) {
        for (let y = centerY - cakeHeight / 2 - candleHeight; y <= centerY - cakeHeight / 2; y += 4) {
            positions.push({ x: x, y: y, color: getGradientColor(x, y) });
        }
    }

    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = 'white';
    ctx.fillText("Happy 25th Birthday Melis", centerX, centerY - cakeHeight - 60);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let y = 0; y < canvas.height; y += 4) {
        for (let x = 0; x < canvas.width; x += 4) {
            const index = (y * canvas.width + x) * 4;
            if (data[index + 3] > 128) {
                positions.push({ x: x, y: y, color: getGradientColor(x, y) });
            }
        }
    }

    return positions;
}

function getMessagePositions(message) {
    const positions = [];
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 40px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

    for (let y = 0; y < canvas.height; y += 3) { // Decreased spacing for thicker text
        for (let x = 0; x < canvas.width; x += 3) { // Decreased spacing for thicker text
            const index = (y * canvas.width + x) * 4;
            if (data[index + 3] > 128) {
                positions.push({ x: x, y: y, color: getGradientColor(x, y) });
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

function animate() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    if (frame === durationRandomMotion) {
        const initialPositions = getCakeAndTextPositions();
        assignTargetPositions(initialPositions);
    }

    if (frame >= durationRandomMotion + durationShapeFormation && !animationStarted) {
        animationStarted = true;

        // Play the birthday song
        birthdaySong.play();

        // Define the messages and their timings
        const messages = [
            { text: "SORRY", delay: 5000 },
            { text: "I CANT GIVE YOU ANYTHING", delay: 10000 },
            
            { text: "ON YOUR SPECIAL DAY", delay: 15000 },
            { text: "BUT", delay: 20000 },
            { text: "I WILL TRY", delay: 25000 },
            { text: "TO PUT A SMILE", delay: 30000 },
            { text: "ON YOUR FACE", delay: 35000 },
            { text: "BY BRINGING ALL THE", delay: 40000 },
            { text: "THINGS YOU LIKE", delay: 45000 },
            { text: "AT ONE PLACE", delay: 50000 },
            { text: "HOPE YOU LIKE IT !!!!", delay: 55000 }
        ];

        // Display each message at the defined times
        messages.forEach(({ text, delay }) => {
            setTimeout(() => {
                const positions = getMessagePositions(text);
                assignTargetPositions(positions);
            }, delay);
        });

        // Smooth transition from canvas to content
        setTimeout(() => {
            canvas.style.transition = 'opacity 2s';
            content.style.transition = 'opacity 2s';
            canvas.style.opacity = 0;
            content.style.display = 'flex';
            setTimeout(() => {
                content.style.opacity = 1;
                document.body.style.overflowY = 'scroll';
                canvas.style.display = 'none';
            }, 2000);
        }, 65000); // Adjust this timing as needed
    }

    requestAnimationFrame(animate);
}

function playMusic() {
    player.play();
    playBtn.style.display = 'none';
    pauseBtn.style.display = 'block';
}

function pauseMusic() {
    player.pause();
    playBtn.style.display = 'block';
    pauseBtn.style.display = 'none';
}

function stopMusic() {
    player.pause();
    player.currentTime = 0;
}

function nextMusic() {
    stopMusic();
    currentAudioIndex = (currentAudioIndex + 1) % musicFiles.length;
    playerSource.src = musicFiles[currentAudioIndex];
    player.load();
    playMusic();
}

function prevMusic() {
    stopMusic();
    currentAudioIndex = (currentAudioIndex - 1 + musicFiles.length) % musicFiles.length;
    playerSource.src = musicFiles[currentAudioIndex];
    player.load();
    playMusic();
}

function updateProgressBar() {
    const progress = (player.currentTime / player.duration) * 100;
    progressBar.value = progress;
}

function setProgress() {
    const newTime = (progressBar.value / 100) * player.duration;
    player.currentTime = newTime;
}

function setVolume() {
    player.volume = volumeControl.value;
}

startButton.addEventListener('click', () => {
    startButton.style.display = 'none';
    createParticles();
    animate();
});

playBtn.addEventListener('click', () => {
    playMusic();
});

pauseBtn.addEventListener('click', () => {
    pauseMusic();
});

nextBtn.addEventListener('click', () => {
    nextMusic();
});

prevBtn.addEventListener('click', () => {
    prevMusic();
});

player.addEventListener('timeupdate', () => {
    updateProgressBar();
});

progressBar.addEventListener('input', () => {
    setProgress();
});

volumeControl.addEventListener('input', () => {
    setVolume();
});
