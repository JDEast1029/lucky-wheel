"use strict";
exports.__esModule = true;
exports.CubicBezier = void 0;
var CubicBezier = /** @class */ (function () {
    function CubicBezier(x1, y1, x2, y2) {
        this.precision = 1e-5;
        this.p1 = {
            x: x1,
            y: y1
        };
        this.p2 = {
            x: x2,
            y: y2
        };
    }
    CubicBezier.prototype.getX = function (t) {
        var x1 = this.p1.x, x2 = this.p2.x;
        return 3 * x1 * t * Math.pow(1 - t, 2) + 3 * x2 * Math.pow(t, 2) * (1 - t) + Math.pow(t, 3);
    };
    CubicBezier.prototype.getY = function (t) {
        var y1 = this.p1.y, y2 = this.p2.y;
        return 3 * y1 * t * Math.pow(1 - t, 2) + 3 * y2 * Math.pow(t, 2) * (1 - t) + Math.pow(t, 3);
    };
    // https://github.com/amfe/amfe-cubicbezier/blob/master/src/index.js
    CubicBezier.prototype.solveCurveX = function (x) {
        var t2 = x;
        var derivative;
        var x2;
        var p1x = this.p1.x, p2x = this.p2.x;
        var ax = 3 * p1x - 3 * p2x + 1;
        var bx = 3 * p2x - 6 * p1x;
        var cx = 3 * p1x;
        function sampleCurveDerivativeX(t) {
            // `ax t^3 + bx t^2 + cx t' expanded using Horner 's rule.
            return (3 * ax * t + 2 * bx) * t + cx;
        }
        // https://trac.webkit.org/browser/trunk/Source/WebCore/platform/animation
        // First try a few iterations of Newton's method -- normally very fast.
        // http://en.wikipedia.org/wiki/Newton's_method
        for (var i = 0; i < 8; i++) {
            // f(t)-x=0
            x2 = this.getX(t2) - x;
            if (Math.abs(x2) < this.precision) {
                return t2;
            }
            derivative = sampleCurveDerivativeX(t2);
            // == 0, failure
            if (Math.abs(derivative) < this.precision) {
                break;
            }
            // xn = x(n-1) - f(xn)/ f'(xn)
            // 假设g(x) = f(t) - x 
            // g'(x) = f'(t)
            //所以  f'(t) == g'(t) 
            // derivative == g'(t)
            t2 -= x2 / derivative;
        }
        // Fall back to the bisection method for reliability.
        // bisection
        // http://en.wikipedia.org/wiki/Bisection_method
        var t1 = 1;
        var t0 = 0;
        t2 = x;
        while (t1 > t0) {
            x2 = this.getX(t2) - x;
            if (Math.abs(x2) < this.precision) {
                return t2;
            }
            if (x2 > 0) {
                t1 = t2;
            }
            else {
                t0 = t2;
            }
            t2 = (t1 + t0) / 2;
        }
        // Failure
        return t2;
    };
    CubicBezier.prototype.solve = function (x) {
        return this.getY(this.solveCurveX(x));
    };
    return CubicBezier;
}());
exports.CubicBezier = CubicBezier;
