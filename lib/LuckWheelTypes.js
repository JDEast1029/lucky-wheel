"use strict";
exports.__esModule = true;
exports.LuckWheelStatus = exports.DirectionType = void 0;
var DirectionType;
(function (DirectionType) {
    DirectionType[DirectionType["CLOCKWISE"] = 0] = "CLOCKWISE";
    DirectionType[DirectionType["ANTICLOCKWISE"] = 1] = "ANTICLOCKWISE";
})(DirectionType = exports.DirectionType || (exports.DirectionType = {}));
var LuckWheelStatus;
(function (LuckWheelStatus) {
    LuckWheelStatus[LuckWheelStatus["INIT"] = 0] = "INIT";
    LuckWheelStatus[LuckWheelStatus["SPEED_UP"] = 1] = "SPEED_UP";
    LuckWheelStatus[LuckWheelStatus["PENDING"] = 2] = "PENDING";
    LuckWheelStatus[LuckWheelStatus["SPEED_CUT"] = 3] = "SPEED_CUT";
})(LuckWheelStatus = exports.LuckWheelStatus || (exports.LuckWheelStatus = {}));
