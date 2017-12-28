/**
 * -------------  Demo  -------------------
 * constructor(props) {
 * 	  super(props);
 * 	  this.state = {
 * 	  	  position: 0,
 * 	  	  isComplete: false
 * 	  }
 * }
 * handleLoadData = () => {
 * 	  setTimeout(() => {
 * 	  	this.setState({
 * 	  		position: 2,
 * 	  		isComplete: true
 * 	  	})
 * 	  }, 1000);
 * }
 * handleComplete = () => {
 *	 this.setState({isComplete: false})
 * }
 * 
 * render：
 * <LuckyWheel 
 * 	   onLoadData={this.handleLoadData}
 * 	   position={position}
 * 	   areaNum={7}
 * 	   cycle={10}
 * 	   isComplete={isComplete}
 * 	   onComplete={this.handleComplete}
 * />
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getQuadratic, getY, getSpeed, getSpeedY, easyIn } from './utils';
import './Styles.scss';

const TURNTABLE_BG = "http://www.jq22.com/demo/jquery-cj-150310213714/images/turntable-bg2.png";
const TURNTABLE = "http://www.jq22.com/demo/jquery-cj-150310213714/images/turntable2.png";
const POINTER = "http://www.jq22.com/demo/jquery-cj-150310213714/images/pointer.png";

class LuckyWheel extends Component {
	static propTypes = {
		position: PropTypes.number.isRequired,                // 起点位置
		areaNum: PropTypes.number.isRequired,                 // 区域数
		cycle: PropTypes.number.isRequired,                   // 需要转动多少次才开始进入抽奖环节
		isComplete: PropTypes.bool.isRequired,                // 是否完成
		onLoadData: PropTypes.func.isRequired,                // 抽奖结果请求
		onComplete: PropTypes.func.isRequired,                // 完成后的回调
	};

	static defaultProps = {
		position: 0,
		areaNum: 7,
		cycle: 10
	};

	constructor(props) {
		super(props);
		this.state = {
			angle: 0
		};
		this.startAngle = 0;
		this.isStart = false;
		this.startPointer = {x: 0, y: 0};
		this.middlePointer = { x: 1000, y: 360};
		this.finalPointer = { x: 2000, y: 720};
		this.time = 0;
		this.speed = 0;
		this.isComplete = false;
		this.isLoading = false;
		this.count = 0;
	}

	// 开始旋转
	handleStart = () => {
		const { position, areaNum } = this.props;
		if (this.isStart) return; // 禁止多次点击
		this.isStart = true
		let offsetAngle = 360 - this.state.angle;
		this.middlePointer.y = 360 * 3 + offsetAngle;
		this.handleRoll();
	};

	// 旋转动画
	handleRoll = () => {
		const { cycle, onLoadData, position, isComplete } = this.props;
		const { angle } = this.state;
		let quadratic = getQuadratic(this.startPointer, this.middlePointer);
		this.speed = getSpeed(quadratic, this.middlePointer);
		let rotateAngle = getY(quadratic, this.time);
		
		if (angle === 0 && isComplete) {
			this.isLoading = false;
			this.handleStop(position)
			return; // 请求完成后，开始减速并且转盘已经回到原位
		}
		if (this.time <= 1000) {
			requestAnimationFrame(() => {
				this.time += 10;
				this.setState({angle: (this.startAngle + rotateAngle) % 360})
				this.handleRoll()
			});
		} else if (rotateAngle >= this.middlePointer.y) {
			let newAngle = this.state.angle + parseInt(getSpeedY(this.speed, 10).toFixed(0));

			if (newAngle >= 360) {
				this.count += 1;
				newAngle = 0;
			}
			if (this.count === cycle && !this.isLoading) { // 旋转 cycle 圈之后开始请求
				this.isLoading = true;
				onLoadData && onLoadData();
			}
			requestAnimationFrame(() => {
				this.setState({angle: (newAngle > 360 ? 0 : newAngle) % 360});
				this.handleRoll()
			});
		}
	}

	// 停止旋转
	handleStop = (position) => {
		const { areaNum, onComplete } = this.props;
		const { angle } = this.state;
		
		// if (angle > 0) return;
		let prizeAngle = position / areaNum * 360;
		this.finalPointer.y = this.middlePointer.y + prizeAngle + 360 * (position / areaNum < 0.5 ? 1 : 3);
		let quadratic = getQuadratic(this.finalPointer, this.middlePointer);
		let rotateAngle = getY(quadratic, this.time);
		if (this.time <= 2000) {
			requestAnimationFrame(() => {
				this.time += 10;
				this.setState({angle: parseInt(((rotateAngle + this.startAngle) % 360).toFixed(0))})
				this.handleStop(position);
			});
		} else {
			console.log(angle, quadratic, rotateAngle, this.time)
			this.isStart = false;
			this.startPointer = {x: 0, y: 0};
			this.middlePointer = { x: 1000, y: 360};
			this.finalPointer = { x: 2000, y: 720};
			this.time = 0;
			this.speed = 0;
			this.count = 0;
			this.startAngle = angle;
			onComplete && onComplete();
			return;
		}

	};

	render() {
		const { chunkNum } = this.props;
		const { angle } = this.state;

		return (
			<div className="c-wheel-content">
				<img className="_bg" 
					src={TURNTABLE_BG}
				/>
				
				<img className="_turntable" 
				 	style={{
						transform: `rotate(${angle}deg)`
					}}
					src={TURNTABLE}
				/>
				<img className="_pointer" 
					onClick={this.handleStart}
				 	src={POINTER}
				/> 
			</div>
		);
	}
}

export default LuckyWheel;