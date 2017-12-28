# lucky-wheel使用说明
1. 安装lucky-wheel包
`npm install -S lucky-wheel`
2. render组件
```js
import LuckyWheel from 'lucky-wheel';

constructor(props) {
  super(props);
  this.state = {
    position: 0,
    isComplete: false
  }
}
handleLoadData = () => {
  setTimeout(() => {
    this.setState({
      position: 2,
      isComplete: true
    })
  }, 1000);
}
handleComplete = () => {
  this.setState({isComplete: false})
}

render() {
  return (
    <LuckyWheel
       onLoadData={this.handleLoadData}
       position={position}
       areaNum={7}
       cycle={10}
       isComplete={isComplete}
       onComplete={this.handleComplete}
    />
  )
}
```
