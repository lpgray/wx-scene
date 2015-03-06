(function(root) {
    'use strict';

    var pages = document.querySelectorAll('.page');
    var pages_size = pages.length;
    var pages_events = ['pages.afterEnter', 'pages.afterLeave'];
    var current_page = -1;
    var loading_page = document.getElementById('J_loadingPage');
    var progress_bar = document.getElementById('J_progress');
    var player = document.getElementById('J_player');

    // 定义两个事件，上滑动和下滑动
    // var evtSwipeTop = new Event('pages.toTop');
    var evtSwipeTop = document.createEvent('HTMLEvents');
    evtSwipeTop.initEvent('pages.toTop', false, false);
    //var evtSwipeBottom = new Event('pages.toBottom');
    var evtSwipeBottom = document.createEvent('HTMLEvents');
    evtSwipeBottom.initEvent('pages.toBottom', false, false);
    //var evtAfterEnter = new Event(pages_events[0]);
    var evtAfterEnter = document.createEvent('HTMLEvents');
    evtAfterEnter.initEvent(pages_events[0], false, false);
    //var evtAfterLeave = new Event(pages_events[1]);
    var evtAfterLeave = document.createEvent('HTMLEvents');
    evtAfterLeave.initEvent(pages_events[1], false, false);

    // Event bind helpers
    function addEvent(target, events, handler) {
        var eventArr = events.split(' ');
        for (var i = 0, l = eventArr.length; i < l; i++) {
            target.addEventListener(eventArr[i], handler, false);
        }
    }

    function removeEvent(target, events, handler) {
        var eventArr = events.split(' ');
        for (var i = 0, l = eventArr.length; i < l; i++) {
            target.removeEventListener(eventArr[i], handler);
        }
    }

    function showPage(pageNbr) {
        for (var index = 0, l = pages.length; index < l; index++) {
            if (index !== current_page) {
                pages.item(index).className = 'page';
                pages.item(index).style.display = 'none';
                pages.item(pageNbr).style.zIndex = 1;
            }
        }
        var afterEnter = function() {
            pages.item(pageNbr).dispatchEvent(evtAfterEnter);
            removeEvent(pages.item(pageNbr), 'webkitAnimationEnd animationend', afterEnter);
            pages.item(pageNbr).style.zIndex = 100;
        };
        addEvent(pages.item(pageNbr), 'webkitAnimationEnd animationend', afterEnter);
        pages.item(pageNbr).style.display = 'block';
        pages.item(pageNbr).className = 'page animate_enter';
        current_page = pageNbr;

        if (pageNbr === 2) {
            var div1 = pages.item(pageNbr).children[0];
            div1.className = 'match-frame';
            div1.style.opacity = 1;
        }
    }

    // 每一页中的元素在执行动画前设置opacity1
    var pageHideFunc = function() {
        this.style.display = 'none';
        this.style.zIndex = 1;
        for (var i = 0, l = this.children.length; i < l; i++) {
            var item = this.children[i];
            if (item.className.indexOf('icon') > -1) {
                continue;
            }
            item.className = '';
            item.style.opacity = 0;
        }
        removeEvent(this, 'webkitTransitionEnd msTransitionEnd', pageHideFunc);
    };

    // 页面事件
    function bindPageEvent(page, index) {
        var _ = page;
        _.addEventListener('pages.toTop', function() {
            if (index >= pages_size - 1) {
                return false;
            } else {
                _.style.zIndex = 100;
                _.className = 'page animate_swipe_top';
                addEvent(_, 'webkitTransitionEnd msTransitionEnd', pageHideFunc);
                showPage(index + 1);
            }
        }, false);
        _.addEventListener('pages.toBottom', function() {
            if (index <= 0) {
                return false;
            } else {
                _.style.zIndex = 100;
                _.className = 'page animate_swipe_bottom';
                addEvent(_, 'webkitTransitionEnd msTransitionEnd', pageHideFunc);
                showPage(index - 1);
            }
        }, false);

        var pageItems = pages.item(index).children;
        for (var itemIndex = 0, l2 = pageItems.length; itemIndex < l2; itemIndex++) {
            addEvent(pageItems[itemIndex], 'animationstart webkitAnimationStart MSAnimationStart', function() {
                this.style.opacity = 1;
            });
        }
    }

    // 绑定页面上滑、下滑事件处理
    for (var index = 0, l = pages.length; index < l; index++) {
        bindPageEvent.call(null, pages.item(index), index);
    }

    // 事件捕获
    var startPoint = {};
    var endPoint;
    document.body.addEventListener('touchstart', function(e) {
        if (e.target.nodeName === 'A') {
            return;
        }
        startPoint.pageX = e.changedTouches[0].pageX;
        startPoint.pageY = e.changedTouches[0].pageY;
        e.preventDefault();
        e.stopPropagation();
    }, false);
    document.body.addEventListener('touchend', function(e) {
        if (e.target.nodeName === 'A') {
            return;
        }
        endPoint = e.changedTouches[0];
        if (startPoint.pageY - endPoint.pageY > 60) {
            // 发布事件
            pages.item(current_page).dispatchEvent(evtSwipeTop);
        } else if (endPoint.pageY - startPoint.pageY > 60) {
            // 发布事件
            pages.item(current_page).dispatchEvent(evtSwipeBottom);
        }
        e.preventDefault();
        e.stopPropagation();
    }, false);

    pages.item(0).addEventListener(pages_events[0], function() {
        var div1 = this.children[0];
        var div2 = this.children[1];
        var div3 = this.children[2];
        var div4 = this.children[3];
        var div5 = this.children[4];
        var div6 = this.children[5];

        var delay = 0;

        div1.style.webkitAnimationDelay = (delay + 1.5) + 's';
        div1.className = 'animate animate_fade_from_bottom';
        div2.style.webkitAnimationDelay = (delay + 1) + 's';
        div2.className = 'animate animate_fade_from_bottom';
        div3.style.webkitAnimationDelay = (delay + 0.5) + 's';
        div3.className = 'animate animate_fade_from_bottom';
        div4.style.webkitAnimationDelay = delay + 's';
        div4.className = 'animate animate_fade_from_right';
        div5.style.webkitAnimationDelay = delay + 's';
        div5.className = 'animate animate_fade_from_left';
        div6.style.webkitAnimationDelay = delay + 's';
        div6.className = 'animate animate_fade_from_right';
    }, false);
    pages.item(1).addEventListener(pages_events[0], function() {
        var div1 = this.children[0];
        var div2 = this.children[1];
        var div3 = this.children[2];
        var div4 = this.children[3];
        var div5 = this.children[4];

        var delay = 0;
        div1.style.webkitAnimationDelay = (delay + 2) + 's';
        div1.className = 'animate animate_fade';
        div2.style.webkitAnimationDelay = (delay + 1.5) + 's';
        div2.className = 'animate animate_fade';
        div3.style.webkitAnimationDelay = delay + 's';
        div3.className = 'animate animate_fade';
        div4.style.webkitAnimationDelay = (delay + 0.5) + 's';
        div4.className = 'animate animate_fade';
        div5.style.webkitAnimationDelay = (delay + 1) + 's';
        div5.className = 'animate animate_fade';

    }, false);
    pages.item(2).addEventListener(pages_events[0], function() {
        new root.bindMatch(function() {
            bianpaoMusic.play();
            root.bianpao.fire({
                onFireEnd: function() {
                    setTimeout(function(){
                        bianpaoMusic.stop();
                    }, 2000);
                }
            });
        });

    }, false);

    // 资源加载
    var LoadingRecource = (function() {
        var eventCenter = {};

        return {
            // 加载图片资源，资源加载完毕后会触发 imageLoaded 事件
            // 参数：array类型，表示要加载资源的 url
            loadImages: function(resArr) {
                var loaded = 0;
                for (var index = 0, l = resArr.length; index < l; index++) {
                    var image = new Image();
                    image.onload = function() {
                        if ('naturalHeight' in this) {
                            if (this.naturalHeight + this.naturalWidth === 0) {
                                this.onerror();
                                return;
                            }
                        } else if (this.width + this.height === 0) {
                            this.onerror();
                            return;
                        }
                        loaded++;
                        eventCenter.progress && eventCenter.progress.call(LoadingRecource, (loaded / resArr.length).toFixed(2));
                        if (loaded >= resArr.length) {
                            eventCenter.imageLoaded && eventCenter.imageLoaded.call(LoadingRecource);
                        }
                    };
                    image.onerror = function() {
                        loaded++;
                        if (loaded >= resArr.length) {
                            eventCenter.imageLoaded && eventCenter.imageLoaded.call(LoadingRecource);
                        }
                    };
                    image.src = resArr[index];
                }
            },
            // 事件绑定，绑定特定事件
            on: function(eventName, handler) {
                eventCenter[eventName] = handler;
            }
        };
    }());
    var imagesLocation = 'images/spring';
    LoadingRecource.on('imageLoaded', function() {
        showPage(0);
        loading_page.style.display = 'none';
    });
    LoadingRecource.on('progress', function(progress) {
        progress_bar.style.maxWidth = progress * 100 + '%';
    });

    // 加载图片资源
    LoadingRecource.loadImages([
        imagesLocation + '/p01_bg.jpg',
        imagesLocation + '/p01_cloud.png',
        imagesLocation + '/p01_s01.png',
        imagesLocation + '/p01_s02.png',
        imagesLocation + '/p01_z01.png',
        imagesLocation + '/p01_z02.png',
        imagesLocation + '/p01_z03.png',
        imagesLocation + '/p02_bg.jpg',
        imagesLocation + '/p02_s01.png',
        imagesLocation + '/p02_s02.png',
        imagesLocation + '/p02_z01.png',
        imagesLocation + '/p02_z02.png',
        imagesLocation + '/p02_z03.png',
        imagesLocation + '/p03_bg.jpg',
        imagesLocation + '/pole.png',
        imagesLocation + '/fu_03.png'
    ]);

    // 判断是否是Android机器
    // Android机将使用较弱的动画
    // if (navigator.appVersion.search(/android/i) > -1) {
    // 	document.body.className += ' android';
    // }

    function BianPaoMusic() {
        var audioElem = document.createElement('audio');
        document.body.appendChild(audioElem);
        audioElem.src = 'http://pan.xici.com/group4/M01/0D/0E/rBABp1Ta77uEW965AAAAAOqccuU333.mp3';
        audioElem.loop = true;

        this.audioElem = audioElem;
    }

    BianPaoMusic.prototype = {
        play: function(){
            this.audioElem.play();
        },
        stop: function() {
            this.audioElem.pause();
        }
    };

    var bianpaoMusic = new BianPaoMusic();

    // 音乐播放控制
    var MediaPlayer = (function() {
        var btnPlay = player.children[0];
        var btnPause = player.children[1];
        var mp3Url = 'http://pan.xici.com/group4/M01/0D/0E/rBABplTa77iESZ3zAAAAAHgQVyQ216.mp3';
        var audioElem = document.createElement('audio');
        var isDownload = false;
        document.body.appendChild(audioElem);
        btnPause.style.display = 'none';
        btnPlay.style.display = 'block';

        audioElem.loop = true;

        btnPlay.addEventListener('touchend', function() {
            MediaPlayer.play();
        }, false);
        btnPause.addEventListener('touchend', function() {
            MediaPlayer.pause();
        }, false);

        return {
            play: function() {
                if (!isDownload) {
                    audioElem.src = mp3Url;
                    isDownload = true;
                }
                audioElem.play();
                btnPause.style.display = 'block';
                btnPlay.style.display = 'none';
            },
            pause: function() {
                audioElem.pause();
                btnPause.style.display = 'none';
                btnPlay.style.display = 'block';
            }
        };
    }());

    root.MediaPlayer = MediaPlayer;

    // 点击再来一次
    $('#J_BtnAgain').bind('touchend', function(){
        root.bianpao.reset();
    });

}(this.XiciSpring));