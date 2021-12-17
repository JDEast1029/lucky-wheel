"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.LuckWheel = void 0;
var constants_1 = require("./constants");
var LuckWheelTypes_1 = require("./LuckWheelTypes");
var CubicBezier_1 = require("./CubicBezier");
var LuckWheel = /** @class */ (function () {
    function LuckWheel(targetEl, config) {
        this.targetEl = targetEl;
        // 偏移角度 ??
        this.offsetDegree = 0;
        this.status = LuckWheelTypes_1.LuckWheelStatus.INIT;
        // 初始的旋转角度
        this.initialRotateDegree = 0;
        // 已经旋转的角度
        this.rotateDegree = 0;
        // 开始动画触发时的时间戳
        this.startTimeStamp = 0;
        // 结束动画触发时的时间戳
        this.stopTimeStamp = 0;
        // 结束后触发缓冲动画时的时间戳
        this.stopBufferTimeStamp = 0;
        // 缓冲动画需要的时间
        this.bufferTime = 0;
        // 各个状态下requestAnimationFrame返回的id,用来取消回调函数
        this.startAnimateID = 0;
        this.runningAnimateID = 0;
        this.stopAnimateID = 0;
        this.config = __assign(__assign({}, constants_1.luckWheelConfig), (config || {}));
        this.init();
    }
    LuckWheel.prototype.start = function (degree) {
        if (degree) {
            this.validateDegree(degree);
            this.offsetDegree = degree;
        }
        this.initialRotateDegree = this.offsetDegree;
        this.rotateDegree = this.offsetDegree;
        this.status = LuckWheelTypes_1.LuckWheelStatus.SPEED_UP;
        this.startTimeStamp = performance.now();
        this.startAnimateID = requestAnimationFrame(this.speedUpAnimate.bind(this));
    };
    LuckWheel.prototype.stop = function (targetDegree) {
        if (targetDegree === void 0) { targetDegree = 0; }
        this.validateDegree(targetDegree);
        this.status = LuckWheelTypes_1.LuckWheelStatus.SPEED_CUT;
        cancelAnimationFrame(this.runningAnimateID);
        this.stopTimeStamp = performance.now();
        this.stopAnimateID = requestAnimationFrame(this.speedCutAnimate.bind(this, targetDegree));
    };
    LuckWheel.prototype.running = function (step) {
        this.runningAnimateID = requestAnimationFrame(this.runningAnimate.bind(this, step));
    };
    LuckWheel.prototype.reset = function () {
        this.status = LuckWheelTypes_1.LuckWheelStatus.INIT;
        console.log('reset');
    };
    LuckWheel.prototype.init = function () {
        var _a = this.config, speedUpCubicBezier = _a.speedUpCubicBezier, speedCutCubicBezier = _a.speedCutCubicBezier;
        var start = this.getCubicBezierType(speedUpCubicBezier);
        var end = this.getCubicBezierType(speedCutCubicBezier);
        this.startCubicBezier = new CubicBezier_1.CubicBezier(start[0], start[1], start[2], start[3]);
        this.stopCubicBezier = new CubicBezier_1.CubicBezier(end[0], end[1], end[2], end[3]);
        this.stopBufferCubicBezier = new CubicBezier_1.CubicBezier(0, 0, 1, 1); // 线性
    };
    LuckWheel.prototype.validateDegree = function (degree) {
        if (degree < 0 || degree > 360) {
            throw new Error("度数值不符合要求，请保持在0~360之间");
        }
        if (!Number.isInteger(degree)) {
            throw new Error("度数要求为正整数");
        }
    };
    LuckWheel.prototype.getCubicBezierType = function (value) {
        var data = value.trim().split(',').map(function (v) { return Number(v); });
        if (data.length !== 4) {
            throw new Error("贝塞尔曲线参数不符合预期");
        }
        return data;
    };
    LuckWheel.prototype.setRotateDegree = function (degree) {
        // degree % 360： 以一圈360度为计算基准，超出的度数取余
        this.rotateDegree = this.rotateDegree + (degree % 360);
        if (this.rotateDegree >= 360) {
            this.rotateDegree = this.rotateDegree - 360;
        }
        else if (this.rotateDegree < 0) {
            this.rotateDegree = 360 + this.rotateDegree;
        }
        return this.rotateDegree;
    };
    LuckWheel.prototype.speedUpAnimate = function (t) {
        var _a = this.config, speedUpDuration = _a.speedUpDuration, maxRotationalSpeed = _a.maxRotationalSpeed;
        t = t - this.startTimeStamp;
        if (t <= speedUpDuration) {
            // 因为cubicBezier的值为0-1
            var tPct = t / speedUpDuration; // 当前时间t与speedUpDuration的比值
            var rsPct = this.startCubicBezier.solve(tPct); // 得到当前转速与最大转速的比值
            // 通过当前角速度获得当前转动的角度
            var degree = Number((rsPct * maxRotationalSpeed).toFixed(0));
            degree = this.setRotateDegree(degree);
            this.targetEl.style.transform = "rotate(".concat(degree, "deg)");
            this.startAnimateID = requestAnimationFrame(this.speedUpAnimate.bind(this));
        }
        else {
            // keep running
            this.status = LuckWheelTypes_1.LuckWheelStatus.PENDING;
            this.runningAnimateID = requestAnimationFrame(this.runningAnimate.bind(this, maxRotationalSpeed));
        }
    };
    LuckWheel.prototype.runningAnimate = function (step, t) {
        var degree = this.setRotateDegree(step);
        this.targetEl.style.transform = "rotate(".concat(degree, "deg)");
        // TODO: 测试用的，后面要去掉
        if (t - this.startTimeStamp < 6000) {
            this.runningAnimateID = requestAnimationFrame(this.runningAnimate.bind(this, step));
        }
        else {
            this.stop(90);
        }
        // this.runningAnimateID = requestAnimationFrame(this.runningAnimate.bind(this, step));
    };
    LuckWheel.prototype.speedCutAnimate = function (targetDegree, t) {
        var _a = this.config, speedCutDuration = _a.speedCutDuration, maxRotationalSpeed = _a.maxRotationalSpeed;
        t = t - this.stopTimeStamp;
        if (t <= speedCutDuration) {
            // 因为cubicBezier的值为0-1
            var tPct = t / speedCutDuration; // 当前时间t与speedCutDuration的比值
            var rsPct = this.stopCubicBezier.solve(tPct); // 得到当前转速与最大转速的比值
            // 通过当前角速度获得当前转动的角度
            var degree = Number(((1 - rsPct) * maxRotationalSpeed).toFixed(0));
            degree = this.setRotateDegree(degree);
            this.targetEl.style.transform = "rotate(".concat(degree, "deg)");
            this.stopAnimateID = requestAnimationFrame(this.speedCutAnimate.bind(this, targetDegree));
        }
    };
    return LuckWheel;
}());
exports.LuckWheel = LuckWheel;
