import * as v from "@thi.ng/vectors";

const MAX_STEPS = 12;
const MAX_DIST = 2.0;
const SURF_DIST = 0.01;

import { circle } from "@thi.ng/geom";
let circ = circle([0.0, 0.0], 0.2);

function distToSurf(p) {
  // distance to circle = length(p - circCenter) - circRadius
  let dC = v.mag(v.sub([], p, circ.pos)) - circ.r;
  return dC;
}

function rayMarch(ray) {
  let dO = 0;
  for (let i = 0; i < MAX_STEPS; ++i) {
    let p = ray.at(dO);
    let dS = distToSurf(p);
    dO += dS;
    if (dS < SURF_DIST) {
      return {
        hit: true,
        dist: dO,
      };
    } else if (dO > MAX_DIST) {
      break;
    }
  }
  return {
    hit: false,
    dist: dO,
  };
}

export { rayMarch };
