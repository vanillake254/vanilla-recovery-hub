const fs = require('fs');
const { createCanvas, registerFont } = require('canvas');

// Create canvas
const width = 1200;
const height = 630;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Purple gradient background
const gradient = ctx.createLinearGradient(0, 0, width, height);
gradient.addColorStop(0, '#7C3AED');
gradient.addColorStop(1, '#9333EA');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, width, height);

// Draw shield logo
ctx.save();
ctx.translate(550, 150);
ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
ctx.beginPath();
ctx.moveTo(100, 20);
ctx.lineTo(200, 60);
ctx.lineTo(200, 180);
ctx.quadraticCurveTo(200, 240, 100, 300);
ctx.quadraticCurveTo(0, 240, 0, 180);
ctx.lineTo(0, 60);
ctx.closePath();
ctx.fill();

// Draw checkmark
ctx.strokeStyle = '#7C3AED';
ctx.lineWidth = 18;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.beginPath();
ctx.moveTo(50, 160);
ctx.lineTo(90, 200);
ctx.lineTo(170, 90);
ctx.stroke();

// Dot on checkmark
ctx.fillStyle = '#7C3AED';
ctx.beginPath();
ctx.arc(90, 200, 10, 0, Math.PI * 2);
ctx.fill();
ctx.restore();

// Title
ctx.fillStyle = 'white';
ctx.font = 'bold 64px Arial, sans-serif';
ctx.textAlign = 'center';
ctx.fillText('Vanilla Recovery Hub', width / 2, 400);

// Subtitle
ctx.font = '32px Arial, sans-serif';
ctx.globalAlpha = 0.9;
ctx.fillText('Professional Account Recovery Services', width / 2, 460);

// Stats
ctx.font = '28px Arial, sans-serif';
ctx.globalAlpha = 0.95;
ctx.fillText('✓ 500+ Recovered', 300, 540);
ctx.fillText('✓ 95% Success', 600, 540);
ctx.fillText('✓ Secure Payment', 900, 540);

// Save as PNG
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('./public/og-image.png', buffer);

console.log('✅ OpenGraph image created: public/og-image.png');
