import { circle, asPolygon } from "@thi.ng/geom";
import * as v from "@thi.ng/vectors";
import * as sdf from "./lib/sdf_2d";
import { rayMarch } from "./lib/ray_march";
import { Ray } from "./lib/ray";
import * as dx from "./snod/drawer";

const settings = {
  // animated: true,
  clearColor: "black",

  rayCount: 1000,

  antiAliasFactor: 0.001,

  rayMarchMaxSteps: 32,
  rayMarchMaxDist: 3.0,
  rayMarchSurfDist: 0.001,
};

// 1) Create one or more shapes
const shapes = [
  sdf.circle([-0.5, 0], 0.3),
  sdf.circle([0.5, 0], 0.3),
  sdf.circle([0, 0], 0.05),
];

// 2) Create N points of light
const lights = [
  { pt: [-0.3, -0.6], cd: [0, 0.7, 0.8, 0.7] },
  { pt: [0.3, 0.6], cd: [0, 0.8, 0.7, 0.7] },
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

    let cent = v.add([], light.pt, [
      settings.antiAliasFactor * (Math.random() - 0.5),
      settings.antiAliasFactor * (Math.random() - 0.5),
    ]);

    return Ray(cent, v.sub([], pt, light.pt));
  });

  // fire from each ray and collect lines made
  return rays.map((ray) => {
    let rec = rayMarch(ray, shapes, settings);
    let line = ray.lineTo(rec.dist);
    line.attribs = {
      cd: light.cd,
    };
    return line;
  });
}

let lines;

const update = function () {
  lines = lights.flatMap(fireRays);
};

function render({ ctx, canvasScale }) {
  // ctx.strokeStyle = "#ffffff11";
  ctx.fillStyle = "#ffffff22";
  ctx.strokeStyle = "#ffffff";

  // shapes.forEach((shape) => {
  //   dx.circle(ctx, shape.pos, shape.r);
  // });

  lines.forEach((line) => {
    let [a, b] = line.points;

    if (line.attribs.cd) {
      let cd = line.attribs.cd.map((a) => {
        return a * 255;
      });
      ctx.strokeStyle = `rgba(
      ${cd[0]},
      ${cd[1]},
      ${cd[2]},
      ${line.attribs.cd[3]})`;
    }

    dx.line(ctx, a, b);
  });
}

export { settings, update, render };
