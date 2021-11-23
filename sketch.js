const settings = {
  // animated: true,
  clearColor: "black",
};

const random = (min, max) => Math.random() * (max - min) + min;

const count = 1000;

const circles = Array.from(new Array(count)).map(() => {
  const arcStart = Math.PI * 2 - random(0, (Math.PI * 2) / 3);
  const arcLength = random(-0.1, 0.3) * Math.PI * 2;
  const segmentCount = Math.floor(random(5, 200));
  const spread = 0.085;
  return {
    segments: Array.from(new Array(segmentCount)).map(() => random(0, 1)),
    arcStart,
    arcEnd: arcStart + arcLength,
    arcLength,
    thickness: random(0.01, 1),
    alpha: random(0.25, 0.5),
    radius: random(0.1, 0.75),
    x: 1.0 + random(-1, 1) * spread,
    y: 1.0 + random(-1, 1) * spread,
  };
});

function update() {}

function render({ ctx, canvasScale }) {
  ctx.globalCompositeOperation = "source-over";

  const globalThickness = 4.0 * canvasScale;

  circles.forEach((circle) => {
    ctx.globalCompositeOperation = "lighter";
    circle.segments.forEach((t) => {
      const angle = circle.arcStart + circle.arcLength * t;
      const radius = circle.radius * random(-1, 1) * 0.5;
      const x = circle.x + Math.cos(angle) * radius;
      const y = circle.y + Math.sin(angle) * radius;
      ctx.beginPath();
      ctx.arc(
        x,
        y,
        circle.thickness * random(0.5, 1.25) * globalThickness,
        0,
        Math.PI * 2,
        false
      );
      ctx.fill();
      ctx.closePath();
      ctx.globalAlpha = circle.alpha;
    });
  });
}

export { settings, update, render };
