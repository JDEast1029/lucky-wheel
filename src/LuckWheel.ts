import { luckWheelConfig } from "./constants";
import { ILuckWheelConfig, LuckWheelStatus } from "./LuckWheelTypes";
import { CubicBezier } from './CubicBezier';

export class LuckWheel {
	// 偏移角度 ??
	private offsetDegree = 0;
	private config: Required<ILuckWheelConfig>;
	private status = LuckWheelStatus.INIT;
	// 已经旋转的角度
	private rotateDegree = 0;
	private startCubicBezier!: CubicBezier;
	private stopCubicBezier!: CubicBezier;
	private stopBufferCubicBezier!: CubicBezier;
	// 开始动画触发时的时间戳
	startTimeStamp = 0;
	// 结束动画触发时的时间戳
	stopTimeStamp = 0;
	// 在最大转速下每次增加的旋转角度
	maxDegreeStep = 0;
	// 各个状态下requestAnimationFrame返回的id,用来取消回调函数
	startAnimateID = 0;
	runningAnimateID = 0;
	stopAnimateID = 0;

	constructor(private targetEl: HTMLElement, config?: ILuckWheelConfig) {
		this.config = {
			...luckWheelConfig,
			...(config || {}),
		};
		this.init();
	}

	start(degree?: number) {
		if (degree) {
			this.validateDegree(degree);
			this.offsetDegree = degree;
		}

		this.rotateDegree = this.offsetDegree;

		this.status = LuckWheelStatus.SPEED_UP;
		this.startTimeStamp = performance.now();

		this.startAnimateID = requestAnimationFrame(this.startRotateAnimate.bind(this));
	}


	stop(targetDegree = 0) {
		this.validateDegree(targetDegree);
		this.status = LuckWheelStatus.SPEED_CUT;

		cancelAnimationFrame(this.runningAnimateID);

		this.stopTimeStamp = performance.now();
		this.stopAnimateID = requestAnimationFrame(this.stopRotateAnimate.bind(this, targetDegree));
	}

	running(step: number, t: number) {
		const degree = this.setRotateDegree(step);
		this.targetEl.style.transform = `rotate(${degree}deg)`;

		// 测试用的，后面要去掉
		if (t - this.startTimeStamp < 6000) {
			this.runningAnimateID = requestAnimationFrame(this.running.bind(this, step));
		} else {
			this.stop(90);
		}

		// this.runningAnimateID = requestAnimationFrame(this.running.bind(this));
	}

	reset() {
		this.status = LuckWheelStatus.INIT;
		console.log('reset');
	}

	private init() {
		const { maxRotationalSpeed, step, speedUpCubicBezier, speedCutCubicBezier } = this.config;
		const start = this.getCubicBezierType(speedUpCubicBezier);
		const end = this.getCubicBezierType(speedCutCubicBezier);
		this.startCubicBezier = new CubicBezier(start[0], start[1], start[2], start[3]);
		this.stopCubicBezier = new CubicBezier(end[0], end[1], end[2], end[3]);
		this.stopBufferCubicBezier = new CubicBezier(0 ,0 ,1, 1); // 线性
		this.maxDegreeStep = Number((maxRotationalSpeed * 360 / (1000 / step)).toFixed(0));
	}

	private validateDegree(degree: number) {
		if (degree < 0 || degree > 360) {
			throw new Error("度数值不符合要求，请保持在0~360之间");
		}
		if (!Number.isInteger(degree)) {
			throw new Error("度数要求为正整数");
		}
	}

	private getCubicBezierType(value: string): number[] {
		const data = value.trim().split(',').map((v) => Number(v));
		if (data.length !== 4) {
			throw new Error("贝塞尔曲线参数不符合预期");
		}
		return data;
	}

	private setRotateDegree(degree: number) {
		// degree % 360： 以一圈360度为计算基准，超出的度数取余
		this.rotateDegree = this.rotateDegree + (degree % 360);
		if (this.rotateDegree >= 360) {
			this.rotateDegree = this.rotateDegree - 360;
		} else if (this.rotateDegree < 0) {
			this.rotateDegree = 360 + this.rotateDegree;
		}
		return this.rotateDegree;
	}

	private startRotateAnimate(t: number) {
		const { speedUpDuration, maxRotationalSpeed, step } = this.config;
		t = t - this.startTimeStamp;
		if (t <= speedUpDuration) {
			// 因为cubicBezier的值为0-1
			const tPer = t / speedUpDuration; // 当前时间t与speedUpDuration的比值
			const rsPer = this.startCubicBezier.solve(tPer); // 得到当前转速与最大转速的比值

			// 通过当前角速度获得当前转动的角度
			let degree = Number((rsPer * maxRotationalSpeed * 360 / (1000 / step)).toFixed(0));
			degree = this.setRotateDegree(degree);

			this.targetEl.style.transform = `rotate(${degree}deg)`;
			this.startAnimateID = requestAnimationFrame(this.startRotateAnimate.bind(this));
		} else {
			// keep running
			this.status = LuckWheelStatus.PENDING;
			this.runningAnimateID = requestAnimationFrame(this.running.bind(this, this.maxDegreeStep));
		}
	}

	private stopRotateAnimate(targetDegree: number, t: number) {
		const { speedCutDuration, maxRotationalSpeed, step } = this.config;
		t = t - this.stopTimeStamp;
		if (t <= speedCutDuration) {
			// 因为cubicBezier的值为0-1
			const tPer = t / speedCutDuration; // 当前时间t与speedCutDuration的比值
			const rsPer = this.stopCubicBezier.solve(tPer); // 得到当前转速与最大转速的比值

			// 通过当前角速度获得当前转动的角度
			let degree = Number(((1 - rsPer) * maxRotationalSpeed * 360 / (1000 / step)).toFixed(0));
			degree = this.setRotateDegree(degree);

			this.targetEl.style.transform = `rotate(${degree}deg)`;
			this.stopAnimateID = requestAnimationFrame(this.stopRotateAnimate.bind(this, targetDegree));
		} else if (this.rotateDegree !== targetDegree) { // 如果最后的偏转角度不等于设置的角度
			// TODO:
		} else {
			cancelAnimationFrame(this.stopAnimateID);
		}
	}
}