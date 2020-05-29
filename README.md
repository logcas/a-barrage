# <p align="center">A-Barrage</p>
<p align="center">基于Canvas渲染的高性能JavaScript弹幕库</p>

## 🎦 Live Demo
https://logcas.github.io/a-barrage/example/

## 🧐 如何使用

`A-Barrage`是基于Canvas渲染的，因此你需要准备一个画布：

```html
<canvas id="danmu"></canvas>
```

然后，实例化一个`aBarrage`对象，同时传入`canvas`元素：

```js
new aBarrage(
  '#danmu',
  config
)
```

其中，`config`对象支持如下属性（全部都是可选的，如下值为默认值）：

```js
config = {
  zoom: 1, // 文字缩放比
  proxyObject: null, // 事件代理触发对象
  usePointerEvents: true, // 屏蔽弹幕画布的点击事件
  maxTrack: 4, // 最大轨道数
  fontSize: 20, // 文字大小，单位为px
  fontColor: '#fff', // 文字颜色
  duration: 10000, // 弹幕留存时间
  trackHeight: 20 * 1.5 // 轨道高度，默认为默认文字的1.5倍
}
```

然后，可以通过`add()`方法添加弹幕：
```js
instance.add(danmu, 'scroll')
```

其中，第一个参数是一个`RawBarrageObject`对象，它的类型是这样的：

```js
RawBarrageObject {
  text: string //  文本 
  color?: string // 颜色，可选
  size?: number // 字体大小，可选
}
```

第二个参数也是可选的，默认为`scroll`，即滚动弹幕。顶部弹幕和底部弹幕分别为：`fixed-top`、`fixed-bottom`。

## 📅 事件机制

首先，当实例化`aBarrage`对象后，会在`wrapper`元素中插入一个`canvas`标签，并且这个画布是绝对定位的，且置于`wrapper`子元素的(`z-index`)顶层。因此，默认状态下会阻挡鼠标事件的传播。（比如你想要点击`video`标签，但被画布元素阻挡了）

为了解决事件被阻挡的问题，这里主要使用了两种方法：
1. `pointer-events:none`
2. 事件代理

### `usePointerEvent`
配置选项中的`usePointerEvent`默认为`true`，也就是默认状态下会为画布元素添加该CSS属性。这样的话画布元素就不会成为鼠标事件的`target`，那么鼠标事件就会从下一层的元素开始触发。

但是这个属性有兼容性问题，对于IE仅支持IE11+的浏览器，其余浏览器的最新版本基本已支持。

综上，所以有了事件代理机制。

### 事件代理
`aBarrage`类是继承自`EventEmitter`的，因此它也是一个事件中心，拥有`$on`、`$once`、`$emit`、`$off`等方法。

对于`click`、`dblclick`、`mousedown`、`mousemove`、`mouseout`、`mouseover`、`mouseup`这几个鼠标事件，当画布触发这些事件时，会调用`$emit`同步触发通过`$on`绑定的事件处理器。

除此之外，你也可以添加自定义事件。

## 🔎 API
### add(barrage[, type])
其中，`barrage`是一个`RawBarrageObject`对象，它的结构是这样的：
```js
{
  text: string,
  color?: string,
  size?: number
}
```

`type`可选`scroll`、`fixed-top`、`fixed-bottom`，分别代表滚动弹幕、固定顶部弹幕、底部弹幕。默认为`scroll`。

### start()
弹幕开始

### stop()
弹幕暂停

### resize([,width])
宽度会影响弹幕轨道的宽度，当`canvas`的宽度更改时，务必调用该方法更新轨道宽度。

### clear()
清空弹幕

### setOpacity(opacity = 1)
设置弹幕文字的不透明度，默认为`1`，即不透明。取值区间为`[0,1]`。

### setFontSize(zoom = 1)
全局设置文字的缩放大小。需要注意的是，`setFontSize`并不会改变实话配置中的`fontSize`大小，而是通过设置`config.zoom`（缩放比率）的方式更改输出文字的大小。默认为`1`。

### $on(eventName, handler)
绑定事件处理器。

### $once(eventName, handler)
绑定事件处理器，但它只会执行一次。

### $off(eventName[, handler])
接触事件处理器，当`handler`不传时，会消除`eventName`事件的所有回调。

### $emit(eventName[, ...args])
触发事件处理器，从第二个参数开始可以传入回调函数的参数。

## License
MIT