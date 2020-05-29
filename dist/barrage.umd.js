(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.aBarrage = factory());
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
    function getEl(el) {
        if (el instanceof HTMLElement) {
            return el;
        }
        return document.querySelector(el);
    }
    var requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame;
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

    var HTML_ELEMENT_NATIVE_EVENTS = 'click,dblclick,mousedown,mousemove,mouseout,mouseover,mouseup'.split(',');
    var BARRAGE_TYPE = {
        SCROLL: 'scroll',
        FIXED_TOP: 'fixed-top',
        FIXED_BOTTOM: 'fixed-bottom'
    };
    var TIME_PER_FRAME = 16.6;

    var scrollStragies = {
        add: function (barrage) {
            var trackId = this._findMatchestTrack();
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
        },
        find: function () {
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
        },
        push: function () {
            var isIntered;
            for (var i = 0; i < this.waitingQueue.length;) {
                isIntered = this.add(this.waitingQueue[i]);
                if (!isIntered) {
                    break;
                }
                this.waitingQueue.shift();
            }
        },
        render: function () {
            this._pushBarrage();
            var ctx = this.context;
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
        }
    };

    var fixedStragies = {
        add: function (barrage) {
            var trackId = this._findMatchestTrack();
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
        },
        find: function () {
            var idx = -1;
            for (var i = 0; i < this.tracks.length; ++i) {
                if (isEmptyArray(this.tracks[i].barrages)) {
                    idx = i;
                    break;
                }
            }
            return idx;
        },
        renderTop: function () {
            this._pushBarrage();
            var ctx = this.context;
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
        },
        renderBottom: function () {
            this._pushBarrage();
            var ctx = this.context;
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
        }
    };

    var globalStragies = {
        push: function () {
            var isIntered;
            for (var i = 0; i < this.waitingQueue.length;) {
                isIntered = this.add(this.waitingQueue[i]);
                if (!isIntered) {
                    break;
                }
                this.waitingQueue.shift();
            }
        }
    };

    var _a, _b, _c, _d;
    var addBarrageStragy = (_a = {},
        _a[BARRAGE_TYPE.SCROLL] = scrollStragies.add,
        _a[BARRAGE_TYPE.FIXED_TOP] = fixedStragies.add,
        _a[BARRAGE_TYPE.FIXED_BOTTOM] = fixedStragies.add,
        _a);
    var findTrackStragy = (_b = {},
        _b[BARRAGE_TYPE.SCROLL] = scrollStragies.find,
        _b[BARRAGE_TYPE.FIXED_TOP] = fixedStragies.find,
        _b[BARRAGE_TYPE.FIXED_BOTTOM] = fixedStragies.find,
        _b);
    var pushBarrageStragy = (_c = {},
        _c[BARRAGE_TYPE.SCROLL] = globalStragies.push,
        _c[BARRAGE_TYPE.FIXED_BOTTOM] = globalStragies.push,
        _c[BARRAGE_TYPE.FIXED_TOP] = globalStragies.push,
        _c);
    var renderBarrageStragy = (_d = {},
        _d[BARRAGE_TYPE.SCROLL] = scrollStragies.render,
        _d[BARRAGE_TYPE.FIXED_TOP] = fixedStragies.renderTop,
        _d[BARRAGE_TYPE.FIXED_BOTTOM] = fixedStragies.renderBottom,
        _d);

    function createCommonjsModule(fn, module) {
    	return module = { exports: {} }, fn(module, module.exports), module.exports;
    }

    var isBuffer = function isBuffer(arg) {
      return arg instanceof Buffer;
    };

    var inherits_browser = createCommonjsModule(function (module) {
    if (typeof Object.create === 'function') {
      // implementation from standard node.js 'util' module
      module.exports = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      };
    } else {
      // old school shim for old browsers
      module.exports = function inherits(ctor, superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function () {};
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      };
    }
    });

    var inherits = createCommonjsModule(function (module) {
    try {
      var util$$1 = util;
      if (typeof util$$1.inherits !== 'function') throw '';
      module.exports = util$$1.inherits;
    } catch (e) {
      module.exports = inherits_browser;
    }
    });

    var util = createCommonjsModule(function (module, exports) {
    // Copyright Joyent, Inc. and other Node contributors.
    //
    // Permission is hereby granted, free of charge, to any person obtaining a
    // copy of this software and associated documentation files (the
    // "Software"), to deal in the Software without restriction, including
    // without limitation the rights to use, copy, modify, merge, publish,
    // distribute, sublicense, and/or sell copies of the Software, and to permit
    // persons to whom the Software is furnished to do so, subject to the
    // following conditions:
    //
    // The above copyright notice and this permission notice shall be included
    // in all copies or substantial portions of the Software.
    //
    // THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
    // OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
    // MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
    // NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
    // DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
    // OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
    // USE OR OTHER DEALINGS IN THE SOFTWARE.

    var getOwnPropertyDescriptors = Object.getOwnPropertyDescriptors ||
      function getOwnPropertyDescriptors(obj) {
        var keys = Object.keys(obj);
        var descriptors = {};
        for (var i = 0; i < keys.length; i++) {
          descriptors[keys[i]] = Object.getOwnPropertyDescriptor(obj, keys[i]);
        }
        return descriptors;
      };

    var formatRegExp = /%[sdj%]/g;
    exports.format = function(f) {
      if (!isString(f)) {
        var objects = [];
        for (var i = 0; i < arguments.length; i++) {
          objects.push(inspect(arguments[i]));
        }
        return objects.join(' ');
      }

      var i = 1;
      var args = arguments;
      var len = args.length;
      var str = String(f).replace(formatRegExp, function(x) {
        if (x === '%%') return '%';
        if (i >= len) return x;
        switch (x) {
          case '%s': return String(args[i++]);
          case '%d': return Number(args[i++]);
          case '%j':
            try {
              return JSON.stringify(args[i++]);
            } catch (_) {
              return '[Circular]';
            }
          default:
            return x;
        }
      });
      for (var x = args[i]; i < len; x = args[++i]) {
        if (isNull(x) || !isObject(x)) {
          str += ' ' + x;
        } else {
          str += ' ' + inspect(x);
        }
      }
      return str;
    };


    // Mark that a method should not be used.
    // Returns a modified function which warns once by default.
    // If --no-deprecation is set, then it is a no-op.
    exports.deprecate = function(fn, msg) {
      if (typeof process !== 'undefined' && process.noDeprecation === true) {
        return fn;
      }

      // Allow for deprecating things in the process of starting up.
      if (typeof process === 'undefined') {
        return function() {
          return exports.deprecate(fn, msg).apply(this, arguments);
        };
      }

      var warned = false;
      function deprecated() {
        if (!warned) {
          if (process.throwDeprecation) {
            throw new Error(msg);
          } else if (process.traceDeprecation) {
            console.trace(msg);
          } else {
            console.error(msg);
          }
          warned = true;
        }
        return fn.apply(this, arguments);
      }

      return deprecated;
    };


    var debugs = {};
    var debugEnviron;
    exports.debuglog = function(set) {
      if (isUndefined(debugEnviron))
        debugEnviron = process.env.NODE_DEBUG || '';
      set = set.toUpperCase();
      if (!debugs[set]) {
        if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
          var pid = process.pid;
          debugs[set] = function() {
            var msg = exports.format.apply(exports, arguments);
            console.error('%s %d: %s', set, pid, msg);
          };
        } else {
          debugs[set] = function() {};
        }
      }
      return debugs[set];
    };


    /**
     * Echos the value of a value. Trys to print the value out
     * in the best way possible given the different types.
     *
     * @param {Object} obj The object to print out.
     * @param {Object} opts Optional options object that alters the output.
     */
    /* legacy: obj, showHidden, depth, colors*/
    function inspect(obj, opts) {
      // default options
      var ctx = {
        seen: [],
        stylize: stylizeNoColor
      };
      // legacy...
      if (arguments.length >= 3) ctx.depth = arguments[2];
      if (arguments.length >= 4) ctx.colors = arguments[3];
      if (isBoolean(opts)) {
        // legacy...
        ctx.showHidden = opts;
      } else if (opts) {
        // got an "options" object
        exports._extend(ctx, opts);
      }
      // set default options
      if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
      if (isUndefined(ctx.depth)) ctx.depth = 2;
      if (isUndefined(ctx.colors)) ctx.colors = false;
      if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
      if (ctx.colors) ctx.stylize = stylizeWithColor;
      return formatValue(ctx, obj, ctx.depth);
    }
    exports.inspect = inspect;


    // http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
    inspect.colors = {
      'bold' : [1, 22],
      'italic' : [3, 23],
      'underline' : [4, 24],
      'inverse' : [7, 27],
      'white' : [37, 39],
      'grey' : [90, 39],
      'black' : [30, 39],
      'blue' : [34, 39],
      'cyan' : [36, 39],
      'green' : [32, 39],
      'magenta' : [35, 39],
      'red' : [31, 39],
      'yellow' : [33, 39]
    };

    // Don't use 'blue' not visible on cmd.exe
    inspect.styles = {
      'special': 'cyan',
      'number': 'yellow',
      'boolean': 'yellow',
      'undefined': 'grey',
      'null': 'bold',
      'string': 'green',
      'date': 'magenta',
      // "name": intentionally not styling
      'regexp': 'red'
    };


    function stylizeWithColor(str, styleType) {
      var style = inspect.styles[styleType];

      if (style) {
        return '\u001b[' + inspect.colors[style][0] + 'm' + str +
               '\u001b[' + inspect.colors[style][1] + 'm';
      } else {
        return str;
      }
    }


    function stylizeNoColor(str, styleType) {
      return str;
    }


    function arrayToHash(array) {
      var hash = {};

      array.forEach(function(val, idx) {
        hash[val] = true;
      });

      return hash;
    }


    function formatValue(ctx, value, recurseTimes) {
      // Provide a hook for user-specified inspect functions.
      // Check that value is an object with an inspect function on it
      if (ctx.customInspect &&
          value &&
          isFunction(value.inspect) &&
          // Filter out the util module, it's inspect function is special
          value.inspect !== exports.inspect &&
          // Also filter out any prototype objects using the circular check.
          !(value.constructor && value.constructor.prototype === value)) {
        var ret = value.inspect(recurseTimes, ctx);
        if (!isString(ret)) {
          ret = formatValue(ctx, ret, recurseTimes);
        }
        return ret;
      }

      // Primitive types cannot have properties
      var primitive = formatPrimitive(ctx, value);
      if (primitive) {
        return primitive;
      }

      // Look up the keys of the object.
      var keys = Object.keys(value);
      var visibleKeys = arrayToHash(keys);

      if (ctx.showHidden) {
        keys = Object.getOwnPropertyNames(value);
      }

      // IE doesn't make error fields non-enumerable
      // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
      if (isError(value)
          && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
        return formatError(value);
      }

      // Some type of object without properties can be shortcutted.
      if (keys.length === 0) {
        if (isFunction(value)) {
          var name = value.name ? ': ' + value.name : '';
          return ctx.stylize('[Function' + name + ']', 'special');
        }
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
        }
        if (isDate(value)) {
          return ctx.stylize(Date.prototype.toString.call(value), 'date');
        }
        if (isError(value)) {
          return formatError(value);
        }
      }

      var base = '', array = false, braces = ['{', '}'];

      // Make Array say that they are Array
      if (isArray(value)) {
        array = true;
        braces = ['[', ']'];
      }

      // Make functions say that they are functions
      if (isFunction(value)) {
        var n = value.name ? ': ' + value.name : '';
        base = ' [Function' + n + ']';
      }

      // Make RegExps say that they are RegExps
      if (isRegExp(value)) {
        base = ' ' + RegExp.prototype.toString.call(value);
      }

      // Make dates with properties first say the date
      if (isDate(value)) {
        base = ' ' + Date.prototype.toUTCString.call(value);
      }

      // Make error with message first say the error
      if (isError(value)) {
        base = ' ' + formatError(value);
      }

      if (keys.length === 0 && (!array || value.length == 0)) {
        return braces[0] + base + braces[1];
      }

      if (recurseTimes < 0) {
        if (isRegExp(value)) {
          return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
        } else {
          return ctx.stylize('[Object]', 'special');
        }
      }

      ctx.seen.push(value);

      var output;
      if (array) {
        output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
      } else {
        output = keys.map(function(key) {
          return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
        });
      }

      ctx.seen.pop();

      return reduceToSingleString(output, base, braces);
    }


    function formatPrimitive(ctx, value) {
      if (isUndefined(value))
        return ctx.stylize('undefined', 'undefined');
      if (isString(value)) {
        var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
                                                 .replace(/'/g, "\\'")
                                                 .replace(/\\"/g, '"') + '\'';
        return ctx.stylize(simple, 'string');
      }
      if (isNumber(value))
        return ctx.stylize('' + value, 'number');
      if (isBoolean(value))
        return ctx.stylize('' + value, 'boolean');
      // For some reason typeof null is "object", so special case here.
      if (isNull(value))
        return ctx.stylize('null', 'null');
    }


    function formatError(value) {
      return '[' + Error.prototype.toString.call(value) + ']';
    }


    function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
      var output = [];
      for (var i = 0, l = value.length; i < l; ++i) {
        if (hasOwnProperty(value, String(i))) {
          output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
              String(i), true));
        } else {
          output.push('');
        }
      }
      keys.forEach(function(key) {
        if (!key.match(/^\d+$/)) {
          output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
              key, true));
        }
      });
      return output;
    }


    function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
      var name, str, desc;
      desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
      if (desc.get) {
        if (desc.set) {
          str = ctx.stylize('[Getter/Setter]', 'special');
        } else {
          str = ctx.stylize('[Getter]', 'special');
        }
      } else {
        if (desc.set) {
          str = ctx.stylize('[Setter]', 'special');
        }
      }
      if (!hasOwnProperty(visibleKeys, key)) {
        name = '[' + key + ']';
      }
      if (!str) {
        if (ctx.seen.indexOf(desc.value) < 0) {
          if (isNull(recurseTimes)) {
            str = formatValue(ctx, desc.value, null);
          } else {
            str = formatValue(ctx, desc.value, recurseTimes - 1);
          }
          if (str.indexOf('\n') > -1) {
            if (array) {
              str = str.split('\n').map(function(line) {
                return '  ' + line;
              }).join('\n').substr(2);
            } else {
              str = '\n' + str.split('\n').map(function(line) {
                return '   ' + line;
              }).join('\n');
            }
          }
        } else {
          str = ctx.stylize('[Circular]', 'special');
        }
      }
      if (isUndefined(name)) {
        if (array && key.match(/^\d+$/)) {
          return str;
        }
        name = JSON.stringify('' + key);
        if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
          name = name.substr(1, name.length - 2);
          name = ctx.stylize(name, 'name');
        } else {
          name = name.replace(/'/g, "\\'")
                     .replace(/\\"/g, '"')
                     .replace(/(^"|"$)/g, "'");
          name = ctx.stylize(name, 'string');
        }
      }

      return name + ': ' + str;
    }


    function reduceToSingleString(output, base, braces) {
      var length = output.reduce(function(prev, cur) {
        if (cur.indexOf('\n') >= 0) ;
        return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
      }, 0);

      if (length > 60) {
        return braces[0] +
               (base === '' ? '' : base + '\n ') +
               ' ' +
               output.join(',\n  ') +
               ' ' +
               braces[1];
      }

      return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
    }


    // NOTE: These type checking functions intentionally don't use `instanceof`
    // because it is fragile and can be easily faked with `Object.create()`.
    function isArray(ar) {
      return Array.isArray(ar);
    }
    exports.isArray = isArray;

    function isBoolean(arg) {
      return typeof arg === 'boolean';
    }
    exports.isBoolean = isBoolean;

    function isNull(arg) {
      return arg === null;
    }
    exports.isNull = isNull;

    function isNullOrUndefined(arg) {
      return arg == null;
    }
    exports.isNullOrUndefined = isNullOrUndefined;

    function isNumber(arg) {
      return typeof arg === 'number';
    }
    exports.isNumber = isNumber;

    function isString(arg) {
      return typeof arg === 'string';
    }
    exports.isString = isString;

    function isSymbol(arg) {
      return typeof arg === 'symbol';
    }
    exports.isSymbol = isSymbol;

    function isUndefined(arg) {
      return arg === void 0;
    }
    exports.isUndefined = isUndefined;

    function isRegExp(re) {
      return isObject(re) && objectToString(re) === '[object RegExp]';
    }
    exports.isRegExp = isRegExp;

    function isObject(arg) {
      return typeof arg === 'object' && arg !== null;
    }
    exports.isObject = isObject;

    function isDate(d) {
      return isObject(d) && objectToString(d) === '[object Date]';
    }
    exports.isDate = isDate;

    function isError(e) {
      return isObject(e) &&
          (objectToString(e) === '[object Error]' || e instanceof Error);
    }
    exports.isError = isError;

    function isFunction(arg) {
      return typeof arg === 'function';
    }
    exports.isFunction = isFunction;

    function isPrimitive(arg) {
      return arg === null ||
             typeof arg === 'boolean' ||
             typeof arg === 'number' ||
             typeof arg === 'string' ||
             typeof arg === 'symbol' ||  // ES6 symbol
             typeof arg === 'undefined';
    }
    exports.isPrimitive = isPrimitive;

    exports.isBuffer = isBuffer;

    function objectToString(o) {
      return Object.prototype.toString.call(o);
    }


    function pad(n) {
      return n < 10 ? '0' + n.toString(10) : n.toString(10);
    }


    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
                  'Oct', 'Nov', 'Dec'];

    // 26 Feb 16:19:34
    function timestamp() {
      var d = new Date();
      var time = [pad(d.getHours()),
                  pad(d.getMinutes()),
                  pad(d.getSeconds())].join(':');
      return [d.getDate(), months[d.getMonth()], time].join(' ');
    }


    // log is just a thin wrapper to console.log that prepends a timestamp
    exports.log = function() {
      console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
    };


    /**
     * Inherit the prototype methods from one constructor into another.
     *
     * The Function.prototype.inherits from lang.js rewritten as a standalone
     * function (not on Function.prototype). NOTE: If this file is to be loaded
     * during bootstrapping this function needs to be rewritten using some native
     * functions as prototype setup using normal JavaScript does not work as
     * expected during bootstrapping (see mirror.js in r114903).
     *
     * @param {function} ctor Constructor function which needs to inherit the
     *     prototype.
     * @param {function} superCtor Constructor function to inherit prototype from.
     */
    exports.inherits = inherits;

    exports._extend = function(origin, add) {
      // Don't do anything if add isn't an object
      if (!add || !isObject(add)) return origin;

      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin;
    };

    function hasOwnProperty(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    var kCustomPromisifiedSymbol = typeof Symbol !== 'undefined' ? Symbol('util.promisify.custom') : undefined;

    exports.promisify = function promisify(original) {
      if (typeof original !== 'function')
        throw new TypeError('The "original" argument must be of type Function');

      if (kCustomPromisifiedSymbol && original[kCustomPromisifiedSymbol]) {
        var fn = original[kCustomPromisifiedSymbol];
        if (typeof fn !== 'function') {
          throw new TypeError('The "util.promisify.custom" argument must be of type Function');
        }
        Object.defineProperty(fn, kCustomPromisifiedSymbol, {
          value: fn, enumerable: false, writable: false, configurable: true
        });
        return fn;
      }

      function fn() {
        var promiseResolve, promiseReject;
        var promise = new Promise(function (resolve, reject) {
          promiseResolve = resolve;
          promiseReject = reject;
        });

        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }
        args.push(function (err, value) {
          if (err) {
            promiseReject(err);
          } else {
            promiseResolve(value);
          }
        });

        try {
          original.apply(this, args);
        } catch (err) {
          promiseReject(err);
        }

        return promise;
      }

      Object.setPrototypeOf(fn, Object.getPrototypeOf(original));

      if (kCustomPromisifiedSymbol) Object.defineProperty(fn, kCustomPromisifiedSymbol, {
        value: fn, enumerable: false, writable: false, configurable: true
      });
      return Object.defineProperties(
        fn,
        getOwnPropertyDescriptors(original)
      );
    };

    exports.promisify.custom = kCustomPromisifiedSymbol;

    function callbackifyOnRejected(reason, cb) {
      // `!reason` guard inspired by bluebird (Ref: https://goo.gl/t5IS6M).
      // Because `null` is a special error value in callbacks which means "no error
      // occurred", we error-wrap so the callback consumer can distinguish between
      // "the promise rejected with null" or "the promise fulfilled with undefined".
      if (!reason) {
        var newReason = new Error('Promise was rejected with a falsy value');
        newReason.reason = reason;
        reason = newReason;
      }
      return cb(reason);
    }

    function callbackify(original) {
      if (typeof original !== 'function') {
        throw new TypeError('The "original" argument must be of type Function');
      }

      // We DO NOT return the promise as it gives the user a false sense that
      // the promise is actually somehow related to the callback's execution
      // and that the callback throwing will reject the promise.
      function callbackified() {
        var args = [];
        for (var i = 0; i < arguments.length; i++) {
          args.push(arguments[i]);
        }

        var maybeCb = args.pop();
        if (typeof maybeCb !== 'function') {
          throw new TypeError('The last argument must be of type Function');
        }
        var self = this;
        var cb = function() {
          return maybeCb.apply(self, arguments);
        };
        // In true node style we process the callback on `nextTick` with all the
        // implications (stack, `uncaughtException`, `async_hooks`)
        original.apply(this, args)
          .then(function(ret) { process.nextTick(cb, null, ret); },
                function(rej) { process.nextTick(callbackifyOnRejected, rej, cb); });
      }

      Object.setPrototypeOf(callbackified, Object.getPrototypeOf(original));
      Object.defineProperties(callbackified,
                              getOwnPropertyDescriptors(original));
      return callbackified;
    }
    exports.callbackify = callbackify;
    });
    var util_1 = util.format;
    var util_2 = util.deprecate;
    var util_3 = util.debuglog;
    var util_4 = util.inspect;
    var util_5 = util.isArray;
    var util_6 = util.isBoolean;
    var util_7 = util.isNull;
    var util_8 = util.isNullOrUndefined;
    var util_9 = util.isNumber;
    var util_10 = util.isString;
    var util_11 = util.isSymbol;
    var util_12 = util.isUndefined;
    var util_13 = util.isRegExp;
    var util_14 = util.isObject;
    var util_15 = util.isDate;
    var util_16 = util.isError;
    var util_17 = util.isFunction;
    var util_18 = util.isPrimitive;
    var util_19 = util.isBuffer;
    var util_20 = util.log;
    var util_21 = util.inherits;
    var util_22 = util._extend;
    var util_23 = util.promisify;
    var util_24 = util.callbackify;

    var TrackManager = /** @class */ (function () {
        function TrackManager(canvas, config) {
            this.tracks = [];
            this.waitingQueue = [];
            this.canvas = canvas;
            this.context = canvas.getContext('2d');
            var trackWidth = config.trackWidth, trackHeight = config.trackHeight, duration = config.duration, numbersOfTrack = config.numbersOfTrack, type = config.type;
            this.trackHeight = trackHeight;
            this.trackWidth = trackWidth;
            this.duration = duration;
            this.type = type;
            for (var i = 0; i < numbersOfTrack; ++i) {
                this.tracks[i] = new BarrageTrack();
            }
        }
        TrackManager.prototype.forEach = function (handler) {
            for (var i = 0; i < this.tracks.length; ++i) {
                handler(this.tracks[i], i, this.tracks);
            }
        };
        TrackManager.prototype.add = function (barrage) {
            var fn = addBarrageStragy[this.type];
            return util_17(fn) && fn.call(this, barrage);
        };
        TrackManager.prototype._findMatchestTrack = function () {
            var fn = findTrackStragy[this.type];
            return util_17(fn) ? fn.call(this) : -1;
        };
        TrackManager.prototype._pushBarrage = function () {
            var fn = pushBarrageStragy[this.type];
            return util_17(fn) ? fn.call(this) : false;
        };
        TrackManager.prototype.render = function () {
            var fn = renderBarrageStragy[this.type];
            util_17(fn) && fn.call(this);
        };
        Object.defineProperty(TrackManager.prototype, "_defaultSpeed", {
            get: function () {
                return (this.trackWidth / this.duration) * TIME_PER_FRAME;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(TrackManager.prototype, "_randomSpeed", {
            get: function () {
                return 0.8 + Math.random() * 1.3;
            },
            enumerable: false,
            configurable: true
        });
        TrackManager.prototype.reset = function () {
            this.forEach(function (track) { return track.reset(); });
        };
        TrackManager.prototype.resize = function (trackWidth, trackHeight) {
            if (trackWidth) {
                this.trackWidth = trackWidth;
            }
            if (trackHeight) {
                this.trackHeight = trackHeight;
            }
        };
        return TrackManager;
    }());

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

    var defaultConfig = {
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
            _this.animation = null;
            var canvas = getEl(el);
            if (!canvas) {
                throw new Error('wrapper is not a HTMLElement');
            }
            if (!(canvas instanceof HTMLCanvasElement)) {
                throw new Error('el must be a HTMLCanvasElement!');
            }
            _this.canvas = canvas;
            _this.ctx = _this.canvas.getContext('2d');
            _this.config = deepMerge(defaultConfig, config || {});
            // 兼容性：IE11+ / 非IE基本全支持
            // pointer-events 避免上层canvas阻碍下层点击
            if (_this.config.usePointerEvents) {
                _this.canvas.style.pointerEvents = 'none';
            }
            _this.trackManagerMap = {
                scroll: new TrackManager(_this.canvas, {
                    trackWidth: _this.canvas.width,
                    trackHeight: _this.config.trackHeight,
                    numbersOfTrack: _this.config.maxTrack,
                    duration: _this.config.duration,
                    type: 'scroll'
                }),
                'fixed-top': new TrackManager(_this.canvas, {
                    trackWidth: _this.canvas.width,
                    trackHeight: _this.config.trackHeight,
                    numbersOfTrack: _this.config.maxTrack,
                    duration: _this.config.duration,
                    type: 'fixed-top'
                }),
                'fixed-bottom': new TrackManager(_this.canvas, {
                    trackWidth: _this.canvas.width,
                    trackHeight: _this.config.trackHeight,
                    numbersOfTrack: _this.config.maxTrack,
                    duration: _this.config.duration,
                    type: 'fixed-bottom'
                })
            };
            _this.resize();
            _this._bindNativeEvents();
            _this._delegateEvents();
            return _this;
        }
        BarrageMaker.prototype.resize = function (width) {
            width = width || this.canvas.width;
            this._forEachManager(function (manager) { return manager.resize(width); });
        };
        BarrageMaker.prototype.clear = function () {
            var _a = this.canvas, width = _a.width, height = _a.height;
            this._forEachManager(function (manager) { return manager.reset(); });
            this.ctx.clearRect(0, 0, width, height);
        };
        BarrageMaker.prototype.setOpacity = function (opacity) {
            if (opacity === void 0) { opacity = 1; }
            this.canvas.style.opacity = "" + opacity;
        };
        BarrageMaker.prototype.setFontSize = function (zoom) {
            if (zoom === void 0) { zoom = 1; }
            this.config.zoom = zoom;
        };
        BarrageMaker.prototype.add = function (barrage, type) {
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
                this.trackManagerMap[type].waitingQueue.push(barrageObject);
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
                this.trackManagerMap[type].waitingQueue.push(barrageObject);
            }
        };
        BarrageMaker.prototype.start = function () {
            if (this.animation) {
                return;
            }
            this.animation = requestAnimationFrame(this._render.bind(this));
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
            Object.keys(this.trackManagerMap).forEach(function (key) {
                return handler.call(_this, _this.trackManagerMap[key]);
            });
        };
        BarrageMaker.prototype._render = function () {
            var ctx = this.ctx;
            ctx.shadowBlur = 2;
            ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this._forEachManager(function (manager) { return manager.render(); });
            this.animation = requestAnimationFrame(this._render.bind(this));
        };
        BarrageMaker.prototype._bindNativeEvents = function () {
            var _this = this;
            HTML_ELEMENT_NATIVE_EVENTS.map(function (eventName) {
                _this.canvas.addEventListener(eventName, function (event) {
                    _this.$emit(eventName, event);
                });
            });
        };
        BarrageMaker.prototype._delegateEvents = function () {
            var _this = this;
            var proxyObject = this.config.proxyObject;
            if (!(proxyObject instanceof HTMLElement)) {
                return;
            }
            HTML_ELEMENT_NATIVE_EVENTS.map(function (eventName) {
                _this.canvas.addEventListener(eventName, function (e) {
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
        };
        return BarrageMaker;
    }(EventEmitter));

    return BarrageMaker;

})));
//# sourceMappingURL=barrage.umd.js.map
