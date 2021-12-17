import { DirectionType, ILuckWheelConfig } from "./LuckWheelTypes";

export const cubicBezierMAP = {
	"ease": ".25, .1, .25, 1",
	"linear": "0, 0, 1, 1",
	"ease-in": ".42, 0, 1, 1",
	"ease-out": "0, 0, .58, 1",
	"ease-in-out": ".42, 0, .58, 1"
};
export const luckWheelConfig: Required<ILuckWheelConfig> = {
	direction: DirectionType.CLOCKWISE,
	speedUpDuration: 3000,
	speedCutDuration: 3000,
	maxRotationalSpeed: 25,
	speedUpCubicBezier: cubicBezierMAP['linear'],
	speedCutCubicBezier: cubicBezierMAP['linear'],
};