import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * 顶点式：y=a(x－h)2+k  (a≠0)，其中点(h,k)为顶点，对称轴为x=h。
 */
var getQuadratic = function getQuadratic() {
	var topPointer = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { x: 0, y: 0 };
	var otherPointer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { x: 0, y: 0 };

	if (topPointer.x == otherPointer.x && topPointer.y == otherPointer.y) {
		console.error('两个点不能一样');
		return -1;
	}
	var a = (otherPointer.y - topPointer.y) / Math.pow(otherPointer.x - topPointer.x, 2);
	return {
		a: a,
		b: 2 * a * -topPointer.x,
		c: a * Math.pow(topPointer.x, 2) + topPointer.y
	};
};

// 根据传入的x获取Y轴坐标
var getY = function getY(quadratic, x) {
	var a = quadratic.a,
	    b = quadratic.b,
	    c = quadratic.c;

	return a * Math.pow(x, 2) + b * x + c;
};

// 获取斜率
var getSpeed = function getSpeed(quadratic) {
	var pointer = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { x: 0, y: 0 };

	var speed = 2 * quadratic.a * pointer.x + quadratic.b;
	return speed;
};

// 根据斜率获取y值
var getSpeedY = function getSpeedY(speed, x) {
	return x * speed;
};

/**
 * 缓入动画
 * t: current time（当前时间）
 * b: beginning value（初始值）
 * c: change in value（变化量）
 * d: duration（持续时间）
 */

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

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
var TURNTABLE_BG = "http://www.jq22.com/demo/jquery-cj-150310213714/images/turntable-bg2.png";
var TURNTABLE = "http://www.jq22.com/demo/jquery-cj-150310213714/images/turntable2.png";
var POINTER = "http://www.jq22.com/demo/jquery-cj-150310213714/images/pointer.png";

var LuckyWheel = function (_Component) {
	inherits(LuckyWheel, _Component);

	function LuckyWheel(props) {
		classCallCheck(this, LuckyWheel);

		var _this = possibleConstructorReturn(this, (LuckyWheel.__proto__ || Object.getPrototypeOf(LuckyWheel)).call(this, props));

		_this.handleStart = function () {
			var _this$props = _this.props,
			    position = _this$props.position,
			    areaNum = _this$props.areaNum;

			if (_this.isStart) return; // 禁止多次点击
			_this.isStart = true;
			var offsetAngle = 360 - _this.state.angle;
			_this.middlePointer.y = 360 * 3 + offsetAngle;
			_this.handleRoll();
		};

		_this.handleRoll = function () {
			var _this$props2 = _this.props,
			    cycle = _this$props2.cycle,
			    onLoadData = _this$props2.onLoadData,
			    position = _this$props2.position,
			    isComplete = _this$props2.isComplete;
			var angle = _this.state.angle;

			var quadratic = getQuadratic(_this.startPointer, _this.middlePointer);
			_this.speed = getSpeed(quadratic, _this.middlePointer);
			var rotateAngle = getY(quadratic, _this.time);

			if (angle === 0 && isComplete) {
				_this.isLoading = false;
				_this.handleStop(position);
				return; // 请求完成后，开始减速并且转盘已经回到原位
			}
			if (_this.time <= 1000) {
				requestAnimationFrame(function () {
					_this.time += 10;
					_this.setState({ angle: (_this.startAngle + rotateAngle) % 360 });
					_this.handleRoll();
				});
			} else if (rotateAngle >= _this.middlePointer.y) {
				var newAngle = _this.state.angle + parseInt(getSpeedY(_this.speed, 10).toFixed(0));

				if (newAngle >= 360) {
					_this.count += 1;
					newAngle = 0;
				}
				if (_this.count === cycle && !_this.isLoading) {
					// 旋转 cycle 圈之后开始请求
					_this.isLoading = true;
					onLoadData && onLoadData();
				}
				requestAnimationFrame(function () {
					_this.setState({ angle: (newAngle > 360 ? 0 : newAngle) % 360 });
					_this.handleRoll();
				});
			}
		};

		_this.handleStop = function (position) {
			var _this$props3 = _this.props,
			    areaNum = _this$props3.areaNum,
			    onComplete = _this$props3.onComplete;
			var angle = _this.state.angle;

			// if (angle > 0) return;

			var prizeAngle = position / areaNum * 360;
			_this.finalPointer.y = _this.middlePointer.y + prizeAngle + 360 * (position / areaNum < 0.5 ? 1 : 3);
			var quadratic = getQuadratic(_this.finalPointer, _this.middlePointer);
			var rotateAngle = getY(quadratic, _this.time);
			if (_this.time <= 2000) {
				requestAnimationFrame(function () {
					_this.time += 10;
					_this.setState({ angle: parseInt(((rotateAngle + _this.startAngle) % 360).toFixed(0)) });
					_this.handleStop(position);
				});
			} else {
				console.log(angle, quadratic, rotateAngle, _this.time);
				_this.isStart = false;
				_this.startPointer = { x: 0, y: 0 };
				_this.middlePointer = { x: 1000, y: 360 };
				_this.finalPointer = { x: 2000, y: 720 };
				_this.time = 0;
				_this.speed = 0;
				_this.count = 0;
				_this.startAngle = angle;
				onComplete && onComplete();
				return;
			}
		};

		_this.state = {
			angle: 0
		};
		_this.startAngle = 0;
		_this.isStart = false;
		_this.startPointer = { x: 0, y: 0 };
		_this.middlePointer = { x: 1000, y: 360 };
		_this.finalPointer = { x: 2000, y: 720 };
		_this.time = 0;
		_this.speed = 0;
		_this.isComplete = false;
		_this.isLoading = false;
		_this.count = 0;
		return _this;
	}

	// 开始旋转


	// 旋转动画


	// 停止旋转


	createClass(LuckyWheel, [{
		key: 'render',
		value: function render() {
			var chunkNum = this.props.chunkNum;
			var angle = this.state.angle;


			return React.createElement(
				'div',
				{ className: 'c-wheel-content' },
				React.createElement('img', { className: '_bg',
					src: TURNTABLE_BG
				}),
				React.createElement('img', { className: '_turntable',
					style: {
						transform: 'rotate(' + angle + 'deg)'
					},
					src: TURNTABLE
				}),
				React.createElement('img', { className: '_pointer',
					onClick: this.handleStart,
					src: POINTER
				})
			);
		}
	}]);
	return LuckyWheel;
}(Component);

LuckyWheel.propTypes = {
	position: PropTypes.number.isRequired, // 起点位置
	areaNum: PropTypes.number.isRequired, // 区域数
	cycle: PropTypes.number.isRequired, // 需要转动多少次才开始进入抽奖环节
	isComplete: PropTypes.bool.isRequired, // 是否完成
	onLoadData: PropTypes.func.isRequired, // 抽奖结果请求
	onComplete: PropTypes.func.isRequired // 完成后的回调
};
LuckyWheel.defaultProps = {
	position: 0,
	areaNum: 7,
	cycle: 10
};

export default LuckyWheel;
