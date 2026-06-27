// ============================================================================
// HTML5 CANVAS NATURE ANIMATION CONTROL ENGINE (LOW VOLUME & HIGH PERFORMANCE)
// ============================================================================
const canvas = document.getElementById("nature-canvas");
if (canvas) {
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const natureAssets = [];
    const particleCount = 10; 

    class NatureParticle {
        constructor() {
            this.reset();
            this.y = Math.random() * canvas.height; 
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = -30;
            this.size = Math.random() * 12 + 10; 
            this.speedY = Math.random() * 0.7 + 0.3; 
            this.speedX = Math.sin(Math.random() * 2) * 0.15;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 1.0 - 0.5;
            this.type = Math.floor(Math.random() * 3); 
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y > canvas.height + 30 || this.x > canvas.width + 30 || this.x < -30) {
                this.reset();
            }
        }
        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);

            if (this.type === 0) {
                let grad = ctx.createRadialGradient(-2, -2, 1, 0, 0, this.size);
                grad.addColorStop(0, "#ff4d6d");
                grad.addColorStop(0.6, "#c9184a");
                grad.addColorStop(1, "#590d22");
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.ellipse(0, 0, this.size, this.size * 0.7, 0, 0, 2 * Math.PI);
                ctx.fill();
            } else if (this.type === 1) {
                let grad = ctx.createLinearGradient(-this.size, 0, this.size, 0);
                grad.addColorStop(0, "#ffb703");
                grad.addColorStop(0.5, "#fb8500");
                grad.addColorStop(1, "#d62828");
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.moveTo(-this.size, 0);
                ctx.quadraticCurveTo(0, -this.size * 0.6, this.size, 0);
                ctx.quadraticCurveTo(0, this.size * 0.6, -this.size, 0);
                ctx.fill();
            } else {
                let grad = ctx.createLinearGradient(0, -this.size, 0, this.size);
                grad.addColorStop(0, "#9ef01a");
                grad.addColorStop(0.4, "#38b000");
                grad.addColorStop(1, "#005f73");
                ctx.fillStyle = grad;
                ctx.beginPath();
                ctx.moveTo(0, -this.size);
                ctx.quadraticCurveTo(this.size * 0.5, 0, 0, this.size);
                ctx.quadraticCurveTo(-this.size * 0.5, 0, 0, -this.size);
                ctx.fill();
            }
            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        natureAssets.push(new NatureParticle());
    }

    function engineLoop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        natureAssets.forEach((asset) => {
            asset.update();
            asset.draw();
        });
        requestAnimationFrame(engineLoop);
    }
    engineLoop();
}
