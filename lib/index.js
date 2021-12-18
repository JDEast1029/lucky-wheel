function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    enumerableOnly && (symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    })), keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = null != arguments[i] ? arguments[i] : {};
    i % 2 ? ownKeys(Object(source), !0).forEach(function (key) {
      _defineProperty(target, key, source[key]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) {
      Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
    });
  }

  return target;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

var DirectionType;

(function (DirectionType) {
  DirectionType[DirectionType["CLOCKWISE"] = 0] = "CLOCKWISE";
  DirectionType[DirectionType["ANTICLOCKWISE"] = 1] = "ANTICLOCKWISE";
})(DirectionType || (DirectionType = {}));

var LuckWheelStatus;

(function (LuckWheelStatus) {
  LuckWheelStatus[LuckWheelStatus["INIT"] = 0] = "INIT";
  LuckWheelStatus[LuckWheelStatus["SPEED_UP"] = 1] = "SPEED_UP";
  LuckWheelStatus[LuckWheelStatus["PENDING"] = 2] = "PENDING";
  LuckWheelStatus[LuckWheelStatus["SPEED_CUT"] = 3] = "SPEED_CUT";
})(LuckWheelStatus || (LuckWheelStatus = {}));

var cubicBezierMAP = {
  "ease": ".25, .1, .25, 1",
  "linear": "0, 0, 1, 1",
  "ease-in": ".42, 0, 1, 1",
  "ease-out": "0, 0, .58, 1",
  "ease-in-out": ".42, 0, .58, 1"
};
var luckWheelConfig = {
  direction: DirectionType.CLOCKWISE,
  offsetDegree: 0,
  speedUpDuration: 3000,
  speedCutDuration: 3000,
  maxRotateSpeed: 25,
  speedUpCubicBezier: cubicBezierMAP['linear'],
  speedCutCubicBezier: cubicBezierMAP['linear']
};

/* from: https://juejin.cn/post/6988305902633746468 */
var CubicBezier = /*#__PURE__*/function () {
  // 0.00001
  function CubicBezier(x1, y1, x2, y2) {
    _classCallCheck(this, CubicBezier);

    _defineProperty(this, "precision", 1e-5);

    this.p1 = {
      x: x1,
      y: y1
    };
    this.p2 = {
      x: x2,
      y: y2
    };
  }

  _createClass(CubicBezier, [{
    key: "getX",
    value: function getX(t) {
      var x1 = this.p1.x,
          x2 = this.p2.x;
      return 3 * x1 * t * Math.pow(1 - t, 2) + 3 * x2 * Math.pow(t, 2) * (1 - t) + Math.pow(t, 3);
    }
  }, {
    key: "getY",
    value: function getY(t) {
      var y1 = this.p1.y,
          y2 = this.p2.y;
      return 3 * y1 * t * Math.pow(1 - t, 2) + 3 * y2 * Math.pow(t, 2) * (1 - t) + Math.pow(t, 3);
    } // https://github.com/amfe/amfe-cubicbezier/blob/master/src/index.js

  }, {
    key: "solveCurveX",
    value: function solveCurveX(x) {
      var t2 = x;
      var derivative;
      var x2;
      var p1x = this.p1.x,
          p2x = this.p2.x;
      var ax = 3 * p1x - 3 * p2x + 1;
      var bx = 3 * p2x - 6 * p1x;
      var cx = 3 * p1x;

      function sampleCurveDerivativeX(t) {
        // `ax t^3 + bx t^2 + cx t' expanded using Horner 's rule.
        return (3 * ax * t + 2 * bx) * t + cx;
      } // https://trac.webkit.org/browser/trunk/Source/WebCore/platform/animation
      // First try a few iterations of Newton's method -- normally very fast.
      // http://en.wikipedia.org/wiki/Newton's_method


      for (var i = 0; i < 8; i++) {
        // f(t)-x=0
        x2 = this.getX(t2) - x;

        if (Math.abs(x2) < this.precision) {
          return t2;
        }

        derivative = sampleCurveDerivativeX(t2); // == 0, failure

        if (Math.abs(derivative) < this.precision) {
          break;
        } // xn = x(n-1) - f(xn)/ f'(xn)
        // 假设g(x) = f(t) - x 
        // g'(x) = f'(t)
        //所以  f'(t) == g'(t) 
        // derivative == g'(t)


        t2 -= x2 / derivative;
      } // Fall back to the bisection method for reliability.
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
        } else {
          t0 = t2;
        }

        t2 = (t1 + t0) / 2;
      } // Failure


      return t2;
    }
  }, {
    key: "solve",
    value: function solve(x) {
      return this.getY(this.solveCurveX(x));
    }
  }]);

  return CubicBezier;
}();

var LuckWheel = /*#__PURE__*/function () {
  // 已经旋转的角度
  // 开始动画触发时的时间戳
  // 结束动画触发时的时间戳
  // 各个状态下requestAnimationFrame返回的id,用来取消回调函数
  function LuckWheel(targetEl, config) {
    _classCallCheck(this, LuckWheel);

    _defineProperty(this, "status", LuckWheelStatus.INIT);

    _defineProperty(this, "rotateDegree", 0);

    _defineProperty(this, "maxRotateSpeed", 0);

    _defineProperty(this, "startTimeStamp", 0);

    _defineProperty(this, "stopTimeStamp", 0);

    _defineProperty(this, "startAnimateID", 0);

    _defineProperty(this, "runningAnimateID", 0);

    _defineProperty(this, "stopAnimateID", 0);

    this.targetEl = targetEl;
    this.config = _objectSpread2(_objectSpread2({}, luckWheelConfig), config || {});
    this.init();
  }

  _createClass(LuckWheel, [{
    key: "start",
    value: function start() {
      this.cancelAnimate('all');
      this.status = LuckWheelStatus.SPEED_UP;
      this.startTimeStamp = performance.now();
      this.startAnimateID = requestAnimationFrame(this.speedUpAnimate.bind(this));
    }
  }, {
    key: "stop",
    value: function stop() {
      var targetDegree = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      this.validateDegree(targetDegree);
      this.status = LuckWheelStatus.SPEED_CUT;
      this.cancelAnimate('all');
      this.stopTimeStamp = performance.now();
      this.stopAnimateID = requestAnimationFrame(this.speedCutAnimate.bind(this, targetDegree));
    }
  }, {
    key: "running",
    value: function running(step) {
      this.cancelAnimate('all');
      this.runningAnimateID = requestAnimationFrame(this.runningAnimate.bind(this, step));
    }
  }, {
    key: "reset",
    value: function reset() {
      this.status = LuckWheelStatus.INIT;
      this.rotateDegree = this.config.offsetDegree;
      this.cancelAnimate('all');
    }
  }, {
    key: "init",
    value: function init() {
      var _this$config = this.config,
          speedUpCubicBezier = _this$config.speedUpCubicBezier,
          speedCutCubicBezier = _this$config.speedCutCubicBezier,
          offsetDegree = _this$config.offsetDegree,
          maxRotateSpeed = _this$config.maxRotateSpeed,
          direction = _this$config.direction;
      var start = this.getCubicBezierType(speedUpCubicBezier);
      var end = this.getCubicBezierType(speedCutCubicBezier);
      this.startCubicBezier = new CubicBezier(start[0], start[1], start[2], start[3]);
      this.stopCubicBezier = new CubicBezier(end[0], end[1], end[2], end[3]);
      this.rotateDegree = offsetDegree;
      this.maxRotateSpeed = direction === DirectionType.ANTICLOCKWISE ? -maxRotateSpeed : maxRotateSpeed;
    }
  }, {
    key: "validateDegree",
    value: function validateDegree(degree) {
      if (degree < 0 || degree > 360) {
        throw new Error("度数值不符合要求，请保持在0~360之间");
      }

      if (!Number.isInteger(degree)) {
        throw new Error("度数要求为正整数");
      }
    }
  }, {
    key: "getCubicBezierType",
    value: function getCubicBezierType(value) {
      var data = value.trim().split(',').map(function (v) {
        return Number(v);
      });

      if (data.length !== 4) {
        throw new Error("贝塞尔曲线参数不符合预期");
      }

      return data;
    }
  }, {
    key: "setRotateDegree",
    value: function setRotateDegree(degree) {
      // degree % 360： 以一圈360度为计算基准，超出的度数取余
      this.rotateDegree = this.rotateDegree + degree % 360;

      if (this.rotateDegree >= 360) {
        this.rotateDegree = this.rotateDegree - 360;
      } else if (this.rotateDegree < 0) {
        this.rotateDegree = 360 + this.rotateDegree;
      }

      return this.rotateDegree;
    }
  }, {
    key: "speedUpAnimate",
    value: function speedUpAnimate(t) {
      var speedUpDuration = this.config.speedUpDuration;
      t = t - this.startTimeStamp;

      if (t <= speedUpDuration) {
        // 因为cubicBezier的值为0-1
        var tPct = t / speedUpDuration; // 当前时间t与speedUpDuration的比值

        var rsPct = this.startCubicBezier.solve(tPct); // 得到当前转速与最大转速的比值
        // 通过当前角速度获得当前转动的角度

        var degree = Number((rsPct * this.maxRotateSpeed).toFixed(0));
        degree = this.setRotateDegree(degree);
        this.targetEl.style.transform = "rotate(".concat(degree, "deg)");
        this.startAnimateID = requestAnimationFrame(this.speedUpAnimate.bind(this));
      } else {
        // keep running
        this.status = LuckWheelStatus.PENDING;
        this.runningAnimateID = requestAnimationFrame(this.runningAnimate.bind(this, this.maxRotateSpeed));
      }
    }
  }, {
    key: "runningAnimate",
    value: function runningAnimate(step, t) {
      var degree = this.setRotateDegree(step);
      this.targetEl.style.transform = "rotate(".concat(degree, "deg)");
      this.runningAnimateID = requestAnimationFrame(this.runningAnimate.bind(this, step));
    }
  }, {
    key: "speedCutAnimate",
    value: function speedCutAnimate(targetDegree, t) {
      var speedCutDuration = this.config.speedCutDuration;
      t = t - this.stopTimeStamp;

      if (t <= speedCutDuration) {
        // 因为cubicBezier的值为0-1
        var tPct = t / speedCutDuration; // 当前时间t与speedCutDuration的比值

        var rsPct = this.stopCubicBezier.solve(tPct); // 得到当前转速与最大转速的比值
        // 通过当前角速度获得当前转动的角度

        var degree = Number(((1 - rsPct) * this.maxRotateSpeed).toFixed(0));

        if (degree <= 3) {
          requestAnimationFrame(this.stopBufferAnimate.bind(this, degree, targetDegree));
        } else {
          degree = this.setRotateDegree(degree);
          this.targetEl.style.transform = "rotate(".concat(degree, "deg)");
          this.stopAnimateID = requestAnimationFrame(this.speedCutAnimate.bind(this, targetDegree));
        }
      }
    }
  }, {
    key: "stopBufferAnimate",
    value: function stopBufferAnimate(step, targetDegree) {
      if (this.rotateDegree === targetDegree) {
        this.cancelAnimate([this.stopAnimateID]);
        return;
      }

      var nextStep = targetDegree - this.rotateDegree;

      if (nextStep > 0 && nextStep < step) {
        step = nextStep;
      }

      var degree = this.setRotateDegree(step);
      this.targetEl.style.transform = "rotate(".concat(degree, "deg)");
      this.stopAnimateID = requestAnimationFrame(this.stopBufferAnimate.bind(this, step, targetDegree));
    }
  }, {
    key: "cancelAnimate",
    value: function cancelAnimate(animateIDs) {
      if (animateIDs === 'all') {
        animateIDs = [this.startAnimateID, this.stopAnimateID, this.runningAnimateID];
      }

      animateIDs.forEach(function (id) {
        id && cancelAnimationFrame(id);
      });
    }
  }]);

  return LuckWheel;
}();

export { DirectionType, LuckWheelStatus, LuckWheel as default };
