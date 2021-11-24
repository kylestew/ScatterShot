import { circle, asPolygon } from "@thi.ng/geom";
import { sub } from "@thi.ng/vectors";
import * as sdf from "./lib/sdf_2d";
import { rayMarch } from "./lib/ray_march";
import { Ray } from "./lib/ray";
import * as dx from "./snod/drawer";

const settings = {
  // animated: true,
  clearColor: "black",

  rayCount: 8,

  rayMarchMaxSteps: 12,
  rayMarchMaxDist: 4.0,
  rayMarchSurfDist: 0.0001,
};

// 1) Create one or more shapes
const shapes = [sdf.circle([0, 0], 0.3)];

// 2) Create N points of light
const lights = [
  { pt: [-0.4, -0.6], cd: [1, 0, 0, 1] },
  { pt: [0.6, 0.4], cd: [1, 0, 0, 1] },
];

// 3) Fire rays from point lights in all directions
// a) draw rays in color of light
// TODO: b) bounce rays that collide with CIRCLE and pick up their color
function fireRays(light) {
  // point lights fire rays in all directions
  // create a circle and use points as directions
  // (saves on some brain-thinking)
  let poly = asPolygon(circle(light.pt, 0.1), settings.rayCount);
  let rays = poly.points.map((pt) => {
    // direction = point on circle - center of circle
    return Ray(light.pt, sub([], pt, light.pt));
  });

  // fire from each ray and collect lines made
  return rays.map((ray) => {
    let rec = rayMarch(ray, shapes, settings);
    return ray.lineTo(rec.dist);
  });
}

let lines;

const update = function () {
  lines = lights.flatMap(fireRays);
};

function render({ ctx, canvasScale }) {
  // ctx.strokeStyle = "#ffffff11";
  ctx.strokeStyle = "#ffffff";

  shapes.forEach((shape) => {
    dx.circle(ctx, shape.pos, shape.r);
  });

  lines.forEach((line) => {
    console.log(line);
    let [a, b] = line.points;
    dx.line(ctx, a, b);
  });
}

export { settings, update, render };
