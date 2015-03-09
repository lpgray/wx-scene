(function (root) {
    'use strict';

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

    // Page Events
    var AFTER_ENTER = 'pages.afterEnter';
    var musicPlayer;
    var loadingPage;

    // Main
    var WxScene = function (options) {
        var self = this;

        this.options = options;

        if (options.music) {
            musicPlayer = musicPlayerFactory(options.music);
        }

        if (options.loading) {
            loadingPage = loadingPageFactory(options);
            loadingPage.onLoad(function() {
                // 加载 json 并 render html
                self.renderPages(options.pages);

                // 绑定滑动事件
                self.bindEvent();
            });
            return;
        }

        // 加载 json 并 render html
        this.renderPages(options.pages);

        // 绑定滑动事件
        this.bindEvent();
    };
    WxScene.prototype = {
        renderPages: function (pages) {
            var tmpl = '';
            var page;
            var pageItem;

            for (var i = 0, l = pages.length; i < l; i++) {
                page = pages[i];

                tmpl += '<div class="page" style="background-image:url(' + page.bg + ')">';

                for (var j = 0, l2 = page.items.length; j < l2; j++) {
                    pageItem = page.items[j];
                    tmpl += '<div style="background-image:url(' + pageItem.bg + ')"></div>';
                }

                if (i < l - 1) {
                    tmpl += '<div class="icon icon_arrow"><i class="arrow"></i></div></div>';
                }

                tmpl += '</div>';
            }

            var div = document.createElement('div');
            div.innerHTML = tmpl;

            document.body.appendChild(div);
        },

        bindEvent: function () {
            var pages = document.querySelectorAll('.page');
            var pages_size = pages.length;
            var current_page = -1;

            // 定义两个事件，上滑动和下滑动
            var evtSwipeTop = document.createEvent('HTMLEvents');
            evtSwipeTop.initEvent('pages.toTop', false, false);
            var evtSwipeBottom = document.createEvent('HTMLEvents');
            evtSwipeBottom.initEvent('pages.toBottom', false, false);
            var evtAfterEnter = document.createEvent('HTMLEvents');
            evtAfterEnter.initEvent(AFTER_ENTER, false, false);

            function showPage(pageNbr) {
                for (var index = 0, l = pages.length; index < l; index++) {
                    if (index !== current_page) {
                        pages.item(index).className = 'page';
                        pages.item(index).style.display = 'none';
                        pages.item(pageNbr).style.zIndex = 1;
                    }
                }

                var afterEnter = function () {
                    pages.item(pageNbr).dispatchEvent(evtAfterEnter);
                    removeEvent(pages.item(pageNbr), 'webkitAnimationEnd animationend', afterEnter);
                    pages.item(pageNbr).style.zIndex = 100;
                };

                addEvent(pages.item(pageNbr), 'webkitAnimationEnd animationend', afterEnter);
                pages.item(pageNbr).style.display = 'block';
                pages.item(pageNbr).className = 'page animate_enter';
                current_page = pageNbr;
            }

            // 每一页中的元素在执行动画前设置opacity1
            function pageHideFunc() {
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
                _.addEventListener('pages.toTop', function () {
                    if (index >= pages_size - 1) {
                        return false;
                    } else {
                        _.style.zIndex = 100;
                        _.className = 'page animate_swipe_top';
                        addEvent(_, 'webkitTransitionEnd msTransitionEnd', pageHideFunc);
                        showPage(index + 1);
                    }
                }, false);
                _.addEventListener('pages.toBottom', function () {
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
                    addEvent(pageItems[itemIndex], 'animationstart webkitAnimationStart MSAnimationStart', function () {
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
            document.body.addEventListener('touchstart', function (e) {
                if (e.target.nodeName === 'A') {
                    return;
                }
                startPoint.pageX = e.changedTouches[0].pageX;
                startPoint.pageY = e.changedTouches[0].pageY;
                e.preventDefault();
                e.stopPropagation();
            }, false);
            document.body.addEventListener('touchend', function (e) {
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

            this.pages = pages;

            // 绑定页面动画
            this.bindPagesAnimation();

            showPage(0);
        },

        bindPagesAnimation: function () {
            var page;
            var self = this;

            for (var i = 0, l = this.pages.length; i < l; i++) {
                page = self.pages[i];

                page.addEventListener(AFTER_ENTER, (function (index) {

                    return function () {
                        var pageItems = this.children;
                        var pageOption = self.options.pages[index];
                        var pageItem;

                        for (var j = 0, l2 = pageItems.length; j < l2; j++) {
                            pageItem = pageItems.item(j);

                            if (pageItem.className.indexOf('icon_arrow') > -1) {
                                continue;
                            }

                            if (pageOption.items[j].delay) {
                                pageItem.style.webkitAnimationDelay = pageOption.items[j].delay + 's';
                            } else {
                                pageItem.style.webkitAnimationDelay = 0.2 + 's';
                            }

                            pageItem.className = 'animate ' + pageOption.items[j].animate;
                        }
                    }

                }(i)), false);
            }
        }
    };

    // 音乐播放控制
    function musicPlayerFactory(mp3Url) {
        var tmpl = '<div class="play">播放</div><div class="pause">暂停</div>';

        var player = document.createElement('div');
        player.className = 'player';

        player.innerHTML = tmpl;

        document.body.appendChild(player);

        var btnPlay = player.children[0];
        var btnPause = player.children[1];
        var audioElem = document.createElement('audio');
        var isDownload = false;
        document.body.appendChild(audioElem);
        btnPause.style.display = 'none';
        btnPlay.style.display = 'block';

        audioElem.loop = true;

        btnPlay.addEventListener('touchend', function() {
            musicPlayer && musicPlayer.play();
        }, false);
        btnPause.addEventListener('touchend', function() {
            musicPlayer && musicPlayer.pause();
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
    };

    // loading页面
    function loadingPageFactory(options) {
        var tmpl = '';
        tmpl += '   <p>'+ options.loading +'</p>';
        tmpl += '   <div class="progress">';
        tmpl += '       <div id="J_progress" class="inner"></div>';
        tmpl += '   </div>';

        var div = document.createElement('div');
        div.className = 'loading_page';
        div.innerHTML = tmpl;

        document.body.appendChild(div);

        var progressBar = document.getElementById('J_progress');

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

        var onLoad;

        LoadingRecource.on('imageLoaded', function() {
            div.style.display = 'none';
            onLoad && onLoad.call();
        });

        LoadingRecource.on('progress', function(progress) {
            progressBar.style.maxWidth = progress * 100 + '%';
        });

        var imgResArr = [];
        for (var i = 0, l = options.pages.length; i < l; i++) {
            imgResArr.push(options.pages[i].bg);
            for (var j = 0, l2 = options.pages[i].items.length; j<l2 ; j++) {
                imgResArr.push(options.pages[i].items[j].bg);
            }
        }

        LoadingRecource.loadImages(imgResArr);

        return {
            onLoad : function(cb) {
                onLoad = cb;
            }
        }
    }

    root.WxScene = WxScene;

}(this));