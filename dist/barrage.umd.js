(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.ABarrage = factory());
}(this, (function () { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function isEmptyArray(array) {
        return array.length === 0;
    }
    function getArrayRight(array) {
        return array[array.length - 1];
    }
    function isDiv(el) {
        return el instanceof HTMLDivElement;
    }
    function isCanvas(el) {
        return el instanceof HTMLCanvasElement;
    }
    function getEl(el, type) {
        var $ = document.querySelector;
        var _el = typeof el === 'string' ? $(el) : el;
        if (type === 'canvas' && !isCanvas(_el)) {
            throwElError('canvas');
        }
        if (type === 'css3' && !isDiv(_el)) {
            throwElError('css3');
        }
        return _el;
        function throwElError(type) {
            var EL_TYPE = type === 'canvas' ? 'HTMLCanvasElement' : 'HTMLDivElement';
            throw new Error("Engine Error: el is not a " + EL_TYPE + " instance.(engine: " + type + ")");
        }
    }
    var requestAnimationFrame$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
    var cancelAnimationFrame = window.cancelAnimationFrame || window.webkitCancelAnimationFrame;
    var isNull = function (o) {
        return o === null;
    };
    var isUndefined = function (o) {
        return typeof o === 'undefined';
    };
    var isObject = function (o) {
        return typeof o === 'object' && o !== null;
    };
    function deepMerge() {
        var objects = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            objects[_i] = arguments[_i];
        }
        var ret = {};
        objects.forEach(function (obj) {
            if (isNull(obj) || isUndefined(obj)) {
                return;
            }
            Object.keys(obj).forEach(function (key) {
                if (!ret.hasOwnProperty(key)) {
                    ret[key] = obj[key];
                }
                else {
                    if (Array.isArray(obj[key])) {
                        ret[key] = obj[key];
                    }
                    else if (isObject(obj[key])) {
                        ret[key] = deepMerge(ret[key], obj[key]);
                    }
                    else {
                        ret[key] = obj[key];
                    }
                }
            });
        });
        return ret;
    }
    function isScrollBarrage(x) {
        return x.hasOwnProperty('speed') && x.hasOwnProperty('offset');
    }
    //# sourceMappingURL=index.js.map

    var EventEmitter = /** @class */ (function () {
        function EventEmitter() {
            this._eventsMap = {};
        }
        EventEmitter.prototype.$on = function (eventName, handler) {
            var eventsMap = this._eventsMap;
            var handlers = eventsMap[eventName] || (eventsMap[eventName] = []);
            handlers.push(handler);
            return this;
        };
        EventEmitter.prototype.$once = function (eventName, handler) {
            var eventsMap = this._eventsMap;
            var handlers = eventsMap[eventName] || (eventsMap[eventName] = []);
            var self = this;
            var fn = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                handler.apply(void 0, args);
                self.$off(eventName, fn);
            };
            handlers.push(fn);
            return this;
        };
        EventEmitter.prototype.$off = function (eventName, handler) {
            var eventsMap = this._eventsMap;
            if (!handler) {
                eventsMap[eventName].length = 0;
                return this;
            }
            var handlers = eventsMap[eventName];
            if (!handlers) {
                return this;
            }
            var index = handlers.indexOf(handler);
            if (index !== -1) {
                handlers.splice(index, 1);
            }
            return this;
        };
        EventEmitter.prototype.$emit = function (eventName) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var eventsMap = this._eventsMap;
            var handlers = eventsMap[eventName];
            if (Array.isArray(handlers)) {
                handlers.forEach(function (fn) { return fn.apply(void 0, args); });
            }
        };
        return EventEmitter;
    }());
    //# sourceMappingURL=event-emitter.js.map

    var BarrageTrack = /** @class */ (function () {
        function BarrageTrack() {
            this.barrages = [];
            this.offset = 0;
        }
        BarrageTrack.prototype.forEach = function (handler) {
            for (var i = 0; i < this.barrages.length; ++i) {
                handler(this.barrages[i], i, this.barrages);
            }
        };
        BarrageTrack.prototype.reset = function () {
            this.barrages = [];
            this.offset = 0;
        };
        BarrageTrack.prototype.push = function () {
            var _a;
            var items = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                items[_i] = arguments[_i];
            }
            (_a = this.barrages).push.apply(_a, items);
        };
        BarrageTrack.prototype.removeTop = function () {
            this.barrages.shift();
        };
        BarrageTrack.prototype.updateOffset = function () {
            var endBarrage = this.barrages[this.barrages.length - 1];
            if (endBarrage && isScrollBarrage(endBarrage)) {
                var speed = endBarrage.speed;
                this.offset -= speed;
            }
        };
        return BarrageTrack;
    }());
    //# sourceMappingURL=track.js.map

    var BaseCommander = /** @class */ (function () {
        function BaseCommander(config) {
            this.tracks = [];
            this.waitingQueue = [];
            this.trackWidth = config.trackWidth;
            this.trackHeight = config.trackHeight;
            this.duration = config.duration;
            for (var i = 0; i < config.maxTrack; ++i) {
                this.tracks[i] = new BarrageTrack();
            }
        }
        BaseCommander.prototype.forEach = function (handler) {
            for (var i = 0; i < this.tracks.length; ++i) {
                handler(this.tracks[i], i, this.tracks);
            }
        };
        BaseCommander.prototype.reset = function () {
            this.forEach(function (track) { return track.reset(); });
        };
        BaseCommander.prototype.resize = function (width, height) {
            if (width) {
                this.trackWidth = width;
            }
            if (height) {
                this.trackHeight = height;
            }
        };
        return BaseCommander;
    }());
    //# sourceMappingURL=base.js.map

    var BaseCanvasCommander = /** @class */ (function (_super) {
        __extends(BaseCanvasCommander, _super);
        function BaseCanvasCommander(canvas, config) {
            var _this = _super.call(this, config) || this;
            _this.canvas = canvas;
            _this.ctx = canvas.getContext('2d');
            return _this;
        }
        return BaseCanvasCommander;
    }(BaseCommander));
    //# sourceMappingURL=base-canvas.js.map

    var BaseFixedCommander = /** @class */ (function (_super) {
        __extends(BaseFixedCommander, _super);
        function BaseFixedCommander(canvas, config) {
            return _super.call(this, canvas, config) || this;
        }
        BaseFixedCommander.prototype.add = function (barrage) {
            var trackId = this._findTrack();
            if (trackId === -1) {
                return false;
            }
            var track = this.tracks[trackId];
            var trackWidth = this.trackWidth;
            var width = barrage.width;
            var barrageOffset = (trackWidth - width) / 2;
            var normalizedBarrage = Object.assign({}, barrage, {
                offset: barrageOffset,
                duration: this.duration
            });
            track.push(normalizedBarrage);
            return true;
        };
        BaseFixedCommander.prototype._findTrack = function () {
            var idx = -1;
            for (var i = 0; i < this.tracks.length; ++i) {
                if (isEmptyArray(this.tracks[i].barrages)) {
                    idx = i;
                    break;
                }
            }
            return idx;
        };
        BaseFixedCommander.prototype._extractBarrage = function () {
            var isIntered;
            for (var i = 0; i < this.waitingQueue.length;) {
                isIntered = this.add(this.waitingQueue[i]);
                if (!isIntered) {
                    break;
                }
                this.waitingQueue.shift();
            }
        };
        return BaseFixedCommander;
    }(BaseCanvasCommander));
    //# sourceMappingURL=base-fixed.js.map

    var HTML_ELEMENT_NATIVE_EVENTS = 'click,dblclick,mousedown,mousemove,mouseout,mouseover,mouseup'.split(',');
    var TIME_PER_FRAME = 16.6;
    //# sourceMappingURL=index.js.map

    var FixedTopCommander = /** @class */ (function (_super) {
        __extends(FixedTopCommander, _super);
        function FixedTopCommander(canvas, config) {
            return _super.call(this, canvas, config) || this;
        }
        FixedTopCommander.prototype.render = function () {
            this._extractBarrage();
            var ctx = this.ctx;
            var trackHeight = this.trackHeight;
            this.tracks.forEach(function (track, index) {
                var barrage = track.barrages[0];
                if (!barrage) {
                    return;
                }
                var color = barrage.color, text = barrage.text, offset = barrage.offset, size = barrage.size;
                ctx.fillStyle = color;
                ctx.font = size + "px 'Microsoft Yahei'";
                ctx.fillText(text, offset, (index + 1) * trackHeight);
                barrage.duration -= TIME_PER_FRAME;
                if (barrage.duration <= 0) {
                    track.removeTop();
                }
            });
        };
        return FixedTopCommander;
    }(BaseFixedCommander));
    //# sourceMappingURL=fixed-top.js.map

    var FixedBottomCommander = /** @class */ (function (_super) {
        __extends(FixedBottomCommander, _super);
        function FixedBottomCommander(canvas, config) {
            return _super.call(this, canvas, config) || this;
        }
        FixedBottomCommander.prototype.render = function () {
            this._extractBarrage();
            var ctx = this.ctx;
            var trackHeight = this.trackHeight;
            var canvasHeight = this.canvas.height;
            var startY = canvasHeight - this.trackHeight * this.tracks.length;
            this.tracks.forEach(function (track, index) {
                var barrage = track.barrages[0];
                if (!barrage) {
                    return;
                }
                var color = barrage.color, text = barrage.text, offset = barrage.offset, size = barrage.size;
                ctx.fillStyle = color;
                ctx.font = size + "px 'Microsoft Yahei'";
                ctx.fillText(text, offset, startY + index * trackHeight);
                barrage.duration -= TIME_PER_FRAME;
                if (barrage.duration <= 0) {
                    track.removeTop();
                }
            });
        };
        return FixedBottomCommander;
    }(BaseFixedCommander));
    //# sourceMappingURL=fixed-bottom.js.map

    var RollingCommander = /** @class */ (function (_super) {
        __extends(RollingCommander, _super);
        function RollingCommander(canvas, config) {
            return _super.call(this, canvas, config) || this;
        }
        Object.defineProperty(RollingCommander.prototype, "_defaultSpeed", {
            get: function () {
                return (this.trackWidth / this.duration) * TIME_PER_FRAME;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RollingCommander.prototype, "_randomSpeed", {
            get: function () {
                return 0.8 + Math.random() * 1.3;
            },
            enumerable: false,
            configurable: true
        });
        RollingCommander.prototype.add = function (barrage) {
            var trackId = this._findTrack();
            if (trackId === -1) {
                return false;
            }
            var track = this.tracks[trackId];
            var trackOffset = track.offset;
            var trackWidth = this.trackWidth;
            var speed;
            if (isEmptyArray(track.barrages)) {
                speed = this._defaultSpeed * this._randomSpeed;
            }
            else {
                var preSpeed = getArrayRight(track.barrages).speed;
                speed = (trackWidth * preSpeed) / trackOffset;
            }
            speed = Math.min(speed, this._defaultSpeed * 2);
            var normalizedBarrage = Object.assign({}, barrage, {
                offset: trackWidth,
                speed: speed
            });
            track.push(normalizedBarrage);
            track.offset = trackWidth + barrage.width * 1.2;
            return true;
        };
        RollingCommander.prototype._findTrack = function () {
            var _this = this;
            var idx = -1;
            var max = -Infinity;
            this.forEach(function (track, index) {
                var trackOffset = track.offset;
                if (trackOffset > _this.trackWidth) {
                    return;
                }
                var t = _this.trackWidth - trackOffset;
                if (t > max) {
                    idx = index;
                    max = t;
                }
            });
            return idx;
        };
        RollingCommander.prototype._extractBarrage = function () {
            var isIntered;
            for (var i = 0; i < this.waitingQueue.length;) {
                isIntered = this.add(this.waitingQueue[i]);
                if (!isIntered) {
                    break;
                }
                this.waitingQueue.shift();
            }
        };
        RollingCommander.prototype.render = function () {
            this._extractBarrage();
            var ctx = this.ctx;
            var trackHeight = this.trackHeight;
            this.forEach(function (track, trackIndex) {
                var removeTop = false;
                track.forEach(function (barrage, barrageIndex) {
                    var color = barrage.color, text = barrage.text, offset = barrage.offset, speed = barrage.speed, width = barrage.width, size = barrage.size;
                    ctx.fillStyle = color;
                    ctx.font = size + "px 'Microsoft Yahei'";
                    ctx.fillText(text, offset, (trackIndex + 1) * trackHeight);
                    barrage.offset -= speed;
                    if (barrageIndex === 0 && barrage.offset < 0 && Math.abs(barrage.offset) >= width) {
                        removeTop = true;
                    }
                });
                track.updateOffset();
                if (removeTop) {
                    track.removeTop();
                }
            });
        };
        return RollingCommander;
    }(BaseCanvasCommander));
    //# sourceMappingURL=rolling.js.map

    var engine = {
        FixedBottomCommander: FixedBottomCommander,
        FixedTopCommander: FixedTopCommander,
        RollingCommander: RollingCommander
    };
    //# sourceMappingURL=index.js.map

    var BaseCssCommander = /** @class */ (function (_super) {
        __extends(BaseCssCommander, _super);
        function BaseCssCommander(el, config) {
            var _this = _super.call(this, config) || this;
            _this.el = el;
            return _this;
        }
        BaseCssCommander.prototype.removeElement = function (target) {
            this.el.removeChild(target);
        };
        return BaseCssCommander;
    }(BaseCommander));
    //# sourceMappingURL=base-css.js.map

    var BaseFixedCssCommander = /** @class */ (function (_super) {
        __extends(BaseFixedCssCommander, _super);
        function BaseFixedCssCommander(el, config) {
            var _this = _super.call(this, el, config) || this;
            // FixedBarrageObejct ---> HTML 的映射
            _this.objToElm = new WeakMap();
            return _this;
        }
        BaseFixedCssCommander.prototype.add = function (barrage) {
            var trackId = this._findTrack();
            if (trackId === -1) {
                return false;
            }
            var track = this.tracks[trackId];
            var trackWidth = this.trackWidth;
            var width = barrage.width;
            var barrageOffset = (trackWidth - width) / 2;
            var normalizedBarrage = Object.assign({}, barrage, {
                offset: barrageOffset,
                duration: this.duration
            });
            track.push(normalizedBarrage);
            return true;
        };
        BaseFixedCssCommander.prototype._findTrack = function () {
            var idx = -1;
            for (var i = 0; i < this.tracks.length; ++i) {
                if (isEmptyArray(this.tracks[i].barrages)) {
                    idx = i;
                    break;
                }
            }
            return idx;
        };
        BaseFixedCssCommander.prototype._extractBarrage = function () {
            var isIntered;
            for (var i = 0; i < this.waitingQueue.length;) {
                isIntered = this.add(this.waitingQueue[i]);
                if (!isIntered) {
                    break;
                }
                this.waitingQueue.shift();
            }
        };
        BaseFixedCssCommander.prototype._removeTopElementFromTrack = function (track) {
            var barrage = track.barrages[0];
            if (!barrage) {
                return;
            }
            var el = this.objToElm.get(barrage);
            this.objToElm.delete(barrage);
            this.removeElement(el);
        };
        return BaseFixedCssCommander;
    }(BaseCssCommander));
    //# sourceMappingURL=base-fixed.js.map

    function createElement(tagName) {
        return document.createElement(tagName);
    }
    function createBarrage(text, color, fontSize, left) {
        var danmu = createElement('div');
        setStyle(danmu, {
            position: 'absolute',
            color: color,
            fontSize: fontSize,
            transform: "translateX(" + left + "px)"
        });
        danmu.textContent = text;
        return danmu;
    }
    function appendChild(parent, child) {
        return parent.appendChild(child);
    }
    function setStyle(el, style) {
        for (var key in style) {
            el.style[key] = style[key];
        }
    }
    //# sourceMappingURL=css.js.map

    var FixedTopCommander$1 = /** @class */ (function (_super) {
        __extends(FixedTopCommander, _super);
        function FixedTopCommander(el, config) {
            return _super.call(this, el, config) || this;
        }
        FixedTopCommander.prototype.render = function () {
            var _this = this;
            this._extractBarrage();
            var objToElm = this.objToElm;
            var trackHeight = this.trackHeight;
            this.tracks.forEach(function (track, index) {
                var barrage = track.barrages[0];
                if (!barrage) {
                    return;
                }
                var el = objToElm.get(barrage);
                if (!el) {
                    var text = barrage.text, color = barrage.color, size = barrage.size;
                    el = createBarrage(text, color, size + 'px', '50%');
                    var y = index * trackHeight + 'px';
                    el.style.transform = "translate(-50%, " + y + ")";
                    objToElm.set(barrage, el);
                }
                else {
                    barrage.duration -= TIME_PER_FRAME;
                    if (barrage.duration <= 0) {
                        _this._removeTopElementFromTrack(track);
                        track.removeTop();
                    }
                }
            });
        };
        return FixedTopCommander;
    }(BaseFixedCssCommander));
    //# sourceMappingURL=fixed-top.js.map

    var RollingCssCommander = /** @class */ (function (_super) {
        __extends(RollingCssCommander, _super);
        function RollingCssCommander(el, config) {
            var _this = _super.call(this, el, config) || this;
            // ScrollBarrageObject ---> HTML 的映射
            _this.objToElm = new WeakMap();
            return _this;
        }
        Object.defineProperty(RollingCssCommander.prototype, "_defaultSpeed", {
            get: function () {
                return (this.trackWidth / this.duration) * TIME_PER_FRAME;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(RollingCssCommander.prototype, "_randomSpeed", {
            get: function () {
                return 0.8 + Math.random() * 1.3;
            },
            enumerable: false,
            configurable: true
        });
        RollingCssCommander.prototype.add = function (barrage) {
            var trackId = this._findTrack();
            if (trackId === -1) {
                return false;
            }
            // 创建弹幕DOM
            var text = barrage.text, size = barrage.size, color = barrage.color, offset = barrage.offset;
            var fontSize = size + 'px';
            var posLeft = offset + 'px';
            var danmu = createBarrage(text, color, fontSize, posLeft);
            appendChild(this.el, danmu);
            var width = danmu.offsetWidth;
            // 计算弹幕速度
            var track = this.tracks[trackId];
            var trackOffset = track.offset;
            var trackWidth = this.trackWidth;
            var speed;
            if (isEmptyArray(track.barrages)) {
                speed = this._defaultSpeed * this._randomSpeed;
            }
            else {
                var preSpeed = getArrayRight(track.barrages).speed;
                speed = (trackWidth * preSpeed) / trackOffset;
            }
            speed = Math.min(speed, this._defaultSpeed * 2);
            var normalizedBarrage = Object.assign({}, barrage, {
                offset: trackWidth,
                speed: speed,
                width: width
            });
            this.objToElm.set(normalizedBarrage, danmu);
            track.push(normalizedBarrage);
            track.offset = trackWidth + normalizedBarrage.width * 1.2;
            return true;
        };
        RollingCssCommander.prototype._findTrack = function () {
            var _this = this;
            var idx = -1;
            var max = -Infinity;
            this.forEach(function (track, index) {
                var trackOffset = track.offset;
                if (trackOffset > _this.trackWidth) {
                    return;
                }
                var t = _this.trackWidth - trackOffset;
                if (t > max) {
                    idx = index;
                    max = t;
                }
            });
            return idx;
        };
        RollingCssCommander.prototype._extractBarrage = function () {
            var isIntered;
            for (var i = 0; i < this.waitingQueue.length;) {
                isIntered = this.add(this.waitingQueue[i]);
                if (!isIntered) {
                    break;
                }
                this.waitingQueue.shift();
            }
        };
        RollingCssCommander.prototype.render = function () {
            var _this = this;
            this._extractBarrage();
            var objToElm = this.objToElm;
            var trackHeight = this.trackHeight;
            this.forEach(function (track, trackIndex) {
                var removeTop = false;
                track.forEach(function (barrage, barrageIndex) {
                    if (!objToElm.has(barrage)) {
                        return;
                    }
                    var el = objToElm.get(barrage);
                    var offset = barrage.offset;
                    el.style.transform = "translate(" + offset + "px, " + trackIndex * trackHeight + "px)";
                    barrage.offset -= barrage.speed;
                    if (barrageIndex === 0 && barrage.offset < 0 && Math.abs(barrage.offset) > barrage.width) {
                        removeTop = true;
                    }
                });
                track.updateOffset();
                if (removeTop) {
                    _this._removeTopElementFromTrack(track);
                    track.removeTop();
                }
            });
        };
        RollingCssCommander.prototype._removeTopElementFromTrack = function (track) {
            var barrage = track.barrages[0];
            if (!barrage) {
                return;
            }
            var el = this.objToElm.get(barrage);
            this.objToElm.delete(barrage);
            this.removeElement(el);
        };
        return RollingCssCommander;
    }(BaseCssCommander));

    var engine$1 = {
        FixedTopCommander: FixedTopCommander$1,
        FixedBottomCommander: FixedTopCommander$1,
        RollingCommander: RollingCssCommander
    };
    //# sourceMappingURL=index.js.map

    function getEngine(type) {
        if (type === 'canvas') {
            return engine;
        }
        if (type === 'css3') {
            return engine$1;
        }
        return null;
    }
    //# sourceMappingURL=index.js.map

    function injectNativeEvents(instance) {
        HTML_ELEMENT_NATIVE_EVENTS.map(function (eventName) {
            instance.el.addEventListener(eventName, function (event) {
                instance.$emit(eventName, event);
            });
        });
    }
    function injectEventsDelegator(instance) {
        var proxyObject = instance.config.proxyObject;
        if (!(proxyObject instanceof HTMLElement)) {
            return;
        }
        HTML_ELEMENT_NATIVE_EVENTS.map(function (eventName) {
            instance.el.addEventListener(eventName, function (e) {
                var event = new MouseEvent(eventName, {
                    view: window,
                    relatedTarget: proxyObject,
                    altKey: e.altKey,
                    button: e.button,
                    buttons: e.buttons,
                    clientX: e.clientX,
                    clientY: e.clientY,
                    ctrlKey: e.ctrlKey,
                    metaKey: e.metaKey,
                    movementX: e.movementX,
                    movementY: e.movementY,
                    screenX: e.screenX,
                    screenY: e.screenY,
                    shiftKey: e.shiftKey
                });
                proxyObject.dispatchEvent(event);
            });
        });
    }
    //# sourceMappingURL=index.js.map

    var CanvasStragy = {
        clear: function () {
            var _a = this.canvas, width = _a.width, height = _a.height;
            this._forEachManager(function (manager) { return manager.reset(); });
            this.ctx.clearRect(0, 0, width, height);
        },
        add: function (barrage, type) {
            if (type === void 0) { type = 'scroll'; }
            var text = barrage.text, color = barrage.color, size = barrage.size;
            var ctx = this.ctx;
            var fontSize = (size || this.config.fontSize) * this.config.zoom;
            var fontColor = color || this.config.fontColor;
            ctx.font = fontSize + "px 'Microsoft Yahei'";
            var width = ctx.measureText(text).width;
            if (type === 'scroll') {
                var barrageObject = {
                    text: text,
                    width: width,
                    color: fontColor,
                    size: fontSize,
                    speed: 0,
                    offset: 0
                };
                this.commanderMap[type].waitingQueue.push(barrageObject);
            }
            else {
                var barrageObject = {
                    text: text,
                    width: width,
                    color: fontColor,
                    size: fontSize,
                    duration: 0,
                    offset: 0
                };
                this.commanderMap[type].waitingQueue.push(barrageObject);
            }
        },
        _render: function () {
            var ctx = this.ctx;
            var canvas = this.canvas;
            ctx.shadowBlur = 2;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this._forEachManager(function (manager) { return manager.render(); });
            this.animation = requestAnimationFrame(this._render.bind(this));
        }
    };
    //# sourceMappingURL=canvas.js.map

    // import { createBarrage, appendChild } from '../helper/css';
    var Css3Stragy = {
        clear: function () { },
        add: function (barrage, type) {
            if (type === void 0) { type = 'scroll'; }
            var text = barrage.text, _a = barrage.color, color = _a === void 0 ? this.config.fontColor : _a, _b = barrage.size, size = _b === void 0 ? this.config.fontSize : _b;
            var fontColor = color;
            // const fontSize = size + 'px';
            var trackWidth = this.el.offsetWidth;
            // const posLeft = trackWidth + 'px';
            // const danmu = createBarrage(text, fontColor, fontSize, posLeft);
            // appendChild(this.el, danmu);
            // const width = danmu.offsetWidth;
            if (type === 'scroll') {
                var barrageObject = {
                    text: text,
                    width: 0,
                    color: fontColor,
                    size: size,
                    speed: 0,
                    offset: trackWidth
                };
                // (this.commanderMap[type] as RollingCssCommander).objToElm.set(barrageObject, danmu);
                this.commanderMap[type].waitingQueue.push(barrageObject);
            }
        },
        _render: function () {
            this._forEachManager(function (manager) { return manager.render(); });
            this.animation = requestAnimationFrame$1(this._render.bind(this));
        }
    };
    //# sourceMappingURL=css3.js.map

    function getHandler(engine, fn) {
        var fnMap = engine === 'canvas' ? CanvasStragy : Css3Stragy;
        return fnMap[fn];
    }
    //# sourceMappingURL=index.js.map

    var defaultConfig = {
        engine: 'canvas',
        zoom: 1,
        proxyObject: null,
        usePointerEvents: true,
        maxTrack: 4,
        fontSize: 20,
        fontColor: '#fff',
        duration: 10000,
        trackHeight: 20 * 1.5
    };
    var BarrageMaker = /** @class */ (function (_super) {
        __extends(BarrageMaker, _super);
        function BarrageMaker(el, config) {
            var _this = _super.call(this) || this;
            _this.canvas = null;
            _this.ctx = null;
            _this.animation = null;
            _this.config = deepMerge(defaultConfig, config || {});
            _this.el = getEl(el, _this.config.engine);
            if (isCanvas(_this.el)) {
                _this.canvas = _this.el;
                _this.ctx = _this.canvas.getContext('2d');
            }
            // 兼容性：IE11+ / 非IE基本全支持
            // pointer-events 避免上层canvas阻碍下层点击
            if (_this.config.usePointerEvents) {
                _this.el.style.pointerEvents = 'none';
            }
            // 获取渲染引擎
            var renderEngine = getEngine(_this.config.engine);
            var commanderConfig = {
                trackWidth: _this.el.offsetWidth,
                trackHeight: _this.config.trackHeight,
                maxTrack: _this.config.maxTrack,
                duration: _this.config.duration
            };
            var rootEle = _this.config.engine === 'canvas' ? _this.canvas : _this.el;
            _this.commanderMap = {
                scroll: new renderEngine.RollingCommander(rootEle, commanderConfig),
                'fixed-top': new renderEngine.FixedTopCommander(rootEle, commanderConfig),
                'fixed-bottom': new renderEngine.FixedBottomCommander(rootEle, commanderConfig)
            };
            _this.resize();
            // 注入事件控制逻辑
            injectNativeEvents(_this);
            injectEventsDelegator(_this);
            return _this;
        }
        BarrageMaker.prototype.resize = function (width) {
            width = width || this.el.offsetWidth;
            this._forEachManager(function (manager) { return manager.resize(width); });
        };
        BarrageMaker.prototype.clear = function () {
            var fn = getHandler(this.config.engine, 'clear');
            return fn.call(this);
        };
        BarrageMaker.prototype.setOpacity = function (opacity) {
            if (opacity === void 0) { opacity = 1; }
            this.el.style.opacity = "" + opacity;
        };
        BarrageMaker.prototype.setFontSize = function (zoom) {
            if (zoom === void 0) { zoom = 1; }
            this.config.zoom = zoom;
        };
        BarrageMaker.prototype.add = function (barrage, type) {
            if (type === void 0) { type = 'scroll'; }
            var fn = getHandler(this.config.engine, 'add');
            return fn.call(this, barrage, type);
        };
        BarrageMaker.prototype.start = function () {
            if (this.animation) {
                return;
            }
            this.animation = requestAnimationFrame$1(this._render.bind(this));
        };
        BarrageMaker.prototype.stop = function () {
            if (!this.animation) {
                return;
            }
            cancelAnimationFrame(this.animation);
            this.animation = null;
        };
        BarrageMaker.prototype._forEachManager = function (handler) {
            var _this = this;
            Object.keys(this.commanderMap).forEach(function (key) {
                return handler.call(_this, _this.commanderMap[key]);
            });
        };
        BarrageMaker.prototype._render = function () {
            var fn = getHandler(this.config.engine, '_render');
            return fn.call(this);
        };
        return BarrageMaker;
    }(EventEmitter));
    //# sourceMappingURL=a-barrage.js.map

    return BarrageMaker;

})));
//# sourceMappingURL=barrage.umd.js.map
