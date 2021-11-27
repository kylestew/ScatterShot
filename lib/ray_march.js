import { Ray } from "./ray";
import { normalize } from "@thi.ng/vectors";

function distToSurf(p, shapes) {
  return shapes
    .map((shape) => {
      return shape.distToSurf(p);
    })
    .sort((a, b) => {
      return a - b;
    })[0];
}

function calcNormal(p, shapes) {
  const episolon = 0.001;
  let dx =
    distToSurf([p[0] + episolon, p[1]], shapes) -
    distToSurf([p[0] - episolon, p[1]], shapes);
  let dy =
    distToSurf([p[0], p[1] + episolon], shapes) -
    distToSurf([p[0], p[1] - episolon], shapes);
  return normalize([], [dx, dy]);
}

function rayMarch(ray, shapes, settings) {
  // start a bit away from the surface so we don't get stuck to it
  let dO = 0.0001;
  for (let i = 0; i < settings.rayMarchMaxSteps; ++i) {
    let p = ray.at(dO);
    let dS = distToSurf(p, shapes);
    dO += dS;
    if (dS < settings.rayMarchSurfDist) {
      // hit a surface
      return {
        hit: true,
        o: ray.orig,
        p: p,
        d: dO,
        n: calcNormal(p, shapes),
      };
    } else if (dO > settings.rayMarchMaxDist) {
      // flew off into space
      return {
        hit: false,
        o: ray.orig,
        p: p,
        d: dO,
      };
    }
  }
  // bounced too many times
  return {
    hit: false,
    d: dO,
  };
}

function recursiveRayMarch(ray, shapes, settings, depth = 0) {
  let rec = rayMarch(ray, shapes, settings);
  rec.depth = depth;
  if (rec.hit === true) {
    return [
      rec,
      recursiveRayMarch(Ray(rec.p, rec.n), shapes, settings, depth + 1),
    ].flat();
  }
  return [rec];
}

export { rayMarch, recursiveRayMarch };
