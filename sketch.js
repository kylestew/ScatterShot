import { circle, asPolygon, transform } from "@thi.ng/geom";
import * as v from "@thi.ng/vectors";
import * as m from "@thi.ng/matrices";
import * as sdf from "./lib/sdf_2d";
import { rayMarch } from "./lib/ray_march";
import { Ray } from "./lib/ray";
import * as dx from "./snod/drawer";
import { linspace } from "./snod/math";
import { bounce } from "cli-spinners";

const settings = {
  // animated: true,
  clearColor: "black",

  rayCount: 256,

  antiAliasFactor: 0.0,

  rayMarchMaxSteps: 32,
  rayMarchMaxDist: 3.0,
  rayMarchSurfDist: 0.001,
};

// 1) Create one or more shapes
const shapes = [
  sdf.circle([0, 0], 0.2),
  // sdf.circle([-0.5, 0], 0.3),
  // sdf.circle([0.5, 0], 0.3),
  // sdf.circle([0, 0], 0.05),
];

// 2) Create N points of light
const lights = [
  { pt: [0.5, 0.5], cd: [0, 0.7, 0.8, 0.7] },
  // { pt: [-0.3, -0.6], cd: [0, 0.7, 0.8, 0.7] },
  // { pt: [0.3, 0.6], cd: [0, 0.8, 0.7, 0.7] },
];

// 3) Fire rays from point lights in all directions
// a) draw rays in color of light
// b) bounce rays that collide with CIRCLE and pick up their color
function fireRays(light) {
  // create a set of unit points equally in all directions around center point
  let thetaOffset = Math.PI / 4.0 - 0.1;
  let points = linspace(0, 2 * Math.PI, settings.rayCount).map((theta) => {
    return [
      light.pt[0] + Math.cos(theta + thetaOffset),
      light.pt[1] + Math.sin(theta + thetaOffset),
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

  // fire each ray and collect lines made
  return rays.flatMap((ray) => {
    let rec = rayMarch(ray, shapes, settings);

    let line = ray.lineTo(rec.dist);
    line.attribs = {
      cd: light.cd,
    };

    let lines = [line];

    // TODO: HACK: display bounce
    if (rec.hit === true) {
      let { p, n } = rec;
      let newDirection = Ray(p, n);
      let bounceLine = newDirection.lineTo(0.24);
      bounceLine.attribs = {
        cd: [1, 0, 0, 1],
      };
      lines.push(bounceLine);
    }

    return lines;
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

  shapes.forEach((shape) => {
    dx.circle(ctx, shape.pos, shape.r);
  });

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
