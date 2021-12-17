
export enum DirectionType {
	CLOCKWISE, // 顺时针
	ANTICLOCKWISE, // 逆时针
}

export interface ILuckWheelConfig {
	// 旋转方向
	direction?: DirectionType,
	// 初始偏移角度
	offsetDegree?: number,
	// 加速时间(ms)
	speedUpDuration?: number,
	// 减速时间(ms)
	speedCutDuration?: number,
	// 最大转速时每次动画移动的角度
	maxRotateSpeed?: number,
	// 加速阶段的贝塞尔曲线
	speedUpCubicBezier: string,
	// 减速阶段的贝塞尔曲线
	speedCutCubicBezier: string,
}

export enum LuckWheelStatus {
	INIT,
	SPEED_UP,
	PENDING,
	SPEED_CUT,
}