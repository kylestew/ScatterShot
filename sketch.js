import { circle, asPolygon } from "@thi.ng/geom";
import { sub } from "@thi.ng/vectors";
import { rayMarch } from "./lib/ray_march";
import { Ray } from "./lib/ray";
import * as dx from "./snod/drawer";

const settings = {
  // animated: true,
  clearColor: "black",
};

// 1) Create a CIRCLE
let circ = circle([0.0, 0.0], 0.2);

// 2) Create N points of light
let lights = [{ pt: [0.6, 0.4], cd: [1, 0, 0, 1] }];

// 3) Fire rays from point lights in all directions
// a) draw rays in color of light
// b) bounce rays that collide with CIRCLE and pick up their color

let light = lights[0];
let poly = asPolygon(circle(light.pt, 0.2), 36);
let rays = poly.points.map((pt) => {
  return Ray(light.pt, sub([], pt, light.pt));
});

console.log(rays[0].dir, rays[0].orig);
console.log(rays[1].dir, rays[1].orig);
console.log(rays[2].dir, rays[2].orig);
console.log(rays[3].dir, rays[3].orig);

let lines = rays.map((ray) => {
  let rec = rayMarch(ray);
  console.log(rec);
  let line = ray.lineTo(rec.dist);
  return line;
});
console.log(lines);

function update() {}

function render({ ctx, canvasScale }) {
  ctx.strokeStyle = "white";

  dx.circle(ctx, circ.pos, circ.r);

  lines.forEach((line) => {
    let [a, b] = line.points;
    dx.line(ctx, a, b);
  });
}

export { settings, update, render };
