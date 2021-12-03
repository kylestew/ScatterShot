import { circle, asPolygon, transform } from "@thi.ng/geom";
import { fit } from "@thi.ng/math";
import * as v from "@thi.ng/vectors";
import * as m from "@thi.ng/matrices";
import * as sdf from "./lib/sdf_2d";
import { recursiveRayMarch } from "./lib/ray_march";
import { Ray } from "./lib/ray";
import * as dx from "./snod/drawer";
import { linspace } from "./snod/math";
import { bounce } from "cli-spinners";
import { line } from "@thi.ng/geom";

const settings = {
  // animated: true,
  clearColor: "black",

  rayCount: 4096 * 2,

  antiAliasFactor: 0.001,

  thetaOffset: Math.PI / 4.0,

  rayMarchMaxSteps: 128,
  rayMarchMaxDist: 4.0,
  rayMarchSurfDist: 0.0001,

  compositeMode: "screen",
  // compositeMode: "lighten",
  // compositeMode: "difference",
};

// 1) Create one or more shapes
const shapes = [
  sdf.circle([-0.6, 0.4], 0.25),
  sdf.circle([0.6, 0.4], 0.25),
  sdf.circle([0.0, -0.4], 0.25),
];

// 2) Create N points of light
const lights = [
  { pt: [0.7, -0.4], cd: [0.2, 0.4, 0.9, 0.7] },
  { pt: [-0.7, -0.4], cd: [0.2, 0.9, 0.4, 0.7] },
  { pt: [0.0, 0.7], cd: [0.9, 0.4, 0.2, 0.7] },
];

// 3) Fire rays from point lights in all directions
// a) draw rays in color of light
// b) bounce rays that collide with CIRCLE and pick up their color
function fireRays(light) {
  // create a set of unit points equally in all directions around center point
  // let thetaOffset = Math.PI / 4.0 - 0.1;
  let points = linspace(0, 2 * Math.PI, settings.rayCount).map((theta) => {
    let offset =
      settings.antiAliasFactor * (Math.random() - 0.5) + settings.thetaOffset;
    return [
      light.pt[0] + Math.cos(theta + offset),
      light.pt[1] + Math.sin(theta + offset),
    ];
  });

  // create rays in the direction of those points
  let rays = points.map((pt) => {
    // direction = point on circle - center of circle
    let cent = v.add([], light.pt, [
      settings.antiAliasFactor * (Math.random() - 0.5),
      settings.antiAliasFactor * (Math.random() - 0.5),
    ]);
    return Ray(cent, v.sub([], pt, light.pt));
  });

  // fire each ray - returns hit records
  const rayMarch = (ray) => recursiveRayMarch(ray, shapes, settings);
  let hits = rays.flatMap(rayMarch);

  // copy attrs from light to hit record
  return hits.map((hit) => ({ ...hit, cd: light.cd }));
}

let hits;

const update = function () {
  hits = lights.flatMap(fireRays);
};

function render({ ctx, canvasScale }) {
  // ctx.strokeStyle = "#ffffff11";
  ctx.fillStyle = "#ffffff22";
  ctx.strokeStyle = "#ffffff";

  shapes.forEach((shape) => {
    dx.circle(ctx, shape.pos, shape.r);
  });

  ctx.fillStyle = "#ff000099";
  lights.forEach((light) => {
    dx.circle(ctx, light.pt, 0.01);
  });

  ctx.globalCompositeOperation = settings.compositeMode;
  hits.forEach((hit) => {
    if (hit.cd) {
      let cd = hit.cd.map((a) => {
        return a * 255;
      });
      let alpha = 1.0;
      if (hit.depth >= 0) {
        alpha = fit(hit.depth, 0, 4, 0.1, 0.01);
      }
      ctx.strokeStyle = `rgba( ${cd[0]}, ${cd[1]}, ${cd[2]}, ${alpha})`;
    }

    if (hit.o && hit.p) dx.line(ctx, hit.o, hit.p);
  });
}

export { settings, update, render };
