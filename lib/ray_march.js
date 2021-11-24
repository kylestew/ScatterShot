function distToSurf(p, shapes) {
  return shapes
    .map((shape) => {
      return shape.distToSurf(p);
    })
    .sort((a, b) => {
      return a - b;
    })[0];
}

function rayMarch(ray, shapes, settings) {
  let dO = 0;
  for (let i = 0; i < settings.rayMarchMaxSteps; ++i) {
    let p = ray.at(dO);
    let dS = distToSurf(p, shapes);
    dO += dS;
    if (dS < settings.rayMarchSurfDist) {
      return {
        hit: true,
        dist: dO,
      };
    } else if (dO > settings.rayMarchMaxDist) {
      break;
    }
  }
  return {
    hit: false,
    dist: dO,
  };
}

export { rayMarch };
