wx-scene
======
手机单页滑屏组件，常用于微信营销业务方面，只适用于移动端，不依赖任何类库。本代码现在还是比较乱的，没重构，不过已经经过了几十万PV的考验。

## Demos
以下东西都请用手机或者PC的手机模拟器打开，部分必须在微信内置浏览器打开，当然你也可以自己改UA头，加上 `MicroMessenger` 即可。

- [http://weixin.xici.net/html/cracker/](http://weixin.xici.net/html/cracker/)
- [http://weixin.xici.net/html/gongji/](http://weixin.xici.net/html/gongji/)
- [http://weixin.xici.net/html/xuwei/](http://weixin.xici.net/html/xuwei/)

## Browser Support
- Android 4.0
- iOS 6.0

## How to use
可以参考 `example/json.html` 使用。

## API
```javascript
new WxScene(options);
```

### options
- `pages : [Array]`
- `music : [String]`
- `loading : [String]`

#### pages
每一页的元素声明，包括背景及子元素。例如：

```javascript
new WxScene({
	pages : [
		{
			bg : 'image.jpg',
			items : [
				{
					bg : 'image.png',
					animate : 'animate_fade_from_bottom',
					delay : 0.2
				}
			]
		}
	]
})
```
##### pages下items的参数说明

###### bg
当前元素的背景图片地址

###### animate
动画类型字符串：

- `animate_fade`
- `animate_fade_from_bottom`
- `animate_fade_from_right`
- `animate_fade_from_left`
- `animate_peng`

#### music
默认是 `null`, 需要播放的背景音乐url地址，如果不提供，音乐播放功能将不会被启用。

#### loading
默认是 `null`, 这个参数是指定loading页面的标题，loading设定后，会加载所有 `pages` 需要用的图片资源，加载完毕后显示第一页。

## TODO
- 微信分享