import { luckWheelConfig } from "./constants";
import { DirectionType, ILuckWheelConfig, LuckWheelStatus } from "./LuckWheelTypes";
import { CubicBezier } from './CubicBezier';

export class LuckWheel {
	private config: Required<ILuckWheelConfig>;
	private startCubicBezier!: CubicBezier;
	private stopCubicBezier!: CubicBezier;
	private status = LuckWheelStatus.INIT;
	// 已经旋转的角度
	private rotateDegree = 0;
	private maxRotateSpeed = 0;
	// 开始动画触发时的时间戳
	private startTimeStamp = 0;
	// 结束动画触发时的时间戳
	private stopTimeStamp = 0;
	// 各个状态下requestAnimationFrame返回的id,用来取消回调函数
	private startAnimateID = 0;
	private runningAnimateID = 0;
	private stopAnimateID = 0;

	constructor(private targetEl: HTMLElement, config?: ILuckWheelConfig) {
		this.config = {
			...luckWheelConfig,
			...(config || {}),
		};
		this.init();
	}

	start() {
		this.cancelAnimate('all');
		this.status = LuckWheelStatus.SPEED_UP;
		this.startTimeStamp = performance.now();
		this.startAnimateID = requestAnimationFrame(this.speedUpAnimate.bind(this));
	}

	stop(targetDegree = 0) {
		this.validateDegree(targetDegree);
		this.status = LuckWheelStatus.SPEED_CUT;

		this.cancelAnimate('all');

		this.stopTimeStamp = performance.now();
		this.stopAnimateID = requestAnimationFrame(this.speedCutAnimate.bind(this, targetDegree));
	}

	running(step: number) {
		this.cancelAnimate('all');
		this.runningAnimateID = requestAnimationFrame(this.runningAnimate.bind(this, step));
	}

	reset() {
		this.status = LuckWheelStatus.INIT;
		this.rotateDegree = this.config.offsetDegree;
		this.cancelAnimate('all');
	}

	private init() {
		const { speedUpCubicBezier, speedCutCubicBezier, offsetDegree, maxRotateSpeed, direction } = this.config;
		const start = this.getCubicBezierType(speedUpCubicBezier);
		const end = this.getCubicBezierType(speedCutCubicBezier);
		this.startCubicBezier = new CubicBezier(start[0], start[1], start[2], start[3]);
		this.stopCubicBezier = new CubicBezier(end[0], end[1], end[2], end[3]);
		this.rotateDegree = offsetDegree;
		this.maxRotateSpeed = direction === DirectionType.ANTICLOCKWISE ? -maxRotateSpeed : maxRotateSpeed;
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

	private speedUpAnimate(t: number) {
		const { speedUpDuration } = this.config;
		t = t - this.startTimeStamp;
		if (t <= speedUpDuration) {
			// 因为cubicBezier的值为0-1
			const tPct = t / speedUpDuration; // 当前时间t与speedUpDuration的比值
			const rsPct = this.startCubicBezier.solve(tPct); // 得到当前转速与最大转速的比值

			// 通过当前角速度获得当前转动的角度
			let degree = Number((rsPct * this.maxRotateSpeed).toFixed(0));
			degree = this.setRotateDegree(degree);

			this.targetEl.style.transform = `rotate(${degree}deg)`;
			this.startAnimateID = requestAnimationFrame(this.speedUpAnimate.bind(this));
		} else {
			// keep running
			this.status = LuckWheelStatus.PENDING;
			this.runningAnimateID = requestAnimationFrame(this.runningAnimate.bind(this, this.maxRotateSpeed));
		}
	}

	private runningAnimate(step: number, t: number) {
		const degree = this.setRotateDegree(step);
		this.targetEl.style.transform = `rotate(${degree}deg)`;
		this.runningAnimateID = requestAnimationFrame(this.runningAnimate.bind(this, step));
	}

	private speedCutAnimate(targetDegree: number, t: number) {
		const { speedCutDuration } = this.config;
		t = t - this.stopTimeStamp;
		if (t <= speedCutDuration) {
			// 因为cubicBezier的值为0-1
			const tPct = t / speedCutDuration; // 当前时间t与speedCutDuration的比值
			const rsPct = this.stopCubicBezier.solve(tPct); // 得到当前转速与最大转速的比值
			
			// 通过当前角速度获得当前转动的角度
			let degree = Number(((1 - rsPct) * this.maxRotateSpeed).toFixed(0));
			if (degree <= 3) {
				requestAnimationFrame(this.stopBufferAnimate.bind(this, degree, targetDegree));
			} else {
				degree = this.setRotateDegree(degree);
				this.targetEl.style.transform = `rotate(${degree}deg)`;
				this.stopAnimateID = requestAnimationFrame(this.speedCutAnimate.bind(this, targetDegree));
			}
		}
	}

	private stopBufferAnimate(step: number, targetDegree: number) {
		if (this.rotateDegree === targetDegree) {
			this.cancelAnimate([this.stopAnimateID]);
			return;
		}
		const nextStep = targetDegree - this.rotateDegree;
		if (nextStep > 0 && nextStep < step) {
			step = nextStep;
		}
		const degree = this.setRotateDegree(step);
		this.targetEl.style.transform = `rotate(${degree}deg)`;
		this.stopAnimateID = requestAnimationFrame(this.stopBufferAnimate.bind(this, step, targetDegree));
	}

	private cancelAnimate(animateIDs: number[] | string) {
		if (animateIDs === 'all') {
			animateIDs = [this.startAnimateID, this.stopAnimateID, this.runningAnimateID];
		}
		(<number[]>animateIDs).forEach((id: number) => {
			id && cancelAnimationFrame(id);
		});
	}
}