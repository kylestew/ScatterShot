import { add, mulN, normalize } from "@thi.ng/vectors";
import { line } from "@thi.ng/geom";

function Ray(orig, dir) {
  return {
    orig,
    dir: normalize([], dir),

    at: function (t) {
      return add([], this.orig, mulN([], this.dir, t));
    },

    lineTo: function (t) {
      return line([this.orig, this.at(t)]);
    },
  };
}

export { Ray };
export default Ray;
