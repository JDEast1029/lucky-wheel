/* from: https://juejin.cn/post/6988305902633746468 */

type coordinate = {
	x: number,
	y: number
}
export class CubicBezier {
	p1: coordinate
	p2: coordinate
	precision = 1e-5;
	constructor(x1: number, y1: number, x2: number, y2: number) {
		this.p1 = {
			x: x1,
			y: y1
		};
		this.p2 = {
			x: x2,
			y: y2
		};
	}
	getX(t: number) {
		const x1 = this.p1.x, x2 = this.p2.x;
		return 3 * x1 * t * Math.pow(1 - t, 2) + 3 * x2 * Math.pow(t, 2) * (1 - t) + Math.pow(t, 3);
	}
	getY(t: number) {
		const y1 = this.p1.y, y2 = this.p2.y;
		return 3 * y1 * t * Math.pow(1 - t, 2) + 3 * y2 * Math.pow(t, 2) * (1 - t) + Math.pow(t, 3);
	}
	// https://github.com/amfe/amfe-cubicbezier/blob/master/src/index.js
	solveCurveX(x: number) {
		let t2 = x;
		let derivative;
		let x2;

		const p1x = this.p1.x, p2x = this.p2.x;

		const ax = 3 * p1x - 3 * p2x + 1;
		const bx = 3 * p2x - 6 * p1x;
		const cx = 3 * p1x;

		function sampleCurveDerivativeX(t: number) {
			// `ax t^3 + bx t^2 + cx t' expanded using Horner 's rule.
			return (3 * ax * t + 2 * bx) * t + cx;
		}
		// https://trac.webkit.org/browser/trunk/Source/WebCore/platform/animation
		// First try a few iterations of Newton's method -- normally very fast.
		// http://en.wikipedia.org/wiki/Newton's_method
		for (let i = 0; i < 8; i++) {
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
		let t1 = 1;
		let t0 = 0;

		t2 = x;
		while (t1 > t0) {
			x2 = this.getX(t2) - x;
			if (Math.abs(x2) < this.precision) {
				return t2;
			}
			if (x2 > 0) {
				t1 = t2;
			} else {
				t0 = t2;
			}
			t2 = (t1 + t0) / 2;
		}

		// Failure
		return t2;
	}
	solve(x: number) {
		return this.getY(this.solveCurveX(x));
	}
}