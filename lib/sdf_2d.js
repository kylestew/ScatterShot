import * as v from "@thi.ng/vectors";

/*
https://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
*/

function circle(pos, r) {
  return {
    pos,
    r,

    distToSurf: function (p) {
      // distance to circle = length(p - circCenter) - circRadius
      return v.mag(v.sub([], p, this.pos)) - this.r;
    },
  };
}

export { circle };
