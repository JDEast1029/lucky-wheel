/**
 * 顶点式：y=a(x－h)2+k  (a≠0)，其中点(h,k)为顶点，对称轴为x=h。
 */
export const getQuadratic = (topPointer = {x: 0, y: 0}, otherPointer = {x: 0, y: 0}) => {
	if (topPointer.x == otherPointer.x && topPointer.y == otherPointer.y) {
		console.error('两个点不能一样');
		return -1;
	}
	let a = (otherPointer.y - topPointer.y) / Math.pow((otherPointer.x - topPointer.x), 2);
	return {
		a,
		b: 2 * a * (-topPointer.x),
		c: a * Math.pow(topPointer.x, 2) + topPointer.y
	}
} 

// 根据传入的x获取Y轴坐标
export const getY = (quadratic, x) => {
	let { a, b, c } = quadratic;
	return a * Math.pow(x, 2) + b * x + c;
}

// 获取斜率
export const getSpeed = (quadratic, pointer = {x: 0, y: 0}) => {
	let speed = (2 * quadratic.a * pointer.x) + quadratic.b;
	return speed;
}

// 根据斜率获取y值
export const getSpeedY = (speed, x) => {
	return x * speed;
}

/**
 * 缓入动画
 * t: current time（当前时间）
 * b: beginning value（初始值）
 * c: change in value（变化量）
 * d: duration（持续时间）
 */
export const easyIn = (t,b,c,d) => {
	return c*(t/=d)*t*t + b;
}