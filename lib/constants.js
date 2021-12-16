"use strict";
exports.__esModule = true;
exports.luckWheelConfig = exports.cubicBezierMAP = void 0;
var LuckWheelTypes_1 = require("./LuckWheelTypes");
exports.cubicBezierMAP = {
    "ease": ".25, .1, .25, 1",
    "linear": "0, 0, 1, 1",
    "ease-in": ".42, 0, 1, 1",
    "ease-out": "0, 0, .58, 1",
    "ease-in-out": ".42, 0, .58, 1"
};
exports.luckWheelConfig = {
    direction: LuckWheelTypes_1.DirectionType.CLOCKWISE,
    speedUpDuration: 2000,
    speedCutDuration: 2000,
    maxRotationalSpeed: 10,
    step: 10,
    speedUpCubicBezier: exports.cubicBezierMAP['linear'],
    speedCutCubicBezier: exports.cubicBezierMAP['linear']
};
