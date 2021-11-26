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
  const episolon = 0.0001;
  let dx =
    distToSurf([p[0] + episolon, p[1]], shapes) -
    distToSurf([p[0] - episolon, p[1]], shapes);
  let dy =
    distToSurf([p[0], p[1] + episolon], shapes) -
    distToSurf([p[0], p[1] - episolon], shapes);
  return [dx, dy];
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
        p: p,
        n: calcNormal(p, shapes),
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
