(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
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

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],3:[function(require,module,exports){
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

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],4:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":2,"./encode":3}],5:[function(require,module,exports){
module.exports = require('./vendor/dat.gui')
module.exports.color = require('./vendor/dat.color')
},{"./vendor/dat.color":6,"./vendor/dat.gui":7}],6:[function(require,module,exports){
/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/** @namespace */
var dat = module.exports = dat || {};

/** @namespace */
dat.color = dat.color || {};

/** @namespace */
dat.utils = dat.utils || {};

dat.utils.common = (function () {
  
  var ARR_EACH = Array.prototype.forEach;
  var ARR_SLICE = Array.prototype.slice;

  /**
   * Band-aid methods for things that should be a lot easier in JavaScript.
   * Implementation and structure inspired by underscore.js
   * http://documentcloud.github.com/underscore/
   */

  return { 
    
    BREAK: {},
  
    extend: function(target) {
      
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        
        for (var key in obj)
          if (!this.isUndefined(obj[key])) 
            target[key] = obj[key];
        
      }, this);
      
      return target;
      
    },
    
    defaults: function(target) {
      
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        
        for (var key in obj)
          if (this.isUndefined(target[key])) 
            target[key] = obj[key];
        
      }, this);
      
      return target;
    
    },
    
    compose: function() {
      var toCall = ARR_SLICE.call(arguments);
            return function() {
              var args = ARR_SLICE.call(arguments);
              for (var i = toCall.length -1; i >= 0; i--) {
                args = [toCall[i].apply(this, args)];
              }
              return args[0];
            }
    },
    
    each: function(obj, itr, scope) {

      
      if (ARR_EACH && obj.forEach === ARR_EACH) { 
        
        obj.forEach(itr, scope);
        
      } else if (obj.length === obj.length + 0) { // Is number but not NaN
        
        for (var key = 0, l = obj.length; key < l; key++)
          if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) 
            return;
            
      } else {

        for (var key in obj) 
          if (itr.call(scope, obj[key], key) === this.BREAK)
            return;
            
      }
            
    },
    
    defer: function(fnc) {
      setTimeout(fnc, 0);
    },
    
    toArray: function(obj) {
      if (obj.toArray) return obj.toArray();
      return ARR_SLICE.call(obj);
    },

    isUndefined: function(obj) {
      return obj === undefined;
    },
    
    isNull: function(obj) {
      return obj === null;
    },
    
    isNaN: function(obj) {
      return obj !== obj;
    },
    
    isArray: Array.isArray || function(obj) {
      return obj.constructor === Array;
    },
    
    isObject: function(obj) {
      return obj === Object(obj);
    },
    
    isNumber: function(obj) {
      return obj === obj+0;
    },
    
    isString: function(obj) {
      return obj === obj+'';
    },
    
    isBoolean: function(obj) {
      return obj === false || obj === true;
    },
    
    isFunction: function(obj) {
      return Object.prototype.toString.call(obj) === '[object Function]';
    }
  
  };
    
})();


dat.color.toString = (function (common) {

  return function(color) {

    if (color.a == 1 || common.isUndefined(color.a)) {

      var s = color.hex.toString(16);
      while (s.length < 6) {
        s = '0' + s;
      }

      return '#' + s;

    } else {

      return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';

    }

  }

})(dat.utils.common);


dat.Color = dat.color.Color = (function (interpret, math, toString, common) {

  var Color = function() {

    this.__state = interpret.apply(this, arguments);

    if (this.__state === false) {
      throw 'Failed to interpret color arguments';
    }

    this.__state.a = this.__state.a || 1;


  };

  Color.COMPONENTS = ['r','g','b','h','s','v','hex','a'];

  common.extend(Color.prototype, {

    toString: function() {
      return toString(this);
    },

    toOriginal: function() {
      return this.__state.conversion.write(this);
    }

  });

  defineRGBComponent(Color.prototype, 'r', 2);
  defineRGBComponent(Color.prototype, 'g', 1);
  defineRGBComponent(Color.prototype, 'b', 0);

  defineHSVComponent(Color.prototype, 'h');
  defineHSVComponent(Color.prototype, 's');
  defineHSVComponent(Color.prototype, 'v');

  Object.defineProperty(Color.prototype, 'a', {

    get: function() {
      return this.__state.a;
    },

    set: function(v) {
      this.__state.a = v;
    }

  });

  Object.defineProperty(Color.prototype, 'hex', {

    get: function() {

      if (!this.__state.space !== 'HEX') {
        this.__state.hex = math.rgb_to_hex(this.r, this.g, this.b);
      }

      return this.__state.hex;

    },

    set: function(v) {

      this.__state.space = 'HEX';
      this.__state.hex = v;

    }

  });

  function defineRGBComponent(target, component, componentHexIndex) {

    Object.defineProperty(target, component, {

      get: function() {

        if (this.__state.space === 'RGB') {
          return this.__state[component];
        }

        recalculateRGB(this, component, componentHexIndex);

        return this.__state[component];

      },

      set: function(v) {

        if (this.__state.space !== 'RGB') {
          recalculateRGB(this, component, componentHexIndex);
          this.__state.space = 'RGB';
        }

        this.__state[component] = v;

      }

    });

  }

  function defineHSVComponent(target, component) {

    Object.defineProperty(target, component, {

      get: function() {

        if (this.__state.space === 'HSV')
          return this.__state[component];

        recalculateHSV(this);

        return this.__state[component];

      },

      set: function(v) {

        if (this.__state.space !== 'HSV') {
          recalculateHSV(this);
          this.__state.space = 'HSV';
        }

        this.__state[component] = v;

      }

    });

  }

  function recalculateRGB(color, component, componentHexIndex) {

    if (color.__state.space === 'HEX') {

      color.__state[component] = math.component_from_hex(color.__state.hex, componentHexIndex);

    } else if (color.__state.space === 'HSV') {

      common.extend(color.__state, math.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));

    } else {

      throw 'Corrupted color state';

    }

  }

  function recalculateHSV(color) {

    var result = math.rgb_to_hsv(color.r, color.g, color.b);

    common.extend(color.__state,
        {
          s: result.s,
          v: result.v
        }
    );

    if (!common.isNaN(result.h)) {
      color.__state.h = result.h;
    } else if (common.isUndefined(color.__state.h)) {
      color.__state.h = 0;
    }

  }

  return Color;

})(dat.color.interpret = (function (toString, common) {

  var result, toReturn;

  var interpret = function() {

    toReturn = false;

    var original = arguments.length > 1 ? common.toArray(arguments) : arguments[0];

    common.each(INTERPRETATIONS, function(family) {

      if (family.litmus(original)) {

        common.each(family.conversions, function(conversion, conversionName) {

          result = conversion.read(original);

          if (toReturn === false && result !== false) {
            toReturn = result;
            result.conversionName = conversionName;
            result.conversion = conversion;
            return common.BREAK;

          }

        });

        return common.BREAK;

      }

    });

    return toReturn;

  };

  var INTERPRETATIONS = [

    // Strings
    {

      litmus: common.isString,

      conversions: {

        THREE_CHAR_HEX: {

          read: function(original) {

            var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
            if (test === null) return false;

            return {
              space: 'HEX',
              hex: parseInt(
                  '0x' +
                      test[1].toString() + test[1].toString() +
                      test[2].toString() + test[2].toString() +
                      test[3].toString() + test[3].toString())
            };

          },

          write: toString

        },

        SIX_CHAR_HEX: {

          read: function(original) {

            var test = original.match(/^#([A-F0-9]{6})$/i);
            if (test === null) return false;

            return {
              space: 'HEX',
              hex: parseInt('0x' + test[1].toString())
            };

          },

          write: toString

        },

        CSS_RGB: {

          read: function(original) {

            var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
            if (test === null) return false;

            return {
              space: 'RGB',
              r: parseFloat(test[1]),
              g: parseFloat(test[2]),
              b: parseFloat(test[3])
            };

          },

          write: toString

        },

        CSS_RGBA: {

          read: function(original) {

            var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
            if (test === null) return false;

            return {
              space: 'RGB',
              r: parseFloat(test[1]),
              g: parseFloat(test[2]),
              b: parseFloat(test[3]),
              a: parseFloat(test[4])
            };

          },

          write: toString

        }

      }

    },

    // Numbers
    {

      litmus: common.isNumber,

      conversions: {

        HEX: {
          read: function(original) {
            return {
              space: 'HEX',
              hex: original,
              conversionName: 'HEX'
            }
          },

          write: function(color) {
            return color.hex;
          }
        }

      }

    },

    // Arrays
    {

      litmus: common.isArray,

      conversions: {

        RGB_ARRAY: {
          read: function(original) {
            if (original.length != 3) return false;
            return {
              space: 'RGB',
              r: original[0],
              g: original[1],
              b: original[2]
            };
          },

          write: function(color) {
            return [color.r, color.g, color.b];
          }

        },

        RGBA_ARRAY: {
          read: function(original) {
            if (original.length != 4) return false;
            return {
              space: 'RGB',
              r: original[0],
              g: original[1],
              b: original[2],
              a: original[3]
            };
          },

          write: function(color) {
            return [color.r, color.g, color.b, color.a];
          }

        }

      }

    },

    // Objects
    {

      litmus: common.isObject,

      conversions: {

        RGBA_OBJ: {
          read: function(original) {
            if (common.isNumber(original.r) &&
                common.isNumber(original.g) &&
                common.isNumber(original.b) &&
                common.isNumber(original.a)) {
              return {
                space: 'RGB',
                r: original.r,
                g: original.g,
                b: original.b,
                a: original.a
              }
            }
            return false;
          },

          write: function(color) {
            return {
              r: color.r,
              g: color.g,
              b: color.b,
              a: color.a
            }
          }
        },

        RGB_OBJ: {
          read: function(original) {
            if (common.isNumber(original.r) &&
                common.isNumber(original.g) &&
                common.isNumber(original.b)) {
              return {
                space: 'RGB',
                r: original.r,
                g: original.g,
                b: original.b
              }
            }
            return false;
          },

          write: function(color) {
            return {
              r: color.r,
              g: color.g,
              b: color.b
            }
          }
        },

        HSVA_OBJ: {
          read: function(original) {
            if (common.isNumber(original.h) &&
                common.isNumber(original.s) &&
                common.isNumber(original.v) &&
                common.isNumber(original.a)) {
              return {
                space: 'HSV',
                h: original.h,
                s: original.s,
                v: original.v,
                a: original.a
              }
            }
            return false;
          },

          write: function(color) {
            return {
              h: color.h,
              s: color.s,
              v: color.v,
              a: color.a
            }
          }
        },

        HSV_OBJ: {
          read: function(original) {
            if (common.isNumber(original.h) &&
                common.isNumber(original.s) &&
                common.isNumber(original.v)) {
              return {
                space: 'HSV',
                h: original.h,
                s: original.s,
                v: original.v
              }
            }
            return false;
          },

          write: function(color) {
            return {
              h: color.h,
              s: color.s,
              v: color.v
            }
          }

        }

      }

    }


  ];

  return interpret;


})(dat.color.toString,
dat.utils.common),
dat.color.math = (function () {

  var tmpComponent;

  return {

    hsv_to_rgb: function(h, s, v) {

      var hi = Math.floor(h / 60) % 6;

      var f = h / 60 - Math.floor(h / 60);
      var p = v * (1.0 - s);
      var q = v * (1.0 - (f * s));
      var t = v * (1.0 - ((1.0 - f) * s));
      var c = [
        [v, t, p],
        [q, v, p],
        [p, v, t],
        [p, q, v],
        [t, p, v],
        [v, p, q]
      ][hi];

      return {
        r: c[0] * 255,
        g: c[1] * 255,
        b: c[2] * 255
      };

    },

    rgb_to_hsv: function(r, g, b) {

      var min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h, s;

      if (max != 0) {
        s = delta / max;
      } else {
        return {
          h: NaN,
          s: 0,
          v: 0
        };
      }

      if (r == max) {
        h = (g - b) / delta;
      } else if (g == max) {
        h = 2 + (b - r) / delta;
      } else {
        h = 4 + (r - g) / delta;
      }
      h /= 6;
      if (h < 0) {
        h += 1;
      }

      return {
        h: h * 360,
        s: s,
        v: max / 255
      };
    },

    rgb_to_hex: function(r, g, b) {
      var hex = this.hex_with_component(0, 2, r);
      hex = this.hex_with_component(hex, 1, g);
      hex = this.hex_with_component(hex, 0, b);
      return hex;
    },

    component_from_hex: function(hex, componentIndex) {
      return (hex >> (componentIndex * 8)) & 0xFF;
    },

    hex_with_component: function(hex, componentIndex, value) {
      return value << (tmpComponent = componentIndex * 8) | (hex & ~ (0xFF << tmpComponent));
    }

  }

})(),
dat.color.toString,
dat.utils.common);
},{}],7:[function(require,module,exports){
/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

/** @namespace */
var dat = module.exports = dat || {};

/** @namespace */
dat.gui = dat.gui || {};

/** @namespace */
dat.utils = dat.utils || {};

/** @namespace */
dat.controllers = dat.controllers || {};

/** @namespace */
dat.dom = dat.dom || {};

/** @namespace */
dat.color = dat.color || {};

dat.utils.css = (function () {
  return {
    load: function (url, doc) {
      doc = doc || document;
      var link = doc.createElement('link');
      link.type = 'text/css';
      link.rel = 'stylesheet';
      link.href = url;
      doc.getElementsByTagName('head')[0].appendChild(link);
    },
    inject: function(css, doc) {
      doc = doc || document;
      var injected = document.createElement('style');
      injected.type = 'text/css';
      injected.innerHTML = css;
      doc.getElementsByTagName('head')[0].appendChild(injected);
    }
  }
})();


dat.utils.common = (function () {
  
  var ARR_EACH = Array.prototype.forEach;
  var ARR_SLICE = Array.prototype.slice;

  /**
   * Band-aid methods for things that should be a lot easier in JavaScript.
   * Implementation and structure inspired by underscore.js
   * http://documentcloud.github.com/underscore/
   */

  return { 
    
    BREAK: {},
  
    extend: function(target) {
      
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        
        for (var key in obj)
          if (!this.isUndefined(obj[key])) 
            target[key] = obj[key];
        
      }, this);
      
      return target;
      
    },
    
    defaults: function(target) {
      
      this.each(ARR_SLICE.call(arguments, 1), function(obj) {
        
        for (var key in obj)
          if (this.isUndefined(target[key])) 
            target[key] = obj[key];
        
      }, this);
      
      return target;
    
    },
    
    compose: function() {
      var toCall = ARR_SLICE.call(arguments);
            return function() {
              var args = ARR_SLICE.call(arguments);
              for (var i = toCall.length -1; i >= 0; i--) {
                args = [toCall[i].apply(this, args)];
              }
              return args[0];
            }
    },
    
    each: function(obj, itr, scope) {

      
      if (ARR_EACH && obj.forEach === ARR_EACH) { 
        
        obj.forEach(itr, scope);
        
      } else if (obj.length === obj.length + 0) { // Is number but not NaN
        
        for (var key = 0, l = obj.length; key < l; key++)
          if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) 
            return;
            
      } else {

        for (var key in obj) 
          if (itr.call(scope, obj[key], key) === this.BREAK)
            return;
            
      }
            
    },
    
    defer: function(fnc) {
      setTimeout(fnc, 0);
    },
    
    toArray: function(obj) {
      if (obj.toArray) return obj.toArray();
      return ARR_SLICE.call(obj);
    },

    isUndefined: function(obj) {
      return obj === undefined;
    },
    
    isNull: function(obj) {
      return obj === null;
    },
    
    isNaN: function(obj) {
      return obj !== obj;
    },
    
    isArray: Array.isArray || function(obj) {
      return obj.constructor === Array;
    },
    
    isObject: function(obj) {
      return obj === Object(obj);
    },
    
    isNumber: function(obj) {
      return obj === obj+0;
    },
    
    isString: function(obj) {
      return obj === obj+'';
    },
    
    isBoolean: function(obj) {
      return obj === false || obj === true;
    },
    
    isFunction: function(obj) {
      return Object.prototype.toString.call(obj) === '[object Function]';
    }
  
  };
    
})();


dat.controllers.Controller = (function (common) {

  /**
   * @class An "abstract" class that represents a given property of an object.
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var Controller = function(object, property) {

    this.initialValue = object[property];

    /**
     * Those who extend this class will put their DOM elements in here.
     * @type {DOMElement}
     */
    this.domElement = document.createElement('div');

    /**
     * The object to manipulate
     * @type {Object}
     */
    this.object = object;

    /**
     * The name of the property to manipulate
     * @type {String}
     */
    this.property = property;

    /**
     * The function to be called on change.
     * @type {Function}
     * @ignore
     */
    this.__onChange = undefined;

    /**
     * The function to be called on finishing change.
     * @type {Function}
     * @ignore
     */
    this.__onFinishChange = undefined;

  };

  common.extend(

      Controller.prototype,

      /** @lends dat.controllers.Controller.prototype */
      {

        /**
         * Specify that a function fire every time someone changes the value with
         * this Controller.
         *
         * @param {Function} fnc This function will be called whenever the value
         * is modified via this Controller.
         * @returns {dat.controllers.Controller} this
         */
        onChange: function(fnc) {
          this.__onChange = fnc;
          return this;
        },

        /**
         * Specify that a function fire every time someone "finishes" changing
         * the value wih this Controller. Useful for values that change
         * incrementally like numbers or strings.
         *
         * @param {Function} fnc This function will be called whenever
         * someone "finishes" changing the value via this Controller.
         * @returns {dat.controllers.Controller} this
         */
        onFinishChange: function(fnc) {
          this.__onFinishChange = fnc;
          return this;
        },

        /**
         * Change the value of <code>object[property]</code>
         *
         * @param {Object} newValue The new value of <code>object[property]</code>
         */
        setValue: function(newValue) {
          this.object[this.property] = newValue;
          if (this.__onChange) {
            this.__onChange.call(this, newValue);
          }
          this.updateDisplay();
          return this;
        },

        /**
         * Gets the value of <code>object[property]</code>
         *
         * @returns {Object} The current value of <code>object[property]</code>
         */
        getValue: function() {
          return this.object[this.property];
        },

        /**
         * Refreshes the visual display of a Controller in order to keep sync
         * with the object's current value.
         * @returns {dat.controllers.Controller} this
         */
        updateDisplay: function() {
          return this;
        },

        /**
         * @returns {Boolean} true if the value has deviated from initialValue
         */
        isModified: function() {
          return this.initialValue !== this.getValue()
        }

      }

  );

  return Controller;


})(dat.utils.common);


dat.dom.dom = (function (common) {

  var EVENT_MAP = {
    'HTMLEvents': ['change'],
    'MouseEvents': ['click','mousemove','mousedown','mouseup', 'mouseover'],
    'KeyboardEvents': ['keydown']
  };

  var EVENT_MAP_INV = {};
  common.each(EVENT_MAP, function(v, k) {
    common.each(v, function(e) {
      EVENT_MAP_INV[e] = k;
    });
  });

  var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;

  function cssValueToPixels(val) {

    if (val === '0' || common.isUndefined(val)) return 0;

    var match = val.match(CSS_VALUE_PIXELS);

    if (!common.isNull(match)) {
      return parseFloat(match[1]);
    }

    // TODO ...ems? %?

    return 0;

  }

  /**
   * @namespace
   * @member dat.dom
   */
  var dom = {

    /**
     * 
     * @param elem
     * @param selectable
     */
    makeSelectable: function(elem, selectable) {

      if (elem === undefined || elem.style === undefined) return;

      elem.onselectstart = selectable ? function() {
        return false;
      } : function() {
      };

      elem.style.MozUserSelect = selectable ? 'auto' : 'none';
      elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
      elem.unselectable = selectable ? 'on' : 'off';

    },

    /**
     *
     * @param elem
     * @param horizontal
     * @param vertical
     */
    makeFullscreen: function(elem, horizontal, vertical) {

      if (common.isUndefined(horizontal)) horizontal = true;
      if (common.isUndefined(vertical)) vertical = true;

      elem.style.position = 'absolute';

      if (horizontal) {
        elem.style.left = 0;
        elem.style.right = 0;
      }
      if (vertical) {
        elem.style.top = 0;
        elem.style.bottom = 0;
      }

    },

    /**
     *
     * @param elem
     * @param eventType
     * @param params
     */
    fakeEvent: function(elem, eventType, params, aux) {
      params = params || {};
      var className = EVENT_MAP_INV[eventType];
      if (!className) {
        throw new Error('Event type ' + eventType + ' not supported.');
      }
      var evt = document.createEvent(className);
      switch (className) {
        case 'MouseEvents':
          var clientX = params.x || params.clientX || 0;
          var clientY = params.y || params.clientY || 0;
          evt.initMouseEvent(eventType, params.bubbles || false,
              params.cancelable || true, window, params.clickCount || 1,
              0, //screen X
              0, //screen Y
              clientX, //client X
              clientY, //client Y
              false, false, false, false, 0, null);
          break;
        case 'KeyboardEvents':
          var init = evt.initKeyboardEvent || evt.initKeyEvent; // webkit || moz
          common.defaults(params, {
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: undefined,
            charCode: undefined
          });
          init(eventType, params.bubbles || false,
              params.cancelable, window,
              params.ctrlKey, params.altKey,
              params.shiftKey, params.metaKey,
              params.keyCode, params.charCode);
          break;
        default:
          evt.initEvent(eventType, params.bubbles || false,
              params.cancelable || true);
          break;
      }
      common.defaults(evt, aux);
      elem.dispatchEvent(evt);
    },

    /**
     *
     * @param elem
     * @param event
     * @param func
     * @param bool
     */
    bind: function(elem, event, func, bool) {
      bool = bool || false;
      if (elem.addEventListener)
        elem.addEventListener(event, func, bool);
      else if (elem.attachEvent)
        elem.attachEvent('on' + event, func);
      return dom;
    },

    /**
     *
     * @param elem
     * @param event
     * @param func
     * @param bool
     */
    unbind: function(elem, event, func, bool) {
      bool = bool || false;
      if (elem.removeEventListener)
        elem.removeEventListener(event, func, bool);
      else if (elem.detachEvent)
        elem.detachEvent('on' + event, func);
      return dom;
    },

    /**
     *
     * @param elem
     * @param className
     */
    addClass: function(elem, className) {
      if (elem.className === undefined) {
        elem.className = className;
      } else if (elem.className !== className) {
        var classes = elem.className.split(/ +/);
        if (classes.indexOf(className) == -1) {
          classes.push(className);
          elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
        }
      }
      return dom;
    },

    /**
     *
     * @param elem
     * @param className
     */
    removeClass: function(elem, className) {
      if (className) {
        if (elem.className === undefined) {
          // elem.className = className;
        } else if (elem.className === className) {
          elem.removeAttribute('class');
        } else {
          var classes = elem.className.split(/ +/);
          var index = classes.indexOf(className);
          if (index != -1) {
            classes.splice(index, 1);
            elem.className = classes.join(' ');
          }
        }
      } else {
        elem.className = undefined;
      }
      return dom;
    },

    hasClass: function(elem, className) {
      return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
    },

    /**
     *
     * @param elem
     */
    getWidth: function(elem) {

      var style = getComputedStyle(elem);

      return cssValueToPixels(style['border-left-width']) +
          cssValueToPixels(style['border-right-width']) +
          cssValueToPixels(style['padding-left']) +
          cssValueToPixels(style['padding-right']) +
          cssValueToPixels(style['width']);
    },

    /**
     *
     * @param elem
     */
    getHeight: function(elem) {

      var style = getComputedStyle(elem);

      return cssValueToPixels(style['border-top-width']) +
          cssValueToPixels(style['border-bottom-width']) +
          cssValueToPixels(style['padding-top']) +
          cssValueToPixels(style['padding-bottom']) +
          cssValueToPixels(style['height']);
    },

    /**
     *
     * @param elem
     */
    getOffset: function(elem) {
      var offset = {left: 0, top:0};
      if (elem.offsetParent) {
        do {
          offset.left += elem.offsetLeft;
          offset.top += elem.offsetTop;
        } while (elem = elem.offsetParent);
      }
      return offset;
    },

    // http://stackoverflow.com/posts/2684561/revisions
    /**
     * 
     * @param elem
     */
    isActive: function(elem) {
      return elem === document.activeElement && ( elem.type || elem.href );
    }

  };

  return dom;

})(dat.utils.common);


dat.controllers.OptionController = (function (Controller, dom, common) {

  /**
   * @class Provides a select input to alter the property of an object, using a
   * list of accepted values.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Object|string[]} options A map of labels to acceptable values, or
   * a list of acceptable string values.
   *
   * @member dat.controllers
   */
  var OptionController = function(object, property, options) {

    OptionController.superclass.call(this, object, property);

    var _this = this;

    /**
     * The drop down menu
     * @ignore
     */
    this.__select = document.createElement('select');

    if (common.isArray(options)) {
      var map = {};
      common.each(options, function(element) {
        map[element] = element;
      });
      options = map;
    }

    common.each(options, function(value, key) {

      var opt = document.createElement('option');
      opt.innerHTML = key;
      opt.setAttribute('value', value);
      _this.__select.appendChild(opt);

    });

    // Acknowledge original value
    this.updateDisplay();

    dom.bind(this.__select, 'change', function() {
      var desiredValue = this.options[this.selectedIndex].value;
      _this.setValue(desiredValue);
    });

    this.domElement.appendChild(this.__select);

  };

  OptionController.superclass = Controller;

  common.extend(

      OptionController.prototype,
      Controller.prototype,

      {

        setValue: function(v) {
          var toReturn = OptionController.superclass.prototype.setValue.call(this, v);
          if (this.__onFinishChange) {
            this.__onFinishChange.call(this, this.getValue());
          }
          return toReturn;
        },

        updateDisplay: function() {
          this.__select.value = this.getValue();
          return OptionController.superclass.prototype.updateDisplay.call(this);
        }

      }

  );

  return OptionController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.utils.common);


dat.controllers.NumberController = (function (Controller, common) {

  /**
   * @class Represents a given property of an object that is a number.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Object} [params] Optional parameters
   * @param {Number} [params.min] Minimum allowed value
   * @param {Number} [params.max] Maximum allowed value
   * @param {Number} [params.step] Increment by which to change value
   *
   * @member dat.controllers
   */
  var NumberController = function(object, property, params) {

    NumberController.superclass.call(this, object, property);

    params = params || {};

    this.__min = params.min;
    this.__max = params.max;
    this.__step = params.step;

    if (common.isUndefined(this.__step)) {

      if (this.initialValue == 0) {
        this.__impliedStep = 1; // What are we, psychics?
      } else {
        // Hey Doug, check this out.
        this.__impliedStep = Math.pow(10, Math.floor(Math.log(this.initialValue)/Math.LN10))/10;
      }

    } else {

      this.__impliedStep = this.__step;

    }

    this.__precision = numDecimals(this.__impliedStep);


  };

  NumberController.superclass = Controller;

  common.extend(

      NumberController.prototype,
      Controller.prototype,

      /** @lends dat.controllers.NumberController.prototype */
      {

        setValue: function(v) {

          if (this.__min !== undefined && v < this.__min) {
            v = this.__min;
          } else if (this.__max !== undefined && v > this.__max) {
            v = this.__max;
          }

          if (this.__step !== undefined && v % this.__step != 0) {
            v = Math.round(v / this.__step) * this.__step;
          }

          return NumberController.superclass.prototype.setValue.call(this, v);

        },

        /**
         * Specify a minimum value for <code>object[property]</code>.
         *
         * @param {Number} minValue The minimum value for
         * <code>object[property]</code>
         * @returns {dat.controllers.NumberController} this
         */
        min: function(v) {
          this.__min = v;
          return this;
        },

        /**
         * Specify a maximum value for <code>object[property]</code>.
         *
         * @param {Number} maxValue The maximum value for
         * <code>object[property]</code>
         * @returns {dat.controllers.NumberController} this
         */
        max: function(v) {
          this.__max = v;
          return this;
        },

        /**
         * Specify a step value that dat.controllers.NumberController
         * increments by.
         *
         * @param {Number} stepValue The step value for
         * dat.controllers.NumberController
         * @default if minimum and maximum specified increment is 1% of the
         * difference otherwise stepValue is 1
         * @returns {dat.controllers.NumberController} this
         */
        step: function(v) {
          this.__step = v;
          return this;
        }

      }

  );

  function numDecimals(x) {
    x = x.toString();
    if (x.indexOf('.') > -1) {
      return x.length - x.indexOf('.') - 1;
    } else {
      return 0;
    }
  }

  return NumberController;

})(dat.controllers.Controller,
dat.utils.common);


dat.controllers.NumberControllerBox = (function (NumberController, dom, common) {

  /**
   * @class Represents a given property of an object that is a number and
   * provides an input element with which to manipulate it.
   *
   * @extends dat.controllers.Controller
   * @extends dat.controllers.NumberController
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Object} [params] Optional parameters
   * @param {Number} [params.min] Minimum allowed value
   * @param {Number} [params.max] Maximum allowed value
   * @param {Number} [params.step] Increment by which to change value
   *
   * @member dat.controllers
   */
  var NumberControllerBox = function(object, property, params) {

    this.__truncationSuspended = false;

    NumberControllerBox.superclass.call(this, object, property, params);

    var _this = this;

    /**
     * {Number} Previous mouse y position
     * @ignore
     */
    var prev_y;

    this.__input = document.createElement('input');
    this.__input.setAttribute('type', 'text');

    // Makes it so manually specified values are not truncated.

    dom.bind(this.__input, 'change', onChange);
    dom.bind(this.__input, 'blur', onBlur);
    dom.bind(this.__input, 'mousedown', onMouseDown);
    dom.bind(this.__input, 'keydown', function(e) {

      // When pressing entire, you can be as precise as you want.
      if (e.keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
      }

    });

    function onChange() {
      var attempted = parseFloat(_this.__input.value);
      if (!common.isNaN(attempted)) _this.setValue(attempted);
    }

    function onBlur() {
      onChange();
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    function onMouseDown(e) {
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      prev_y = e.clientY;
    }

    function onMouseDrag(e) {

      var diff = prev_y - e.clientY;
      _this.setValue(_this.getValue() + diff * _this.__impliedStep);

      prev_y = e.clientY;

    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
    }

    this.updateDisplay();

    this.domElement.appendChild(this.__input);

  };

  NumberControllerBox.superclass = NumberController;

  common.extend(

      NumberControllerBox.prototype,
      NumberController.prototype,

      {

        updateDisplay: function() {

          this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
          return NumberControllerBox.superclass.prototype.updateDisplay.call(this);
        }

      }

  );

  function roundToDecimal(value, decimals) {
    var tenTo = Math.pow(10, decimals);
    return Math.round(value * tenTo) / tenTo;
  }

  return NumberControllerBox;

})(dat.controllers.NumberController,
dat.dom.dom,
dat.utils.common);


dat.controllers.NumberControllerSlider = (function (NumberController, dom, css, common, styleSheet) {

  /**
   * @class Represents a given property of an object that is a number, contains
   * a minimum and maximum, and provides a slider element with which to
   * manipulate it. It should be noted that the slider element is made up of
   * <code>&lt;div&gt;</code> tags, <strong>not</strong> the html5
   * <code>&lt;slider&gt;</code> element.
   *
   * @extends dat.controllers.Controller
   * @extends dat.controllers.NumberController
   * 
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   * @param {Number} minValue Minimum allowed value
   * @param {Number} maxValue Maximum allowed value
   * @param {Number} stepValue Increment by which to change value
   *
   * @member dat.controllers
   */
  var NumberControllerSlider = function(object, property, min, max, step) {

    NumberControllerSlider.superclass.call(this, object, property, { min: min, max: max, step: step });

    var _this = this;

    this.__background = document.createElement('div');
    this.__foreground = document.createElement('div');
    


    dom.bind(this.__background, 'mousedown', onMouseDown);
    
    dom.addClass(this.__background, 'slider');
    dom.addClass(this.__foreground, 'slider-fg');

    function onMouseDown(e) {

      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);

      onMouseDrag(e);
    }

    function onMouseDrag(e) {

      e.preventDefault();

      var offset = dom.getOffset(_this.__background);
      var width = dom.getWidth(_this.__background);
      
      _this.setValue(
        map(e.clientX, offset.left, offset.left + width, _this.__min, _this.__max)
      );

      return false;

    }

    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    this.updateDisplay();

    this.__background.appendChild(this.__foreground);
    this.domElement.appendChild(this.__background);

  };

  NumberControllerSlider.superclass = NumberController;

  /**
   * Injects default stylesheet for slider elements.
   */
  NumberControllerSlider.useDefaultStyles = function() {
    css.inject(styleSheet);
  };

  common.extend(

      NumberControllerSlider.prototype,
      NumberController.prototype,

      {

        updateDisplay: function() {
          var pct = (this.getValue() - this.__min)/(this.__max - this.__min);
          this.__foreground.style.width = pct*100+'%';
          return NumberControllerSlider.superclass.prototype.updateDisplay.call(this);
        }

      }



  );

  function map(v, i1, i2, o1, o2) {
    return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
  }

  return NumberControllerSlider;
  
})(dat.controllers.NumberController,
dat.dom.dom,
dat.utils.css,
dat.utils.common,
".slider {\n  box-shadow: inset 0 2px 4px rgba(0,0,0,0.15);\n  height: 1em;\n  border-radius: 1em;\n  background-color: #eee;\n  padding: 0 0.5em;\n  overflow: hidden;\n}\n\n.slider-fg {\n  padding: 1px 0 2px 0;\n  background-color: #aaa;\n  height: 1em;\n  margin-left: -0.5em;\n  padding-right: 0.5em;\n  border-radius: 1em 0 0 1em;\n}\n\n.slider-fg:after {\n  display: inline-block;\n  border-radius: 1em;\n  background-color: #fff;\n  border:  1px solid #aaa;\n  content: '';\n  float: right;\n  margin-right: -1em;\n  margin-top: -1px;\n  height: 0.9em;\n  width: 0.9em;\n}");


dat.controllers.FunctionController = (function (Controller, dom, common) {

  /**
   * @class Provides a GUI interface to fire a specified method, a property of an object.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var FunctionController = function(object, property, text) {

    FunctionController.superclass.call(this, object, property);

    var _this = this;

    this.__button = document.createElement('div');
    this.__button.innerHTML = text === undefined ? 'Fire' : text;
    dom.bind(this.__button, 'click', function(e) {
      e.preventDefault();
      _this.fire();
      return false;
    });

    dom.addClass(this.__button, 'button');

    this.domElement.appendChild(this.__button);


  };

  FunctionController.superclass = Controller;

  common.extend(

      FunctionController.prototype,
      Controller.prototype,
      {
        
        fire: function() {
          if (this.__onChange) {
            this.__onChange.call(this);
          }
          if (this.__onFinishChange) {
            this.__onFinishChange.call(this, this.getValue());
          }
          this.getValue().call(this.object);
        }
      }

  );

  return FunctionController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.utils.common);


dat.controllers.BooleanController = (function (Controller, dom, common) {

  /**
   * @class Provides a checkbox input to alter the boolean property of an object.
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var BooleanController = function(object, property) {

    BooleanController.superclass.call(this, object, property);

    var _this = this;
    this.__prev = this.getValue();

    this.__checkbox = document.createElement('input');
    this.__checkbox.setAttribute('type', 'checkbox');


    dom.bind(this.__checkbox, 'change', onChange, false);

    this.domElement.appendChild(this.__checkbox);

    // Match original value
    this.updateDisplay();

    function onChange() {
      _this.setValue(!_this.__prev);
    }

  };

  BooleanController.superclass = Controller;

  common.extend(

      BooleanController.prototype,
      Controller.prototype,

      {

        setValue: function(v) {
          var toReturn = BooleanController.superclass.prototype.setValue.call(this, v);
          if (this.__onFinishChange) {
            this.__onFinishChange.call(this, this.getValue());
          }
          this.__prev = this.getValue();
          return toReturn;
        },

        updateDisplay: function() {
          
          if (this.getValue() === true) {
            this.__checkbox.setAttribute('checked', 'checked');
            this.__checkbox.checked = true;    
          } else {
              this.__checkbox.checked = false;
          }

          return BooleanController.superclass.prototype.updateDisplay.call(this);

        }


      }

  );

  return BooleanController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.utils.common);


dat.color.toString = (function (common) {

  return function(color) {

    if (color.a == 1 || common.isUndefined(color.a)) {

      var s = color.hex.toString(16);
      while (s.length < 6) {
        s = '0' + s;
      }

      return '#' + s;

    } else {

      return 'rgba(' + Math.round(color.r) + ',' + Math.round(color.g) + ',' + Math.round(color.b) + ',' + color.a + ')';

    }

  }

})(dat.utils.common);


dat.color.interpret = (function (toString, common) {

  var result, toReturn;

  var interpret = function() {

    toReturn = false;

    var original = arguments.length > 1 ? common.toArray(arguments) : arguments[0];

    common.each(INTERPRETATIONS, function(family) {

      if (family.litmus(original)) {

        common.each(family.conversions, function(conversion, conversionName) {

          result = conversion.read(original);

          if (toReturn === false && result !== false) {
            toReturn = result;
            result.conversionName = conversionName;
            result.conversion = conversion;
            return common.BREAK;

          }

        });

        return common.BREAK;

      }

    });

    return toReturn;

  };

  var INTERPRETATIONS = [

    // Strings
    {

      litmus: common.isString,

      conversions: {

        THREE_CHAR_HEX: {

          read: function(original) {

            var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
            if (test === null) return false;

            return {
              space: 'HEX',
              hex: parseInt(
                  '0x' +
                      test[1].toString() + test[1].toString() +
                      test[2].toString() + test[2].toString() +
                      test[3].toString() + test[3].toString())
            };

          },

          write: toString

        },

        SIX_CHAR_HEX: {

          read: function(original) {

            var test = original.match(/^#([A-F0-9]{6})$/i);
            if (test === null) return false;

            return {
              space: 'HEX',
              hex: parseInt('0x' + test[1].toString())
            };

          },

          write: toString

        },

        CSS_RGB: {

          read: function(original) {

            var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
            if (test === null) return false;

            return {
              space: 'RGB',
              r: parseFloat(test[1]),
              g: parseFloat(test[2]),
              b: parseFloat(test[3])
            };

          },

          write: toString

        },

        CSS_RGBA: {

          read: function(original) {

            var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\,\s*(.+)\s*\)/);
            if (test === null) return false;

            return {
              space: 'RGB',
              r: parseFloat(test[1]),
              g: parseFloat(test[2]),
              b: parseFloat(test[3]),
              a: parseFloat(test[4])
            };

          },

          write: toString

        }

      }

    },

    // Numbers
    {

      litmus: common.isNumber,

      conversions: {

        HEX: {
          read: function(original) {
            return {
              space: 'HEX',
              hex: original,
              conversionName: 'HEX'
            }
          },

          write: function(color) {
            return color.hex;
          }
        }

      }

    },

    // Arrays
    {

      litmus: common.isArray,

      conversions: {

        RGB_ARRAY: {
          read: function(original) {
            if (original.length != 3) return false;
            return {
              space: 'RGB',
              r: original[0],
              g: original[1],
              b: original[2]
            };
          },

          write: function(color) {
            return [color.r, color.g, color.b];
          }

        },

        RGBA_ARRAY: {
          read: function(original) {
            if (original.length != 4) return false;
            return {
              space: 'RGB',
              r: original[0],
              g: original[1],
              b: original[2],
              a: original[3]
            };
          },

          write: function(color) {
            return [color.r, color.g, color.b, color.a];
          }

        }

      }

    },

    // Objects
    {

      litmus: common.isObject,

      conversions: {

        RGBA_OBJ: {
          read: function(original) {
            if (common.isNumber(original.r) &&
                common.isNumber(original.g) &&
                common.isNumber(original.b) &&
                common.isNumber(original.a)) {
              return {
                space: 'RGB',
                r: original.r,
                g: original.g,
                b: original.b,
                a: original.a
              }
            }
            return false;
          },

          write: function(color) {
            return {
              r: color.r,
              g: color.g,
              b: color.b,
              a: color.a
            }
          }
        },

        RGB_OBJ: {
          read: function(original) {
            if (common.isNumber(original.r) &&
                common.isNumber(original.g) &&
                common.isNumber(original.b)) {
              return {
                space: 'RGB',
                r: original.r,
                g: original.g,
                b: original.b
              }
            }
            return false;
          },

          write: function(color) {
            return {
              r: color.r,
              g: color.g,
              b: color.b
            }
          }
        },

        HSVA_OBJ: {
          read: function(original) {
            if (common.isNumber(original.h) &&
                common.isNumber(original.s) &&
                common.isNumber(original.v) &&
                common.isNumber(original.a)) {
              return {
                space: 'HSV',
                h: original.h,
                s: original.s,
                v: original.v,
                a: original.a
              }
            }
            return false;
          },

          write: function(color) {
            return {
              h: color.h,
              s: color.s,
              v: color.v,
              a: color.a
            }
          }
        },

        HSV_OBJ: {
          read: function(original) {
            if (common.isNumber(original.h) &&
                common.isNumber(original.s) &&
                common.isNumber(original.v)) {
              return {
                space: 'HSV',
                h: original.h,
                s: original.s,
                v: original.v
              }
            }
            return false;
          },

          write: function(color) {
            return {
              h: color.h,
              s: color.s,
              v: color.v
            }
          }

        }

      }

    }


  ];

  return interpret;


})(dat.color.toString,
dat.utils.common);


dat.GUI = dat.gui.GUI = (function (css, saveDialogueContents, styleSheet, controllerFactory, Controller, BooleanController, FunctionController, NumberControllerBox, NumberControllerSlider, OptionController, ColorController, requestAnimationFrame, CenteredDiv, dom, common) {

  css.inject(styleSheet);

  /** Outer-most className for GUI's */
  var CSS_NAMESPACE = 'dg';

  var HIDE_KEY_CODE = 72;

  /** The only value shared between the JS and SCSS. Use caution. */
  var CLOSE_BUTTON_HEIGHT = 20;

  var DEFAULT_DEFAULT_PRESET_NAME = 'Default';

  var SUPPORTS_LOCAL_STORAGE = (function() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  })();

  var SAVE_DIALOGUE;

  /** Have we yet to create an autoPlace GUI? */
  var auto_place_virgin = true;

  /** Fixed position div that auto place GUI's go inside */
  var auto_place_container;

  /** Are we hiding the GUI's ? */
  var hide = false;

  /** GUI's which should be hidden */
  var hideable_guis = [];

  /**
   * A lightweight controller library for JavaScript. It allows you to easily
   * manipulate variables and fire functions on the fly.
   * @class
   *
   * @member dat.gui
   *
   * @param {Object} [params]
   * @param {String} [params.name] The name of this GUI.
   * @param {Object} [params.load] JSON object representing the saved state of
   * this GUI.
   * @param {Boolean} [params.auto=true]
   * @param {dat.gui.GUI} [params.parent] The GUI I'm nested in.
   * @param {Boolean} [params.closed] If true, starts closed
   */
  var GUI = function(params) {

    var _this = this;

    /**
     * Outermost DOM Element
     * @type DOMElement
     */
    this.domElement = document.createElement('div');
    this.__ul = document.createElement('ul');
    this.domElement.appendChild(this.__ul);

    dom.addClass(this.domElement, CSS_NAMESPACE);

    /**
     * Nested GUI's by name
     * @ignore
     */
    this.__folders = {};

    this.__controllers = [];

    /**
     * List of objects I'm remembering for save, only used in top level GUI
     * @ignore
     */
    this.__rememberedObjects = [];

    /**
     * Maps the index of remembered objects to a map of controllers, only used
     * in top level GUI.
     *
     * @private
     * @ignore
     *
     * @example
     * [
     *  {
     *    propertyName: Controller,
     *    anotherPropertyName: Controller
     *  },
     *  {
     *    propertyName: Controller
     *  }
     * ]
     */
    this.__rememberedObjectIndecesToControllers = [];

    this.__listening = [];

    params = params || {};

    // Default parameters
    params = common.defaults(params, {
      autoPlace: true,
      width: GUI.DEFAULT_WIDTH
    });

    params = common.defaults(params, {
      resizable: params.autoPlace,
      hideable: params.autoPlace
    });


    if (!common.isUndefined(params.load)) {

      // Explicit preset
      if (params.preset) params.load.preset = params.preset;

    } else {

      params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };

    }

    if (common.isUndefined(params.parent) && params.hideable) {
      hideable_guis.push(this);
    }

    // Only root level GUI's are resizable.
    params.resizable = common.isUndefined(params.parent) && params.resizable;


    if (params.autoPlace && common.isUndefined(params.scrollable)) {
      params.scrollable = true;
    }
//    params.scrollable = common.isUndefined(params.parent) && params.scrollable === true;

    // Not part of params because I don't want people passing this in via
    // constructor. Should be a 'remembered' value.
    var use_local_storage =
        SUPPORTS_LOCAL_STORAGE &&
            localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';

    Object.defineProperties(this,

        /** @lends dat.gui.GUI.prototype */
        {

          /**
           * The parent <code>GUI</code>
           * @type dat.gui.GUI
           */
          parent: {
            get: function() {
              return params.parent;
            }
          },

          scrollable: {
            get: function() {
              return params.scrollable;
            }
          },

          /**
           * Handles <code>GUI</code>'s element placement for you
           * @type Boolean
           */
          autoPlace: {
            get: function() {
              return params.autoPlace;
            }
          },

          /**
           * The identifier for a set of saved values
           * @type String
           */
          preset: {

            get: function() {
              if (_this.parent) {
                return _this.getRoot().preset;
              } else {
                return params.load.preset;
              }
            },

            set: function(v) {
              if (_this.parent) {
                _this.getRoot().preset = v;
              } else {
                params.load.preset = v;
              }
              setPresetSelectIndex(this);
              _this.revert();
            }

          },

          /**
           * The width of <code>GUI</code> element
           * @type Number
           */
          width: {
            get: function() {
              return params.width;
            },
            set: function(v) {
              params.width = v;
              setWidth(_this, v);
            }
          },

          /**
           * The name of <code>GUI</code>. Used for folders. i.e
           * a folder's name
           * @type String
           */
          name: {
            get: function() {
              return params.name;
            },
            set: function(v) {
              // TODO Check for collisions among sibling folders
              params.name = v;
              if (title_row_name) {
                title_row_name.innerHTML = params.name;
              }
            }
          },

          /**
           * Whether the <code>GUI</code> is collapsed or not
           * @type Boolean
           */
          closed: {
            get: function() {
              return params.closed;
            },
            set: function(v) {
              params.closed = v;
              if (params.closed) {
                dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
              } else {
                dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
              }
              // For browsers that aren't going to respect the CSS transition,
              // Lets just check our height against the window height right off
              // the bat.
              this.onResize();

              if (_this.__closeButton) {
                _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
              }
            }
          },

          /**
           * Contains all presets
           * @type Object
           */
          load: {
            get: function() {
              return params.load;
            }
          },

          /**
           * Determines whether or not to use <a href="https://developer.mozilla.org/en/DOM/Storage#localStorage">localStorage</a> as the means for
           * <code>remember</code>ing
           * @type Boolean
           */
          useLocalStorage: {

            get: function() {
              return use_local_storage;
            },
            set: function(bool) {
              if (SUPPORTS_LOCAL_STORAGE) {
                use_local_storage = bool;
                if (bool) {
                  dom.bind(window, 'unload', saveToLocalStorage);
                } else {
                  dom.unbind(window, 'unload', saveToLocalStorage);
                }
                localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
              }
            }

          }

        });

    // Are we a root level GUI?
    if (common.isUndefined(params.parent)) {

      params.closed = false;

      dom.addClass(this.domElement, GUI.CLASS_MAIN);
      dom.makeSelectable(this.domElement, false);

      // Are we supposed to be loading locally?
      if (SUPPORTS_LOCAL_STORAGE) {

        if (use_local_storage) {

          _this.useLocalStorage = true;

          var saved_gui = localStorage.getItem(getLocalStorageHash(this, 'gui'));

          if (saved_gui) {
            params.load = JSON.parse(saved_gui);
          }

        }

      }

      this.__closeButton = document.createElement('div');
      this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
      this.domElement.appendChild(this.__closeButton);

      dom.bind(this.__closeButton, 'click', function() {

        _this.closed = !_this.closed;


      });


      // Oh, you're a nested GUI!
    } else {

      if (params.closed === undefined) {
        params.closed = true;
      }

      var title_row_name = document.createTextNode(params.name);
      dom.addClass(title_row_name, 'controller-name');

      var title_row = addRow(_this, title_row_name);

      var on_click_title = function(e) {
        e.preventDefault();
        _this.closed = !_this.closed;
        return false;
      };

      dom.addClass(this.__ul, GUI.CLASS_CLOSED);

      dom.addClass(title_row, 'title');
      dom.bind(title_row, 'click', on_click_title);

      if (!params.closed) {
        this.closed = false;
      }

    }

    if (params.autoPlace) {

      if (common.isUndefined(params.parent)) {

        if (auto_place_virgin) {
          auto_place_container = document.createElement('div');
          dom.addClass(auto_place_container, CSS_NAMESPACE);
          dom.addClass(auto_place_container, GUI.CLASS_AUTO_PLACE_CONTAINER);
          document.body.appendChild(auto_place_container);
          auto_place_virgin = false;
        }

        // Put it in the dom for you.
        auto_place_container.appendChild(this.domElement);

        // Apply the auto styles
        dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);

      }


      // Make it not elastic.
      if (!this.parent) setWidth(_this, params.width);

    }

    dom.bind(window, 'resize', function() { _this.onResize() });
    dom.bind(this.__ul, 'webkitTransitionEnd', function() { _this.onResize(); });
    dom.bind(this.__ul, 'transitionend', function() { _this.onResize() });
    dom.bind(this.__ul, 'oTransitionEnd', function() { _this.onResize() });
    this.onResize();


    if (params.resizable) {
      addResizeHandle(this);
    }

    function saveToLocalStorage() {
      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
    }

    var root = _this.getRoot();
    function resetWidth() {
        var root = _this.getRoot();
        root.width += 1;
        common.defer(function() {
          root.width -= 1;
        });
      }

      if (!params.parent) {
        resetWidth();
      }

  };

  GUI.toggleHide = function() {

    hide = !hide;
    common.each(hideable_guis, function(gui) {
      gui.domElement.style.zIndex = hide ? -999 : 999;
      gui.domElement.style.opacity = hide ? 0 : 1;
    });
  };

  GUI.CLASS_AUTO_PLACE = 'a';
  GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
  GUI.CLASS_MAIN = 'main';
  GUI.CLASS_CONTROLLER_ROW = 'cr';
  GUI.CLASS_TOO_TALL = 'taller-than-window';
  GUI.CLASS_CLOSED = 'closed';
  GUI.CLASS_CLOSE_BUTTON = 'close-button';
  GUI.CLASS_DRAG = 'drag';

  GUI.DEFAULT_WIDTH = 245;
  GUI.TEXT_CLOSED = 'Close Controls';
  GUI.TEXT_OPEN = 'Open Controls';

  dom.bind(window, 'keydown', function(e) {

    if (document.activeElement.type !== 'text' &&
        (e.which === HIDE_KEY_CODE || e.keyCode == HIDE_KEY_CODE)) {
      GUI.toggleHide();
    }

  }, false);

  common.extend(

      GUI.prototype,

      /** @lends dat.gui.GUI */
      {

        /**
         * @param object
         * @param property
         * @returns {dat.controllers.Controller} The new controller that was added.
         * @instance
         */
        add: function(object, property) {

          return add(
              this,
              object,
              property,
              {
                factoryArgs: Array.prototype.slice.call(arguments, 2)
              }
          );

        },

        /**
         * @param object
         * @param property
         * @returns {dat.controllers.ColorController} The new controller that was added.
         * @instance
         */
        addColor: function(object, property) {

          return add(
              this,
              object,
              property,
              {
                color: true
              }
          );

        },

        /**
         * @param controller
         * @instance
         */
        remove: function(controller) {

          // TODO listening?
          this.__ul.removeChild(controller.__li);
          this.__controllers.slice(this.__controllers.indexOf(controller), 1);
          var _this = this;
          common.defer(function() {
            _this.onResize();
          });

        },

        destroy: function() {

          if (this.autoPlace) {
            auto_place_container.removeChild(this.domElement);
          }

        },

        /**
         * @param name
         * @returns {dat.gui.GUI} The new folder.
         * @throws {Error} if this GUI already has a folder by the specified
         * name
         * @instance
         */
        addFolder: function(name) {

          // We have to prevent collisions on names in order to have a key
          // by which to remember saved values
          if (this.__folders[name] !== undefined) {
            throw new Error('You already have a folder in this GUI by the' +
                ' name "' + name + '"');
          }

          var new_gui_params = { name: name, parent: this };

          // We need to pass down the autoPlace trait so that we can
          // attach event listeners to open/close folder actions to
          // ensure that a scrollbar appears if the window is too short.
          new_gui_params.autoPlace = this.autoPlace;

          // Do we have saved appearance data for this folder?

          if (this.load && // Anything loaded?
              this.load.folders && // Was my parent a dead-end?
              this.load.folders[name]) { // Did daddy remember me?

            // Start me closed if I was closed
            new_gui_params.closed = this.load.folders[name].closed;

            // Pass down the loaded data
            new_gui_params.load = this.load.folders[name];

          }

          var gui = new GUI(new_gui_params);
          this.__folders[name] = gui;

          var li = addRow(this, gui.domElement);
          dom.addClass(li, 'folder');
          return gui;

        },

        open: function() {
          this.closed = false;
        },

        close: function() {
          this.closed = true;
        },

        onResize: function() {

          var root = this.getRoot();

          if (root.scrollable) {

            var top = dom.getOffset(root.__ul).top;
            var h = 0;

            common.each(root.__ul.childNodes, function(node) {
              if (! (root.autoPlace && node === root.__save_row))
                h += dom.getHeight(node);
            });

            if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
              dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
              root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
            } else {
              dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
              root.__ul.style.height = 'auto';
            }

          }

          if (root.__resize_handle) {
            common.defer(function() {
              root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
            });
          }

          if (root.__closeButton) {
            root.__closeButton.style.width = root.width + 'px';
          }

        },

        /**
         * Mark objects for saving. The order of these objects cannot change as
         * the GUI grows. When remembering new objects, append them to the end
         * of the list.
         *
         * @param {Object...} objects
         * @throws {Error} if not called on a top level GUI.
         * @instance
         */
        remember: function() {

          if (common.isUndefined(SAVE_DIALOGUE)) {
            SAVE_DIALOGUE = new CenteredDiv();
            SAVE_DIALOGUE.domElement.innerHTML = saveDialogueContents;
          }

          if (this.parent) {
            throw new Error("You can only call remember on a top level GUI.");
          }

          var _this = this;

          common.each(Array.prototype.slice.call(arguments), function(object) {
            if (_this.__rememberedObjects.length == 0) {
              addSaveMenu(_this);
            }
            if (_this.__rememberedObjects.indexOf(object) == -1) {
              _this.__rememberedObjects.push(object);
            }
          });

          if (this.autoPlace) {
            // Set save row width
            setWidth(this, this.width);
          }

        },

        /**
         * @returns {dat.gui.GUI} the topmost parent GUI of a nested GUI.
         * @instance
         */
        getRoot: function() {
          var gui = this;
          while (gui.parent) {
            gui = gui.parent;
          }
          return gui;
        },

        /**
         * @returns {Object} a JSON object representing the current state of
         * this GUI as well as its remembered properties.
         * @instance
         */
        getSaveObject: function() {

          var toReturn = this.load;

          toReturn.closed = this.closed;

          // Am I remembering any values?
          if (this.__rememberedObjects.length > 0) {

            toReturn.preset = this.preset;

            if (!toReturn.remembered) {
              toReturn.remembered = {};
            }

            toReturn.remembered[this.preset] = getCurrentPreset(this);

          }

          toReturn.folders = {};
          common.each(this.__folders, function(element, key) {
            toReturn.folders[key] = element.getSaveObject();
          });

          return toReturn;

        },

        save: function() {

          if (!this.load.remembered) {
            this.load.remembered = {};
          }

          this.load.remembered[this.preset] = getCurrentPreset(this);
          markPresetModified(this, false);

        },

        saveAs: function(presetName) {

          if (!this.load.remembered) {

            // Retain default values upon first save
            this.load.remembered = {};
            this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);

          }

          this.load.remembered[presetName] = getCurrentPreset(this);
          this.preset = presetName;
          addPresetOption(this, presetName, true);

        },

        revert: function(gui) {

          common.each(this.__controllers, function(controller) {
            // Make revert work on Default.
            if (!this.getRoot().load.remembered) {
              controller.setValue(controller.initialValue);
            } else {
              recallSavedValue(gui || this.getRoot(), controller);
            }
          }, this);

          common.each(this.__folders, function(folder) {
            folder.revert(folder);
          });

          if (!gui) {
            markPresetModified(this.getRoot(), false);
          }


        },

        listen: function(controller) {

          var init = this.__listening.length == 0;
          this.__listening.push(controller);
          if (init) updateDisplays(this.__listening);

        }

      }

  );

  function add(gui, object, property, params) {

    if (object[property] === undefined) {
      throw new Error("Object " + object + " has no property \"" + property + "\"");
    }

    var controller;

    if (params.color) {

      controller = new ColorController(object, property);

    } else {

      var factoryArgs = [object,property].concat(params.factoryArgs);
      controller = controllerFactory.apply(gui, factoryArgs);

    }

    if (params.before instanceof Controller) {
      params.before = params.before.__li;
    }

    recallSavedValue(gui, controller);

    dom.addClass(controller.domElement, 'c');

    var name = document.createElement('span');
    dom.addClass(name, 'property-name');
    name.innerHTML = controller.property;

    var container = document.createElement('div');
    container.appendChild(name);
    container.appendChild(controller.domElement);

    var li = addRow(gui, container, params.before);

    dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
    dom.addClass(li, typeof controller.getValue());

    augmentController(gui, li, controller);

    gui.__controllers.push(controller);

    return controller;

  }

  /**
   * Add a row to the end of the GUI or before another row.
   *
   * @param gui
   * @param [dom] If specified, inserts the dom content in the new row
   * @param [liBefore] If specified, places the new row before another row
   */
  function addRow(gui, dom, liBefore) {
    var li = document.createElement('li');
    if (dom) li.appendChild(dom);
    if (liBefore) {
      gui.__ul.insertBefore(li, params.before);
    } else {
      gui.__ul.appendChild(li);
    }
    gui.onResize();
    return li;
  }

  function augmentController(gui, li, controller) {

    controller.__li = li;
    controller.__gui = gui;

    common.extend(controller, {

      options: function(options) {

        if (arguments.length > 1) {
          controller.remove();

          return add(
              gui,
              controller.object,
              controller.property,
              {
                before: controller.__li.nextElementSibling,
                factoryArgs: [common.toArray(arguments)]
              }
          );

        }

        if (common.isArray(options) || common.isObject(options)) {
          controller.remove();

          return add(
              gui,
              controller.object,
              controller.property,
              {
                before: controller.__li.nextElementSibling,
                factoryArgs: [options]
              }
          );

        }

      },

      name: function(v) {
        controller.__li.firstElementChild.firstElementChild.innerHTML = v;
        return controller;
      },

      listen: function() {
        controller.__gui.listen(controller);
        return controller;
      },

      remove: function() {
        controller.__gui.remove(controller);
        return controller;
      }

    });

    // All sliders should be accompanied by a box.
    if (controller instanceof NumberControllerSlider) {

      var box = new NumberControllerBox(controller.object, controller.property,
          { min: controller.__min, max: controller.__max, step: controller.__step });

      common.each(['updateDisplay', 'onChange', 'onFinishChange'], function(method) {
        var pc = controller[method];
        var pb = box[method];
        controller[method] = box[method] = function() {
          var args = Array.prototype.slice.call(arguments);
          pc.apply(controller, args);
          return pb.apply(box, args);
        }
      });

      dom.addClass(li, 'has-slider');
      controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);

    }
    else if (controller instanceof NumberControllerBox) {

      var r = function(returned) {

        // Have we defined both boundaries?
        if (common.isNumber(controller.__min) && common.isNumber(controller.__max)) {

          // Well, then lets just replace this with a slider.
          controller.remove();
          return add(
              gui,
              controller.object,
              controller.property,
              {
                before: controller.__li.nextElementSibling,
                factoryArgs: [controller.__min, controller.__max, controller.__step]
              });

        }

        return returned;

      };

      controller.min = common.compose(r, controller.min);
      controller.max = common.compose(r, controller.max);

    }
    else if (controller instanceof BooleanController) {

      dom.bind(li, 'click', function() {
        dom.fakeEvent(controller.__checkbox, 'click');
      });

      dom.bind(controller.__checkbox, 'click', function(e) {
        e.stopPropagation(); // Prevents double-toggle
      })

    }
    else if (controller instanceof FunctionController) {

      dom.bind(li, 'click', function() {
        dom.fakeEvent(controller.__button, 'click');
      });

      dom.bind(li, 'mouseover', function() {
        dom.addClass(controller.__button, 'hover');
      });

      dom.bind(li, 'mouseout', function() {
        dom.removeClass(controller.__button, 'hover');
      });

    }
    else if (controller instanceof ColorController) {

      dom.addClass(li, 'color');
      controller.updateDisplay = common.compose(function(r) {
        li.style.borderLeftColor = controller.__color.toString();
        return r;
      }, controller.updateDisplay);

      controller.updateDisplay();

    }

    controller.setValue = common.compose(function(r) {
      if (gui.getRoot().__preset_select && controller.isModified()) {
        markPresetModified(gui.getRoot(), true);
      }
      return r;
    }, controller.setValue);

  }

  function recallSavedValue(gui, controller) {

    // Find the topmost GUI, that's where remembered objects live.
    var root = gui.getRoot();

    // Does the object we're controlling match anything we've been told to
    // remember?
    var matched_index = root.__rememberedObjects.indexOf(controller.object);

    // Why yes, it does!
    if (matched_index != -1) {

      // Let me fetch a map of controllers for thcommon.isObject.
      var controller_map =
          root.__rememberedObjectIndecesToControllers[matched_index];

      // Ohp, I believe this is the first controller we've created for this
      // object. Lets make the map fresh.
      if (controller_map === undefined) {
        controller_map = {};
        root.__rememberedObjectIndecesToControllers[matched_index] =
            controller_map;
      }

      // Keep track of this controller
      controller_map[controller.property] = controller;

      // Okay, now have we saved any values for this controller?
      if (root.load && root.load.remembered) {

        var preset_map = root.load.remembered;

        // Which preset are we trying to load?
        var preset;

        if (preset_map[gui.preset]) {

          preset = preset_map[gui.preset];

        } else if (preset_map[DEFAULT_DEFAULT_PRESET_NAME]) {

          // Uhh, you can have the default instead?
          preset = preset_map[DEFAULT_DEFAULT_PRESET_NAME];

        } else {

          // Nada.

          return;

        }


        // Did the loaded object remember thcommon.isObject?
        if (preset[matched_index] &&

          // Did we remember this particular property?
            preset[matched_index][controller.property] !== undefined) {

          // We did remember something for this guy ...
          var value = preset[matched_index][controller.property];

          // And that's what it is.
          controller.initialValue = value;
          controller.setValue(value);

        }

      }

    }

  }

  function getLocalStorageHash(gui, key) {
    // TODO how does this deal with multiple GUI's?
    return document.location.href + '.' + key;

  }

  function addSaveMenu(gui) {

    var div = gui.__save_row = document.createElement('li');

    dom.addClass(gui.domElement, 'has-save');

    gui.__ul.insertBefore(div, gui.__ul.firstChild);

    dom.addClass(div, 'save-row');

    var gears = document.createElement('span');
    gears.innerHTML = '&nbsp;';
    dom.addClass(gears, 'button gears');

    // TODO replace with FunctionController
    var button = document.createElement('span');
    button.innerHTML = 'Save';
    dom.addClass(button, 'button');
    dom.addClass(button, 'save');

    var button2 = document.createElement('span');
    button2.innerHTML = 'New';
    dom.addClass(button2, 'button');
    dom.addClass(button2, 'save-as');

    var button3 = document.createElement('span');
    button3.innerHTML = 'Revert';
    dom.addClass(button3, 'button');
    dom.addClass(button3, 'revert');

    var select = gui.__preset_select = document.createElement('select');

    if (gui.load && gui.load.remembered) {

      common.each(gui.load.remembered, function(value, key) {
        addPresetOption(gui, key, key == gui.preset);
      });

    } else {
      addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
    }

    dom.bind(select, 'change', function() {


      for (var index = 0; index < gui.__preset_select.length; index++) {
        gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
      }

      gui.preset = this.value;

    });

    div.appendChild(select);
    div.appendChild(gears);
    div.appendChild(button);
    div.appendChild(button2);
    div.appendChild(button3);

    if (SUPPORTS_LOCAL_STORAGE) {

      var saveLocally = document.getElementById('dg-save-locally');
      var explain = document.getElementById('dg-local-explain');

      saveLocally.style.display = 'block';

      var localStorageCheckBox = document.getElementById('dg-local-storage');

      if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
        localStorageCheckBox.setAttribute('checked', 'checked');
      }

      function showHideExplain() {
        explain.style.display = gui.useLocalStorage ? 'block' : 'none';
      }

      showHideExplain();

      // TODO: Use a boolean controller, fool!
      dom.bind(localStorageCheckBox, 'change', function() {
        gui.useLocalStorage = !gui.useLocalStorage;
        showHideExplain();
      });

    }

    var newConstructorTextArea = document.getElementById('dg-new-constructor');

    dom.bind(newConstructorTextArea, 'keydown', function(e) {
      if (e.metaKey && (e.which === 67 || e.keyCode == 67)) {
        SAVE_DIALOGUE.hide();
      }
    });

    dom.bind(gears, 'click', function() {
      newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
      SAVE_DIALOGUE.show();
      newConstructorTextArea.focus();
      newConstructorTextArea.select();
    });

    dom.bind(button, 'click', function() {
      gui.save();
    });

    dom.bind(button2, 'click', function() {
      var presetName = prompt('Enter a new preset name.');
      if (presetName) gui.saveAs(presetName);
    });

    dom.bind(button3, 'click', function() {
      gui.revert();
    });

//    div.appendChild(button2);

  }

  function addResizeHandle(gui) {

    gui.__resize_handle = document.createElement('div');

    common.extend(gui.__resize_handle.style, {

      width: '6px',
      marginLeft: '-3px',
      height: '200px',
      cursor: 'ew-resize',
      position: 'absolute'
//      border: '1px solid blue'

    });

    var pmouseX;

    dom.bind(gui.__resize_handle, 'mousedown', dragStart);
    dom.bind(gui.__closeButton, 'mousedown', dragStart);

    gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);

    function dragStart(e) {

      e.preventDefault();

      pmouseX = e.clientX;

      dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
      dom.bind(window, 'mousemove', drag);
      dom.bind(window, 'mouseup', dragStop);

      return false;

    }

    function drag(e) {

      e.preventDefault();

      gui.width += pmouseX - e.clientX;
      gui.onResize();
      pmouseX = e.clientX;

      return false;

    }

    function dragStop() {

      dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
      dom.unbind(window, 'mousemove', drag);
      dom.unbind(window, 'mouseup', dragStop);

    }

  }

  function setWidth(gui, w) {
    gui.domElement.style.width = w + 'px';
    // Auto placed save-rows are position fixed, so we have to
    // set the width manually if we want it to bleed to the edge
    if (gui.__save_row && gui.autoPlace) {
      gui.__save_row.style.width = w + 'px';
    }if (gui.__closeButton) {
      gui.__closeButton.style.width = w + 'px';
    }
  }

  function getCurrentPreset(gui, useInitialValues) {

    var toReturn = {};

    // For each object I'm remembering
    common.each(gui.__rememberedObjects, function(val, index) {

      var saved_values = {};

      // The controllers I've made for thcommon.isObject by property
      var controller_map =
          gui.__rememberedObjectIndecesToControllers[index];

      // Remember each value for each property
      common.each(controller_map, function(controller, property) {
        saved_values[property] = useInitialValues ? controller.initialValue : controller.getValue();
      });

      // Save the values for thcommon.isObject
      toReturn[index] = saved_values;

    });

    return toReturn;

  }

  function addPresetOption(gui, name, setSelected) {
    var opt = document.createElement('option');
    opt.innerHTML = name;
    opt.value = name;
    gui.__preset_select.appendChild(opt);
    if (setSelected) {
      gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
    }
  }

  function setPresetSelectIndex(gui) {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      if (gui.__preset_select[index].value == gui.preset) {
        gui.__preset_select.selectedIndex = index;
      }
    }
  }

  function markPresetModified(gui, modified) {
    var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
//    console.log('mark', modified, opt);
    if (modified) {
      opt.innerHTML = opt.value + "*";
    } else {
      opt.innerHTML = opt.value;
    }
  }

  function updateDisplays(controllerArray) {


    if (controllerArray.length != 0) {

      requestAnimationFrame(function() {
        updateDisplays(controllerArray);
      });

    }

    common.each(controllerArray, function(c) {
      c.updateDisplay();
    });

  }

  return GUI;

})(dat.utils.css,
"<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n      \n    </div>\n    \n  </div>\n\n</div>",
".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity 0.1s linear;-o-transition:opacity 0.1s linear;-moz-transition:opacity 0.1s linear;transition:opacity 0.1s linear;border:0;position:absolute;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-x:hidden}.dg.a.has-save ul{margin-top:27px}.dg.a.has-save ul.closed{margin-top:0}.dg.a .save-row{position:fixed;top:0;z-index:1002}.dg li{-webkit-transition:height 0.1s ease-out;-o-transition:height 0.1s ease-out;-moz-transition:height 0.1s ease-out;transition:height 0.1s ease-out}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;overflow:hidden;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li > *{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:9px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2fa1d6}.dg .cr.number input[type=text]{color:#2fa1d6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2fa1d6}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n",
dat.controllers.factory = (function (OptionController, NumberControllerBox, NumberControllerSlider, StringController, FunctionController, BooleanController, common) {

      return function(object, property) {

        var initialValue = object[property];

        // Providing options?
        if (common.isArray(arguments[2]) || common.isObject(arguments[2])) {
          return new OptionController(object, property, arguments[2]);
        }

        // Providing a map?

        if (common.isNumber(initialValue)) {

          if (common.isNumber(arguments[2]) && common.isNumber(arguments[3])) {

            // Has min and max.
            return new NumberControllerSlider(object, property, arguments[2], arguments[3]);

          } else {

            return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });

          }

        }

        if (common.isString(initialValue)) {
          return new StringController(object, property);
        }

        if (common.isFunction(initialValue)) {
          return new FunctionController(object, property, '');
        }

        if (common.isBoolean(initialValue)) {
          return new BooleanController(object, property);
        }

      }

    })(dat.controllers.OptionController,
dat.controllers.NumberControllerBox,
dat.controllers.NumberControllerSlider,
dat.controllers.StringController = (function (Controller, dom, common) {

  /**
   * @class Provides a text input to alter the string property of an object.
   *
   * @extends dat.controllers.Controller
   *
   * @param {Object} object The object to be manipulated
   * @param {string} property The name of the property to be manipulated
   *
   * @member dat.controllers
   */
  var StringController = function(object, property) {

    StringController.superclass.call(this, object, property);

    var _this = this;

    this.__input = document.createElement('input');
    this.__input.setAttribute('type', 'text');

    dom.bind(this.__input, 'keyup', onChange);
    dom.bind(this.__input, 'change', onChange);
    dom.bind(this.__input, 'blur', onBlur);
    dom.bind(this.__input, 'keydown', function(e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });
    

    function onChange() {
      _this.setValue(_this.__input.value);
    }

    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }

    this.updateDisplay();

    this.domElement.appendChild(this.__input);

  };

  StringController.superclass = Controller;

  common.extend(

      StringController.prototype,
      Controller.prototype,

      {

        updateDisplay: function() {
          // Stops the caret from moving on account of:
          // keyup -> setValue -> updateDisplay
          if (!dom.isActive(this.__input)) {
            this.__input.value = this.getValue();
          }
          return StringController.superclass.prototype.updateDisplay.call(this);
        }

      }

  );

  return StringController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.utils.common),
dat.controllers.FunctionController,
dat.controllers.BooleanController,
dat.utils.common),
dat.controllers.Controller,
dat.controllers.BooleanController,
dat.controllers.FunctionController,
dat.controllers.NumberControllerBox,
dat.controllers.NumberControllerSlider,
dat.controllers.OptionController,
dat.controllers.ColorController = (function (Controller, dom, Color, interpret, common) {

  var ColorController = function(object, property) {

    ColorController.superclass.call(this, object, property);

    this.__color = new Color(this.getValue());
    this.__temp = new Color(0);

    var _this = this;

    this.domElement = document.createElement('div');

    dom.makeSelectable(this.domElement, false);

    this.__selector = document.createElement('div');
    this.__selector.className = 'selector';

    this.__saturation_field = document.createElement('div');
    this.__saturation_field.className = 'saturation-field';

    this.__field_knob = document.createElement('div');
    this.__field_knob.className = 'field-knob';
    this.__field_knob_border = '2px solid ';

    this.__hue_knob = document.createElement('div');
    this.__hue_knob.className = 'hue-knob';

    this.__hue_field = document.createElement('div');
    this.__hue_field.className = 'hue-field';

    this.__input = document.createElement('input');
    this.__input.type = 'text';
    this.__input_textShadow = '0 1px 1px ';

    dom.bind(this.__input, 'keydown', function(e) {
      if (e.keyCode === 13) { // on enter
        onBlur.call(this);
      }
    });

    dom.bind(this.__input, 'blur', onBlur);

    dom.bind(this.__selector, 'mousedown', function(e) {

      dom
        .addClass(this, 'drag')
        .bind(window, 'mouseup', function(e) {
          dom.removeClass(_this.__selector, 'drag');
        });

    });

    var value_field = document.createElement('div');

    common.extend(this.__selector.style, {
      width: '122px',
      height: '102px',
      padding: '3px',
      backgroundColor: '#222',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
    });

    common.extend(this.__field_knob.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: this.__field_knob_border + (this.__color.v < .5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      zIndex: 1
    });
    
    common.extend(this.__hue_knob.style, {
      position: 'absolute',
      width: '15px',
      height: '2px',
      borderRight: '4px solid #fff',
      zIndex: 1
    });

    common.extend(this.__saturation_field.style, {
      width: '100px',
      height: '100px',
      border: '1px solid #555',
      marginRight: '3px',
      display: 'inline-block',
      cursor: 'pointer'
    });

    common.extend(value_field.style, {
      width: '100%',
      height: '100%',
      background: 'none'
    });
    
    linearGradient(value_field, 'top', 'rgba(0,0,0,0)', '#000');

    common.extend(this.__hue_field.style, {
      width: '15px',
      height: '100px',
      display: 'inline-block',
      border: '1px solid #555',
      cursor: 'ns-resize'
    });

    hueGradient(this.__hue_field);

    common.extend(this.__input.style, {
      outline: 'none',
//      width: '120px',
      textAlign: 'center',
//      padding: '4px',
//      marginBottom: '6px',
      color: '#fff',
      border: 0,
      fontWeight: 'bold',
      textShadow: this.__input_textShadow + 'rgba(0,0,0,0.7)'
    });

    dom.bind(this.__saturation_field, 'mousedown', fieldDown);
    dom.bind(this.__field_knob, 'mousedown', fieldDown);

    dom.bind(this.__hue_field, 'mousedown', function(e) {
      setH(e);
      dom.bind(window, 'mousemove', setH);
      dom.bind(window, 'mouseup', unbindH);
    });

    function fieldDown(e) {
      setSV(e);
      // document.body.style.cursor = 'none';
      dom.bind(window, 'mousemove', setSV);
      dom.bind(window, 'mouseup', unbindSV);
    }

    function unbindSV() {
      dom.unbind(window, 'mousemove', setSV);
      dom.unbind(window, 'mouseup', unbindSV);
      // document.body.style.cursor = 'default';
    }

    function onBlur() {
      var i = interpret(this.value);
      if (i !== false) {
        _this.__color.__state = i;
        _this.setValue(_this.__color.toOriginal());
      } else {
        this.value = _this.__color.toString();
      }
    }

    function unbindH() {
      dom.unbind(window, 'mousemove', setH);
      dom.unbind(window, 'mouseup', unbindH);
    }

    this.__saturation_field.appendChild(value_field);
    this.__selector.appendChild(this.__field_knob);
    this.__selector.appendChild(this.__saturation_field);
    this.__selector.appendChild(this.__hue_field);
    this.__hue_field.appendChild(this.__hue_knob);

    this.domElement.appendChild(this.__input);
    this.domElement.appendChild(this.__selector);

    this.updateDisplay();

    function setSV(e) {

      e.preventDefault();

      var w = dom.getWidth(_this.__saturation_field);
      var o = dom.getOffset(_this.__saturation_field);
      var s = (e.clientX - o.left + document.body.scrollLeft) / w;
      var v = 1 - (e.clientY - o.top + document.body.scrollTop) / w;

      if (v > 1) v = 1;
      else if (v < 0) v = 0;

      if (s > 1) s = 1;
      else if (s < 0) s = 0;

      _this.__color.v = v;
      _this.__color.s = s;

      _this.setValue(_this.__color.toOriginal());


      return false;

    }

    function setH(e) {

      e.preventDefault();

      var s = dom.getHeight(_this.__hue_field);
      var o = dom.getOffset(_this.__hue_field);
      var h = 1 - (e.clientY - o.top + document.body.scrollTop) / s;

      if (h > 1) h = 1;
      else if (h < 0) h = 0;

      _this.__color.h = h * 360;

      _this.setValue(_this.__color.toOriginal());

      return false;

    }

  };

  ColorController.superclass = Controller;

  common.extend(

      ColorController.prototype,
      Controller.prototype,

      {

        updateDisplay: function() {

          var i = interpret(this.getValue());

          if (i !== false) {

            var mismatch = false;

            // Check for mismatch on the interpreted value.

            common.each(Color.COMPONENTS, function(component) {
              if (!common.isUndefined(i[component]) &&
                  !common.isUndefined(this.__color.__state[component]) &&
                  i[component] !== this.__color.__state[component]) {
                mismatch = true;
                return {}; // break
              }
            }, this);

            // If nothing diverges, we keep our previous values
            // for statefulness, otherwise we recalculate fresh
            if (mismatch) {
              common.extend(this.__color.__state, i);
            }

          }

          common.extend(this.__temp.__state, this.__color.__state);

          this.__temp.a = 1;

          var flip = (this.__color.v < .5 || this.__color.s > .5) ? 255 : 0;
          var _flip = 255 - flip;

          common.extend(this.__field_knob.style, {
            marginLeft: 100 * this.__color.s - 7 + 'px',
            marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
            backgroundColor: this.__temp.toString(),
            border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip +')'
          });

          this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px'

          this.__temp.s = 1;
          this.__temp.v = 1;

          linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toString());

          common.extend(this.__input.style, {
            backgroundColor: this.__input.value = this.__color.toString(),
            color: 'rgb(' + flip + ',' + flip + ',' + flip +')',
            textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip +',.7)'
          });

        }

      }

  );
  
  var vendors = ['-moz-','-o-','-webkit-','-ms-',''];
  
  function linearGradient(elem, x, a, b) {
    elem.style.background = '';
    common.each(vendors, function(vendor) {
      elem.style.cssText += 'background: ' + vendor + 'linear-gradient('+x+', '+a+' 0%, ' + b + ' 100%); ';
    });
  }
  
  function hueGradient(elem) {
    elem.style.background = '';
    elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);'
    elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
    elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
    elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
    elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);'
  }


  return ColorController;

})(dat.controllers.Controller,
dat.dom.dom,
dat.color.Color = (function (interpret, math, toString, common) {

  var Color = function() {

    this.__state = interpret.apply(this, arguments);

    if (this.__state === false) {
      throw 'Failed to interpret color arguments';
    }

    this.__state.a = this.__state.a || 1;


  };

  Color.COMPONENTS = ['r','g','b','h','s','v','hex','a'];

  common.extend(Color.prototype, {

    toString: function() {
      return toString(this);
    },

    toOriginal: function() {
      return this.__state.conversion.write(this);
    }

  });

  defineRGBComponent(Color.prototype, 'r', 2);
  defineRGBComponent(Color.prototype, 'g', 1);
  defineRGBComponent(Color.prototype, 'b', 0);

  defineHSVComponent(Color.prototype, 'h');
  defineHSVComponent(Color.prototype, 's');
  defineHSVComponent(Color.prototype, 'v');

  Object.defineProperty(Color.prototype, 'a', {

    get: function() {
      return this.__state.a;
    },

    set: function(v) {
      this.__state.a = v;
    }

  });

  Object.defineProperty(Color.prototype, 'hex', {

    get: function() {

      if (!this.__state.space !== 'HEX') {
        this.__state.hex = math.rgb_to_hex(this.r, this.g, this.b);
      }

      return this.__state.hex;

    },

    set: function(v) {

      this.__state.space = 'HEX';
      this.__state.hex = v;

    }

  });

  function defineRGBComponent(target, component, componentHexIndex) {

    Object.defineProperty(target, component, {

      get: function() {

        if (this.__state.space === 'RGB') {
          return this.__state[component];
        }

        recalculateRGB(this, component, componentHexIndex);

        return this.__state[component];

      },

      set: function(v) {

        if (this.__state.space !== 'RGB') {
          recalculateRGB(this, component, componentHexIndex);
          this.__state.space = 'RGB';
        }

        this.__state[component] = v;

      }

    });

  }

  function defineHSVComponent(target, component) {

    Object.defineProperty(target, component, {

      get: function() {

        if (this.__state.space === 'HSV')
          return this.__state[component];

        recalculateHSV(this);

        return this.__state[component];

      },

      set: function(v) {

        if (this.__state.space !== 'HSV') {
          recalculateHSV(this);
          this.__state.space = 'HSV';
        }

        this.__state[component] = v;

      }

    });

  }

  function recalculateRGB(color, component, componentHexIndex) {

    if (color.__state.space === 'HEX') {

      color.__state[component] = math.component_from_hex(color.__state.hex, componentHexIndex);

    } else if (color.__state.space === 'HSV') {

      common.extend(color.__state, math.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));

    } else {

      throw 'Corrupted color state';

    }

  }

  function recalculateHSV(color) {

    var result = math.rgb_to_hsv(color.r, color.g, color.b);

    common.extend(color.__state,
        {
          s: result.s,
          v: result.v
        }
    );

    if (!common.isNaN(result.h)) {
      color.__state.h = result.h;
    } else if (common.isUndefined(color.__state.h)) {
      color.__state.h = 0;
    }

  }

  return Color;

})(dat.color.interpret,
dat.color.math = (function () {

  var tmpComponent;

  return {

    hsv_to_rgb: function(h, s, v) {

      var hi = Math.floor(h / 60) % 6;

      var f = h / 60 - Math.floor(h / 60);
      var p = v * (1.0 - s);
      var q = v * (1.0 - (f * s));
      var t = v * (1.0 - ((1.0 - f) * s));
      var c = [
        [v, t, p],
        [q, v, p],
        [p, v, t],
        [p, q, v],
        [t, p, v],
        [v, p, q]
      ][hi];

      return {
        r: c[0] * 255,
        g: c[1] * 255,
        b: c[2] * 255
      };

    },

    rgb_to_hsv: function(r, g, b) {

      var min = Math.min(r, g, b),
          max = Math.max(r, g, b),
          delta = max - min,
          h, s;

      if (max != 0) {
        s = delta / max;
      } else {
        return {
          h: NaN,
          s: 0,
          v: 0
        };
      }

      if (r == max) {
        h = (g - b) / delta;
      } else if (g == max) {
        h = 2 + (b - r) / delta;
      } else {
        h = 4 + (r - g) / delta;
      }
      h /= 6;
      if (h < 0) {
        h += 1;
      }

      return {
        h: h * 360,
        s: s,
        v: max / 255
      };
    },

    rgb_to_hex: function(r, g, b) {
      var hex = this.hex_with_component(0, 2, r);
      hex = this.hex_with_component(hex, 1, g);
      hex = this.hex_with_component(hex, 0, b);
      return hex;
    },

    component_from_hex: function(hex, componentIndex) {
      return (hex >> (componentIndex * 8)) & 0xFF;
    },

    hex_with_component: function(hex, componentIndex, value) {
      return value << (tmpComponent = componentIndex * 8) | (hex & ~ (0xFF << tmpComponent));
    }

  }

})(),
dat.color.toString,
dat.utils.common),
dat.color.interpret,
dat.utils.common),
dat.utils.requestAnimationFrame = (function () {

  /**
   * requirejs version of Paul Irish's RequestAnimationFrame
   * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
   */

  return window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback, element) {

        window.setTimeout(callback, 1000 / 60);

      };
})(),
dat.dom.CenteredDiv = (function (dom, common) {


  var CenteredDiv = function() {

    this.backgroundElement = document.createElement('div');
    common.extend(this.backgroundElement.style, {
      backgroundColor: 'rgba(0,0,0,0.8)',
      top: 0,
      left: 0,
      display: 'none',
      zIndex: '1000',
      opacity: 0,
      WebkitTransition: 'opacity 0.2s linear'
    });

    dom.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = 'fixed';

    this.domElement = document.createElement('div');
    common.extend(this.domElement.style, {
      position: 'fixed',
      display: 'none',
      zIndex: '1001',
      opacity: 0,
      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear'
    });


    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);

    var _this = this;
    dom.bind(this.backgroundElement, 'click', function() {
      _this.hide();
    });


  };

  CenteredDiv.prototype.show = function() {

    var _this = this;
    


    this.backgroundElement.style.display = 'block';

    this.domElement.style.display = 'block';
    this.domElement.style.opacity = 0;
//    this.domElement.style.top = '52%';
    this.domElement.style.webkitTransform = 'scale(1.1)';

    this.layout();

    common.defer(function() {
      _this.backgroundElement.style.opacity = 1;
      _this.domElement.style.opacity = 1;
      _this.domElement.style.webkitTransform = 'scale(1)';
    });

  };

  CenteredDiv.prototype.hide = function() {

    var _this = this;

    var hide = function() {

      _this.domElement.style.display = 'none';
      _this.backgroundElement.style.display = 'none';

      dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
      dom.unbind(_this.domElement, 'transitionend', hide);
      dom.unbind(_this.domElement, 'oTransitionEnd', hide);

    };

    dom.bind(this.domElement, 'webkitTransitionEnd', hide);
    dom.bind(this.domElement, 'transitionend', hide);
    dom.bind(this.domElement, 'oTransitionEnd', hide);

    this.backgroundElement.style.opacity = 0;
//    this.domElement.style.top = '48%';
    this.domElement.style.opacity = 0;
    this.domElement.style.webkitTransform = 'scale(1.1)';

  };

  CenteredDiv.prototype.layout = function() {
    this.domElement.style.left = window.innerWidth/2 - dom.getWidth(this.domElement) / 2 + 'px';
    this.domElement.style.top = window.innerHeight/2 - dom.getHeight(this.domElement) / 2 + 'px';
  };
  
  function lockScroll(e) {
    console.log(e);
  }

  return CenteredDiv;

})(dat.dom.dom,
dat.utils.common),
dat.dom.dom,
dat.utils.common);
},{}],8:[function(require,module,exports){
var resolve = require('soundcloud-resolve')
var fonts = require('google-fonts')
var minstache = require('minstache')
var insert = require('insert-css')
var fs = require('fs')

var icons = {
    black: 'https://developers.soundcloud.com/assets/logo_black.png'
  , white: 'https://developers.soundcloud.com/assets/logo_white.png'
}

module.exports = badge
function noop(err){ if (err) throw err }

var inserted = false
var gwfadded = false
var template = null

function badge(options, callback) {
  if (!inserted) insert(".npm-scb-wrap {\n  font-family: 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;\n  font-weight: 200;\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 999;\n}\n\n.npm-scb-wrap a {\n  text-decoration: none;\n  color: #000;\n}\n.npm-scb-white\n.npm-scb-wrap a {\n  color: #fff;\n}\n\n.npm-scb-inner {\n  position: absolute;\n  top: -120px; left: 0;\n  padding: 8px;\n  width: 100%;\n  height: 150px;\n  z-index: 2;\n  -webkit-transition: width 0.5s cubic-bezier(1, 0, 0, 1), top 0.5s;\n     -moz-transition: width 0.5s cubic-bezier(1, 0, 0, 1), top 0.5s;\n      -ms-transition: width 0.5s cubic-bezier(1, 0, 0, 1), top 0.5s;\n       -o-transition: width 0.5s cubic-bezier(1, 0, 0, 1), top 0.5s;\n          transition: width 0.5s cubic-bezier(1, 0, 0, 1), top 0.5s;\n}\n.npm-scb-wrap:hover\n.npm-scb-inner {\n  top: 0;\n}\n\n.npm-scb-artwork {\n  position: absolute;\n  top: 16px; left: 16px;\n  width: 104px; height: 104px;\n  box-shadow: 0 0 8px -3px #000;\n  outline: 1px solid rgba(0,0,0,0.1);\n  z-index: 2;\n}\n.npm-scb-white\n.npm-scb-artwork {\n  outline: 1px solid rgba(255,255,255,0.1);\n  box-shadow: 0 0 10px -2px rgba(255,255,255,0.9);\n}\n\n.npm-scb-info {\n  position: absolute;\n  top: 16px;\n  left: 120px;\n  width: 300px;\n  z-index: 1;\n}\n\n.npm-scb-info > a {\n  display: block;\n}\n\n.npm-scb-now-playing {\n  font-size: 12px;\n  line-height: 12px;\n  position: absolute;\n  width: 500px;\n  z-index: 1;\n  padding: 15px 0;\n  top: 0; left: 138px;\n  opacity: 1;\n  -webkit-transition: opacity 0.25s;\n     -moz-transition: opacity 0.25s;\n      -ms-transition: opacity 0.25s;\n       -o-transition: opacity 0.25s;\n          transition: opacity 0.25s;\n}\n\n.npm-scb-wrap:hover\n.npm-scb-now-playing {\n  opacity: 0;\n}\n\n.npm-scb-white\n.npm-scb-now-playing {\n  color: #fff;\n}\n.npm-scb-now-playing > a {\n  font-weight: bold;\n}\n\n.npm-scb-info > a > p {\n  margin: 0;\n  padding-bottom: 0.25em;\n  line-height: 1.35em;\n  margin-left: 1em;\n  font-size: 1em;\n}\n\n.npm-scb-title {\n  font-weight: bold;\n}\n\n.npm-scb-icon {\n  position: absolute;\n  top: 120px;\n  padding-top: 0.75em;\n  left: 16px;\n}\n"), inserted = true
  if (!template) template = minstache.compile("<div class=\"npm-scb-wrap\">\n  <div class=\"npm-scb-inner\">\n    <a target=\"_blank\" href=\"{{!urls.song}}\">\n      <img class=\"npm-scb-icon\" src=\"{{!icon}}\">\n      <img class=\"npm-scb-artwork\" src=\"{{!artwork}}\">\n    </a>\n    <div class=\"npm-scb-info\">\n      <a target=\"_blank\" href=\"{{!urls.song}}\">\n        <p class=\"npm-scb-title\">{{!title}}</p>\n      </a>\n      <a target=\"_blank\" href=\"{{!urls.artist}}\">\n        <p class=\"npm-scb-artist\">{{!artist}}</p>\n      </a>\n    </div>\n  </div>\n  <div class=\"npm-scb-now-playing\">\n    Now Playing:\n    <a href=\"{{!urls.song}}\">{{!title}}</a>\n    by\n    <a href=\"{{!urls.artist}}\">{{!artist}}</a>\n  </div>\n</div>")

  if (!gwfadded && options.getFonts) {
    fonts.add({ 'Open Sans': [300, 600] })
    gwfadded = true
  }

  options = options || {}
  callback = callback || noop

  var div   = options.el || document.createElement('div')
  var icon  = !('dark' in options) || options.dark ? 'black' : 'white'
  var id    = options.client_id
  var song  = options.song

  resolve(id, song, function(err, json) {
    if (err) return callback(err)
    if (json.kind !== 'track') throw new Error(
      'soundcloud-badge only supports individual tracks at the moment'
    )

    div.classList[
      icon === 'black' ? 'remove' : 'add'
    ]('npm-scb-white')

    div.innerHTML = template({
        artwork: json.artwork_url || json.user.avatar_url
      , artist: json.user.username
      , title: json.title
      , icon: icons[icon]
      , urls: {
          song: json.permalink_url
        , artist: json.user.permalink_url
      }
    })

    document.body.appendChild(div)

    callback(null, json.stream_url + '?client_id=' + id, json, div)
  })

  return div
}

},{"fs":1,"google-fonts":9,"insert-css":10,"minstache":11,"soundcloud-resolve":12}],9:[function(require,module,exports){
module.exports = asString
module.exports.add = append

function asString(fonts) {
  var href = getHref(fonts)
  return '<link href="' + href + '" rel="stylesheet" type="text/css">'
}

function asElement(fonts) {
  var href = getHref(fonts)
  var link = document.createElement('link')
  link.setAttribute('href', href)
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  return link
}

function getHref(fonts) {
  var family = Object.keys(fonts).map(function(name) {
    var details = fonts[name]
    name = name.replace(/\s+/, '+')
    return typeof details === 'boolean'
      ? name
      : name + ':' + makeArray(details).join(',')
  }).join('|')

  return 'http://fonts.googleapis.com/css?family=' + family
}

function append(fonts) {
  var link = asElement(fonts)
  document.head.appendChild(link)
  return link
}

function makeArray(arr) {
  return Array.isArray(arr) ? arr : [arr]
}

},{}],10:[function(require,module,exports){
var inserted = [];

module.exports = function (css) {
    if (inserted.indexOf(css) >= 0) return;
    inserted.push(css);
    
    var elem = document.createElement('style');
    var text = document.createTextNode(css);
    elem.appendChild(text);
    
    if (document.head.childNodes.length) {
        document.head.insertBefore(elem, document.head.childNodes[0]);
    }
    else {
        document.head.appendChild(elem);
    }
};

},{}],11:[function(require,module,exports){

/**
 * Expose `render()`.`
 */

exports = module.exports = render;

/**
 * Expose `compile()`.
 */

exports.compile = compile;

/**
 * Render the given mustache `str` with `obj`.
 *
 * @param {String} str
 * @param {Object} obj
 * @return {String}
 * @api public
 */

function render(str, obj) {
  obj = obj || {};
  var fn = compile(str);
  return fn(obj);
}

/**
 * Compile the given `str` to a `Function`.
 *
 * @param {String} str
 * @return {Function}
 * @api public
 */

function compile(str) {
  var js = [];
  var toks = parse(str);
  var tok;

  for (var i = 0; i < toks.length; ++i) {
    tok = toks[i];
    if (i % 2 == 0) {
      js.push('"' + tok.replace(/"/g, '\\"') + '"');
    } else {
      switch (tok[0]) {
        case '/':
          tok = tok.slice(1);
          js.push(') + ');
          break;
        case '^':
          tok = tok.slice(1);
          assertProperty(tok);
          js.push(' + section(obj, "' + tok + '", true, ');
          break;
        case '#':
          tok = tok.slice(1);
          assertProperty(tok);
          js.push(' + section(obj, "' + tok + '", false, ');
          break;
        case '!':
          tok = tok.slice(1);
          assertProperty(tok);
          js.push(' + obj.' + tok + ' + ');
          break;
        default:
          assertProperty(tok);
          js.push(' + escape(obj.' + tok + ') + ');
      }
    }
  }

  js = '\n'
    + indent(escape.toString()) + ';\n\n'
    + indent(section.toString()) + ';\n\n'
    + '  return ' + js.join('').replace(/\n/g, '\\n');

  return new Function('obj', js);
}

/**
 * Assert that `prop` is a valid property.
 *
 * @param {String} prop
 * @api private
 */

function assertProperty(prop) {
  if (!prop.match(/^[\w.]+$/)) throw new Error('invalid property "' + prop + '"');
}

/**
 * Parse `str`.
 *
 * @param {String} str
 * @return {Array}
 * @api private
 */

function parse(str) {
  return str.split(/\{\{|\}\}/);
}

/**
 * Indent `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function indent(str) {
  return str.replace(/^/gm, '  ');
}

/**
 * Section handler.
 *
 * @param {Object} context obj
 * @param {String} prop
 * @param {String} str
 * @param {Boolean} negate
 * @api private
 */

function section(obj, prop, negate, str) {
  var val = obj[prop];
  if ('function' == typeof val) return val.call(obj, str);
  if (negate) val = !val;
  if (val) return str;
  return '';
}

/**
 * Escape the given `html`.
 *
 * @param {String} html
 * @return {String}
 * @api private
 */

function escape(html) {
  return String(html)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

},{}],12:[function(require,module,exports){
var qs  = require('querystring')
var xhr = require('xhr')

module.exports = resolve

function resolve(id, goal, callback) {
  var uri = 'http://api.soundcloud.com/resolve.json?' + qs.stringify({
      url: goal
    , client_id: id
  })

  xhr({
      uri: uri
    , method: 'GET'
  }, function(err, res, body) {
    if (err) return callback(err)
    try {
      body = JSON.parse(body)
    } catch(e) {
      return callback(e)
    }
    if (body.errors) return callback(new Error(
      body.errors[0].error_message
    ))
    return callback(null, body)
  })
}

},{"querystring":4,"xhr":13}],13:[function(require,module,exports){
var window = require("global/window")
var once = require("once")

var messages = {
    "0": "Internal XMLHttpRequest Error",
    "4": "4xx Client Error",
    "5": "5xx Server Error"
}

var XHR = window.XMLHttpRequest || noop
var XDR = "withCredentials" in (new XHR()) ?
        window.XMLHttpRequest : window.XDomainRequest

module.exports = createXHR

function createXHR(options, callback) {
    if (typeof options === "string") {
        options = { uri: options }
    }

    options = options || {}
    callback = once(callback)

    var xhr

    if (options.cors) {
        xhr = new XDR()
    } else {
        xhr = new XHR()
    }

    var uri = xhr.url = options.uri
    var method = xhr.method = options.method || "GET"
    var body = options.body || options.data
    var headers = xhr.headers = options.headers || {}
    var isJson = false

    if ("json" in options) {
        isJson = true
        headers["Content-Type"] = "application/json"
        body = JSON.stringify(options.json)
    }

    xhr.onreadystatechange = readystatechange
    xhr.onload = load
    xhr.onerror = error
    // IE9 must have onprogress be set to a unique function.
    xhr.onprogress = function () {
        // IE must die
    }
    // hate IE
    xhr.ontimeout = noop
    xhr.open(method, uri)
    if (options.cors) {
        xhr.withCredentials = true
    }
    xhr.timeout = "timeout" in options ? options.timeout : 5000

    if ( xhr.setRequestHeader) {
        Object.keys(headers).forEach(function (key) {
            xhr.setRequestHeader(key, headers[key])
        })
    }

    xhr.send(body)

    return xhr

    function readystatechange() {
        if (xhr.readyState === 4) {
            load()
        }
    }

    function load() {
        var error = null
        var status = xhr.statusCode = xhr.status
        var body = xhr.body = xhr.response ||
            xhr.responseText || xhr.responseXML

        if (status === 0 || (status >= 400 && status < 600)) {
            var message = xhr.responseText ||
                messages[String(xhr.status).charAt(0)]
            error = new Error(message)

            error.statusCode = xhr.status
        }

        if (isJson) {
            try {
                body = xhr.body = JSON.parse(body)
            } catch (e) {}
        }

        callback(error, xhr, body)
    }

    function error(evt) {
        callback(evt, xhr)
    }
}


function noop() {}

},{"global/window":14,"once":15}],14:[function(require,module,exports){
(function (global){
if (typeof window !== "undefined") {
    module.exports = window
} else if (typeof global !== "undefined") {
    module.exports = global
} else {
    module.exports = {}
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],15:[function(require,module,exports){
module.exports = once

once.proto = once(function () {
  Object.defineProperty(Function.prototype, 'once', {
    value: function () {
      return once(this)
    },
    configurable: true
  })
})

function once (fn) {
  var called = false
  return function () {
    if (called) return
    called = true
    return fn.apply(this, arguments)
  }
}

},{}],16:[function(require,module,exports){
// SceneApp.js

var GL = bongiovi.GL, gl;
var SubsceneLantern = require("./subsceneLantern/SubsceneLantern");
var SubsceneTerrain = require("./subsceneTerrain/SubsceneTerrain");
	
var Vec3 = require("./Vec3");
//	post effects
var ViewFXAA = require("./ViewFXAA");
var ViewBlur = require("./ViewBlur");
var ViewPost = require("./ViewPost");
var ViewBg = require("./ViewBg");

function SceneApp() {
	this.count = 0;
	gl = GL.gl;
	bongiovi.Scene.call(this);

	window.addEventListener("resize", this.resize.bind(this));

	this.camera.setPerspective(90 * Math.PI/180, GL.aspectRatio, 5, 4000);
	this.camera.lockRotation(false);
	this.camera.radius.setTo(1200);
	var easing = .015;
	this.camera.radius.setEasing(easing);
	this.sceneRotation.lock(true);
	this.cameraTarget = new Vec3(300, 0, 1000, easing);
	this.camera._rx.setTo(.1);
	this.camera._rx.limit(0, .1);
	this.cameraOffset = new Vec3(0, 0, 0, easing);
}


var p = SceneApp.prototype = new bongiovi.Scene();



p.setState = function(index) {
	console.log('setState', index);

	if(index == 0) {
		this.cameraTarget.set(300, 0, 1000);
		this.camera.radius.value = 1200;
		this.cameraOffset.set(0, 0, 0);
	} else if(index == 1) {
		this.cameraTarget.set(0, -100, 0);
		this.camera.radius.value = 600;
		this.cameraOffset.set(0, -50, 0);
	}
};

p._initTextures = function() {
	console.log('Init Textures');

	this._textureBg = new bongiovi.GLTexture(images.bg);
	this._textureBg1 = new bongiovi.GLTexture(images.bg1);
	this._textureBg2 = new bongiovi.GLTexture(images.bg3);
	var renderSize = 1024;
	// this._fboRender = new bongiovi.FrameBuffer(renderSize, renderSize);
	this._fboRender = new bongiovi.FrameBuffer(GL.width, GL.height);
	this._fboBg = new bongiovi.FrameBuffer(renderSize, renderSize/2);
};

p._initViews = function() {
	console.log('Init Views');
	this._vCopy = new  bongiovi.ViewCopy();
	this._vBg = new ViewBg();
	this._subsceneLantern = new SubsceneLantern(this);
	this._subsceneTerrain = new SubsceneTerrain(this);

	var fboBlurSize = 512;
	var vBlur = new ViewBlur(true);
	var hBlur = new ViewBlur(false);
	var passVBlur = new bongiovi.post.Pass(vBlur, fboBlurSize, fboBlurSize);
	var passHBlur = new bongiovi.post.Pass(hBlur, fboBlurSize, fboBlurSize);

	var fboSize = 1024;
	this._vPost = new ViewPost();
	var passPost = new bongiovi.post.Pass(this._vPost, fboSize, fboSize);
	this._vFxaa = new ViewFXAA();
	var passFxaa = new bongiovi.post.Pass(this._vFxaa, fboSize, fboSize);


	this._composerPost = new bongiovi.post.EffectComposer();
	this._composerPost.addPass(passPost);
	// this._composerPost.addPass(passFxaa, fboSize, fboSize);

	
	this._composerBlur = new bongiovi.post.EffectComposer();
	this._composerBlur.addPass(passVBlur);
	// this._composerBlur.addPass(passVBlur);
	// this._composerBlur.addPass(passHBlur);
	this._composerBlur.addPass(passHBlur);
};

p._update = function() {
	this._subsceneLantern.update();
};

p.render = function() {
	//	CAMERA 
	this.camera.center = this.cameraTarget.getValue();
	this.camera.positionOffset = this.cameraOffset.getValue();


	this.count += .01;
	params.post.bgOffset = Math.sin(this.count) * .5 + .5;
	this._update();


//*/
	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);

	GL.setViewport(0, 0, this._fboBg.width, this._fboBg.height);
	this._fboBg.bind();
	GL.clear(0, 0, 0, 0);
	this._vBg.render(this._textureBg1, this._textureBg2);
	this._fboBg.unbind();

	GL.setViewport(0, 0, GL.width, GL.height);

	gl.disable(gl.DEPTH_TEST);
	this._vCopy.render(this._fboBg.getTexture());

	gl.enable(gl.DEPTH_TEST);
	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);
	
	this._subsceneTerrain.render(this._fboBg.getTexture());
	this._subsceneLantern.render(this._fboBg.getTexture());
	
	return;

	//*/


	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);

	GL.setViewport(0, 0, this._fboBg.width, this._fboBg.height);
	this._fboBg.bind();
	GL.clear(0, 0, 0, 0);
	this._vBg.render(this._textureBg1, this._textureBg2);
	this._fboBg.unbind();


	GL.setViewport(0, 0, this._fboRender.width, this._fboRender.height);

	this._fboRender.bind();
	GL.clear(0, 0, 0, 1);
	gl.disable(gl.DEPTH_TEST);
	this._vCopy.render(this._fboBg.getTexture());

	gl.enable(gl.DEPTH_TEST);
	GL.setMatrices(this.camera);
	GL.rotate(this.sceneRotation.matrix);
	this._subsceneLantern.render(this._fboBg.getTexture());
	this._subsceneTerrain.render(this._fboBg.getTexture());
	this._fboRender.unbind();

	GL.setViewport(0, 0, GL.width, GL.height);
	GL.setMatrices(this.cameraOrtho);
	GL.rotate(this.rotationFront);

	this._composerBlur.render(this._fboRender.getTexture());
	this._vPost.textureBlur = this._composerBlur.getTexture();

	GL.enableAdditiveBlending();
	this._composerPost.render(this._fboRender.getTexture());
	this._vCopy.render(this._fboRender.getTexture());
	this._vFxaa.render(this._composerPost.getTexture());
	GL.enableAlphaBlending();
};

p.resize = function() {
	console.log('Resize');
	GL.setSize(window.innerWidth, window.innerHeight);
	this.camera.resize(GL.aspectRatio);

	this._fboRender = new bongiovi.FrameBuffer(GL.width, GL.height);
};

module.exports = SceneApp;
},{"./Vec3":17,"./ViewBg":18,"./ViewBlur":19,"./ViewFXAA":20,"./ViewPost":21,"./subsceneLantern/SubsceneLantern":24,"./subsceneTerrain/SubsceneTerrain":29}],17:[function(require,module,exports){
// Vec3.js

function Vec3(x, y, z, easing) {
	x = x === undefined ? 0 : x;
	y = y === undefined ? 0 : y;
	z = z === undefined ? 0 : z;
	easing = easing || .1;

	this.x = new bongiovi.EaseNumber(x, easing);
	this.y = new bongiovi.EaseNumber(y, easing);
	this.z = new bongiovi.EaseNumber(z, easing);
}


var p = Vec3.prototype;

p.set = function(x, y, z) {
	this.x.value = x;
	this.y.value = y;
	this.z.value = z;
}

p.setTo = function(x, y, z) {
	this.x.setTo(x);
	this.y.setTo(y);
	this.z.setTo(z);
};

p.getValue = function() {
	return [ this.x.value, this.y.value, this.z.value ];
};


module.exports = Vec3;
},{}],18:[function(require,module,exports){
// ViewBg.js

var GL = bongiovi.GL;
var gl;


function ViewBg() {
	bongiovi.View.call(this, null, "#define GLSLIFY 1\n// bg.frag\n#define SHADER_NAME SIMPLE_TEXTURE\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform sampler2D textureNext;\nuniform float bgOffset;\n\nvoid main(void) {\n    vec4 bg0 = texture2D(texture, vTextureCoord);\n    vec4 bg1 = texture2D(textureNext, vTextureCoord);\n\n    gl_FragColor = mix(bg0, bg1, bgOffset);\n}");
}

var p = ViewBg.prototype = new bongiovi.View();
p.constructor = ViewBg;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture, textureNext) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureNext", "uniform1i", 1);
	textureNext.bind(1);
	this.shader.uniform("bgOffset", "uniform1f", params.post.bgOffset);
	GL.draw(this.mesh);
};

module.exports = ViewBg;
},{}],19:[function(require,module,exports){
// ViewBlur.js


var GL = bongiovi.GL;
var gl;


function ViewBlur(isVertical) {
	isVertical = isVertical === undefined ? true : isVertical;
	this._direction = isVertical ? [0, 1] : [1, 0];
	bongiovi.View.call(this, null, "#define GLSLIFY 1\n// blur.frag\n\n#define SHADER_NAME SIMPLE_TEXTURE\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform vec2 resolution;\nuniform vec2 direction;\nuniform sampler2D texture;\n\n\n\nvec4 blur13(sampler2D image, vec2 uv, vec2 res, vec2 dir) {\n\tvec4 color = vec4(0.0);\n\tvec2 off1 = vec2(1.411764705882353) * dir;\n\tvec2 off2 = vec2(3.2941176470588234) * dir;\n\tvec2 off3 = vec2(5.176470588235294) * dir;\n\tcolor += texture2D(image, uv) * 0.1964825501511404;\n\tcolor += texture2D(image, uv + (off1 / res)) * 0.2969069646728344;\n\tcolor += texture2D(image, uv - (off1 / res)) * 0.2969069646728344;\n\tcolor += texture2D(image, uv + (off2 / res)) * 0.09447039785044732;\n\tcolor += texture2D(image, uv - (off2 / res)) * 0.09447039785044732;\n\tcolor += texture2D(image, uv + (off3 / res)) * 0.010381362401148057;\n\tcolor += texture2D(image, uv - (off3 / res)) * 0.010381362401148057;\n\treturn color;\n}\n\nvec4 blur9(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {\n  vec4 color = vec4(0.0);\n  vec2 off1 = vec2(1.3846153846) * direction;\n  vec2 off2 = vec2(3.2307692308) * direction;\n  color += texture2D(image, uv) * 0.2270270270;\n  color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;\n  color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;\n  color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;\n  color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;\n  return color;\n}\n\nvoid main(void) {\n\n\tvec4 texel = blur13(texture, vTextureCoord, resolution, direction);\n    gl_FragColor = texel;\n}");
}

var p = ViewBlur.prototype = new bongiovi.View();
p.constructor = ViewBlur;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("resolution", "uniform2fv", [GL.width, GL.height]);
	this.shader.uniform("direction", "uniform2fv", this._direction);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewBlur;
},{}],20:[function(require,module,exports){
// ViewFXAA.js

var GL = bongiovi.GL;
var gl;


function ViewFXAA() {
	bongiovi.View.call(this, null, "#define GLSLIFY 1\n// fxaa.frag\n\n#define SHADER_NAME SIMPLE_TEXTURE\n\nprecision highp float;\n\nvarying vec2 vTextureCoord;\nvarying vec2 v_rgbNW;\nvarying vec2 v_rgbNE;\nvarying vec2 v_rgbSW;\nvarying vec2 v_rgbSE;\nvarying vec2 v_rgbM;\n\nuniform sampler2D texture;\nuniform vec2 resolution;\n\n\nfloat FXAA_SUBPIX_SHIFT = 1.0/4.0;\n#define FXAA_REDUCE_MIN   (1.0/ 128.0)\n#define FXAA_REDUCE_MUL   (1.0 / 8.0)\n#define FXAA_SPAN_MAX     8.0\n\n\n\nvec4 applyFXAA(vec2 fragCoord, sampler2D tex) {\n    float rtWidth = resolution.x;\n    float rtHeight = resolution.y;\n    vec4 color;\n    vec2 inverseVP = vec2(1.0 / rtWidth, 1.0 / rtHeight);\n    vec3 rgbNW = texture2D(tex, (fragCoord + vec2(-1.0, -1.0)) * inverseVP).xyz;\n    vec3 rgbNE = texture2D(tex, (fragCoord + vec2(1.0, -1.0)) * inverseVP).xyz;\n    vec3 rgbSW = texture2D(tex, (fragCoord + vec2(-1.0, 1.0)) * inverseVP).xyz;\n    vec3 rgbSE = texture2D(tex, (fragCoord + vec2(1.0, 1.0)) * inverseVP).xyz;\n    vec4 colorPixel  = texture2D(tex, fragCoord  * inverseVP);\n    vec3 rgbM  = colorPixel.xyz;\n    vec3 luma = vec3(0.299, 0.587, 0.114);\n    float lumaNW = dot(rgbNW, luma);\n    float lumaNE = dot(rgbNE, luma);\n    float lumaSW = dot(rgbSW, luma);\n    float lumaSE = dot(rgbSE, luma);\n    float lumaM  = dot(rgbM,  luma);\n    float lumaMin = min(lumaM, min(min(lumaNW, lumaNE), min(lumaSW, lumaSE)));\n    float lumaMax = max(lumaM, max(max(lumaNW, lumaNE), max(lumaSW, lumaSE)));\n\n    //return texture2D(tex, fragCoord);\n    // return vec4(fragCoord, 0.0, 1.0);\n    // return vec4(rgbM, 1.0);\n\n    vec2 dir;\n    dir.x = -((lumaNW + lumaNE) - (lumaSW + lumaSE));\n    dir.y =  ((lumaNW + lumaSW) - (lumaNE + lumaSE));\n\n    float dirReduce = max((lumaNW + lumaNE + lumaSW + lumaSE) *\n                          (0.25 * FXAA_REDUCE_MUL), FXAA_REDUCE_MIN);\n\n    float rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);\n    dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),\n              max(vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX),\n              dir * rcpDirMin)) * inverseVP;\n\n    // vec3 rgbA = 0.5 * (\n    //     texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)).xyz +\n    //     texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)).xyz);\n    // vec3 rgbB = rgbA * 0.5 + 0.25 * (\n    //     texture2D(tex, fragCoord * inverseVP + dir * -0.5).xyz +\n    //     texture2D(tex, fragCoord * inverseVP + dir * 0.5).xyz);\n\n    vec4 rgbaA = 0.5 * (\n        texture2D(tex, fragCoord * inverseVP + dir * (1.0 / 3.0 - 0.5)) +\n        texture2D(tex, fragCoord * inverseVP + dir * (2.0 / 3.0 - 0.5)));\n\n    vec4 rgbaB = rgbaA * 0.5 + 0.25 * (\n        texture2D(tex, fragCoord * inverseVP + dir * -0.5) +\n        texture2D(tex, fragCoord * inverseVP + dir * 0.5));\n\n    float lumaB = dot(rgbaB.xyz, luma);\n    if ((lumaB < lumaMin) || (lumaB > lumaMax))\n        color = rgbaA;\n    else\n        color = rgbaB;\n\n    return color;\n}\n\n\n\n\nvoid main(void) {\n    vec2 fragCoord = vTextureCoord * resolution; \n\n    gl_FragColor = applyFXAA(fragCoord, texture);\n}");
}

var p = ViewFXAA.prototype = new bongiovi.View();
p.constructor = ViewFXAA;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("resolution", "uniform2fv", [GL.width, GL.height]);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewFXAA;
},{}],21:[function(require,module,exports){
// ViewPost.js

var GL = bongiovi.GL;
var gl;


function ViewPost() {
	this.textureBlur = null;
	bongiovi.View.call(this, null, "#define GLSLIFY 1\n#define SHADER_NAME SIMPLE_TEXTURE\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform sampler2D textureBlur;\nuniform float bloom;\nuniform float gamma;\n\nvoid main(void) {\n\tvec4 colorOrg  = texture2D(texture, vTextureCoord);\n\tvec4 colorBlur = texture2D(textureBlur, vTextureCoord);\n\tvec4 color     = colorOrg;\n\tcolor.rgb      += colorBlur.rgb * bloom;\n\t\n\t//\tcolor correction\n\tcolor.rgb      = pow(color.rgb, vec3(1.0 / gamma));\n\t\n\tgl_FragColor   = color;\n}");
}

var p = ViewPost.prototype = new bongiovi.View();
p.constructor = ViewPost;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture) {
	if(!this.textureBlur){
		return;
	}
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureBlur", "uniform1i", 1);
	this.textureBlur.bind(1);
	this.shader.uniform("bloom", "uniform1f", params.post.bloom);
	this.shader.uniform("gamma", "uniform1f", params.post.gamma || 2.2);
	GL.draw(this.mesh);
};

module.exports = ViewPost;
},{}],22:[function(require,module,exports){
// app.js
window.bongiovi = require("./libs/bongiovi-post.min.js");
var dat = require("dat-gui");

window.params = {
	numParticles:64,
	skipCount:15,
	gamma:2.2,
	density:.10,
	weight:.1,
	decay:.85,

	terrain: {
		noise:.3,
		terrainNoiseHeight:235.0,
		detailMapScale:3.4,
		detailMapHeight:.25,
		noiseScale:.25,
		lightPos:[500.0, 500.0, 500.0],
		lightColor:[255.0, 255.0, 255.0],
		bump:.53,
		shininess:.55,
		roughness:1.0,
		albedo:.5,
		ambient:.28
	},


	post: {
		bloom:.25,
		gamma:1.2,
		bgOffset:0
	}
};

(function() {
	var SceneApp = require("./SceneApp");

	App = function() {
		var l = new bongiovi.SimpleImageLoader();
		var a = [
			'assets/gold.jpg', 
			'assets/bg.jpg',
			'assets/bg1.jpg',
			'assets/bg2.jpg',
			'assets/bg3.jpg',
			'assets/starsmap.jpg',
			'assets/paperNormal.jpg',
			"assets/detailHeight.png",
			"assets/noise.png",
			];
		l.load(a, this, this._onImageLoader);
	}

	var p = App.prototype;

	p._onImageLoader = function(img) {
		window.images = img;
		if(document.body) this._init();
		else {
			window.addEventListener("load", this._init.bind(this));
		}
	};

	p._init = function() {
		this.canvas = document.createElement("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.className = "Main-Canvas";
		var options = {
		    alpha: false,
		    premultipliedAlpha: false
		}
		document.body.appendChild(this.canvas, null, null, options);
		bongiovi.GL.init(this.canvas);

		this._scene = new SceneApp();
		bongiovi.Scheduler.addEF(this, this._loop);

		this.gui = new dat.GUI({width:300});
		var fTerrain = this.gui.addFolder('terrain');
		fTerrain.open();
		fTerrain.add(params.terrain, 'bump', 0, 1);
		fTerrain.add(params.terrain, 'shininess', 0, 1);
		fTerrain.add(params.terrain, 'roughness', 0, 1);
		fTerrain.add(params.terrain, 'albedo', 0, 1);

		var fPost = this.gui.addFolder('post');
		fPost.open();
		fPost.add(params.post, 'bgOffset', 0, 1.0).listen();
		fPost.add(params.post, 'bloom', 0, 1.0);
		fPost.add(params.post, 'gamma', 0, 3.0);
//*/
		require('soundcloud-badge')({
		    client_id: 'e8b7a335a5321247b38da4ccc07b07a2'
		  , song: 'https://soundcloud.com/rsheehan/rhian-sheehan-la-bo-te-musique'
		  // , song: 'https://soundcloud.com/dee-san/oscillate-01'
		  , dark: false
		  , getFonts: true
		}, function(err, src, data, div) {
		  if (err) throw err;
		  var audio = new Audio
		  audio.src = src
		  audio.play()
		  audio.loop = true;
		  audio.volume = .25;
		});
//*/		

		window.addEventListener('keydown', this._onKeyDown.bind(this));
		this._scene.setState(1);
	};


	p._onKeyDown = function(e) {
		console.log(e.keyCode, e);
		if(e.keyCode == 48) {	//	state 0
			this._scene.setState(0);
		} else if(e.keyCode == 49) {	//	state 1
			this._scene.setState(1);
		}
	};

	p._loop = function() {
		this._scene.loop();
	};

})();


new App();
},{"./SceneApp":16,"./libs/bongiovi-post.min.js":23,"dat-gui":5,"soundcloud-badge":8}],23:[function(require,module,exports){
(function (global){
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var e;e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,e.bongioviPost=t()}}(function(){var t;return function e(t,i,r){function n(a,o){if(!i[a]){if(!t[a]){var h="function"==typeof require&&require;if(!o&&h)return h(a,!0);if(s)return s(a,!0);var u=new Error("Cannot find module '"+a+"'");throw u.code="MODULE_NOT_FOUND",u}var c=i[a]={exports:{}};t[a][0].call(c.exports,function(e){var i=t[a][1][e];return n(i?i:e)},c,c.exports,e,t,i,r)}return i[a].exports}for(var s="function"==typeof require&&require,a=0;a<r.length;a++)n(r[a]);return n}({1:[function(t,e){"use strict";var i=t("./bongiovi");i.post={Pass:t("./bongiovi/post/Pass"),EffectComposer:t("./bongiovi/post/EffectComposer"),PassGreyscale:t("./bongiovi/post/PassGreyscale")},e.exports=i},{"./bongiovi":3,"./bongiovi/post/EffectComposer":28,"./bongiovi/post/Pass":29,"./bongiovi/post/PassGreyscale":30}],2:[function(e,i,r){!function(n){"use strict";var s={};"undefined"==typeof r?"function"==typeof t&&"object"==typeof t.amd&&t.amd?(s.exports={},t(function(){return s.exports})):s.exports="undefined"!=typeof window?window:n:s.exports=r,function(r){if(!n)var n=1e-6;if(!s)var s="undefined"!=typeof Float32Array?Float32Array:Array;if(!a)var a=Math.random;var o={};o.setMatrixArrayType=function(t){s=t},"undefined"!=typeof r&&(r.glMatrix=o);var h=Math.PI/180;o.toRadian=function(t){return t*h};var u={};u.create=function(){var t=new s(2);return t[0]=0,t[1]=0,t},u.clone=function(t){var e=new s(2);return e[0]=t[0],e[1]=t[1],e},u.fromValues=function(t,e){var i=new s(2);return i[0]=t,i[1]=e,i},u.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t},u.set=function(t,e,i){return t[0]=e,t[1]=i,t},u.add=function(t,e,i){return t[0]=e[0]+i[0],t[1]=e[1]+i[1],t},u.subtract=function(t,e,i){return t[0]=e[0]-i[0],t[1]=e[1]-i[1],t},u.sub=u.subtract,u.multiply=function(t,e,i){return t[0]=e[0]*i[0],t[1]=e[1]*i[1],t},u.mul=u.multiply,u.divide=function(t,e,i){return t[0]=e[0]/i[0],t[1]=e[1]/i[1],t},u.div=u.divide,u.min=function(t,e,i){return t[0]=Math.min(e[0],i[0]),t[1]=Math.min(e[1],i[1]),t},u.max=function(t,e,i){return t[0]=Math.max(e[0],i[0]),t[1]=Math.max(e[1],i[1]),t},u.scale=function(t,e,i){return t[0]=e[0]*i,t[1]=e[1]*i,t},u.scaleAndAdd=function(t,e,i,r){return t[0]=e[0]+i[0]*r,t[1]=e[1]+i[1]*r,t},u.distance=function(t,e){var i=e[0]-t[0],r=e[1]-t[1];return Math.sqrt(i*i+r*r)},u.dist=u.distance,u.squaredDistance=function(t,e){var i=e[0]-t[0],r=e[1]-t[1];return i*i+r*r},u.sqrDist=u.squaredDistance,u.length=function(t){var e=t[0],i=t[1];return Math.sqrt(e*e+i*i)},u.len=u.length,u.squaredLength=function(t){var e=t[0],i=t[1];return e*e+i*i},u.sqrLen=u.squaredLength,u.negate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t},u.normalize=function(t,e){var i=e[0],r=e[1],n=i*i+r*r;return n>0&&(n=1/Math.sqrt(n),t[0]=e[0]*n,t[1]=e[1]*n),t},u.dot=function(t,e){return t[0]*e[0]+t[1]*e[1]},u.cross=function(t,e,i){var r=e[0]*i[1]-e[1]*i[0];return t[0]=t[1]=0,t[2]=r,t},u.lerp=function(t,e,i,r){var n=e[0],s=e[1];return t[0]=n+r*(i[0]-n),t[1]=s+r*(i[1]-s),t},u.random=function(t,e){e=e||1;var i=2*a()*Math.PI;return t[0]=Math.cos(i)*e,t[1]=Math.sin(i)*e,t},u.transformMat2=function(t,e,i){var r=e[0],n=e[1];return t[0]=i[0]*r+i[2]*n,t[1]=i[1]*r+i[3]*n,t},u.transformMat2d=function(t,e,i){var r=e[0],n=e[1];return t[0]=i[0]*r+i[2]*n+i[4],t[1]=i[1]*r+i[3]*n+i[5],t},u.transformMat3=function(t,e,i){var r=e[0],n=e[1];return t[0]=i[0]*r+i[3]*n+i[6],t[1]=i[1]*r+i[4]*n+i[7],t},u.transformMat4=function(t,e,i){var r=e[0],n=e[1];return t[0]=i[0]*r+i[4]*n+i[12],t[1]=i[1]*r+i[5]*n+i[13],t},u.forEach=function(){var t=u.create();return function(e,i,r,n,s,a){var o,h;for(i||(i=2),r||(r=0),h=n?Math.min(n*i+r,e.length):e.length,o=r;h>o;o+=i)t[0]=e[o],t[1]=e[o+1],s(t,t,a),e[o]=t[0],e[o+1]=t[1];return e}}(),u.str=function(t){return"vec2("+t[0]+", "+t[1]+")"},"undefined"!=typeof r&&(r.vec2=u);var c={};c.create=function(){var t=new s(3);return t[0]=0,t[1]=0,t[2]=0,t},c.clone=function(t){var e=new s(3);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e},c.fromValues=function(t,e,i){var r=new s(3);return r[0]=t,r[1]=e,r[2]=i,r},c.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t},c.set=function(t,e,i,r){return t[0]=e,t[1]=i,t[2]=r,t},c.add=function(t,e,i){return t[0]=e[0]+i[0],t[1]=e[1]+i[1],t[2]=e[2]+i[2],t},c.subtract=function(t,e,i){return t[0]=e[0]-i[0],t[1]=e[1]-i[1],t[2]=e[2]-i[2],t},c.sub=c.subtract,c.multiply=function(t,e,i){return t[0]=e[0]*i[0],t[1]=e[1]*i[1],t[2]=e[2]*i[2],t},c.mul=c.multiply,c.divide=function(t,e,i){return t[0]=e[0]/i[0],t[1]=e[1]/i[1],t[2]=e[2]/i[2],t},c.div=c.divide,c.min=function(t,e,i){return t[0]=Math.min(e[0],i[0]),t[1]=Math.min(e[1],i[1]),t[2]=Math.min(e[2],i[2]),t},c.max=function(t,e,i){return t[0]=Math.max(e[0],i[0]),t[1]=Math.max(e[1],i[1]),t[2]=Math.max(e[2],i[2]),t},c.scale=function(t,e,i){return t[0]=e[0]*i,t[1]=e[1]*i,t[2]=e[2]*i,t},c.scaleAndAdd=function(t,e,i,r){return t[0]=e[0]+i[0]*r,t[1]=e[1]+i[1]*r,t[2]=e[2]+i[2]*r,t},c.distance=function(t,e){var i=e[0]-t[0],r=e[1]-t[1],n=e[2]-t[2];return Math.sqrt(i*i+r*r+n*n)},c.dist=c.distance,c.squaredDistance=function(t,e){var i=e[0]-t[0],r=e[1]-t[1],n=e[2]-t[2];return i*i+r*r+n*n},c.sqrDist=c.squaredDistance,c.length=function(t){var e=t[0],i=t[1],r=t[2];return Math.sqrt(e*e+i*i+r*r)},c.len=c.length,c.squaredLength=function(t){var e=t[0],i=t[1],r=t[2];return e*e+i*i+r*r},c.sqrLen=c.squaredLength,c.negate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t},c.normalize=function(t,e){var i=e[0],r=e[1],n=e[2],s=i*i+r*r+n*n;return s>0&&(s=1/Math.sqrt(s),t[0]=e[0]*s,t[1]=e[1]*s,t[2]=e[2]*s),t},c.dot=function(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]},c.cross=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=i[0],o=i[1],h=i[2];return t[0]=n*h-s*o,t[1]=s*a-r*h,t[2]=r*o-n*a,t},c.lerp=function(t,e,i,r){var n=e[0],s=e[1],a=e[2];return t[0]=n+r*(i[0]-n),t[1]=s+r*(i[1]-s),t[2]=a+r*(i[2]-a),t},c.random=function(t,e){e=e||1;var i=2*a()*Math.PI,r=2*a()-1,n=Math.sqrt(1-r*r)*e;return t[0]=Math.cos(i)*n,t[1]=Math.sin(i)*n,t[2]=r*e,t},c.transformMat4=function(t,e,i){var r=e[0],n=e[1],s=e[2];return t[0]=i[0]*r+i[4]*n+i[8]*s+i[12],t[1]=i[1]*r+i[5]*n+i[9]*s+i[13],t[2]=i[2]*r+i[6]*n+i[10]*s+i[14],t},c.transformMat3=function(t,e,i){var r=e[0],n=e[1],s=e[2];return t[0]=r*i[0]+n*i[3]+s*i[6],t[1]=r*i[1]+n*i[4]+s*i[7],t[2]=r*i[2]+n*i[5]+s*i[8],t},c.transformQuat=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=i[0],o=i[1],h=i[2],u=i[3],c=u*r+o*s-h*n,f=u*n+h*r-a*s,l=u*s+a*n-o*r,d=-a*r-o*n-h*s;return t[0]=c*u+d*-a+f*-h-l*-o,t[1]=f*u+d*-o+l*-a-c*-h,t[2]=l*u+d*-h+c*-o-f*-a,t},c.rotateX=function(t,e,i,r){var n=[],s=[];return n[0]=e[0]-i[0],n[1]=e[1]-i[1],n[2]=e[2]-i[2],s[0]=n[0],s[1]=n[1]*Math.cos(r)-n[2]*Math.sin(r),s[2]=n[1]*Math.sin(r)+n[2]*Math.cos(r),t[0]=s[0]+i[0],t[1]=s[1]+i[1],t[2]=s[2]+i[2],t},c.rotateY=function(t,e,i,r){var n=[],s=[];return n[0]=e[0]-i[0],n[1]=e[1]-i[1],n[2]=e[2]-i[2],s[0]=n[2]*Math.sin(r)+n[0]*Math.cos(r),s[1]=n[1],s[2]=n[2]*Math.cos(r)-n[0]*Math.sin(r),t[0]=s[0]+i[0],t[1]=s[1]+i[1],t[2]=s[2]+i[2],t},c.rotateZ=function(t,e,i,r){var n=[],s=[];return n[0]=e[0]-i[0],n[1]=e[1]-i[1],n[2]=e[2]-i[2],s[0]=n[0]*Math.cos(r)-n[1]*Math.sin(r),s[1]=n[0]*Math.sin(r)+n[1]*Math.cos(r),s[2]=n[2],t[0]=s[0]+i[0],t[1]=s[1]+i[1],t[2]=s[2]+i[2],t},c.forEach=function(){var t=c.create();return function(e,i,r,n,s,a){var o,h;for(i||(i=3),r||(r=0),h=n?Math.min(n*i+r,e.length):e.length,o=r;h>o;o+=i)t[0]=e[o],t[1]=e[o+1],t[2]=e[o+2],s(t,t,a),e[o]=t[0],e[o+1]=t[1],e[o+2]=t[2];return e}}(),c.str=function(t){return"vec3("+t[0]+", "+t[1]+", "+t[2]+")"},"undefined"!=typeof r&&(r.vec3=c);var f={};f.create=function(){var t=new s(4);return t[0]=0,t[1]=0,t[2]=0,t[3]=0,t},f.clone=function(t){var e=new s(4);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e},f.fromValues=function(t,e,i,r){var n=new s(4);return n[0]=t,n[1]=e,n[2]=i,n[3]=r,n},f.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t},f.set=function(t,e,i,r,n){return t[0]=e,t[1]=i,t[2]=r,t[3]=n,t},f.add=function(t,e,i){return t[0]=e[0]+i[0],t[1]=e[1]+i[1],t[2]=e[2]+i[2],t[3]=e[3]+i[3],t},f.subtract=function(t,e,i){return t[0]=e[0]-i[0],t[1]=e[1]-i[1],t[2]=e[2]-i[2],t[3]=e[3]-i[3],t},f.sub=f.subtract,f.multiply=function(t,e,i){return t[0]=e[0]*i[0],t[1]=e[1]*i[1],t[2]=e[2]*i[2],t[3]=e[3]*i[3],t},f.mul=f.multiply,f.divide=function(t,e,i){return t[0]=e[0]/i[0],t[1]=e[1]/i[1],t[2]=e[2]/i[2],t[3]=e[3]/i[3],t},f.div=f.divide,f.min=function(t,e,i){return t[0]=Math.min(e[0],i[0]),t[1]=Math.min(e[1],i[1]),t[2]=Math.min(e[2],i[2]),t[3]=Math.min(e[3],i[3]),t},f.max=function(t,e,i){return t[0]=Math.max(e[0],i[0]),t[1]=Math.max(e[1],i[1]),t[2]=Math.max(e[2],i[2]),t[3]=Math.max(e[3],i[3]),t},f.scale=function(t,e,i){return t[0]=e[0]*i,t[1]=e[1]*i,t[2]=e[2]*i,t[3]=e[3]*i,t},f.scaleAndAdd=function(t,e,i,r){return t[0]=e[0]+i[0]*r,t[1]=e[1]+i[1]*r,t[2]=e[2]+i[2]*r,t[3]=e[3]+i[3]*r,t},f.distance=function(t,e){var i=e[0]-t[0],r=e[1]-t[1],n=e[2]-t[2],s=e[3]-t[3];return Math.sqrt(i*i+r*r+n*n+s*s)},f.dist=f.distance,f.squaredDistance=function(t,e){var i=e[0]-t[0],r=e[1]-t[1],n=e[2]-t[2],s=e[3]-t[3];return i*i+r*r+n*n+s*s},f.sqrDist=f.squaredDistance,f.length=function(t){var e=t[0],i=t[1],r=t[2],n=t[3];return Math.sqrt(e*e+i*i+r*r+n*n)},f.len=f.length,f.squaredLength=function(t){var e=t[0],i=t[1],r=t[2],n=t[3];return e*e+i*i+r*r+n*n},f.sqrLen=f.squaredLength,f.negate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=-e[3],t},f.normalize=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=i*i+r*r+n*n+s*s;return a>0&&(a=1/Math.sqrt(a),t[0]=e[0]*a,t[1]=e[1]*a,t[2]=e[2]*a,t[3]=e[3]*a),t},f.dot=function(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]+t[3]*e[3]},f.lerp=function(t,e,i,r){var n=e[0],s=e[1],a=e[2],o=e[3];return t[0]=n+r*(i[0]-n),t[1]=s+r*(i[1]-s),t[2]=a+r*(i[2]-a),t[3]=o+r*(i[3]-o),t},f.random=function(t,e){return e=e||1,t[0]=a(),t[1]=a(),t[2]=a(),t[3]=a(),f.normalize(t,t),f.scale(t,t,e),t},f.transformMat4=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3];return t[0]=i[0]*r+i[4]*n+i[8]*s+i[12]*a,t[1]=i[1]*r+i[5]*n+i[9]*s+i[13]*a,t[2]=i[2]*r+i[6]*n+i[10]*s+i[14]*a,t[3]=i[3]*r+i[7]*n+i[11]*s+i[15]*a,t},f.transformQuat=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=i[0],o=i[1],h=i[2],u=i[3],c=u*r+o*s-h*n,f=u*n+h*r-a*s,l=u*s+a*n-o*r,d=-a*r-o*n-h*s;return t[0]=c*u+d*-a+f*-h-l*-o,t[1]=f*u+d*-o+l*-a-c*-h,t[2]=l*u+d*-h+c*-o-f*-a,t},f.forEach=function(){var t=f.create();return function(e,i,r,n,s,a){var o,h;for(i||(i=4),r||(r=0),h=n?Math.min(n*i+r,e.length):e.length,o=r;h>o;o+=i)t[0]=e[o],t[1]=e[o+1],t[2]=e[o+2],t[3]=e[o+3],s(t,t,a),e[o]=t[0],e[o+1]=t[1],e[o+2]=t[2],e[o+3]=t[3];return e}}(),f.str=function(t){return"vec4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},"undefined"!=typeof r&&(r.vec4=f);var l={};l.create=function(){var t=new s(4);return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t},l.clone=function(t){var e=new s(4);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e},l.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t},l.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t},l.transpose=function(t,e){if(t===e){var i=e[1];t[1]=e[2],t[2]=i}else t[0]=e[0],t[1]=e[2],t[2]=e[1],t[3]=e[3];return t},l.invert=function(n,s){var a=s[0],o=s[1],h=s[2],u=s[3],c=a*u-h*o;return c?(c=1/c,n[0]=u*c,n[1]=-o*c,n[2]=-h*c,n[3]=a*c,n):function(e){if("object"==typeof r&&"undefined"!=typeof i)i.exports=e();else if("function"==typeof t&&t.amd)t([],e);else{var n;n="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this,n.bongioviPost=e()}}(function(){var t;return function i(t,r,n){function s(o,h){if(!r[o]){if(!t[o]){var u="function"==typeof e&&e;if(!h&&u)return u(o,!0);if(a)return a(o,!0);var c=new Error("Cannot find module '"+o+"'");throw c.code="MODULE_NOT_FOUND",c}var f=r[o]={exports:{}};t[o][0].call(f.exports,function(e){var i=t[o][1][e];return s(i?i:e)},f,f.exports,i,t,r,n)}return r[o].exports}for(var a="function"==typeof e&&e,o=0;o<n.length;o++)s(n[o]);return s}({1:[function(t,e){var i=t("./bongiovi");i.post={Pass:t("./bongiovi/post/Pass"),EffectComposer:t("./bongiovi/post/EffectComposer"),PassGreyscale:t("./bongiovi/post/PassGreyscale")},e.exports=i},{"./bongiovi":3,"./bongiovi/post/EffectComposer":28,"./bongiovi/post/Pass":29,"./bongiovi/post/PassGreyscale":30}],2:[function(e,i,r){!function(e){var i={};"undefined"==typeof r?"function"==typeof t&&"object"==typeof t.amd&&t.amd?(i.exports={},t(function(){return i.exports})):i.exports="undefined"!=typeof window?window:e:i.exports=r,function(t){if(!e)var e=1e-6;if(!i)var i="undefined"!=typeof Float32Array?Float32Array:Array;if(!r)var r=Math.random;var n={};n.setMatrixArrayType=function(t){i=t},"undefined"!=typeof t&&(t.glMatrix=n);var s=Math.PI/180;n.toRadian=function(t){return t*s};var a={};a.create=function(){var t=new i(2);return t[0]=0,t[1]=0,t},a.clone=function(t){var e=new i(2);return e[0]=t[0],e[1]=t[1],e},a.fromValues=function(t,e){var r=new i(2);return r[0]=t,r[1]=e,r},a.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t},a.set=function(t,e,i){return t[0]=e,t[1]=i,t},a.add=function(t,e,i){return t[0]=e[0]+i[0],t[1]=e[1]+i[1],t},a.subtract=function(t,e,i){return t[0]=e[0]-i[0],t[1]=e[1]-i[1],t},a.sub=a.subtract,a.multiply=function(t,e,i){return t[0]=e[0]*i[0],t[1]=e[1]*i[1],t},a.mul=a.multiply,a.divide=function(t,e,i){return t[0]=e[0]/i[0],t[1]=e[1]/i[1],t},a.div=a.divide,a.min=function(t,e,i){return t[0]=Math.min(e[0],i[0]),t[1]=Math.min(e[1],i[1]),t},a.max=function(t,e,i){return t[0]=Math.max(e[0],i[0]),t[1]=Math.max(e[1],i[1]),t},a.scale=function(t,e,i){return t[0]=e[0]*i,t[1]=e[1]*i,t},a.scaleAndAdd=function(t,e,i,r){return t[0]=e[0]+i[0]*r,t[1]=e[1]+i[1]*r,t},a.distance=function(t,e){var i=e[0]-t[0],r=e[1]-t[1];return Math.sqrt(i*i+r*r)},a.dist=a.distance,a.squaredDistance=function(t,e){var i=e[0]-t[0],r=e[1]-t[1];return i*i+r*r},a.sqrDist=a.squaredDistance,a.length=function(t){var e=t[0],i=t[1];return Math.sqrt(e*e+i*i)},a.len=a.length,a.squaredLength=function(t){var e=t[0],i=t[1];return e*e+i*i},a.sqrLen=a.squaredLength,a.negate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t},a.normalize=function(t,e){var i=e[0],r=e[1],n=i*i+r*r;return n>0&&(n=1/Math.sqrt(n),t[0]=e[0]*n,t[1]=e[1]*n),t},a.dot=function(t,e){return t[0]*e[0]+t[1]*e[1]},a.cross=function(t,e,i){var r=e[0]*i[1]-e[1]*i[0];return t[0]=t[1]=0,t[2]=r,t},a.lerp=function(t,e,i,r){var n=e[0],s=e[1];return t[0]=n+r*(i[0]-n),t[1]=s+r*(i[1]-s),t},a.random=function(t,e){e=e||1;var i=2*r()*Math.PI;return t[0]=Math.cos(i)*e,t[1]=Math.sin(i)*e,t},a.transformMat2=function(t,e,i){var r=e[0],n=e[1];return t[0]=i[0]*r+i[2]*n,t[1]=i[1]*r+i[3]*n,t},a.transformMat2d=function(t,e,i){var r=e[0],n=e[1];return t[0]=i[0]*r+i[2]*n+i[4],t[1]=i[1]*r+i[3]*n+i[5],t},a.transformMat3=function(t,e,i){var r=e[0],n=e[1];return t[0]=i[0]*r+i[3]*n+i[6],t[1]=i[1]*r+i[4]*n+i[7],t},a.transformMat4=function(t,e,i){var r=e[0],n=e[1];return t[0]=i[0]*r+i[4]*n+i[12],t[1]=i[1]*r+i[5]*n+i[13],t},a.forEach=function(){var t=a.create();return function(e,i,r,n,s,a){var o,h;for(i||(i=2),r||(r=0),h=n?Math.min(n*i+r,e.length):e.length,o=r;h>o;o+=i)t[0]=e[o],t[1]=e[o+1],s(t,t,a),e[o]=t[0],e[o+1]=t[1];return e}}(),a.str=function(t){return"vec2("+t[0]+", "+t[1]+")"},"undefined"!=typeof t&&(t.vec2=a);var o={};o.create=function(){var t=new i(3);return t[0]=0,t[1]=0,t[2]=0,t},o.clone=function(t){var e=new i(3);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e},o.fromValues=function(t,e,r){var n=new i(3);return n[0]=t,n[1]=e,n[2]=r,n},o.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t},o.set=function(t,e,i,r){return t[0]=e,t[1]=i,t[2]=r,t},o.add=function(t,e,i){return t[0]=e[0]+i[0],t[1]=e[1]+i[1],t[2]=e[2]+i[2],t},o.subtract=function(t,e,i){return t[0]=e[0]-i[0],t[1]=e[1]-i[1],t[2]=e[2]-i[2],t},o.sub=o.subtract,o.multiply=function(t,e,i){return t[0]=e[0]*i[0],t[1]=e[1]*i[1],t[2]=e[2]*i[2],t},o.mul=o.multiply,o.divide=function(t,e,i){return t[0]=e[0]/i[0],t[1]=e[1]/i[1],t[2]=e[2]/i[2],t},o.div=o.divide,o.min=function(t,e,i){return t[0]=Math.min(e[0],i[0]),t[1]=Math.min(e[1],i[1]),t[2]=Math.min(e[2],i[2]),t},o.max=function(t,e,i){return t[0]=Math.max(e[0],i[0]),t[1]=Math.max(e[1],i[1]),t[2]=Math.max(e[2],i[2]),t},o.scale=function(t,e,i){return t[0]=e[0]*i,t[1]=e[1]*i,t[2]=e[2]*i,t},o.scaleAndAdd=function(t,e,i,r){return t[0]=e[0]+i[0]*r,t[1]=e[1]+i[1]*r,t[2]=e[2]+i[2]*r,t},o.distance=function(t,e){var i=e[0]-t[0],r=e[1]-t[1],n=e[2]-t[2];return Math.sqrt(i*i+r*r+n*n)},o.dist=o.distance,o.squaredDistance=function(t,e){var i=e[0]-t[0],r=e[1]-t[1],n=e[2]-t[2];return i*i+r*r+n*n},o.sqrDist=o.squaredDistance,o.length=function(t){var e=t[0],i=t[1],r=t[2];return Math.sqrt(e*e+i*i+r*r)},o.len=o.length,o.squaredLength=function(t){var e=t[0],i=t[1],r=t[2];return e*e+i*i+r*r},o.sqrLen=o.squaredLength,o.negate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t},o.normalize=function(t,e){var i=e[0],r=e[1],n=e[2],s=i*i+r*r+n*n;return s>0&&(s=1/Math.sqrt(s),t[0]=e[0]*s,t[1]=e[1]*s,t[2]=e[2]*s),t},o.dot=function(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]},o.cross=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=i[0],o=i[1],h=i[2];return t[0]=n*h-s*o,t[1]=s*a-r*h,t[2]=r*o-n*a,t},o.lerp=function(t,e,i,r){var n=e[0],s=e[1],a=e[2];return t[0]=n+r*(i[0]-n),t[1]=s+r*(i[1]-s),t[2]=a+r*(i[2]-a),t},o.random=function(t,e){e=e||1;var i=2*r()*Math.PI,n=2*r()-1,s=Math.sqrt(1-n*n)*e;return t[0]=Math.cos(i)*s,t[1]=Math.sin(i)*s,t[2]=n*e,t},o.transformMat4=function(t,e,i){var r=e[0],n=e[1],s=e[2];return t[0]=i[0]*r+i[4]*n+i[8]*s+i[12],t[1]=i[1]*r+i[5]*n+i[9]*s+i[13],t[2]=i[2]*r+i[6]*n+i[10]*s+i[14],t},o.transformMat3=function(t,e,i){var r=e[0],n=e[1],s=e[2];return t[0]=r*i[0]+n*i[3]+s*i[6],t[1]=r*i[1]+n*i[4]+s*i[7],t[2]=r*i[2]+n*i[5]+s*i[8],t},o.transformQuat=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=i[0],o=i[1],h=i[2],u=i[3],c=u*r+o*s-h*n,f=u*n+h*r-a*s,l=u*s+a*n-o*r,d=-a*r-o*n-h*s;return t[0]=c*u+d*-a+f*-h-l*-o,t[1]=f*u+d*-o+l*-a-c*-h,t[2]=l*u+d*-h+c*-o-f*-a,t},o.rotateX=function(t,e,i,r){var n=[],s=[];return n[0]=e[0]-i[0],n[1]=e[1]-i[1],n[2]=e[2]-i[2],s[0]=n[0],s[1]=n[1]*Math.cos(r)-n[2]*Math.sin(r),s[2]=n[1]*Math.sin(r)+n[2]*Math.cos(r),t[0]=s[0]+i[0],t[1]=s[1]+i[1],t[2]=s[2]+i[2],t},o.rotateY=function(t,e,i,r){var n=[],s=[];return n[0]=e[0]-i[0],n[1]=e[1]-i[1],n[2]=e[2]-i[2],s[0]=n[2]*Math.sin(r)+n[0]*Math.cos(r),s[1]=n[1],s[2]=n[2]*Math.cos(r)-n[0]*Math.sin(r),t[0]=s[0]+i[0],t[1]=s[1]+i[1],t[2]=s[2]+i[2],t},o.rotateZ=function(t,e,i,r){var n=[],s=[];return n[0]=e[0]-i[0],n[1]=e[1]-i[1],n[2]=e[2]-i[2],s[0]=n[0]*Math.cos(r)-n[1]*Math.sin(r),s[1]=n[0]*Math.sin(r)+n[1]*Math.cos(r),s[2]=n[2],t[0]=s[0]+i[0],t[1]=s[1]+i[1],t[2]=s[2]+i[2],t},o.forEach=function(){var t=o.create();return function(e,i,r,n,s,a){var o,h;for(i||(i=3),r||(r=0),h=n?Math.min(n*i+r,e.length):e.length,o=r;h>o;o+=i)t[0]=e[o],t[1]=e[o+1],t[2]=e[o+2],s(t,t,a),e[o]=t[0],e[o+1]=t[1],e[o+2]=t[2];return e}}(),o.str=function(t){return"vec3("+t[0]+", "+t[1]+", "+t[2]+")"},"undefined"!=typeof t&&(t.vec3=o);var h={};h.create=function(){var t=new i(4);return t[0]=0,t[1]=0,t[2]=0,t[3]=0,t},h.clone=function(t){var e=new i(4);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e},h.fromValues=function(t,e,r,n){var s=new i(4);return s[0]=t,s[1]=e,s[2]=r,s[3]=n,s},h.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t},h.set=function(t,e,i,r,n){return t[0]=e,t[1]=i,t[2]=r,t[3]=n,t},h.add=function(t,e,i){return t[0]=e[0]+i[0],t[1]=e[1]+i[1],t[2]=e[2]+i[2],t[3]=e[3]+i[3],t},h.subtract=function(t,e,i){return t[0]=e[0]-i[0],t[1]=e[1]-i[1],t[2]=e[2]-i[2],t[3]=e[3]-i[3],t},h.sub=h.subtract,h.multiply=function(t,e,i){return t[0]=e[0]*i[0],t[1]=e[1]*i[1],t[2]=e[2]*i[2],t[3]=e[3]*i[3],t},h.mul=h.multiply,h.divide=function(t,e,i){return t[0]=e[0]/i[0],t[1]=e[1]/i[1],t[2]=e[2]/i[2],t[3]=e[3]/i[3],t},h.div=h.divide,h.min=function(t,e,i){return t[0]=Math.min(e[0],i[0]),t[1]=Math.min(e[1],i[1]),t[2]=Math.min(e[2],i[2]),t[3]=Math.min(e[3],i[3]),t},h.max=function(t,e,i){return t[0]=Math.max(e[0],i[0]),t[1]=Math.max(e[1],i[1]),t[2]=Math.max(e[2],i[2]),t[3]=Math.max(e[3],i[3]),t},h.scale=function(t,e,i){return t[0]=e[0]*i,t[1]=e[1]*i,t[2]=e[2]*i,t[3]=e[3]*i,t},h.scaleAndAdd=function(t,e,i,r){return t[0]=e[0]+i[0]*r,t[1]=e[1]+i[1]*r,t[2]=e[2]+i[2]*r,t[3]=e[3]+i[3]*r,t},h.distance=function(t,e){var i=e[0]-t[0],r=e[1]-t[1],n=e[2]-t[2],s=e[3]-t[3];return Math.sqrt(i*i+r*r+n*n+s*s)},h.dist=h.distance,h.squaredDistance=function(t,e){var i=e[0]-t[0],r=e[1]-t[1],n=e[2]-t[2],s=e[3]-t[3];return i*i+r*r+n*n+s*s},h.sqrDist=h.squaredDistance,h.length=function(t){var e=t[0],i=t[1],r=t[2],n=t[3];return Math.sqrt(e*e+i*i+r*r+n*n)},h.len=h.length,h.squaredLength=function(t){var e=t[0],i=t[1],r=t[2],n=t[3];return e*e+i*i+r*r+n*n},h.sqrLen=h.squaredLength,h.negate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=-e[3],t},h.normalize=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=i*i+r*r+n*n+s*s;return a>0&&(a=1/Math.sqrt(a),t[0]=e[0]*a,t[1]=e[1]*a,t[2]=e[2]*a,t[3]=e[3]*a),t},h.dot=function(t,e){return t[0]*e[0]+t[1]*e[1]+t[2]*e[2]+t[3]*e[3]},h.lerp=function(t,e,i,r){var n=e[0],s=e[1],a=e[2],o=e[3];return t[0]=n+r*(i[0]-n),t[1]=s+r*(i[1]-s),t[2]=a+r*(i[2]-a),t[3]=o+r*(i[3]-o),t},h.random=function(t,e){return e=e||1,t[0]=r(),t[1]=r(),t[2]=r(),t[3]=r(),h.normalize(t,t),h.scale(t,t,e),t},h.transformMat4=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3];return t[0]=i[0]*r+i[4]*n+i[8]*s+i[12]*a,t[1]=i[1]*r+i[5]*n+i[9]*s+i[13]*a,t[2]=i[2]*r+i[6]*n+i[10]*s+i[14]*a,t[3]=i[3]*r+i[7]*n+i[11]*s+i[15]*a,t},h.transformQuat=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=i[0],o=i[1],h=i[2],u=i[3],c=u*r+o*s-h*n,f=u*n+h*r-a*s,l=u*s+a*n-o*r,d=-a*r-o*n-h*s;return t[0]=c*u+d*-a+f*-h-l*-o,t[1]=f*u+d*-o+l*-a-c*-h,t[2]=l*u+d*-h+c*-o-f*-a,t},h.forEach=function(){var t=h.create();return function(e,i,r,n,s,a){var o,h;for(i||(i=4),r||(r=0),h=n?Math.min(n*i+r,e.length):e.length,o=r;h>o;o+=i)t[0]=e[o],t[1]=e[o+1],t[2]=e[o+2],t[3]=e[o+3],s(t,t,a),e[o]=t[0],e[o+1]=t[1],e[o+2]=t[2],e[o+3]=t[3];return e}}(),h.str=function(t){return"vec4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},"undefined"!=typeof t&&(t.vec4=h);var u={};u.create=function(){var t=new i(4);return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t},u.clone=function(t){var e=new i(4);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e},u.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t},u.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t},u.transpose=function(t,e){if(t===e){var i=e[1];t[1]=e[2],t[2]=i}else t[0]=e[0],t[1]=e[2],t[2]=e[1],t[3]=e[3];return t},u.invert=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=i*s-n*r;return a?(a=1/a,t[0]=s*a,t[1]=-r*a,t[2]=-n*a,t[3]=i*a,t):null},u.adjoint=function(t,e){var i=e[0];return t[0]=e[3],t[1]=-e[1],t[2]=-e[2],t[3]=i,t},u.determinant=function(t){return t[0]*t[3]-t[2]*t[1]},u.multiply=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=i[0],h=i[1],u=i[2],c=i[3];return t[0]=r*o+s*h,t[1]=n*o+a*h,t[2]=r*u+s*c,t[3]=n*u+a*c,t},u.mul=u.multiply,u.rotate=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=Math.sin(i),h=Math.cos(i);return t[0]=r*h+s*o,t[1]=n*h+a*o,t[2]=r*-o+s*h,t[3]=n*-o+a*h,t},u.scale=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=i[0],h=i[1];return t[0]=r*o,t[1]=n*o,t[2]=s*h,t[3]=a*h,t},u.str=function(t){return"mat2("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},u.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2))},u.LDU=function(t,e,i,r){return t[2]=r[2]/r[0],i[0]=r[0],i[1]=r[1],i[3]=r[3]-t[2]*i[1],[t,e,i]},"undefined"!=typeof t&&(t.mat2=u);var c={};c.create=function(){var t=new i(6);return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t},c.clone=function(t){var e=new i(6);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e},c.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t},c.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t},c.invert=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=e[4],o=e[5],h=i*s-r*n;return h?(h=1/h,t[0]=s*h,t[1]=-r*h,t[2]=-n*h,t[3]=i*h,t[4]=(n*o-s*a)*h,t[5]=(r*a-i*o)*h,t):null},c.determinant=function(t){return t[0]*t[3]-t[1]*t[2]},c.multiply=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=e[4],h=e[5],u=i[0],c=i[1],f=i[2],l=i[3],d=i[4],p=i[5];return t[0]=r*u+s*c,t[1]=n*u+a*c,t[2]=r*f+s*l,t[3]=n*f+a*l,t[4]=r*d+s*p+o,t[5]=n*d+a*p+h,t},c.mul=c.multiply,c.rotate=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=e[4],h=e[5],u=Math.sin(i),c=Math.cos(i);return t[0]=r*c+s*u,t[1]=n*c+a*u,t[2]=r*-u+s*c,t[3]=n*-u+a*c,t[4]=o,t[5]=h,t},c.scale=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=e[4],h=e[5],u=i[0],c=i[1];return t[0]=r*u,t[1]=n*u,t[2]=s*c,t[3]=a*c,t[4]=o,t[5]=h,t},c.translate=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=e[4],h=e[5],u=i[0],c=i[1];return t[0]=r,t[1]=n,t[2]=s,t[3]=a,t[4]=r*u+s*c+o,t[5]=n*u+a*c+h,t},c.str=function(t){return"mat2d("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+")"},c.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+1)},"undefined"!=typeof t&&(t.mat2d=c);var f={};f.create=function(){var t=new i(9);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},f.fromMat4=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[4],t[4]=e[5],t[5]=e[6],t[6]=e[8],t[7]=e[9],t[8]=e[10],t},f.clone=function(t){var e=new i(9);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e},f.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t},f.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},f.transpose=function(t,e){if(t===e){var i=e[1],r=e[2],n=e[5];t[1]=e[3],t[2]=e[6],t[3]=i,t[5]=e[7],t[6]=r,t[7]=n}else t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8];return t},f.invert=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=e[4],o=e[5],h=e[6],u=e[7],c=e[8],f=c*a-o*u,l=-c*s+o*h,d=u*s-a*h,p=i*f+r*l+n*d;return p?(p=1/p,t[0]=f*p,t[1]=(-c*r+n*u)*p,t[2]=(o*r-n*a)*p,t[3]=l*p,t[4]=(c*i-n*h)*p,t[5]=(-o*i+n*s)*p,t[6]=d*p,t[7]=(-u*i+r*h)*p,t[8]=(a*i-r*s)*p,t):null},f.adjoint=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=e[4],o=e[5],h=e[6],u=e[7],c=e[8];return t[0]=a*c-o*u,t[1]=n*u-r*c,t[2]=r*o-n*a,t[3]=o*h-s*c,t[4]=i*c-n*h,t[5]=n*s-i*o,t[6]=s*u-a*h,t[7]=r*h-i*u,t[8]=i*a-r*s,t},f.determinant=function(t){var e=t[0],i=t[1],r=t[2],n=t[3],s=t[4],a=t[5],o=t[6],h=t[7],u=t[8];return e*(u*s-a*h)+i*(-u*n+a*o)+r*(h*n-s*o)},f.multiply=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=e[4],h=e[5],u=e[6],c=e[7],f=e[8],l=i[0],d=i[1],p=i[2],v=i[3],m=i[4],_=i[5],g=i[6],x=i[7],M=i[8];return t[0]=l*r+d*a+p*u,t[1]=l*n+d*o+p*c,t[2]=l*s+d*h+p*f,t[3]=v*r+m*a+_*u,t[4]=v*n+m*o+_*c,t[5]=v*s+m*h+_*f,t[6]=g*r+x*a+M*u,t[7]=g*n+x*o+M*c,t[8]=g*s+x*h+M*f,t},f.mul=f.multiply,f.translate=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=e[4],h=e[5],u=e[6],c=e[7],f=e[8],l=i[0],d=i[1];return t[0]=r,t[1]=n,t[2]=s,t[3]=a,t[4]=o,t[5]=h,t[6]=l*r+d*a+u,t[7]=l*n+d*o+c,t[8]=l*s+d*h+f,t},f.rotate=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=e[4],h=e[5],u=e[6],c=e[7],f=e[8],l=Math.sin(i),d=Math.cos(i);return t[0]=d*r+l*a,t[1]=d*n+l*o,t[2]=d*s+l*h,t[3]=d*a-l*r,t[4]=d*o-l*n,t[5]=d*h-l*s,t[6]=u,t[7]=c,t[8]=f,t},f.scale=function(t,e,i){var r=i[0],n=i[1];return t[0]=r*e[0],t[1]=r*e[1],t[2]=r*e[2],t[3]=n*e[3],t[4]=n*e[4],t[5]=n*e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t},f.fromMat2d=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=0,t[3]=e[2],t[4]=e[3],t[5]=0,t[6]=e[4],t[7]=e[5],t[8]=1,t},f.fromQuat=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=i+i,o=r+r,h=n+n,u=i*a,c=r*a,f=r*o,l=n*a,d=n*o,p=n*h,v=s*a,m=s*o,_=s*h;return t[0]=1-f-p,t[3]=c-_,t[6]=l+m,t[1]=c+_,t[4]=1-u-p,t[7]=d-v,t[2]=l-m,t[5]=d+v,t[8]=1-u-f,t},f.normalFromMat4=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=e[4],o=e[5],h=e[6],u=e[7],c=e[8],f=e[9],l=e[10],d=e[11],p=e[12],v=e[13],m=e[14],_=e[15],g=i*o-r*a,x=i*h-n*a,M=i*u-s*a,T=r*h-n*o,E=r*u-s*o,b=n*u-s*h,R=c*v-f*p,A=c*m-l*p,w=c*_-d*p,P=f*m-l*v,L=f*_-d*v,y=l*_-d*m,F=g*y-x*L+M*P+T*w-E*A+b*R;return F?(F=1/F,t[0]=(o*y-h*L+u*P)*F,t[1]=(h*w-a*y-u*A)*F,t[2]=(a*L-o*w+u*R)*F,t[3]=(n*L-r*y-s*P)*F,t[4]=(i*y-n*w+s*A)*F,t[5]=(r*w-i*L-s*R)*F,t[6]=(v*b-m*E+_*T)*F,t[7]=(m*M-p*b-_*x)*F,t[8]=(p*E-v*M+_*g)*F,t):null},f.str=function(t){return"mat3("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+")"},f.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+Math.pow(t[6],2)+Math.pow(t[7],2)+Math.pow(t[8],2))},"undefined"!=typeof t&&(t.mat3=f);var l={};l.create=function(){var t=new i(16);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},l.clone=function(t){var e=new i(16);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e},l.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t},l.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},l.transpose=function(t,e){if(t===e){var i=e[1],r=e[2],n=e[3],s=e[6],a=e[7],o=e[11];t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=i,t[6]=e[9],t[7]=e[13],t[8]=r,t[9]=s,t[11]=e[14],t[12]=n,t[13]=a,t[14]=o}else t[0]=e[0],t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=e[1],t[5]=e[5],t[6]=e[9],t[7]=e[13],t[8]=e[2],t[9]=e[6],t[10]=e[10],t[11]=e[14],t[12]=e[3],t[13]=e[7],t[14]=e[11],t[15]=e[15];return t},l.invert=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=e[4],o=e[5],h=e[6],u=e[7],c=e[8],f=e[9],l=e[10],d=e[11],p=e[12],v=e[13],m=e[14],_=e[15],g=i*o-r*a,x=i*h-n*a,M=i*u-s*a,T=r*h-n*o,E=r*u-s*o,b=n*u-s*h,R=c*v-f*p,A=c*m-l*p,w=c*_-d*p,P=f*m-l*v,L=f*_-d*v,y=l*_-d*m,F=g*y-x*L+M*P+T*w-E*A+b*R;return F?(F=1/F,t[0]=(o*y-h*L+u*P)*F,t[1]=(n*L-r*y-s*P)*F,t[2]=(v*b-m*E+_*T)*F,t[3]=(l*E-f*b-d*T)*F,t[4]=(h*w-a*y-u*A)*F,t[5]=(i*y-n*w+s*A)*F,t[6]=(m*M-p*b-_*x)*F,t[7]=(c*b-l*M+d*x)*F,t[8]=(a*L-o*w+u*R)*F,t[9]=(r*w-i*L-s*R)*F,t[10]=(p*E-v*M+_*g)*F,t[11]=(f*M-c*E-d*g)*F,t[12]=(o*A-a*P-h*R)*F,t[13]=(i*P-r*A+n*R)*F,t[14]=(v*x-p*T-m*g)*F,t[15]=(c*T-f*x+l*g)*F,t):null},l.adjoint=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=e[4],o=e[5],h=e[6],u=e[7],c=e[8],f=e[9],l=e[10],d=e[11],p=e[12],v=e[13],m=e[14],_=e[15];return t[0]=o*(l*_-d*m)-f*(h*_-u*m)+v*(h*d-u*l),t[1]=-(r*(l*_-d*m)-f*(n*_-s*m)+v*(n*d-s*l)),t[2]=r*(h*_-u*m)-o*(n*_-s*m)+v*(n*u-s*h),t[3]=-(r*(h*d-u*l)-o*(n*d-s*l)+f*(n*u-s*h)),t[4]=-(a*(l*_-d*m)-c*(h*_-u*m)+p*(h*d-u*l)),t[5]=i*(l*_-d*m)-c*(n*_-s*m)+p*(n*d-s*l),t[6]=-(i*(h*_-u*m)-a*(n*_-s*m)+p*(n*u-s*h)),t[7]=i*(h*d-u*l)-a*(n*d-s*l)+c*(n*u-s*h),t[8]=a*(f*_-d*v)-c*(o*_-u*v)+p*(o*d-u*f),t[9]=-(i*(f*_-d*v)-c*(r*_-s*v)+p*(r*d-s*f)),t[10]=i*(o*_-u*v)-a*(r*_-s*v)+p*(r*u-s*o),t[11]=-(i*(o*d-u*f)-a*(r*d-s*f)+c*(r*u-s*o)),t[12]=-(a*(f*m-l*v)-c*(o*m-h*v)+p*(o*l-h*f)),t[13]=i*(f*m-l*v)-c*(r*m-n*v)+p*(r*l-n*f),t[14]=-(i*(o*m-h*v)-a*(r*m-n*v)+p*(r*h-n*o)),t[15]=i*(o*l-h*f)-a*(r*l-n*f)+c*(r*h-n*o),t},l.determinant=function(t){var e=t[0],i=t[1],r=t[2],n=t[3],s=t[4],a=t[5],o=t[6],h=t[7],u=t[8],c=t[9],f=t[10],l=t[11],d=t[12],p=t[13],v=t[14],m=t[15],_=e*a-i*s,g=e*o-r*s,x=e*h-n*s,M=i*o-r*a,T=i*h-n*a,E=r*h-n*o,b=u*p-c*d,R=u*v-f*d,A=u*m-l*d,w=c*v-f*p,P=c*m-l*p,L=f*m-l*v;return _*L-g*P+x*w+M*A-T*R+E*b},l.multiply=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=e[4],h=e[5],u=e[6],c=e[7],f=e[8],l=e[9],d=e[10],p=e[11],v=e[12],m=e[13],_=e[14],g=e[15],x=i[0],M=i[1],T=i[2],E=i[3];return t[0]=x*r+M*o+T*f+E*v,t[1]=x*n+M*h+T*l+E*m,t[2]=x*s+M*u+T*d+E*_,t[3]=x*a+M*c+T*p+E*g,x=i[4],M=i[5],T=i[6],E=i[7],t[4]=x*r+M*o+T*f+E*v,t[5]=x*n+M*h+T*l+E*m,t[6]=x*s+M*u+T*d+E*_,t[7]=x*a+M*c+T*p+E*g,x=i[8],M=i[9],T=i[10],E=i[11],t[8]=x*r+M*o+T*f+E*v,t[9]=x*n+M*h+T*l+E*m,t[10]=x*s+M*u+T*d+E*_,t[11]=x*a+M*c+T*p+E*g,x=i[12],M=i[13],T=i[14],E=i[15],t[12]=x*r+M*o+T*f+E*v,t[13]=x*n+M*h+T*l+E*m,t[14]=x*s+M*u+T*d+E*_,t[15]=x*a+M*c+T*p+E*g,t
},l.mul=l.multiply,l.translate=function(t,e,i){var r,n,s,a,o,h,u,c,f,l,d,p,v=i[0],m=i[1],_=i[2];return e===t?(t[12]=e[0]*v+e[4]*m+e[8]*_+e[12],t[13]=e[1]*v+e[5]*m+e[9]*_+e[13],t[14]=e[2]*v+e[6]*m+e[10]*_+e[14],t[15]=e[3]*v+e[7]*m+e[11]*_+e[15]):(r=e[0],n=e[1],s=e[2],a=e[3],o=e[4],h=e[5],u=e[6],c=e[7],f=e[8],l=e[9],d=e[10],p=e[11],t[0]=r,t[1]=n,t[2]=s,t[3]=a,t[4]=o,t[5]=h,t[6]=u,t[7]=c,t[8]=f,t[9]=l,t[10]=d,t[11]=p,t[12]=r*v+o*m+f*_+e[12],t[13]=n*v+h*m+l*_+e[13],t[14]=s*v+u*m+d*_+e[14],t[15]=a*v+c*m+p*_+e[15]),t},l.scale=function(t,e,i){var r=i[0],n=i[1],s=i[2];return t[0]=e[0]*r,t[1]=e[1]*r,t[2]=e[2]*r,t[3]=e[3]*r,t[4]=e[4]*n,t[5]=e[5]*n,t[6]=e[6]*n,t[7]=e[7]*n,t[8]=e[8]*s,t[9]=e[9]*s,t[10]=e[10]*s,t[11]=e[11]*s,t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t},l.rotate=function(t,i,r,n){var s,a,o,h,u,c,f,l,d,p,v,m,_,g,x,M,T,E,b,R,A,w,P,L,y=n[0],F=n[1],S=n[2],V=Math.sqrt(y*y+F*F+S*S);return Math.abs(V)<e?null:(V=1/V,y*=V,F*=V,S*=V,s=Math.sin(r),a=Math.cos(r),o=1-a,h=i[0],u=i[1],c=i[2],f=i[3],l=i[4],d=i[5],p=i[6],v=i[7],m=i[8],_=i[9],g=i[10],x=i[11],M=y*y*o+a,T=F*y*o+S*s,E=S*y*o-F*s,b=y*F*o-S*s,R=F*F*o+a,A=S*F*o+y*s,w=y*S*o+F*s,P=F*S*o-y*s,L=S*S*o+a,t[0]=h*M+l*T+m*E,t[1]=u*M+d*T+_*E,t[2]=c*M+p*T+g*E,t[3]=f*M+v*T+x*E,t[4]=h*b+l*R+m*A,t[5]=u*b+d*R+_*A,t[6]=c*b+p*R+g*A,t[7]=f*b+v*R+x*A,t[8]=h*w+l*P+m*L,t[9]=u*w+d*P+_*L,t[10]=c*w+p*P+g*L,t[11]=f*w+v*P+x*L,i!==t&&(t[12]=i[12],t[13]=i[13],t[14]=i[14],t[15]=i[15]),t)},l.rotateX=function(t,e,i){var r=Math.sin(i),n=Math.cos(i),s=e[4],a=e[5],o=e[6],h=e[7],u=e[8],c=e[9],f=e[10],l=e[11];return e!==t&&(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[4]=s*n+u*r,t[5]=a*n+c*r,t[6]=o*n+f*r,t[7]=h*n+l*r,t[8]=u*n-s*r,t[9]=c*n-a*r,t[10]=f*n-o*r,t[11]=l*n-h*r,t},l.rotateY=function(t,e,i){var r=Math.sin(i),n=Math.cos(i),s=e[0],a=e[1],o=e[2],h=e[3],u=e[8],c=e[9],f=e[10],l=e[11];return e!==t&&(t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=s*n-u*r,t[1]=a*n-c*r,t[2]=o*n-f*r,t[3]=h*n-l*r,t[8]=s*r+u*n,t[9]=a*r+c*n,t[10]=o*r+f*n,t[11]=h*r+l*n,t},l.rotateZ=function(t,e,i){var r=Math.sin(i),n=Math.cos(i),s=e[0],a=e[1],o=e[2],h=e[3],u=e[4],c=e[5],f=e[6],l=e[7];return e!==t&&(t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=s*n+u*r,t[1]=a*n+c*r,t[2]=o*n+f*r,t[3]=h*n+l*r,t[4]=u*n-s*r,t[5]=c*n-a*r,t[6]=f*n-o*r,t[7]=l*n-h*r,t},l.fromRotationTranslation=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=r+r,h=n+n,u=s+s,c=r*o,f=r*h,l=r*u,d=n*h,p=n*u,v=s*u,m=a*o,_=a*h,g=a*u;return t[0]=1-(d+v),t[1]=f+g,t[2]=l-_,t[3]=0,t[4]=f-g,t[5]=1-(c+v),t[6]=p+m,t[7]=0,t[8]=l+_,t[9]=p-m,t[10]=1-(c+d),t[11]=0,t[12]=i[0],t[13]=i[1],t[14]=i[2],t[15]=1,t},l.fromQuat=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=i+i,o=r+r,h=n+n,u=i*a,c=r*a,f=r*o,l=n*a,d=n*o,p=n*h,v=s*a,m=s*o,_=s*h;return t[0]=1-f-p,t[1]=c+_,t[2]=l-m,t[3]=0,t[4]=c-_,t[5]=1-u-p,t[6]=d+v,t[7]=0,t[8]=l+m,t[9]=d-v,t[10]=1-u-f,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},l.frustum=function(t,e,i,r,n,s,a){var o=1/(i-e),h=1/(n-r),u=1/(s-a);return t[0]=2*s*o,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=2*s*h,t[6]=0,t[7]=0,t[8]=(i+e)*o,t[9]=(n+r)*h,t[10]=(a+s)*u,t[11]=-1,t[12]=0,t[13]=0,t[14]=a*s*2*u,t[15]=0,t},l.perspective=function(t,e,i,r,n){var s=1/Math.tan(e/2),a=1/(r-n);return t[0]=s/i,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=s,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=(n+r)*a,t[11]=-1,t[12]=0,t[13]=0,t[14]=2*n*r*a,t[15]=0,t},l.ortho=function(t,e,i,r,n,s,a){var o=1/(e-i),h=1/(r-n),u=1/(s-a);return t[0]=-2*o,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*h,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=2*u,t[11]=0,t[12]=(e+i)*o,t[13]=(n+r)*h,t[14]=(a+s)*u,t[15]=1,t},l.lookAt=function(t,i,r,n){var s,a,o,h,u,c,f,d,p,v,m=i[0],_=i[1],g=i[2],x=n[0],M=n[1],T=n[2],E=r[0],b=r[1],R=r[2];return Math.abs(m-E)<e&&Math.abs(_-b)<e&&Math.abs(g-R)<e?l.identity(t):(f=m-E,d=_-b,p=g-R,v=1/Math.sqrt(f*f+d*d+p*p),f*=v,d*=v,p*=v,s=M*p-T*d,a=T*f-x*p,o=x*d-M*f,v=Math.sqrt(s*s+a*a+o*o),v?(v=1/v,s*=v,a*=v,o*=v):(s=0,a=0,o=0),h=d*o-p*a,u=p*s-f*o,c=f*a-d*s,v=Math.sqrt(h*h+u*u+c*c),v?(v=1/v,h*=v,u*=v,c*=v):(h=0,u=0,c=0),t[0]=s,t[1]=h,t[2]=f,t[3]=0,t[4]=a,t[5]=u,t[6]=d,t[7]=0,t[8]=o,t[9]=c,t[10]=p,t[11]=0,t[12]=-(s*m+a*_+o*g),t[13]=-(h*m+u*_+c*g),t[14]=-(f*m+d*_+p*g),t[15]=1,t)},l.str=function(t){return"mat4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+", "+t[9]+", "+t[10]+", "+t[11]+", "+t[12]+", "+t[13]+", "+t[14]+", "+t[15]+")"},l.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+Math.pow(t[6],2)+Math.pow(t[6],2)+Math.pow(t[7],2)+Math.pow(t[8],2)+Math.pow(t[9],2)+Math.pow(t[10],2)+Math.pow(t[11],2)+Math.pow(t[12],2)+Math.pow(t[13],2)+Math.pow(t[14],2)+Math.pow(t[15],2))},"undefined"!=typeof t&&(t.mat4=l);var d={};d.create=function(){var t=new i(4);return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t},d.rotationTo=function(){var t=o.create(),e=o.fromValues(1,0,0),i=o.fromValues(0,1,0);return function(r,n,s){var a=o.dot(n,s);return-.999999>a?(o.cross(t,e,n),o.length(t)<1e-6&&o.cross(t,i,n),o.normalize(t,t),d.setAxisAngle(r,t,Math.PI),r):a>.999999?(r[0]=0,r[1]=0,r[2]=0,r[3]=1,r):(o.cross(t,n,s),r[0]=t[0],r[1]=t[1],r[2]=t[2],r[3]=1+a,d.normalize(r,r))}}(),d.setAxes=function(){var t=f.create();return function(e,i,r,n){return t[0]=r[0],t[3]=r[1],t[6]=r[2],t[1]=n[0],t[4]=n[1],t[7]=n[2],t[2]=-i[0],t[5]=-i[1],t[8]=-i[2],d.normalize(e,d.fromMat3(e,t))}}(),d.clone=h.clone,d.fromValues=h.fromValues,d.copy=h.copy,d.set=h.set,d.identity=function(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t},d.setAxisAngle=function(t,e,i){i=.5*i;var r=Math.sin(i);return t[0]=r*e[0],t[1]=r*e[1],t[2]=r*e[2],t[3]=Math.cos(i),t},d.add=h.add,d.multiply=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=i[0],h=i[1],u=i[2],c=i[3];return t[0]=r*c+a*o+n*u-s*h,t[1]=n*c+a*h+s*o-r*u,t[2]=s*c+a*u+r*h-n*o,t[3]=a*c-r*o-n*h-s*u,t},d.mul=d.multiply,d.scale=h.scale,d.rotateX=function(t,e,i){i*=.5;var r=e[0],n=e[1],s=e[2],a=e[3],o=Math.sin(i),h=Math.cos(i);return t[0]=r*h+a*o,t[1]=n*h+s*o,t[2]=s*h-n*o,t[3]=a*h-r*o,t},d.rotateY=function(t,e,i){i*=.5;var r=e[0],n=e[1],s=e[2],a=e[3],o=Math.sin(i),h=Math.cos(i);return t[0]=r*h-s*o,t[1]=n*h+a*o,t[2]=s*h+r*o,t[3]=a*h-n*o,t},d.rotateZ=function(t,e,i){i*=.5;var r=e[0],n=e[1],s=e[2],a=e[3],o=Math.sin(i),h=Math.cos(i);return t[0]=r*h+n*o,t[1]=n*h-r*o,t[2]=s*h+a*o,t[3]=a*h-s*o,t},d.calculateW=function(t,e){var i=e[0],r=e[1],n=e[2];return t[0]=i,t[1]=r,t[2]=n,t[3]=-Math.sqrt(Math.abs(1-i*i-r*r-n*n)),t},d.dot=h.dot,d.lerp=h.lerp,d.slerp=function(t,e,i,r){var n,s,a,o,h,u=e[0],c=e[1],f=e[2],l=e[3],d=i[0],p=i[1],v=i[2],m=i[3];return s=u*d+c*p+f*v+l*m,0>s&&(s=-s,d=-d,p=-p,v=-v,m=-m),1-s>1e-6?(n=Math.acos(s),a=Math.sin(n),o=Math.sin((1-r)*n)/a,h=Math.sin(r*n)/a):(o=1-r,h=r),t[0]=o*u+h*d,t[1]=o*c+h*p,t[2]=o*f+h*v,t[3]=o*l+h*m,t},d.invert=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=i*i+r*r+n*n+s*s,o=a?1/a:0;return t[0]=-i*o,t[1]=-r*o,t[2]=-n*o,t[3]=s*o,t},d.conjugate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=e[3],t},d.length=h.length,d.len=d.length,d.squaredLength=h.squaredLength,d.sqrLen=d.squaredLength,d.normalize=h.normalize,d.fromMat3=function(t,e){var i,r=e[0]+e[4]+e[8];if(r>0)i=Math.sqrt(r+1),t[3]=.5*i,i=.5/i,t[0]=(e[7]-e[5])*i,t[1]=(e[2]-e[6])*i,t[2]=(e[3]-e[1])*i;else{var n=0;e[4]>e[0]&&(n=1),e[8]>e[3*n+n]&&(n=2);var s=(n+1)%3,a=(n+2)%3;i=Math.sqrt(e[3*n+n]-e[3*s+s]-e[3*a+a]+1),t[n]=.5*i,i=.5/i,t[3]=(e[3*a+s]-e[3*s+a])*i,t[s]=(e[3*s+n]+e[3*n+s])*i,t[a]=(e[3*a+n]+e[3*n+a])*i}return t},d.str=function(t){return"quat("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},"undefined"!=typeof t&&(t.quat=d)}(i.exports)}(this)},{}],3:[function(t,e){var i=t("./bongiovi/GLTools"),r={GL:i,GLTools:i,Scheduler:t("./bongiovi/Scheduler"),SimpleImageLoader:t("./bongiovi/SimpleImageLoader"),EaseNumber:t("./bongiovi/EaseNumber"),QuatRotation:t("./bongiovi/QuatRotation"),Scene:t("./bongiovi/Scene"),Camera:t("./bongiovi/Camera"),SimpleCamera:t("./bongiovi/SimpleCamera"),CameraOrtho:t("./bongiovi/CameraOrtho"),CameraPerspective:t("./bongiovi/CameraPerspective"),Mesh:t("./bongiovi/Mesh"),Face:t("./bongiovi/Face"),GLShader:t("./bongiovi/GLShader"),GLTexture:t("./bongiovi/GLTexture"),GLCubeTexture:t("./bongiovi/GLCubeTexture"),ShaderLibs:t("./bongiovi/ShaderLibs"),View:t("./bongiovi/View"),ViewCopy:t("./bongiovi/ViewCopy"),ViewAxis:t("./bongiovi/ViewAxis"),ViewDotPlane:t("./bongiovi/ViewDotPlanes"),MeshUtils:t("./bongiovi/MeshUtils"),FrameBuffer:t("./bongiovi/FrameBuffer"),EventDispatcher:t("./bongiovi/EventDispatcher"),ObjLoader:t("./bongiovi/ObjLoader"),glm:t("gl-matrix")};e.exports=r},{"./bongiovi/Camera":4,"./bongiovi/CameraOrtho":5,"./bongiovi/CameraPerspective":6,"./bongiovi/EaseNumber":7,"./bongiovi/EventDispatcher":8,"./bongiovi/Face":9,"./bongiovi/FrameBuffer":10,"./bongiovi/GLCubeTexture":11,"./bongiovi/GLShader":12,"./bongiovi/GLTexture":13,"./bongiovi/GLTools":14,"./bongiovi/Mesh":15,"./bongiovi/MeshUtils":16,"./bongiovi/ObjLoader":17,"./bongiovi/QuatRotation":18,"./bongiovi/Scene":19,"./bongiovi/Scheduler":20,"./bongiovi/ShaderLibs":21,"./bongiovi/SimpleCamera":22,"./bongiovi/SimpleImageLoader":23,"./bongiovi/View":24,"./bongiovi/ViewAxis":25,"./bongiovi/ViewCopy":26,"./bongiovi/ViewDotPlanes":27,"gl-matrix":2}],4:[function(t,e){var i=t("gl-matrix"),r=function(){this.matrix=i.mat4.create(),i.mat4.identity(this.matrix),this.position=i.vec3.create()},n=r.prototype;n.lookAt=function(t,e,r){i.vec3.copy(this.position,t),i.mat4.identity(this.matrix),i.mat4.lookAt(this.matrix,t,e,r)},n.getMatrix=function(){return this.matrix},e.exports=r},{"gl-matrix":2}],5:[function(t,e){var i=t("./Camera"),r=t("gl-matrix"),n=function(){i.call(this);var t=r.vec3.clone([0,0,500]),e=r.vec3.create(),n=r.vec3.clone([0,-1,0]);this.lookAt(t,e,n),this.projection=r.mat4.create()},s=n.prototype=new i;s.setBoundary=function(t,e,i,n){this.left=t,this.right=e,this.top=i,this.bottom=n,r.mat4.ortho(this.projection,t,e,i,n,0,1e4)},s.ortho=s.setBoundary,s.getMatrix=function(){return this.matrix},s.resize=function(){r.mat4.ortho(this.projection,this.left,this.right,this.top,this.bottom,0,1e4)},e.exports=n},{"./Camera":4,"gl-matrix":2}],6:[function(t,e){var i=t("./Camera"),r=t("gl-matrix"),n=function(){i.call(this),this.projection=r.mat4.create(),this.mtxFinal=r.mat4.create()},s=n.prototype=new i;s.setPerspective=function(t,e,i,n){this._fov=t,this._near=i,this._far=n,this._aspect=e,r.mat4.perspective(this.projection,t,e,i,n)},s.getMatrix=function(){return this.matrix},s.resize=function(t){this._aspect=t,r.mat4.perspective(this.projection,this._fov,t,this._near,this._far)},s.__defineGetter__("near",function(){return this._near}),s.__defineGetter__("far",function(){return this._far}),e.exports=n},{"./Camera":4,"gl-matrix":2}],7:[function(t,e){function i(t,e){this._easing=e||.1,this._value=t,this._targetValue=t,r.addEF(this,this._update)}var r=t("./Scheduler"),n=i.prototype;n._update=function(){this._checkLimit(),this._value+=(this._targetValue-this._value)*this._easing},n.setTo=function(t){this._targetValue=this._value=t},n.add=function(t){this._targetValue+=t},n.limit=function(t,e){this._min=t,this._max=e,this._checkLimit()},n.setEasing=function(t){this._easing=t},n._checkLimit=function(){void 0!==this._min&&this._targetValue<this._min&&(this._targetValue=this._min),void 0!==this._max&&this._targetValue>this._max&&(this._targetValue=this._max)},n.__defineGetter__("value",function(){return this._value}),n.__defineGetter__("targetValue",function(){return this._targetValue}),n.__defineSetter__("value",function(t){this._targetValue=t}),e.exports=i},{"./Scheduler":20}],8:[function(t,e){function i(){this._eventListeners=null}var r=!0;try{var n=document.createEvent("CustomEvent");n=null}catch(s){r=!1}var a=i.prototype;a.addEventListener=function(t,e){return null===this._eventListeners&&(this._eventListeners={}),this._eventListeners[t]||(this._eventListeners[t]=[]),this._eventListeners[t].push(e),this},a.removeEventListener=function(t,e){null===this._eventListeners&&(this._eventListeners={});var i=this._eventListeners[t];if("undefined"==typeof i)return this;for(var r=i.length,n=0;r>n;n++)i[n]===e&&(i.splice(n,1),n--,r--);return this},a.dispatchEvent=function(t){null===this._eventListeners&&(this._eventListeners={});var e=t.type;try{null===t.target&&(t.target=this),t.currentTarget=this}catch(i){var r={type:e,detail:t.detail,dispatcher:this};return this.dispatchEvent(r)}var n=this._eventListeners[e];if(null!==n&&void 0!==n)for(var s=this._copyArray(n),a=s.length,o=0;a>o;o++){var h=s[o];h.call(this,t)}return this},a.dispatchCustomEvent=function(t,e){var i;return r?(i=document.createEvent("CustomEvent"),i.dispatcher=this,i.initCustomEvent(t,!1,!1,e)):i={type:t,detail:e,dispatcher:this},this.dispatchEvent(i)},a._destroy=function(){if(null!==this._eventListeners){for(var t in this._eventListeners)if(this._eventListeners.hasOwnProperty(t)){for(var e=this._eventListeners[t],i=e.length,r=0;i>r;r++)e[r]=null;delete this._eventListeners[t]}this._eventListeners=null}},a._copyArray=function(t){for(var e=new Array(t.length),i=e.length,r=0;i>r;r++)e[r]=t[r];return e},e.exports=i},{}],9:[function(t,e){var i=t("gl-matrix"),r=function(t,e,i){this._vertexA=t,this._vertexB=e,this._vertexC=i,this._init()},n=r.prototype;n._init=function(){var t=i.vec3.create(),e=i.vec3.create();i.vec3.sub(t,this._vertexB,this._vertexA),i.vec3.sub(e,this._vertexC,this._vertexA),this._faceNormal=i.vec3.create(),i.vec3.cross(this._faceNormal,t,e),i.vec3.normalize(this._faceNormal,this._faceNormal)},n.contains=function(t){return s(t,this._vertexA)||s(t,this._vertexB)||s(t,this._vertexC)},n.__defineGetter__("faceNormal",function(){return this._faceNormal});var s=function(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]};e.exports=r},{"gl-matrix":2}],10:[function(t,e){var i,r=t("./GLTools"),n=t("./GLTexture"),s=function(t){return 0!==t&&!(t&t-1)},a=function(t,e,n){i=r.gl,n=n||{},this.width=t,this.height=e,this.magFilter=n.magFilter||i.LINEAR,this.minFilter=n.minFilter||i.LINEAR,this.wrapS=n.wrapS||i.MIRRORED_REPEAT,this.wrapT=n.wrapT||i.MIRRORED_REPEAT,s(t)&&s(e)||(this.wrapS=this.wrapT=i.CLAMP_TO_EDGE,this.minFilter===i.LINEAR_MIPMAP_NEAREST&&(this.minFilter=i.LINEAR)),this._init()},o=a.prototype;o._init=function(){if(this.texture=i.createTexture(),this.glTexture=new n(this.texture,!0),this.frameBuffer=i.createFramebuffer(),i.bindFramebuffer(i.FRAMEBUFFER,this.frameBuffer),this.frameBuffer.width=this.width,this.frameBuffer.height=this.height,i.bindTexture(i.TEXTURE_2D,this.texture),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,this.magFilter),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,this.minFilter),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),r.depthTextureExt?i.texImage2D(i.TEXTURE_2D,0,i.RGBA,this.frameBuffer.width,this.frameBuffer.height,0,i.RGBA,i.FLOAT,null):i.texImage2D(i.TEXTURE_2D,0,i.RGBA,this.frameBuffer.width,this.frameBuffer.height,0,i.RGBA,i.FLOAT,null),this.minFilter===i.LINEAR_MIPMAP_NEAREST&&i.generateMipmap(i.TEXTURE_2D),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,this.texture,0),null===r.depthTextureExt){var t=i.createRenderbuffer();i.bindRenderbuffer(i.RENDERBUFFER,t),i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_COMPONENT16,this.frameBuffer.width,this.frameBuffer.height),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,this.texture,0),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,t)}else this.depthTexture=i.createTexture(),this.glDepthTexture=new n(this.depthTexture,!0),i.bindTexture(i.TEXTURE_2D,this.depthTexture),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.texImage2D(i.TEXTURE_2D,0,i.DEPTH_COMPONENT,this.width,this.height,0,i.DEPTH_COMPONENT,i.UNSIGNED_SHORT,null),i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,this.depthTexture,0);i.bindTexture(i.TEXTURE_2D,null),i.bindRenderbuffer(i.RENDERBUFFER,null),i.bindFramebuffer(i.FRAMEBUFFER,null)},o.bind=function(){i.bindFramebuffer(i.FRAMEBUFFER,this.frameBuffer)},o.unbind=function(){i.bindFramebuffer(i.FRAMEBUFFER,null)},o.getTexture=function(){return this.glTexture},o.getDepthTexture=function(){return this.glDepthTexture},o.destroy=function(){i.deleteFramebuffer(this.frameBuffer),this.glTexture.destroy(),this.glDepthTexture&&this.glDepthTexture.destroy()},e.exports=a},{"./GLTexture":13,"./GLTools":14}],11:[function(t,e){var i,r=t("./GLTools"),n=t("./GLTexture"),s=function(t,e){var s=!1;t[0]instanceof n&&(s=!0),e=e||{},i=r.gl,this.texture=i.createTexture(),this.magFilter=e.magFilter||i.LINEAR,this.minFilter=e.minFilter||i.LINEAR_MIPMAP_NEAREST,this.wrapS=e.wrapS||i.CLAMP_TO_EDGE,this.wrapT=e.wrapT||i.CLAMP_TO_EDGE,i.bindTexture(i.TEXTURE_CUBE_MAP,this.texture);for(var a=[i.TEXTURE_CUBE_MAP_POSITIVE_X,i.TEXTURE_CUBE_MAP_NEGATIVE_X,i.TEXTURE_CUBE_MAP_POSITIVE_Y,i.TEXTURE_CUBE_MAP_NEGATIVE_Y,i.TEXTURE_CUBE_MAP_POSITIVE_Z,i.TEXTURE_CUBE_MAP_NEGATIVE_Z],o=0;6>o;o++)s?console.log("Texture : ",t[o].texture):i.texImage2D(a[o],0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,t[o]),i.texParameteri(i.TEXTURE_CUBE_MAP,i.TEXTURE_WRAP_S,this.wrapS),i.texParameteri(i.TEXTURE_CUBE_MAP,i.TEXTURE_WRAP_T,this.wrapT);i.generateMipmap(i.TEXTURE_CUBE_MAP),i.bindTexture(i.TEXTURE_CUBE_MAP,null)},a=s.prototype;a.bind=function(t){void 0===t&&(t=0),r.shader&&(i.bindTexture(i.TEXTURE_CUBE_MAP,this.texture),i.uniform1i(r.shader.uniformTextures[t],t),this._bindIndex=t)},a.unbind=function(){i.bindTexture(i.TEXTURE_CUBE_MAP,null)},a.destroy=function(){i.deleteTexture(this.texture)},e.exports=s},{"./GLTexture":13,"./GLTools":14}],12:[function(t,e){var i,r=t("./GLTools"),n=t("./ShaderLibs"),s=function(t){for(var e=t.split("\n"),i=0;i<e.length;i++)e[i]=i+1+": "+e[i];return e.join("\n")},a=function(t,e){i=r.gl,this.idVertex=t,this.idFragment=e,this.parameters=[],this.uniformValues={},this.uniformTextures=[],this.vertexShader=void 0,this.fragmentShader=void 0,this._isReady=!1,this._loadedCount=0,(void 0===t||null===t)&&this.createVertexShaderProgram(n.getShader("copyVert")),(void 0===e||null===t)&&this.createFragmentShaderProgram(n.getShader("copyFrag")),this.init()},o=a.prototype;o.init=function(){this.idVertex&&this.idVertex.indexOf("main(void)")>-1?this.createVertexShaderProgram(this.idVertex):this.getShader(this.idVertex,!0),this.idFragment&&this.idFragment.indexOf("main(void)")>-1?this.createFragmentShaderProgram(this.idFragment):this.getShader(this.idFragment,!1)},o.getShader=function(t,e){if(t){var i=new XMLHttpRequest;i.hasCompleted=!1;var r=this;i.onreadystatechange=function(t){4===t.target.readyState&&(e?r.createVertexShaderProgram(t.target.responseText):r.createFragmentShaderProgram(t.target.responseText))},i.open("GET",t,!0),i.send(null)}},o.createVertexShaderProgram=function(t){if(i){var e=i.createShader(i.VERTEX_SHADER);if(i.shaderSource(e,t),i.compileShader(e),!i.getShaderParameter(e,i.COMPILE_STATUS))return console.warn("Error in Vertex Shader : ",this.idVertex,":",i.getShaderInfoLog(e)),console.log(s(t)),null;this.vertexShader=e,void 0!==this.vertexShader&&void 0!==this.fragmentShader&&this.attachShaderProgram(),this._loadedCount++}},o.createFragmentShaderProgram=function(t){if(i){var e=i.createShader(i.FRAGMENT_SHADER);if(i.shaderSource(e,t),i.compileShader(e),!i.getShaderParameter(e,i.COMPILE_STATUS))return console.warn("Error in Fragment Shader: ",this.idFragment,":",i.getShaderInfoLog(e)),console.log(s(t)),null;this.fragmentShader=e,void 0!==this.vertexShader&&void 0!==this.fragmentShader&&this.attachShaderProgram(),this._loadedCount++}},o.attachShaderProgram=function(){this._isReady=!0,this.shaderProgram=i.createProgram(),i.attachShader(this.shaderProgram,this.vertexShader),i.attachShader(this.shaderProgram,this.fragmentShader),i.linkProgram(this.shaderProgram)},o.bind=function(){this._isReady&&(i.useProgram(this.shaderProgram),void 0===this.shaderProgram.pMatrixUniform&&(this.shaderProgram.pMatrixUniform=i.getUniformLocation(this.shaderProgram,"uPMatrix")),void 0===this.shaderProgram.mvMatrixUniform&&(this.shaderProgram.mvMatrixUniform=i.getUniformLocation(this.shaderProgram,"uMVMatrix")),void 0===this.shaderProgram.normalMatrixUniform&&(this.shaderProgram.normalMatrixUniform=i.getUniformLocation(this.shaderProgram,"normalMatrix")),void 0===this.shaderProgram.invertMVMatrixUniform&&(this.shaderProgram.invertMVMatrixUniform=i.getUniformLocation(this.shaderProgram,"invertMVMatrix")),r.setShader(this),r.setShaderProgram(this.shaderProgram),this.uniformTextures=[])},o.isReady=function(){return this._isReady},o.clearUniforms=function(){this.parameters=[],this.uniformValues={}},o.uniform=function(t,e,r){if(this._isReady){"texture"===e&&(e="uniform1i");for(var n,s=!1,a=0;a<this.parameters.length;a++)if(n=this.parameters[a],n.name===t){n.value=r,s=!0;break}if(s?this.shaderProgram[t]=n.uniformLoc:(this.shaderProgram[t]=i.getUniformLocation(this.shaderProgram,t),this.parameters.push({name:t,type:e,value:r,uniformLoc:this.shaderProgram[t]})),-1===e.indexOf("Matrix"))if(s)this.checkUniform(t,e,r)&&i[e](this.shaderProgram[t],r);else{var o=Array.isArray(r);this.uniformValues[t]=o?r.concat():r,i[e](this.shaderProgram[t],r)}else i[e](this.shaderProgram[t],!1,r),s||(i[e](this.shaderProgram[t],!1,r),this.uniformValues[t]=r);"uniform1i"===e&&(this.uniformTextures[r]=this.shaderProgram[t])}},o.checkUniform=function(t,e,i){var r=Array.isArray(i);if(!this.uniformValues[t])return this.uniformValues[t]=i,!0;if("uniform1i"===e)return this.uniformValues[t]=i,!0;var n=this.uniformValues[t],s=!1;if(r){for(var a=0;a<n.length;a++)if(n[a]!==i[a]){s=!0;break}}else s=n!==i;return s&&(this.uniformValues[t]=r?i.concat():i),s},o.unbind=function(){},o.destroy=function(){i.detachShader(this.shaderProgram,this.vertexShader),i.detachShader(this.shaderProgram,this.fragmentShader),i.deleteShader(this.vertexShader),i.deleteShader(this.fragmentShader),i.deleteProgram(this.shaderProgram)},e.exports=a},{"./GLTools":14,"./ShaderLibs":21}],13:[function(t,e){var i,r=t("./GLTools"),n=function(t){var e=0!==t&&!(t&t-1);return e},s=function(t){var e=t.width||t.videoWidth,i=t.height||t.videoHeight;return e&&i?n(e)&&n(i):!1},a=function(t,e,n){if(e=e||!1,n=n||{},i=r.gl,e)this.texture=t;else{this._source=t,this.texture=i.createTexture(),this._isVideo="VIDEO"===t.tagName,this.magFilter=n.magFilter||i.LINEAR,this.minFilter=n.minFilter||i.LINEAR_MIPMAP_NEAREST,this.wrapS=n.wrapS||i.MIRRORED_REPEAT,this.wrapT=n.wrapT||i.MIRRORED_REPEAT;var a=t.width||t.videoWidth;a?s(t)||(this.wrapS=this.wrapT=i.CLAMP_TO_EDGE,this.minFilter===i.LINEAR_MIPMAP_NEAREST&&(this.minFilter=i.LINEAR)):(this.wrapS=this.wrapT=i.CLAMP_TO_EDGE,this.minFilter===i.LINEAR_MIPMAP_NEAREST&&(this.minFilter=i.LINEAR)),i.bindTexture(i.TEXTURE_2D,this.texture),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!0),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,t),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,this.magFilter),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,this.minFilter),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,this.wrapS),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,this.wrapT),this.minFilter===i.LINEAR_MIPMAP_NEAREST&&i.generateMipmap(i.TEXTURE_2D),i.bindTexture(i.TEXTURE_2D,null)}},o=a.prototype;o.updateTexture=function(t){t&&(this._source=t),i.bindTexture(i.TEXTURE_2D,this.texture),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!0),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,this._source),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,this.magFilter),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,this.minFilter),this.minFilter===i.LINEAR_MIPMAP_NEAREST&&i.generateMipmap(i.TEXTURE_2D),i.bindTexture(i.TEXTURE_2D,null)},o.bind=function(t){void 0===t&&(t=0),r.shader&&(i.activeTexture(i.TEXTURE0+t),i.bindTexture(i.TEXTURE_2D,this.texture),i.uniform1i(r.shader.uniformTextures[t],t),this._bindIndex=t)},o.unbind=function(){i.bindTexture(i.TEXTURE_2D,null)},o.destroy=function(){i.deleteTexture(this.texture)},e.exports=a},{"./GLTools":14}],14:[function(t,e){function i(){this.aspectRatio=1,this.fieldOfView=45,this.zNear=5,this.zFar=3e3,this.canvas=null,this.gl=null,this.shader=null,this.shaderProgram=null}var r=t("gl-matrix"),n=i.prototype;n.init=function(t,e,i,n){null===this.canvas&&(this.canvas=t||document.createElement("canvas"));var s=n||{};s.antialias=!0,this.gl=this.canvas.getContext("webgl",s)||this.canvas.getContext("experimental-webgl",s),console.log("GL TOOLS : ",this.gl),void 0!==e&&void 0!==i?this.setSize(e,i):this.setSize(window.innerWidth,window.innerHeight),this.gl.viewport(0,0,this.gl.viewportWidth,this.gl.viewportHeight),this.gl.enable(this.gl.DEPTH_TEST),this.gl.enable(this.gl.CULL_FACE),this.gl.enable(this.gl.BLEND),this.gl.clearColor(0,0,0,1),this.gl.clearDepth(1),this.matrix=r.mat4.create(),r.mat4.identity(this.matrix),this.normalMatrix=r.mat3.create(),this.invertMVMatrix=r.mat3.create(),this.depthTextureExt=this.gl.getExtension("WEBKIT_WEBGL_depth_texture"),this.floatTextureExt=this.gl.getExtension("OES_texture_float"),this.floatTextureLinearExt=this.gl.getExtension("OES_texture_float_linear"),this.standardDerivativesExt=this.gl.getExtension("OES_standard_derivatives"),this.enabledVertexAttribute=[],this.enableAlphaBlending(),this._viewport=[0,0,this.width,this.height]},n.getGL=function(){return this.gl},n.setShader=function(t){this.shader=t},n.setShaderProgram=function(t){this.shaderProgram=t},n.setViewport=function(t,e,i,r){var n=!1;t!==this._viewport[0]&&(n=!0),e!==this._viewport[1]&&(n=!0),i!==this._viewport[2]&&(n=!0),r!==this._viewport[3]&&(n=!0),n&&(this.gl.viewport(t,e,i,r),this._viewport=[t,e,i,r])},n.setMatrices=function(t){this.camera=t},n.rotate=function(t){r.mat4.copy(this.matrix,t),r.mat4.multiply(this.matrix,this.camera.getMatrix(),this.matrix),r.mat3.fromMat4(this.normalMatrix,this.matrix),r.mat3.invert(this.normalMatrix,this.normalMatrix),r.mat3.transpose(this.normalMatrix,this.normalMatrix),r.mat3.fromMat4(this.invertMVMatrix,this.matrix),r.mat3.invert(this.invertMVMatrix,this.invertMVMatrix)},n.enableAlphaBlending=function(){this.gl.blendFunc(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA)},n.enableAdditiveBlending=function(){this.gl.blendFunc(this.gl.ONE,this.gl.ONE)},n.clear=function(t,e,i,r){this.gl.clearColor(t,e,i,r),this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT)},n.draw=function(t){function e(t,e,i){return void 0===e.cacheAttribLoc&&(e.cacheAttribLoc={}),void 0===e.cacheAttribLoc[i]&&(e.cacheAttribLoc[i]=t.getAttribLocation(e,i)),e.cacheAttribLoc[i]}if(!this.shaderProgram)return void console.warn("Shader program not ready yet");if(this.shaderProgram.pMatrixValue){var i=this.camera.projection||this.camera.getMatrix();r.mat4.str(this.shaderProgram.pMatrixValue)!==r.mat4.str(i)&&(this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform,!1,this.camera.projection||this.camera.getMatrix()),r.mat4.copy(this.shaderProgram.pMatrixValue,i))}else this.shaderProgram.pMatrixValue=r.mat4.create(),this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform,!1,this.camera.projection||this.camera.getMatrix()),r.mat4.copy(this.shaderProgram.pMatrixValue,this.camera.projection||this.camera.getMatrix());this.shaderProgram.mvMatrixValue?r.mat4.str(this.shaderProgram.mvMatrixValue)!==r.mat4.str(this.matrix)&&(this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform,!1,this.matrix),r.mat4.copy(this.shaderProgram.mvMatrixValue,this.matrix)):(this.shaderProgram.mvMatrixValue=r.mat4.create(),this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform,!1,this.matrix),r.mat4.copy(this.shaderProgram.mvMatrixValue,this.matrix)),this.shaderProgram.invertMVMatrixValue?r.mat3.str(this.shaderProgram.invertMVMatrixValue)!==r.mat3.str(this.invertMVMatrix)&&(this.gl.uniformMatrix3fv(this.shaderProgram.invertMVMatrixUniform,!1,this.invertMVMatrix),r.mat3.copy(this.shaderProgram.invertMVMatrixValue,this.invertMVMatrix)):(this.shaderProgram.invertMVMatrixValue=r.mat3.create(),this.gl.uniformMatrix3fv(this.shaderProgram.invertMVMatrixUniform,!1,this.invertMVMatrix),r.mat3.copy(this.shaderProgram.invertMVMatrixValue,this.invertMVMatrix)),this.shaderProgram.normalMatrixValue?r.mat3.str(this.shaderProgram.normalMatrixValue)!==r.mat3.str(this.normalMatrix)&&(this.gl.uniformMatrix3fv(this.shaderProgram.normalMatrixUniform,!1,this.normalMatrix),r.mat3.copy(this.shaderProgram.normalMatrixValue,this.normalMatrix)):(this.shaderProgram.normalMatrixValue=r.mat4.create(),this.gl.uniformMatrix3fv(this.shaderProgram.normalMatrixUniform,!1,this.normalMatrix),r.mat3.copy(this.shaderProgram.normalMatrixValue,this.normalMatrix)),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,t.vBufferPos);var n=e(this.gl,this.shaderProgram,"aVertexPosition");this.gl.vertexAttribPointer(n,t.vBufferPos.itemSize,this.gl.FLOAT,!1,0,0),-1===this.enabledVertexAttribute.indexOf(n)&&(this.gl.enableVertexAttribArray(n),this.enabledVertexAttribute.push(n)),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,t.vBufferUV);var s=e(this.gl,this.shaderProgram,"aTextureCoord");this.gl.vertexAttribPointer(s,t.vBufferUV.itemSize,this.gl.FLOAT,!1,0,0),-1===this.enabledVertexAttribute.indexOf(s)&&(this.gl.enableVertexAttribArray(s),this.enabledVertexAttribute.push(s)),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,t.iBuffer);for(var a=0;a<t.extraAttributes.length;a++){this.gl.bindBuffer(this.gl.ARRAY_BUFFER,t.extraAttributes[a].buffer);var o=e(this.gl,this.shaderProgram,t.extraAttributes[a].name);this.gl.vertexAttribPointer(o,t.extraAttributes[a].itemSize,this.gl.FLOAT,!1,0,0),-1===this.enabledVertexAttribute.indexOf(o)&&(this.gl.enableVertexAttribArray(o),this.enabledVertexAttribute.push(o))}t.drawType===this.gl.POINTS?this.gl.drawArrays(t.drawType,0,t.vertexSize):this.gl.drawElements(t.drawType,t.iBuffer.numItems,this.gl.UNSIGNED_SHORT,0)},n.setSize=function(t,e){this._width=t,this._height=e,this.canvas.width=this._width,this.canvas.height=this._height,this.gl.viewportWidth=this._width,this.gl.viewportHeight=this._height,this.gl.viewport(0,0,this._width,this._height),this.aspectRatio=this._width/this._height},n.__defineGetter__("width",function(){return this._width}),n.__defineGetter__("height",function(){return this._height}),n.__defineGetter__("viewport",function(){return this._viewport});var s=null;i.getInstance=function(){return null===s&&(s=new i),s},e.exports=i.getInstance()},{"gl-matrix":2}],15:[function(t,e){var i=t("./Face"),r=t("./GLTools"),n=t("gl-matrix"),s=function(t,e,i){this.gl=r.gl,this.vertexSize=t,this.indexSize=e,this.drawType=i,this.extraAttributes=[],this.vBufferPos=void 0,this._floatArrayVertex=void 0,this._init()},a=s.prototype;a._init=function(){},a.bufferVertex=function(t,e){var i=[],r=e?this.gl.DYNAMIC_DRAW:this.gl.STATIC_DRAW;this._vertices=[];for(var s=0;s<t.length;s++){for(var a=0;a<t[s].length;a++)i.push(t[s][a]);this._vertices.push(n.vec3.clone(t[s]))}if(void 0===this.vBufferPos&&(this.vBufferPos=this.gl.createBuffer()),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.vBufferPos),void 0===this._floatArrayVertex)this._floatArrayVertex=new Float32Array(i);else if(t.length!==this._floatArrayVertex.length)this._floatArrayVertex=new Float32Array(i);else for(var o=0;o<t.length;o++)this._floatArrayVertex[o]=t[o];this.gl.bufferData(this.gl.ARRAY_BUFFER,this._floatArrayVertex,r),this.vBufferPos.itemSize=3},a.bufferTexCoords=function(t){for(var e=[],i=0;i<t.length;i++)for(var r=0;r<t[i].length;r++)e.push(t[i][r]);this.vBufferUV=this.gl.createBuffer(),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.vBufferUV),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(e),this.gl.STATIC_DRAW),this.vBufferUV.itemSize=2},a.bufferData=function(t,e,i,r){var n=-1,s=r?this.gl.DYNAMIC_DRAW:this.gl.STATIC_DRAW,a=0;for(a=0;a<this.extraAttributes.length;a++)if(this.extraAttributes[a].name===e){this.extraAttributes[a].data=t,n=a;
break}var o=[];for(a=0;a<t.length;a++)for(var h=0;h<t[a].length;h++)o.push(t[a][h]);var u,c;if(-1===n)u=this.gl.createBuffer(),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,u),c=new Float32Array(o),this.gl.bufferData(this.gl.ARRAY_BUFFER,c,s),this.extraAttributes.push({name:e,data:t,itemSize:i,buffer:u,floatArray:c});else{for(u=this.extraAttributes[n].buffer,this.gl.bindBuffer(this.gl.ARRAY_BUFFER,u),c=this.extraAttributes[n].floatArray,a=0;a<o.length;a++)c[a]=o[a];this.gl.bufferData(this.gl.ARRAY_BUFFER,c,s)}},a.bufferIndices=function(t){this._indices=t,this.iBuffer=this.gl.createBuffer(),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this.iBuffer),this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(t),this.gl.STATIC_DRAW),this.iBuffer.itemSize=1,this.iBuffer.numItems=t.length},a.computeNormals=function(){if(this.drawType===this.gl.TRIANGLES){void 0===this._faces&&this._generateFaces(),console.log("Start computing");var t=(new Date).getTime(),e=0;this._normals=[];for(var i=0;i<this._vertices.length;i++){var r=n.vec3.create(),s=0;for(e=0;e<this._faces.length;e++)this._faces[e].contains(this._vertices[i])&&(n.vec3.add(r,r,this._faces[e].faceNormal),s++);n.vec3.normalize(r,r),this._normals.push(r)}this.bufferData(this._normals,"aNormal",3);var a=(new Date).getTime()-t;console.log("Total Time : ",a)}},a.computeTangent=function(){},a._generateFaces=function(){this._faces=[];for(var t=0;t<this._indices.length;t+=3){var e=this._vertices[this._indices[t+0]],r=this._vertices[this._indices[t+1]],n=this._vertices[this._indices[t+2]];this._faces.push(new i(e,r,n))}},e.exports=s},{"./Face":9,"./GLTools":14,"gl-matrix":2}],16:[function(t,e){var i=t("./GLTools"),r=t("./Mesh"),n={};n.createPlane=function(t,e,n,s,a){a=void 0===a?"xy":a,s=void 0===s?!1:s;for(var o=[],h=[],u=[],c=[],f=t/n,l=e/n,d=1/n,p=0,v=.5*-t,m=.5*-e,_=0;n>_;_++)for(var g=0;n>g;g++){var x=f*_+v,M=l*g+m;"xz"===a?(o.push([x,0,M+l]),o.push([x+f,0,M+l]),o.push([x+f,0,M]),o.push([x,0,M]),c.push([0,1,0]),c.push([0,1,0]),c.push([0,1,0]),c.push([0,1,0])):"yz"===a?(o.push([0,x,M]),o.push([0,x+f,M]),o.push([0,x+f,M+l]),o.push([0,x,M+l]),c.push([1,0,0]),c.push([1,0,0]),c.push([1,0,0]),c.push([1,0,0])):(o.push([x,M,0]),o.push([x+f,M,0]),o.push([x+f,M+l,0]),o.push([x,M+l,0]),c.push([0,0,1]),c.push([0,0,1]),c.push([0,0,1]),c.push([0,0,1]));var T=_/n,E=g/n;h.push([T,E]),h.push([T+d,E]),h.push([T+d,E+d]),h.push([T,E+d]),u.push(4*p+0),u.push(4*p+1),u.push(4*p+2),u.push(4*p+0),u.push(4*p+2),u.push(4*p+3),p++}var b=new r(o.length,u.length,i.gl.TRIANGLES);return b.bufferVertex(o),b.bufferTexCoords(h),b.bufferIndices(u),s&&b.bufferData(c,"aNormal",3),b},n.createSphere=function(t,e,n){n=void 0===n?!1:n;for(var s=[],a=[],o=[],h=[],u=0,c=1/e,f=function(i,r,n){n=void 0===n?!1:n;var s=i/e*Math.PI-.5*Math.PI,a=r/e*Math.PI*2,o=n?1:t,h=[];h[1]=Math.sin(s)*o;var u=Math.cos(s)*o;h[0]=Math.cos(a)*u,h[2]=Math.sin(a)*u;var c=1e4;return h[0]=Math.floor(h[0]*c)/c,h[1]=Math.floor(h[1]*c)/c,h[2]=Math.floor(h[2]*c)/c,h},l=0;e>l;l++)for(var d=0;e>d;d++){s.push(f(l,d)),s.push(f(l+1,d)),s.push(f(l+1,d+1)),s.push(f(l,d+1)),n&&(h.push(f(l,d,!0)),h.push(f(l+1,d,!0)),h.push(f(l+1,d+1,!0)),h.push(f(l,d+1,!0)));var p=d/e,v=l/e;a.push([1-p,v]),a.push([1-p,v+c]),a.push([1-p-c,v+c]),a.push([1-p-c,v]),o.push(4*u+0),o.push(4*u+1),o.push(4*u+2),o.push(4*u+0),o.push(4*u+2),o.push(4*u+3),u++}var m=new r(s.length,o.length,i.gl.TRIANGLES);return m.bufferVertex(s),m.bufferTexCoords(a),m.bufferIndices(o),console.log("With normals :",n),n&&m.bufferData(h,"aNormal",3),m},n.createCube=function(t,e,n,s){s=void 0===s?!1:s,e=e||t,n=n||t;var a=t/2,o=e/2,h=n/2,u=[],c=[],f=[],l=[],d=0;u.push([-a,o,-h]),u.push([a,o,-h]),u.push([a,-o,-h]),u.push([-a,-o,-h]),l.push([0,0,-1]),l.push([0,0,-1]),l.push([0,0,-1]),l.push([0,0,-1]),c.push([0,0]),c.push([1,0]),c.push([1,1]),c.push([0,1]),f.push(4*d+0),f.push(4*d+1),f.push(4*d+2),f.push(4*d+0),f.push(4*d+2),f.push(4*d+3),d++,u.push([a,o,-h]),u.push([a,o,h]),u.push([a,-o,h]),u.push([a,-o,-h]),l.push([1,0,0]),l.push([1,0,0]),l.push([1,0,0]),l.push([1,0,0]),c.push([0,0]),c.push([1,0]),c.push([1,1]),c.push([0,1]),f.push(4*d+0),f.push(4*d+1),f.push(4*d+2),f.push(4*d+0),f.push(4*d+2),f.push(4*d+3),d++,u.push([a,o,h]),u.push([-a,o,h]),u.push([-a,-o,h]),u.push([a,-o,h]),l.push([0,0,1]),l.push([0,0,1]),l.push([0,0,1]),l.push([0,0,1]),c.push([0,0]),c.push([1,0]),c.push([1,1]),c.push([0,1]),f.push(4*d+0),f.push(4*d+1),f.push(4*d+2),f.push(4*d+0),f.push(4*d+2),f.push(4*d+3),d++,u.push([-a,o,h]),u.push([-a,o,-h]),u.push([-a,-o,-h]),u.push([-a,-o,h]),l.push([-1,0,0]),l.push([-1,0,0]),l.push([-1,0,0]),l.push([-1,0,0]),c.push([0,0]),c.push([1,0]),c.push([1,1]),c.push([0,1]),f.push(4*d+0),f.push(4*d+1),f.push(4*d+2),f.push(4*d+0),f.push(4*d+2),f.push(4*d+3),d++,u.push([-a,o,h]),u.push([a,o,h]),u.push([a,o,-h]),u.push([-a,o,-h]),l.push([0,1,0]),l.push([0,1,0]),l.push([0,1,0]),l.push([0,1,0]),c.push([0,0]),c.push([1,0]),c.push([1,1]),c.push([0,1]),f.push(4*d+0),f.push(4*d+1),f.push(4*d+2),f.push(4*d+0),f.push(4*d+2),f.push(4*d+3),d++,u.push([-a,-o,-h]),u.push([a,-o,-h]),u.push([a,-o,h]),u.push([-a,-o,h]),l.push([0,-1,0]),l.push([0,-1,0]),l.push([0,-1,0]),l.push([0,-1,0]),c.push([0,0]),c.push([1,0]),c.push([1,1]),c.push([0,1]),f.push(4*d+0),f.push(4*d+1),f.push(4*d+2),f.push(4*d+0),f.push(4*d+2),f.push(4*d+3),d++;var p=new r(u.length,f.length,i.gl.TRIANGLES);return p.bufferVertex(u),p.bufferTexCoords(c),p.bufferIndices(f),s&&p.bufferData(l,"aNormal",3),p},n.createSkyBox=function(t,e){e=void 0===e?!1:e;var n=[],s=[],a=[],o=[],h=0;n.push([t,t,-t]),n.push([-t,t,-t]),n.push([-t,-t,-t]),n.push([t,-t,-t]),o.push([0,0,-1]),o.push([0,0,-1]),o.push([0,0,-1]),o.push([0,0,-1]),s.push([0,0]),s.push([1,0]),s.push([1,1]),s.push([0,1]),a.push(4*h+0),a.push(4*h+1),a.push(4*h+2),a.push(4*h+0),a.push(4*h+2),a.push(4*h+3),h++,n.push([t,-t,-t]),n.push([t,-t,t]),n.push([t,t,t]),n.push([t,t,-t]),o.push([1,0,0]),o.push([1,0,0]),o.push([1,0,0]),o.push([1,0,0]),s.push([0,0]),s.push([1,0]),s.push([1,1]),s.push([0,1]),a.push(4*h+0),a.push(4*h+1),a.push(4*h+2),a.push(4*h+0),a.push(4*h+2),a.push(4*h+3),h++,n.push([-t,t,t]),n.push([t,t,t]),n.push([t,-t,t]),n.push([-t,-t,t]),o.push([0,0,1]),o.push([0,0,1]),o.push([0,0,1]),o.push([0,0,1]),s.push([0,0]),s.push([1,0]),s.push([1,1]),s.push([0,1]),a.push(4*h+0),a.push(4*h+1),a.push(4*h+2),a.push(4*h+0),a.push(4*h+2),a.push(4*h+3),h++,n.push([-t,-t,t]),n.push([-t,-t,-t]),n.push([-t,t,-t]),n.push([-t,t,t]),o.push([-1,0,0]),o.push([-1,0,0]),o.push([-1,0,0]),o.push([-1,0,0]),s.push([0,0]),s.push([1,0]),s.push([1,1]),s.push([0,1]),a.push(4*h+0),a.push(4*h+1),a.push(4*h+2),a.push(4*h+0),a.push(4*h+2),a.push(4*h+3),h++,n.push([t,t,t]),n.push([-t,t,t]),n.push([-t,t,-t]),n.push([t,t,-t]),o.push([0,1,0]),o.push([0,1,0]),o.push([0,1,0]),o.push([0,1,0]),s.push([0,0]),s.push([1,0]),s.push([1,1]),s.push([0,1]),a.push(4*h+0),a.push(4*h+1),a.push(4*h+2),a.push(4*h+0),a.push(4*h+2),a.push(4*h+3),h++,n.push([t,-t,-t]),n.push([-t,-t,-t]),n.push([-t,-t,t]),n.push([t,-t,t]),o.push([0,-1,0]),o.push([0,-1,0]),o.push([0,-1,0]),o.push([0,-1,0]),s.push([0,0]),s.push([1,0]),s.push([1,1]),s.push([0,1]),a.push(4*h+0),a.push(4*h+1),a.push(4*h+2),a.push(4*h+0),a.push(4*h+2),a.push(4*h+3);var u=new r(n.length,a.length,i.gl.TRIANGLES);return u.bufferVertex(n),u.bufferTexCoords(s),u.bufferIndices(a),e&&u.bufferData(o,"aNormal",3),u},e.exports=n},{"./GLTools":14,"./Mesh":15}],17:[function(t,e){function i(){this._clearAll()}var r,n=t("./GLTools"),s=t("./Mesh"),a=i.prototype;a._clearAll=function(){this._callback=null,this._callbackError=null,this._mesh=[],this._drawingType=""},a.load=function(t,e,i,s,a){this._clearAll(),r||(r=n.gl),this._drawingType=void 0===a?r.TRIANGLES:a,this._ignoreNormals=void 0===s?!0:s,this._callback=e,this._callbackError=i;var o=new XMLHttpRequest;o.onreadystatechange=this._onXHTPState.bind(this),o.open("GET",t,!0),o.send()},a._onXHTPState=function(t){4===t.target.readyState&&this._parseObj(t.target.response)},a.parse=function(t,e,i,n,s){this._clearAll(),this._drawingType=void 0===s?r.TRIANGLES:s,this._ignoreNormals=void 0===n?!0:n,this._parseObj(t)},a._parseObj=function(t){function e(t){var e=parseInt(t);return 3*(e>=0?e-1:e+d.length/3)}function i(t){var e=parseInt(t);return 3*(e>=0?e-1:e+p.length/3)}function r(t){var e=parseInt(t);return 2*(e>=0?e-1:e+v.length/2)}function n(t,e,i){c.push([d[t],d[t+1],d[t+2]]),c.push([d[e],d[e+1],d[e+2]]),c.push([d[i],d[i+1],d[i+2]]),m.push(3*_+0),m.push(3*_+1),m.push(3*_+2),_++}function s(t,e,i){f.push([v[t],v[t+1]]),f.push([v[e],v[e+1]]),f.push([v[i],v[i+1]])}function a(t,e,i){l.push([p[t],p[t+1],p[t+2]]),l.push([p[e],p[e+1],p[e+2]]),l.push([p[i],p[i+1],p[i+2]])}function o(t,o,h,u,c,f,l,d,p,v,m,_){var g,x=e(t),M=e(o),T=e(h);void 0===u?n(x,M,T):(g=e(u),n(x,M,g),n(M,T,g)),void 0!==c&&(x=r(c),M=r(f),T=r(l),void 0===u?s(x,M,T):(g=r(d),s(x,M,g),s(M,T,g))),void 0!==p&&(x=i(p),M=i(v),T=i(m),void 0===u?a(x,M,T):(g=i(_),a(x,M,g),a(M,T,g)))}for(var h,u=t.split("\n"),c=[],f=[],l=[],d=[],p=[],v=[],m=[],_=0,g=/v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/,x=/vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/,M=/vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/,T=/f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/,E=/f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/,b=/f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/,R=/f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/,A=0;A<u.length;A++){var w=u[A];w=w.trim(),0!==w.length&&"#"!==w.charAt(0)&&(null!==(h=g.exec(w))?d.push(parseFloat(h[1]),parseFloat(h[2]),parseFloat(h[3])):null!==(h=x.exec(w))?p.push(parseFloat(h[1]),parseFloat(h[2]),parseFloat(h[3])):null!==(h=M.exec(w))?v.push(parseFloat(h[1]),parseFloat(h[2])):null!==(h=T.exec(w))?o(h[1],h[2],h[3],h[4]):null!==(h=E.exec(w))?o(h[2],h[5],h[8],h[11],h[3],h[6],h[9],h[12]):null!==(h=b.exec(w))?o(h[2],h[6],h[10],h[14],h[3],h[7],h[11],h[15],h[4],h[8],h[12],h[16]):null!==(h=R.exec(w))&&o(h[2],h[5],h[8],h[11],void 0,void 0,void 0,void 0,h[3],h[6],h[9],h[12]))}this._generateMeshes({positions:c,coords:f,normals:l,indices:m})},a._generateMeshes=function(t){r=n.gl;var e=new s(t.positions.length,t.indices.length,this._drawingType);e.bufferVertex(t.positions),e.bufferTexCoords(t.coords),e.bufferIndices(t.indices),this._ignoreNormals||e.bufferData(t.normals,"aNormal",3),this._callback&&this._callback(e,t)},e.exports=i},{"./GLTools":14,"./Mesh":15}],18:[function(t,e){function i(t){void 0===t&&(t=document),this._isRotateZ=0,this.matrix=r.mat4.create(),this.m=r.mat4.create(),this._vZaxis=r.vec3.clone([0,0,0]),this._zAxis=r.vec3.clone([0,0,-1]),this.preMouse={x:0,y:0},this.mouse={x:0,y:0},this._isMouseDown=!1,this._rotation=r.quat.clone([0,0,1,0]),this.tempRotation=r.quat.clone([0,0,0,0]),this._rotateZMargin=0,this.diffX=0,this.diffY=0,this._currDiffX=0,this._currDiffY=0,this._offset=.004,this._easing=.1,this._slerp=-1,this._isLocked=!1;var e=this;t.addEventListener("mousedown",function(t){e._onMouseDown(t)}),t.addEventListener("touchstart",function(t){e._onMouseDown(t)}),t.addEventListener("mouseup",function(t){e._onMouseUp(t)}),t.addEventListener("touchend",function(t){e._onMouseUp(t)}),t.addEventListener("mousemove",function(t){e._onMouseMove(t)}),t.addEventListener("touchmove",function(t){e._onMouseMove(t)})}var r=t("gl-matrix"),n=i.prototype;n.inverseControl=function(t){this._isInvert=void 0===t?!0:t},n.lock=function(t){this._isLocked=void 0===t?!0:t},n.getMousePos=function(t){var e,i;return void 0!==t.changedTouches?(e=t.changedTouches[0].pageX,i=t.changedTouches[0].pageY):(e=t.clientX,i=t.clientY),{x:e,y:i}},n._onMouseDown=function(t){if(!this._isLocked&&!this._isMouseDown){var e=this.getMousePos(t),i=r.quat.clone(this._rotation);this._updateRotation(i),this._rotation=i,this._isMouseDown=!0,this._isRotateZ=0,this.preMouse={x:e.x,y:e.y},e.y<this._rotateZMargin||e.y>window.innerHeight-this._rotateZMargin?this._isRotateZ=1:(e.x<this._rotateZMargin||e.x>window.innerWidth-this._rotateZMargin)&&(this._isRotateZ=2),this._currDiffX=this.diffX=0,this._currDiffY=this.diffY=0}},n._onMouseMove=function(t){this._isLocked||(t.touches&&t.preventDefault(),this.mouse=this.getMousePos(t))},n._onMouseUp=function(){this._isLocked||this._isMouseDown&&(this._isMouseDown=!1)},n.setCameraPos=function(t,e){if(e=e||this._easing,this._easing=e,!(this._slerp>0)){var i=r.quat.clone(this._rotation);this._updateRotation(i),this._rotation=r.quat.clone(i),this._currDiffX=this.diffX=0,this._currDiffY=this.diffY=0,this._isMouseDown=!1,this._isRotateZ=0,this._targetQuat=r.quat.clone(t),this._slerp=1}},n.resetQuat=function(){this._rotation=r.quat.clone([0,0,1,0]),this.tempRotation=r.quat.clone([0,0,0,0]),this._targetQuat=void 0,this._slerp=-1},n.update=function(){r.mat4.identity(this.m),void 0===this._targetQuat?(r.quat.set(this.tempRotation,this._rotation[0],this._rotation[1],this._rotation[2],this._rotation[3]),this._updateRotation(this.tempRotation)):(this._slerp+=.1*(0-this._slerp),this._slerp<.001?(r.quat.set(this._rotation,this._targetQuat[0],this._targetQuat[1],this._targetQuat[2],this._targetQuat[3]),this._targetQuat=void 0,this._slerp=-1):(r.quat.set(this.tempRotation,0,0,0,0),r.quat.slerp(this.tempRotation,this._targetQuat,this._rotation,this._slerp))),r.vec3.transformQuat(this._vZaxis,this._vZaxis,this.tempRotation),r.mat4.fromQuat(this.matrix,this.tempRotation)},n._updateRotation=function(t){this._isMouseDown&&!this._isLocked&&(this.diffX=-(this.mouse.x-this.preMouse.x),this.diffY=this.mouse.y-this.preMouse.y,this._isInvert&&(this.diffX=-this.diffX,this.diffY=-this.diffY)),this._currDiffX+=(this.diffX-this._currDiffX)*this._easing,this._currDiffY+=(this.diffY-this._currDiffY)*this._easing;var e,i;if(this._isRotateZ>0)1===this._isRotateZ?(e=-this._currDiffX*this._offset,e*=this.preMouse.y<this._rotateZMargin?-1:1,i=r.quat.clone([0,0,Math.sin(e),Math.cos(e)]),r.quat.multiply(i,t,i)):(e=-this._currDiffY*this._offset,e*=this.preMouse.x<this._rotateZMargin?1:-1,i=r.quat.clone([0,0,Math.sin(e),Math.cos(e)]),r.quat.multiply(i,t,i));else{var n=r.vec3.clone([this._currDiffX,this._currDiffY,0]),s=r.vec3.create();r.vec3.cross(s,n,this._zAxis),r.vec3.normalize(s,s),e=r.vec3.length(n)*this._offset,i=r.quat.clone([Math.sin(e)*s[0],Math.sin(e)*s[1],Math.sin(e)*s[2],Math.cos(e)]),r.quat.multiply(t,i,t)}},e.exports=i},{"gl-matrix":2}],19:[function(t,e){var i=t("./GLTools"),r=t("./QuatRotation"),n=t("./CameraOrtho"),s=t("./SimpleCamera"),a=t("gl-matrix"),o=function(){null!==i.canvas&&(this.gl=i.gl,this._children=[],this._init())},h=o.prototype;h._init=function(){this.camera=new s(i.canvas),this.camera.setPerspective(45*Math.PI/180,i.aspectRatio,5,3e3),this.camera.lockRotation();var t=a.vec3.clone([0,0,500]),e=a.vec3.create(),o=a.vec3.clone([0,-1,0]);this.camera.lookAt(t,e,o),this.sceneRotation=new r(i.canvas),this.rotationFront=a.mat4.create(),a.mat4.identity(this.rotationFront),this.cameraOrtho=new n,this.cameraOrthoScreen=new n,this.cameraOtho=this.cameraOrtho,this.cameraOrtho.lookAt(t,e,o),this.cameraOrtho.ortho(1,-1,1,-1),this.cameraOrthoScreen.lookAt(t,e,o),this.cameraOrthoScreen.ortho(0,i.width,i.height,0),this._initTextures(),this._initViews(),window.addEventListener("resize",this._onResize.bind(this))},h._initTextures=function(){},h._initViews=function(){},h.loop=function(){this.update(),this.render()},h.update=function(){this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT),this.sceneRotation.update(),i.setViewport(0,0,i.width,i.height),i.setMatrices(this.camera),i.rotate(this.sceneRotation.matrix)},h.resize=function(){},h.render=function(){},h._onResize=function(){this.cameraOrthoScreen.ortho(0,i.width,i.height,0)},e.exports=o},{"./CameraOrtho":5,"./GLTools":14,"./QuatRotation":18,"./SimpleCamera":22,"gl-matrix":2}],20:[function(t,e){function i(){this.FRAMERATE=60,this._delayTasks=[],this._nextTasks=[],this._deferTasks=[],this._highTasks=[],this._usurpTask=[],this._enterframeTasks=[],this._idTable=0,window.requestAnimFrame(this._loop.bind(this))}void 0===window.requestAnimFrame&&(window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)}}());var r=i.prototype;r._loop=function(){window.requestAnimFrame(this._loop.bind(this)),this._process()},r._process=function(){var t,e,i,r=0;for(r=0;r<this._enterframeTasks.length;r++)t=this._enterframeTasks[r],null!==t&&void 0!==t&&t.func.apply(t.scope,t.params);for(;this._highTasks.length>0;)t=this._highTasks.pop(),t.func.apply(t.scope,t.params);var n=(new Date).getTime();for(r=0;r<this._delayTasks.length;r++)t=this._delayTasks[r],n-t.time>t.delay&&(t.func.apply(t.scope,t.params),this._delayTasks.splice(r,1));for(n=(new Date).getTime(),e=1e3/this.FRAMERATE;this._deferTasks.length>0;){if(t=this._deferTasks.shift(),i=(new Date).getTime(),!(e>i-n)){this._deferTasks.unshift(t);break}t.func.apply(t.scope,t.params)}for(n=(new Date).getTime(),e=1e3/this.FRAMERATE;this._usurpTask.length>0&&(t=this._usurpTask.shift(),i=(new Date).getTime(),e>i-n);)t.func.apply(t.scope,t.params);this._highTasks=this._highTasks.concat(this._nextTasks),this._nextTasks=[],this._usurpTask=[]},r.addEF=function(t,e,i){i=i||[];var r=this._idTable;return this._enterframeTasks[r]={scope:t,func:e,params:i},this._idTable++,r},r.removeEF=function(t){return void 0!==this._enterframeTasks[t]&&(this._enterframeTasks[t]=null),-1},r.delay=function(t,e,i,r){var n=(new Date).getTime(),s={scope:t,func:e,params:i,delay:r,time:n};this._delayTasks.push(s)},r.defer=function(t,e,i){var r={scope:t,func:e,params:i};this._deferTasks.push(r)},r.next=function(t,e,i){var r={scope:t,func:e,params:i};this._nextTasks.push(r)},r.usurp=function(t,e,i){var r={scope:t,func:e,params:i};this._usurpTask.push(r)};var n=null;i.getInstance=function(){return null===n&&(n=new i),n},e.exports=i.getInstance()},{}],21:[function(t,e){var i=function(){};i.shaders={},i.shaders.copyVert="#define GLSLIFY 1\n\n#define SHADER_NAME BASIC_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n    vTextureCoord = aTextureCoord;\n}",i.shaders.copyNormalVert="#define GLSLIFY 1\n\n// copyWithNormals.vert\n\n#define SHADER_NAME BASIC_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec3 aNormal;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vNormal;\nvarying vec3 vVertex;\n\nvoid main(void) {\n	gl_Position   = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n	vTextureCoord = aTextureCoord;\n	vNormal       = aNormal;\n	vVertex 	  = aVertexPosition;\n}",i.shaders.generalVert="#define GLSLIFY 1\n\n#define SHADER_NAME GENERAL_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform vec3 position;\nuniform vec3 scale;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    vec3 pos = aVertexPosition;\n    pos *= scale;\n    pos += position;\n    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);\n    vTextureCoord = aTextureCoord;\n}",i.shaders.generalNormalVert="#define GLSLIFY 1\n\n#define SHADER_NAME GENERAL_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec3 aNormal;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform vec3 position;\nuniform vec3 scale;\n\nvarying vec3 vVertex;\nvarying vec3 vNormal;\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n	vec3 pos      = aVertexPosition;\n	pos           *= scale;\n	pos           += position;\n	gl_Position   = uPMatrix * uMVMatrix * vec4(pos, 1.0);\n	vTextureCoord = aTextureCoord;\n	\n	vNormal       = aNormal;\n	vVertex       = pos;\n}",i.shaders.generalWithNormalVert="#define GLSLIFY 1\n\n#define SHADER_NAME GENERAL_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec3 aNormal;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform vec3 position;\nuniform vec3 scale;\n\nvarying vec3 vVertex;\nvarying vec3 vNormal;\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n	vec3 pos      = aVertexPosition;\n	pos           *= scale;\n	pos           += position;\n	gl_Position   = uPMatrix * uMVMatrix * vec4(pos, 1.0);\n	vTextureCoord = aTextureCoord;\n	\n	vNormal       = aNormal;\n	vVertex       = pos;\n}",i.shaders.copyFrag="#define GLSLIFY 1\n\n#define SHADER_NAME SIMPLE_TEXTURE\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\n\nvoid main(void) {\n    gl_FragColor = texture2D(texture, vTextureCoord);\n}\n",i.shaders.alphaFrag="#define GLSLIFY 1\n\n#define SHADER_NAME TEXTURE_WITH_ALPHA\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform float opacity;\n\nvoid main(void) {\n    gl_FragColor = texture2D(texture, vTextureCoord);\n    gl_FragColor.a *= opacity;\n}",i.shaders.simpleColorFrag="#define GLSLIFY 1\n\n#define SHADER_NAME SIMPLE_COLOR_FRAGMENT\n\nprecision highp float;\nuniform vec3 color;\nuniform float opacity;\n\nvoid main(void) {\n    gl_FragColor = vec4(color, opacity);\n}",i.shaders.depthFrag="#define GLSLIFY 1\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform float n;\nuniform float f;\n\nfloat getDepth(float z) {\n	return (6.0 * n) / (f + n - z*(f-n));\n}\n\nvoid main(void) {\n    float r = texture2D(texture, vTextureCoord).r;\n    float grey = getDepth(r);\n    gl_FragColor = vec4(grey, grey, grey, 1.0);\n}",i.shaders.simpleCopyLighting="#define GLSLIFY 1\n\n#define SHADER_NAME SIMPLE_TEXTURE_LIGHTING\n\nprecision highp float;\n\nuniform vec3 ambient;\nuniform vec3 lightPosition;\nuniform vec3 lightColor;\nuniform float lightWeight;\n\nuniform sampler2D texture;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vVertex;\nvarying vec3 vNormal;\n\nvoid main(void) {\n	vec3 L        = normalize(lightPosition-vVertex);\n	float lambert = max(dot(vNormal, L), .0);\n	vec3 light    = ambient + lightColor * lambert * lightWeight;\n	vec4 color 	  = texture2D(texture, vTextureCoord);\n	color.rgb 	  *= light;\n	\n	gl_FragColor  = color;\n}",i.shaders.simpleColorLighting="#define GLSLIFY 1\n\n// simpleColorLighting.frag\n\n#define SHADER_NAME SIMPLE_COLOR_LIGHTING\n\nprecision highp float;\n\nuniform vec3 ambient;\nuniform vec3 lightPosition;\nuniform vec3 lightColor;\nuniform float lightWeight;\n\nuniform vec3 color;\nuniform float opacity;\n\nvarying vec3 vVertex;\nvarying vec3 vNormal;\n\nvoid main(void) {\n	vec3 L        = normalize(lightPosition-vVertex);\n	float lambert = max(dot(vNormal, L), .0);\n	vec3 light    = ambient + lightColor * lambert * lightWeight;\n	\n	gl_FragColor  = vec4(color * light, opacity);\n}",i.getShader=function(t){return this.shaders[t]},i.get=i.getShader,e.exports=i},{}],22:[function(t,e){var i=t("gl-matrix"),r=t("./CameraPerspective"),n=t("./EaseNumber"),s=function(t){this._listenerTarget=t||window,r.call(this),this._init()},a=s.prototype=new r,o=r.prototype;a._init=function(){this.radius=new n(500),this.position[2]=this.radius.value,this.positionOffset=i.vec3.create(),this.center=i.vec3.create(),this.up=i.vec3.clone([0,-1,0]),this.lookAt(this.position,this.center,this.up),this._mouse={},this._preMouse={},this._isMouseDown=!1,this._rx=new n(0),this._rx.limit(-Math.PI/2,Math.PI/2),this._ry=new n(0),this._preRX=0,this._preRY=0,this._isLockZoom=!1,this._isLockRotation=!1,this._isInvert=!1,this._listenerTarget.addEventListener("mousewheel",this._onWheel.bind(this)),this._listenerTarget.addEventListener("DOMMouseScroll",this._onWheel.bind(this)),this._listenerTarget.addEventListener("mousedown",this._onMouseDown.bind(this)),this._listenerTarget.addEventListener("touchstart",this._onMouseDown.bind(this)),this._listenerTarget.addEventListener("mousemove",this._onMouseMove.bind(this)),this._listenerTarget.addEventListener("touchmove",this._onMouseMove.bind(this)),window.addEventListener("mouseup",this._onMouseUp.bind(this)),window.addEventListener("touchend",this._onMouseUp.bind(this))},a.inverseControl=function(t){this._isInvert=void 0===t?!0:t},a.lock=function(t){void 0===t?(this._isLockZoom=!0,this._isLockRotation=!0):(this._isLockZoom=t,this._isLockRotation=t)},a.lockRotation=function(t){this._isLockRotation=void 0===t?!0:t},a.lockZoom=function(t){this._isLockZoom=void 0===t?!0:t},a._onMouseDown=function(t){this._isLockRotation||(this._isMouseDown=!0,h(t,this._mouse),h(t,this._preMouse),this._preRX=this._rx.targetValue,this._preRY=this._ry.targetValue)},a._onMouseMove=function(t){if(!this._isLockRotation&&(h(t,this._mouse),t.touches&&t.preventDefault(),this._isMouseDown)){var e=this._mouse.x-this._preMouse.x;this._isInvert&&(e*=-1),this._ry.value=this._preRY-.01*e;var i=this._mouse.y-this._preMouse.y;this._isInvert&&(i*=-1),this._rx.value=this._preRX-.01*i}},a._onMouseUp=function(){this._isLockRotation||(this._isMouseDown=!1)},a._onWheel=function(t){if(!this._isLockZoom){var e=t.wheelDelta,i=t.detail,r=0;r=i?e?e/i/40*i>0?1:-1:-i/3:e/120,this.radius.add(5*-r)}},a.getMatrix=function(){return this._updateCameraPosition(),this.lookAt(this.position,this.center,this.up),o.getMatrix.call(this)},a._updateCameraPosition=function(){this.position[1]=Math.sin(this._rx.value)*this.radius.value;var t=Math.cos(this._rx.value)*this.radius.value;this.position[0]=Math.cos(this._ry.value+.5*Math.PI)*t,this.position[2]=Math.sin(this._ry.value+.5*Math.PI)*t,i.vec3.add(this.position,this.position,this.positionOffset)};var h=function(t,e){var i=e||{};return t.touches?(i.x=t.touches[0].pageX,i.y=t.touches[0].pageY):(i.x=t.clientX,i.y=t.clientY),i};a.__defineGetter__("rx",function(){return this._rx.targetValue}),a.__defineSetter__("rx",function(t){this._rx.value=t}),a.__defineGetter__("ry",function(){return this._ry.targetValue}),a.__defineSetter__("ry",function(t){this._ry.value=t}),e.exports=s},{"./CameraPerspective":6,"./EaseNumber":7,"gl-matrix":2}],23:[function(t,e){var i=function(){this._imgs={},this._loadedCount=0,this._toLoadCount=0,this._scope=void 0,this._callback=void 0,this._callbackProgress=void 0},r=i.prototype;r.load=function(t,e,i,r){this._imgs={},this._loadedCount=0,this._toLoadCount=t.length,this._scope=e,this._callback=i,this._callbackProgress=r,this._imgLoadedBind=this._onImageLoaded.bind(this);for(var n=0;n<t.length;n++){var s=new Image;s.onload=this._imgLoadedBind;var a=t[n],o=a.split("/"),h=o[o.length-1].split(".")[0];this._imgs[h]=s,s.src=a}},r._onImageLoaded=function(){if(this._loadedCount++,this._loadedCount===this._toLoadCount)this._callback.call(this._scope,this._imgs);else{var t=this._loadedCount/this._toLoadCount;this._callbackProgress&&this._callbackProgress.call(this._scope,t)}},e.exports=i},{}],24:[function(t,e){var i=t("./GLShader"),r=function(t,e){this.shader=new i(t,e),this._init()},n=r.prototype;n._init=function(){},n.render=function(){},e.exports=r},{"./GLShader":12}],25:[function(t,e){var i=t("./GLTools"),r=t("./View"),n=t("./Mesh"),s="precision highp float;attribute vec3 aVertexPosition;attribute vec2 aTextureCoord;attribute vec3 aColor;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;varying vec2 vTextureCoord;varying vec3 vColor;void main(void) {    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);    vTextureCoord = aTextureCoord;    vColor = aColor;}",a="precision mediump float;varying vec3 vColor;void main(void) {    gl_FragColor = vec4(vColor, 1.0);}",o=function(t,e){this.lineWidth=void 0===t?2:t;var i=void 0===e?a:e;r.call(this,s,i)},h=o.prototype=new r;h._init=function(){var t=[],e=[],r=[],s=[0,1,2,3,4,5],a=9999;t.push([-a,0,0]),t.push([a,0,0]),t.push([0,-a,0]),t.push([0,a,0]),t.push([0,0,-a]),t.push([0,0,a]),e.push([1,0,0]),e.push([1,0,0]),e.push([0,1,0]),e.push([0,1,0]),e.push([0,0,1]),e.push([0,0,1]),r.push([0,0]),r.push([0,0]),r.push([0,0]),r.push([0,0]),r.push([0,0]),r.push([0,0]),this.mesh=new n(t.length,s.length,i.gl.LINES),this.mesh.bufferVertex(t),this.mesh.bufferTexCoords(r),this.mesh.bufferIndices(s),this.mesh.bufferData(e,"aColor",3,!1)},h.render=function(){this.shader.isReady()&&(this.shader.bind(),i.gl.lineWidth(this.lineWidth),i.draw(this.mesh),i.gl.lineWidth(1))},e.exports=o},{"./GLTools":14,"./Mesh":15,"./View":24}],26:[function(t,e){var i=t("./View"),r=t("./GLTools"),n=t("./MeshUtils"),s=function(t,e){i.call(this,t,e)},a=s.prototype=new i;a._init=function(){r.gl&&(this.mesh=n.createPlane(2,2,1))},a.render=function(t){this.shader.isReady()&&(this.shader.bind(),this.shader.uniform("texture","uniform1i",0),t.bind(0),r.draw(this.mesh))},e.exports=s},{"./GLTools":14,"./MeshUtils":16,"./View":24}],27:[function(t,e){var i=t("./GLTools"),r=t("./View"),n=t("./ShaderLibs"),s=t("./Mesh"),a=function(t,e){var i=.75;this.color=void 0===t?[i,i,i]:t;var s=void 0===e?n.get("simpleColorFrag"):e;r.call(this,null,s)},o=a.prototype=new r;o._init=function(){var t,e,r=[],n=[],a=[],o=0,h=100,u=3e3,c=u/h;for(t=-u/2;u>t;t+=c)for(e=-u/2;u>e;e+=c)r.push([t,e,0]),n.push([0,0]),a.push(o),o++,r.push([t,0,e]),n.push([0,0]),a.push(o),o++;this.mesh=new s(r.length,a.length,i.gl.DOTS),this.mesh.bufferVertex(r),this.mesh.bufferTexCoords(n),this.mesh.bufferIndices(a)},o.render=function(){this.shader.bind(),this.shader.uniform("color","uniform3fv",this.color),this.shader.uniform("opacity","uniform1f",1),i.draw(this.mesh)},e.exports=a},{"./GLTools":14,"./Mesh":15,"./ShaderLibs":21,"./View":24}],28:[function(t,e){var i=t("./Pass"),r=function(){this._passes=[]},n=r.prototype=new i;n.addPass=function(t){this._passes.push(t)},n.render=function(t){this.texture=t;for(var e=0;e<this._passes.length;e++)this.texture=this._passes[e].render(this.texture);return this.texture},n.getTexture=function(){return this.texture},e.exports=r},{"./Pass":29}],29:[function(t,e){var i,r=t("../GLTools"),n=t("../ViewCopy"),s=t("../FrameBuffer"),a=function(t,e,s,a){e=void 0===e?512:e,s=void 0===s?512:s,i=r.gl,t&&(this.view="string"==typeof t?new n(null,t):t,this.width=e,this.height=s,this._fboParams=a,this._init())},o=a.prototype;o._init=function(){this._fbo=new s(this.width,this.height,this._fboParams),this._fbo.bind(),r.setViewport(0,0,this._fbo.width,this._fbo.height),r.clear(0,0,0,0),this._fbo.unbind(),r.setViewport(0,0,r.canvas.width,r.canvas.height)},o.render=function(t){return this._fbo.bind(),r.setViewport(0,0,this._fbo.width,this._fbo.height),r.clear(0,0,0,0),this.view.render(t),this._fbo.unbind(),r.setViewport(0,0,r.canvas.width,r.canvas.height),this._fbo.getTexture()},o.getTexture=function(){return this._fbo.getTexture()},o.getFbo=function(){return this._fbo},e.exports=a},{"../FrameBuffer":10,"../GLTools":14,"../ViewCopy":26}],30:[function(t,e){var i=t("./Pass"),r=function(t,e,r){i.call(this,"#define GLSLIFY 1\n\n// greyscale.frag\n\n#define SHADER_NAME FRAGMENT_GREYSCALE\n\nprecision highp float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D texture;\n\nvoid main(void) {\n	vec4 color = texture2D(texture, vTextureCoord);\n	float grey = (color.r + color.g + color.b) / 3.0;\n	gl_FragColor = vec4(vec3(grey), color.a);\n}",t,e,r)};r.prototype=new i,e.exports=r},{"./Pass":29}]},{},[1])(1)})},l.adjoint=function(t,e){var i=e[0];return t[0]=e[3],t[1]=-e[1],t[2]=-e[2],t[3]=i,t},l.determinant=function(t){return t[0]*t[3]-t[2]*t[1]},l.multiply=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=i[0],h=i[1],u=i[2],c=i[3];return t[0]=r*o+s*h,t[1]=n*o+a*h,t[2]=r*u+s*c,t[3]=n*u+a*c,t},l.mul=l.multiply,l.rotate=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=Math.sin(i),h=Math.cos(i);return t[0]=r*h+s*o,t[1]=n*h+a*o,t[2]=r*-o+s*h,t[3]=n*-o+a*h,t},l.scale=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=i[0],h=i[1];
return t[0]=r*o,t[1]=n*o,t[2]=s*h,t[3]=a*h,t},l.str=function(t){return"mat2("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},l.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2))},l.LDU=function(t,e,i,r){return t[2]=r[2]/r[0],i[0]=r[0],i[1]=r[1],i[3]=r[3]-t[2]*i[1],[t,e,i]},"undefined"!=typeof r&&(r.mat2=l);var d={};d.create=function(){var t=new s(6);return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t},d.clone=function(t){var e=new s(6);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e},d.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t},d.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=1,t[4]=0,t[5]=0,t},d.invert=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=e[4],o=e[5],h=i*s-r*n;return h?(h=1/h,t[0]=s*h,t[1]=-r*h,t[2]=-n*h,t[3]=i*h,t[4]=(n*o-s*a)*h,t[5]=(r*a-i*o)*h,t):null},d.determinant=function(t){return t[0]*t[3]-t[1]*t[2]},d.multiply=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=e[4],h=e[5],u=i[0],c=i[1],f=i[2],l=i[3],d=i[4],p=i[5];return t[0]=r*u+s*c,t[1]=n*u+a*c,t[2]=r*f+s*l,t[3]=n*f+a*l,t[4]=r*d+s*p+o,t[5]=n*d+a*p+h,t},d.mul=d.multiply,d.rotate=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=e[4],h=e[5],u=Math.sin(i),c=Math.cos(i);return t[0]=r*c+s*u,t[1]=n*c+a*u,t[2]=r*-u+s*c,t[3]=n*-u+a*c,t[4]=o,t[5]=h,t},d.scale=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=e[4],h=e[5],u=i[0],c=i[1];return t[0]=r*u,t[1]=n*u,t[2]=s*c,t[3]=a*c,t[4]=o,t[5]=h,t},d.translate=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=e[4],h=e[5],u=i[0],c=i[1];return t[0]=r,t[1]=n,t[2]=s,t[3]=a,t[4]=r*u+s*c+o,t[5]=n*u+a*c+h,t},d.str=function(t){return"mat2d("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+")"},d.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+1)},"undefined"!=typeof r&&(r.mat2d=d);var p={};p.create=function(){var t=new s(9);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},p.fromMat4=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[4],t[4]=e[5],t[5]=e[6],t[6]=e[8],t[7]=e[9],t[8]=e[10],t},p.clone=function(t){var e=new s(9);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e},p.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t},p.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=1,t[5]=0,t[6]=0,t[7]=0,t[8]=1,t},p.transpose=function(t,e){if(t===e){var i=e[1],r=e[2],n=e[5];t[1]=e[3],t[2]=e[6],t[3]=i,t[5]=e[7],t[6]=r,t[7]=n}else t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8];return t},p.invert=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=e[4],o=e[5],h=e[6],u=e[7],c=e[8],f=c*a-o*u,l=-c*s+o*h,d=u*s-a*h,p=i*f+r*l+n*d;return p?(p=1/p,t[0]=f*p,t[1]=(-c*r+n*u)*p,t[2]=(o*r-n*a)*p,t[3]=l*p,t[4]=(c*i-n*h)*p,t[5]=(-o*i+n*s)*p,t[6]=d*p,t[7]=(-u*i+r*h)*p,t[8]=(a*i-r*s)*p,t):null},p.adjoint=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=e[4],o=e[5],h=e[6],u=e[7],c=e[8];return t[0]=a*c-o*u,t[1]=n*u-r*c,t[2]=r*o-n*a,t[3]=o*h-s*c,t[4]=i*c-n*h,t[5]=n*s-i*o,t[6]=s*u-a*h,t[7]=r*h-i*u,t[8]=i*a-r*s,t},p.determinant=function(t){var e=t[0],i=t[1],r=t[2],n=t[3],s=t[4],a=t[5],o=t[6],h=t[7],u=t[8];return e*(u*s-a*h)+i*(-u*n+a*o)+r*(h*n-s*o)},p.multiply=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=e[4],h=e[5],u=e[6],c=e[7],f=e[8],l=i[0],d=i[1],p=i[2],v=i[3],m=i[4],_=i[5],g=i[6],x=i[7],M=i[8];return t[0]=l*r+d*a+p*u,t[1]=l*n+d*o+p*c,t[2]=l*s+d*h+p*f,t[3]=v*r+m*a+_*u,t[4]=v*n+m*o+_*c,t[5]=v*s+m*h+_*f,t[6]=g*r+x*a+M*u,t[7]=g*n+x*o+M*c,t[8]=g*s+x*h+M*f,t},p.mul=p.multiply,p.translate=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=e[4],h=e[5],u=e[6],c=e[7],f=e[8],l=i[0],d=i[1];return t[0]=r,t[1]=n,t[2]=s,t[3]=a,t[4]=o,t[5]=h,t[6]=l*r+d*a+u,t[7]=l*n+d*o+c,t[8]=l*s+d*h+f,t},p.rotate=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=e[4],h=e[5],u=e[6],c=e[7],f=e[8],l=Math.sin(i),d=Math.cos(i);return t[0]=d*r+l*a,t[1]=d*n+l*o,t[2]=d*s+l*h,t[3]=d*a-l*r,t[4]=d*o-l*n,t[5]=d*h-l*s,t[6]=u,t[7]=c,t[8]=f,t},p.scale=function(t,e,i){var r=i[0],n=i[1];return t[0]=r*e[0],t[1]=r*e[1],t[2]=r*e[2],t[3]=n*e[3],t[4]=n*e[4],t[5]=n*e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t},p.fromMat2d=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=0,t[3]=e[2],t[4]=e[3],t[5]=0,t[6]=e[4],t[7]=e[5],t[8]=1,t},p.fromQuat=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=i+i,o=r+r,h=n+n,u=i*a,c=r*a,f=r*o,l=n*a,d=n*o,p=n*h,v=s*a,m=s*o,_=s*h;return t[0]=1-f-p,t[3]=c-_,t[6]=l+m,t[1]=c+_,t[4]=1-u-p,t[7]=d-v,t[2]=l-m,t[5]=d+v,t[8]=1-u-f,t},p.normalFromMat4=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=e[4],o=e[5],h=e[6],u=e[7],c=e[8],f=e[9],l=e[10],d=e[11],p=e[12],v=e[13],m=e[14],_=e[15],g=i*o-r*a,x=i*h-n*a,M=i*u-s*a,T=r*h-n*o,E=r*u-s*o,b=n*u-s*h,R=c*v-f*p,A=c*m-l*p,w=c*_-d*p,P=f*m-l*v,L=f*_-d*v,y=l*_-d*m,F=g*y-x*L+M*P+T*w-E*A+b*R;return F?(F=1/F,t[0]=(o*y-h*L+u*P)*F,t[1]=(h*w-a*y-u*A)*F,t[2]=(a*L-o*w+u*R)*F,t[3]=(n*L-r*y-s*P)*F,t[4]=(i*y-n*w+s*A)*F,t[5]=(r*w-i*L-s*R)*F,t[6]=(v*b-m*E+_*T)*F,t[7]=(m*M-p*b-_*x)*F,t[8]=(p*E-v*M+_*g)*F,t):null},p.str=function(t){return"mat3("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+")"},p.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+Math.pow(t[6],2)+Math.pow(t[7],2)+Math.pow(t[8],2))},"undefined"!=typeof r&&(r.mat3=p);var v={};v.create=function(){var t=new s(16);return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},v.clone=function(t){var e=new s(16);return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e},v.copy=function(t,e){return t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t},v.identity=function(t){return t[0]=1,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=1,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=1,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},v.transpose=function(t,e){if(t===e){var i=e[1],r=e[2],n=e[3],s=e[6],a=e[7],o=e[11];t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=i,t[6]=e[9],t[7]=e[13],t[8]=r,t[9]=s,t[11]=e[14],t[12]=n,t[13]=a,t[14]=o}else t[0]=e[0],t[1]=e[4],t[2]=e[8],t[3]=e[12],t[4]=e[1],t[5]=e[5],t[6]=e[9],t[7]=e[13],t[8]=e[2],t[9]=e[6],t[10]=e[10],t[11]=e[14],t[12]=e[3],t[13]=e[7],t[14]=e[11],t[15]=e[15];return t},v.invert=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=e[4],o=e[5],h=e[6],u=e[7],c=e[8],f=e[9],l=e[10],d=e[11],p=e[12],v=e[13],m=e[14],_=e[15],g=i*o-r*a,x=i*h-n*a,M=i*u-s*a,T=r*h-n*o,E=r*u-s*o,b=n*u-s*h,R=c*v-f*p,A=c*m-l*p,w=c*_-d*p,P=f*m-l*v,L=f*_-d*v,y=l*_-d*m,F=g*y-x*L+M*P+T*w-E*A+b*R;return F?(F=1/F,t[0]=(o*y-h*L+u*P)*F,t[1]=(n*L-r*y-s*P)*F,t[2]=(v*b-m*E+_*T)*F,t[3]=(l*E-f*b-d*T)*F,t[4]=(h*w-a*y-u*A)*F,t[5]=(i*y-n*w+s*A)*F,t[6]=(m*M-p*b-_*x)*F,t[7]=(c*b-l*M+d*x)*F,t[8]=(a*L-o*w+u*R)*F,t[9]=(r*w-i*L-s*R)*F,t[10]=(p*E-v*M+_*g)*F,t[11]=(f*M-c*E-d*g)*F,t[12]=(o*A-a*P-h*R)*F,t[13]=(i*P-r*A+n*R)*F,t[14]=(v*x-p*T-m*g)*F,t[15]=(c*T-f*x+l*g)*F,t):null},v.adjoint=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=e[4],o=e[5],h=e[6],u=e[7],c=e[8],f=e[9],l=e[10],d=e[11],p=e[12],v=e[13],m=e[14],_=e[15];return t[0]=o*(l*_-d*m)-f*(h*_-u*m)+v*(h*d-u*l),t[1]=-(r*(l*_-d*m)-f*(n*_-s*m)+v*(n*d-s*l)),t[2]=r*(h*_-u*m)-o*(n*_-s*m)+v*(n*u-s*h),t[3]=-(r*(h*d-u*l)-o*(n*d-s*l)+f*(n*u-s*h)),t[4]=-(a*(l*_-d*m)-c*(h*_-u*m)+p*(h*d-u*l)),t[5]=i*(l*_-d*m)-c*(n*_-s*m)+p*(n*d-s*l),t[6]=-(i*(h*_-u*m)-a*(n*_-s*m)+p*(n*u-s*h)),t[7]=i*(h*d-u*l)-a*(n*d-s*l)+c*(n*u-s*h),t[8]=a*(f*_-d*v)-c*(o*_-u*v)+p*(o*d-u*f),t[9]=-(i*(f*_-d*v)-c*(r*_-s*v)+p*(r*d-s*f)),t[10]=i*(o*_-u*v)-a*(r*_-s*v)+p*(r*u-s*o),t[11]=-(i*(o*d-u*f)-a*(r*d-s*f)+c*(r*u-s*o)),t[12]=-(a*(f*m-l*v)-c*(o*m-h*v)+p*(o*l-h*f)),t[13]=i*(f*m-l*v)-c*(r*m-n*v)+p*(r*l-n*f),t[14]=-(i*(o*m-h*v)-a*(r*m-n*v)+p*(r*h-n*o)),t[15]=i*(o*l-h*f)-a*(r*l-n*f)+c*(r*h-n*o),t},v.determinant=function(t){var e=t[0],i=t[1],r=t[2],n=t[3],s=t[4],a=t[5],o=t[6],h=t[7],u=t[8],c=t[9],f=t[10],l=t[11],d=t[12],p=t[13],v=t[14],m=t[15],_=e*a-i*s,g=e*o-r*s,x=e*h-n*s,M=i*o-r*a,T=i*h-n*a,E=r*h-n*o,b=u*p-c*d,R=u*v-f*d,A=u*m-l*d,w=c*v-f*p,P=c*m-l*p,L=f*m-l*v;return _*L-g*P+x*w+M*A-T*R+E*b},v.multiply=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=e[4],h=e[5],u=e[6],c=e[7],f=e[8],l=e[9],d=e[10],p=e[11],v=e[12],m=e[13],_=e[14],g=e[15],x=i[0],M=i[1],T=i[2],E=i[3];return t[0]=x*r+M*o+T*f+E*v,t[1]=x*n+M*h+T*l+E*m,t[2]=x*s+M*u+T*d+E*_,t[3]=x*a+M*c+T*p+E*g,x=i[4],M=i[5],T=i[6],E=i[7],t[4]=x*r+M*o+T*f+E*v,t[5]=x*n+M*h+T*l+E*m,t[6]=x*s+M*u+T*d+E*_,t[7]=x*a+M*c+T*p+E*g,x=i[8],M=i[9],T=i[10],E=i[11],t[8]=x*r+M*o+T*f+E*v,t[9]=x*n+M*h+T*l+E*m,t[10]=x*s+M*u+T*d+E*_,t[11]=x*a+M*c+T*p+E*g,x=i[12],M=i[13],T=i[14],E=i[15],t[12]=x*r+M*o+T*f+E*v,t[13]=x*n+M*h+T*l+E*m,t[14]=x*s+M*u+T*d+E*_,t[15]=x*a+M*c+T*p+E*g,t},v.mul=v.multiply,v.translate=function(t,e,i){var r,n,s,a,o,h,u,c,f,l,d,p,v=i[0],m=i[1],_=i[2];return e===t?(t[12]=e[0]*v+e[4]*m+e[8]*_+e[12],t[13]=e[1]*v+e[5]*m+e[9]*_+e[13],t[14]=e[2]*v+e[6]*m+e[10]*_+e[14],t[15]=e[3]*v+e[7]*m+e[11]*_+e[15]):(r=e[0],n=e[1],s=e[2],a=e[3],o=e[4],h=e[5],u=e[6],c=e[7],f=e[8],l=e[9],d=e[10],p=e[11],t[0]=r,t[1]=n,t[2]=s,t[3]=a,t[4]=o,t[5]=h,t[6]=u,t[7]=c,t[8]=f,t[9]=l,t[10]=d,t[11]=p,t[12]=r*v+o*m+f*_+e[12],t[13]=n*v+h*m+l*_+e[13],t[14]=s*v+u*m+d*_+e[14],t[15]=a*v+c*m+p*_+e[15]),t},v.scale=function(t,e,i){var r=i[0],n=i[1],s=i[2];return t[0]=e[0]*r,t[1]=e[1]*r,t[2]=e[2]*r,t[3]=e[3]*r,t[4]=e[4]*n,t[5]=e[5]*n,t[6]=e[6]*n,t[7]=e[7]*n,t[8]=e[8]*s,t[9]=e[9]*s,t[10]=e[10]*s,t[11]=e[11]*s,t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15],t},v.rotate=function(t,e,i,r){var s,a,o,h,u,c,f,l,d,p,v,m,_,g,x,M,T,E,b,R,A,w,P,L,y=r[0],F=r[1],S=r[2],V=Math.sqrt(y*y+F*F+S*S);return Math.abs(V)<n?null:(V=1/V,y*=V,F*=V,S*=V,s=Math.sin(i),a=Math.cos(i),o=1-a,h=e[0],u=e[1],c=e[2],f=e[3],l=e[4],d=e[5],p=e[6],v=e[7],m=e[8],_=e[9],g=e[10],x=e[11],M=y*y*o+a,T=F*y*o+S*s,E=S*y*o-F*s,b=y*F*o-S*s,R=F*F*o+a,A=S*F*o+y*s,w=y*S*o+F*s,P=F*S*o-y*s,L=S*S*o+a,t[0]=h*M+l*T+m*E,t[1]=u*M+d*T+_*E,t[2]=c*M+p*T+g*E,t[3]=f*M+v*T+x*E,t[4]=h*b+l*R+m*A,t[5]=u*b+d*R+_*A,t[6]=c*b+p*R+g*A,t[7]=f*b+v*R+x*A,t[8]=h*w+l*P+m*L,t[9]=u*w+d*P+_*L,t[10]=c*w+p*P+g*L,t[11]=f*w+v*P+x*L,e!==t&&(t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t)},v.rotateX=function(t,e,i){var r=Math.sin(i),n=Math.cos(i),s=e[4],a=e[5],o=e[6],h=e[7],u=e[8],c=e[9],f=e[10],l=e[11];return e!==t&&(t[0]=e[0],t[1]=e[1],t[2]=e[2],t[3]=e[3],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[4]=s*n+u*r,t[5]=a*n+c*r,t[6]=o*n+f*r,t[7]=h*n+l*r,t[8]=u*n-s*r,t[9]=c*n-a*r,t[10]=f*n-o*r,t[11]=l*n-h*r,t},v.rotateY=function(t,e,i){var r=Math.sin(i),n=Math.cos(i),s=e[0],a=e[1],o=e[2],h=e[3],u=e[8],c=e[9],f=e[10],l=e[11];return e!==t&&(t[4]=e[4],t[5]=e[5],t[6]=e[6],t[7]=e[7],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=s*n-u*r,t[1]=a*n-c*r,t[2]=o*n-f*r,t[3]=h*n-l*r,t[8]=s*r+u*n,t[9]=a*r+c*n,t[10]=o*r+f*n,t[11]=h*r+l*n,t},v.rotateZ=function(t,e,i){var r=Math.sin(i),n=Math.cos(i),s=e[0],a=e[1],o=e[2],h=e[3],u=e[4],c=e[5],f=e[6],l=e[7];return e!==t&&(t[8]=e[8],t[9]=e[9],t[10]=e[10],t[11]=e[11],t[12]=e[12],t[13]=e[13],t[14]=e[14],t[15]=e[15]),t[0]=s*n+u*r,t[1]=a*n+c*r,t[2]=o*n+f*r,t[3]=h*n+l*r,t[4]=u*n-s*r,t[5]=c*n-a*r,t[6]=f*n-o*r,t[7]=l*n-h*r,t},v.fromRotationTranslation=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=r+r,h=n+n,u=s+s,c=r*o,f=r*h,l=r*u,d=n*h,p=n*u,v=s*u,m=a*o,_=a*h,g=a*u;return t[0]=1-(d+v),t[1]=f+g,t[2]=l-_,t[3]=0,t[4]=f-g,t[5]=1-(c+v),t[6]=p+m,t[7]=0,t[8]=l+_,t[9]=p-m,t[10]=1-(c+d),t[11]=0,t[12]=i[0],t[13]=i[1],t[14]=i[2],t[15]=1,t},v.fromQuat=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=i+i,o=r+r,h=n+n,u=i*a,c=r*a,f=r*o,l=n*a,d=n*o,p=n*h,v=s*a,m=s*o,_=s*h;return t[0]=1-f-p,t[1]=c+_,t[2]=l-m,t[3]=0,t[4]=c-_,t[5]=1-u-p,t[6]=d+v,t[7]=0,t[8]=l+m,t[9]=d-v,t[10]=1-u-f,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,t},v.frustum=function(t,e,i,r,n,s,a){var o=1/(i-e),h=1/(n-r),u=1/(s-a);return t[0]=2*s*o,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=2*s*h,t[6]=0,t[7]=0,t[8]=(i+e)*o,t[9]=(n+r)*h,t[10]=(a+s)*u,t[11]=-1,t[12]=0,t[13]=0,t[14]=a*s*2*u,t[15]=0,t},v.perspective=function(t,e,i,r,n){var s=1/Math.tan(e/2),a=1/(r-n);return t[0]=s/i,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=s,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=(n+r)*a,t[11]=-1,t[12]=0,t[13]=0,t[14]=2*n*r*a,t[15]=0,t},v.ortho=function(t,e,i,r,n,s,a){var o=1/(e-i),h=1/(r-n),u=1/(s-a);return t[0]=-2*o,t[1]=0,t[2]=0,t[3]=0,t[4]=0,t[5]=-2*h,t[6]=0,t[7]=0,t[8]=0,t[9]=0,t[10]=2*u,t[11]=0,t[12]=(e+i)*o,t[13]=(n+r)*h,t[14]=(a+s)*u,t[15]=1,t},v.lookAt=function(t,e,i,r){var s,a,o,h,u,c,f,l,d,p,m=e[0],_=e[1],g=e[2],x=r[0],M=r[1],T=r[2],E=i[0],b=i[1],R=i[2];return Math.abs(m-E)<n&&Math.abs(_-b)<n&&Math.abs(g-R)<n?v.identity(t):(f=m-E,l=_-b,d=g-R,p=1/Math.sqrt(f*f+l*l+d*d),f*=p,l*=p,d*=p,s=M*d-T*l,a=T*f-x*d,o=x*l-M*f,p=Math.sqrt(s*s+a*a+o*o),p?(p=1/p,s*=p,a*=p,o*=p):(s=0,a=0,o=0),h=l*o-d*a,u=d*s-f*o,c=f*a-l*s,p=Math.sqrt(h*h+u*u+c*c),p?(p=1/p,h*=p,u*=p,c*=p):(h=0,u=0,c=0),t[0]=s,t[1]=h,t[2]=f,t[3]=0,t[4]=a,t[5]=u,t[6]=l,t[7]=0,t[8]=o,t[9]=c,t[10]=d,t[11]=0,t[12]=-(s*m+a*_+o*g),t[13]=-(h*m+u*_+c*g),t[14]=-(f*m+l*_+d*g),t[15]=1,t)},v.str=function(t){return"mat4("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+", "+t[4]+", "+t[5]+", "+t[6]+", "+t[7]+", "+t[8]+", "+t[9]+", "+t[10]+", "+t[11]+", "+t[12]+", "+t[13]+", "+t[14]+", "+t[15]+")"},v.frob=function(t){return Math.sqrt(Math.pow(t[0],2)+Math.pow(t[1],2)+Math.pow(t[2],2)+Math.pow(t[3],2)+Math.pow(t[4],2)+Math.pow(t[5],2)+Math.pow(t[6],2)+Math.pow(t[6],2)+Math.pow(t[7],2)+Math.pow(t[8],2)+Math.pow(t[9],2)+Math.pow(t[10],2)+Math.pow(t[11],2)+Math.pow(t[12],2)+Math.pow(t[13],2)+Math.pow(t[14],2)+Math.pow(t[15],2))},"undefined"!=typeof r&&(r.mat4=v);var m={};m.create=function(){var t=new s(4);return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t},m.rotationTo=function(){var t=c.create(),e=c.fromValues(1,0,0),i=c.fromValues(0,1,0);return function(r,n,s){var a=c.dot(n,s);return-.999999>a?(c.cross(t,e,n),c.length(t)<1e-6&&c.cross(t,i,n),c.normalize(t,t),m.setAxisAngle(r,t,Math.PI),r):a>.999999?(r[0]=0,r[1]=0,r[2]=0,r[3]=1,r):(c.cross(t,n,s),r[0]=t[0],r[1]=t[1],r[2]=t[2],r[3]=1+a,m.normalize(r,r))}}(),m.setAxes=function(){var t=p.create();return function(e,i,r,n){return t[0]=r[0],t[3]=r[1],t[6]=r[2],t[1]=n[0],t[4]=n[1],t[7]=n[2],t[2]=-i[0],t[5]=-i[1],t[8]=-i[2],m.normalize(e,m.fromMat3(e,t))}}(),m.clone=f.clone,m.fromValues=f.fromValues,m.copy=f.copy,m.set=f.set,m.identity=function(t){return t[0]=0,t[1]=0,t[2]=0,t[3]=1,t},m.setAxisAngle=function(t,e,i){i=.5*i;var r=Math.sin(i);return t[0]=r*e[0],t[1]=r*e[1],t[2]=r*e[2],t[3]=Math.cos(i),t},m.add=f.add,m.multiply=function(t,e,i){var r=e[0],n=e[1],s=e[2],a=e[3],o=i[0],h=i[1],u=i[2],c=i[3];return t[0]=r*c+a*o+n*u-s*h,t[1]=n*c+a*h+s*o-r*u,t[2]=s*c+a*u+r*h-n*o,t[3]=a*c-r*o-n*h-s*u,t},m.mul=m.multiply,m.scale=f.scale,m.rotateX=function(t,e,i){i*=.5;var r=e[0],n=e[1],s=e[2],a=e[3],o=Math.sin(i),h=Math.cos(i);return t[0]=r*h+a*o,t[1]=n*h+s*o,t[2]=s*h-n*o,t[3]=a*h-r*o,t},m.rotateY=function(t,e,i){i*=.5;var r=e[0],n=e[1],s=e[2],a=e[3],o=Math.sin(i),h=Math.cos(i);return t[0]=r*h-s*o,t[1]=n*h+a*o,t[2]=s*h+r*o,t[3]=a*h-n*o,t},m.rotateZ=function(t,e,i){i*=.5;var r=e[0],n=e[1],s=e[2],a=e[3],o=Math.sin(i),h=Math.cos(i);return t[0]=r*h+n*o,t[1]=n*h-r*o,t[2]=s*h+a*o,t[3]=a*h-s*o,t},m.calculateW=function(t,e){var i=e[0],r=e[1],n=e[2];return t[0]=i,t[1]=r,t[2]=n,t[3]=-Math.sqrt(Math.abs(1-i*i-r*r-n*n)),t},m.dot=f.dot,m.lerp=f.lerp,m.slerp=function(t,e,i,r){var n,s,a,o,h,u=e[0],c=e[1],f=e[2],l=e[3],d=i[0],p=i[1],v=i[2],m=i[3];return s=u*d+c*p+f*v+l*m,0>s&&(s=-s,d=-d,p=-p,v=-v,m=-m),1-s>1e-6?(n=Math.acos(s),a=Math.sin(n),o=Math.sin((1-r)*n)/a,h=Math.sin(r*n)/a):(o=1-r,h=r),t[0]=o*u+h*d,t[1]=o*c+h*p,t[2]=o*f+h*v,t[3]=o*l+h*m,t},m.invert=function(t,e){var i=e[0],r=e[1],n=e[2],s=e[3],a=i*i+r*r+n*n+s*s,o=a?1/a:0;return t[0]=-i*o,t[1]=-r*o,t[2]=-n*o,t[3]=s*o,t},m.conjugate=function(t,e){return t[0]=-e[0],t[1]=-e[1],t[2]=-e[2],t[3]=e[3],t},m.length=f.length,m.len=m.length,m.squaredLength=f.squaredLength,m.sqrLen=m.squaredLength,m.normalize=f.normalize,m.fromMat3=function(t,e){var i,r=e[0]+e[4]+e[8];if(r>0)i=Math.sqrt(r+1),t[3]=.5*i,i=.5/i,t[0]=(e[7]-e[5])*i,t[1]=(e[2]-e[6])*i,t[2]=(e[3]-e[1])*i;else{var n=0;e[4]>e[0]&&(n=1),e[8]>e[3*n+n]&&(n=2);var s=(n+1)%3,a=(n+2)%3;i=Math.sqrt(e[3*n+n]-e[3*s+s]-e[3*a+a]+1),t[n]=.5*i,i=.5/i,t[3]=(e[3*a+s]-e[3*s+a])*i,t[s]=(e[3*s+n]+e[3*n+s])*i,t[a]=(e[3*a+n]+e[3*n+a])*i}return t},m.str=function(t){return"quat("+t[0]+", "+t[1]+", "+t[2]+", "+t[3]+")"},"undefined"!=typeof r&&(r.quat=m)}(s.exports)}(this)},{}],3:[function(t,e){"use strict";var i=t("./bongiovi/GLTools"),r={GL:i,GLTools:i,Scheduler:t("./bongiovi/Scheduler"),SimpleImageLoader:t("./bongiovi/SimpleImageLoader"),EaseNumber:t("./bongiovi/EaseNumber"),QuatRotation:t("./bongiovi/QuatRotation"),Scene:t("./bongiovi/Scene"),Camera:t("./bongiovi/Camera"),SimpleCamera:t("./bongiovi/SimpleCamera"),CameraOrtho:t("./bongiovi/CameraOrtho"),CameraPerspective:t("./bongiovi/CameraPerspective"),Mesh:t("./bongiovi/Mesh"),Face:t("./bongiovi/Face"),GLShader:t("./bongiovi/GLShader"),GLTexture:t("./bongiovi/GLTexture"),GLCubeTexture:t("./bongiovi/GLCubeTexture"),ShaderLibs:t("./bongiovi/ShaderLibs"),View:t("./bongiovi/View"),ViewCopy:t("./bongiovi/ViewCopy"),ViewAxis:t("./bongiovi/ViewAxis"),ViewDotPlane:t("./bongiovi/ViewDotPlanes"),MeshUtils:t("./bongiovi/MeshUtils"),FrameBuffer:t("./bongiovi/FrameBuffer"),EventDispatcher:t("./bongiovi/EventDispatcher"),ObjLoader:t("./bongiovi/ObjLoader"),glm:t("gl-matrix")};e.exports=r},{"./bongiovi/Camera":4,"./bongiovi/CameraOrtho":5,"./bongiovi/CameraPerspective":6,"./bongiovi/EaseNumber":7,"./bongiovi/EventDispatcher":8,"./bongiovi/Face":9,"./bongiovi/FrameBuffer":10,"./bongiovi/GLCubeTexture":11,"./bongiovi/GLShader":12,"./bongiovi/GLTexture":13,"./bongiovi/GLTools":14,"./bongiovi/Mesh":15,"./bongiovi/MeshUtils":16,"./bongiovi/ObjLoader":17,"./bongiovi/QuatRotation":18,"./bongiovi/Scene":19,"./bongiovi/Scheduler":20,"./bongiovi/ShaderLibs":21,"./bongiovi/SimpleCamera":22,"./bongiovi/SimpleImageLoader":23,"./bongiovi/View":24,"./bongiovi/ViewAxis":25,"./bongiovi/ViewCopy":26,"./bongiovi/ViewDotPlanes":27,"gl-matrix":2}],4:[function(t,e){"use strict";var i=t("gl-matrix"),r=function(){this.matrix=i.mat4.create(),i.mat4.identity(this.matrix),this.position=i.vec3.create()},n=r.prototype;n.lookAt=function(t,e,r){i.vec3.copy(this.position,t),i.mat4.identity(this.matrix),i.mat4.lookAt(this.matrix,t,e,r)},n.getMatrix=function(){return this.matrix},e.exports=r},{"gl-matrix":2}],5:[function(t,e){"use strict";var i=t("./Camera"),r=t("gl-matrix"),n=function(){i.call(this);var t=r.vec3.clone([0,0,500]),e=r.vec3.create(),n=r.vec3.clone([0,-1,0]);this.lookAt(t,e,n),this.projection=r.mat4.create()},s=n.prototype=new i;s.setBoundary=function(t,e,i,n){this.left=t,this.right=e,this.top=i,this.bottom=n,r.mat4.ortho(this.projection,t,e,i,n,0,1e4)},s.ortho=s.setBoundary,s.getMatrix=function(){return this.matrix},s.resize=function(){r.mat4.ortho(this.projection,this.left,this.right,this.top,this.bottom,0,1e4)},e.exports=n},{"./Camera":4,"gl-matrix":2}],6:[function(t,e){"use strict";var i=t("./Camera"),r=t("gl-matrix"),n=function(){i.call(this),this.projection=r.mat4.create(),this.mtxFinal=r.mat4.create()},s=n.prototype=new i;s.setPerspective=function(t,e,i,n){this._fov=t,this._near=i,this._far=n,this._aspect=e,r.mat4.perspective(this.projection,t,e,i,n)},s.getMatrix=function(){return this.matrix},s.resize=function(t){this._aspect=t,r.mat4.perspective(this.projection,this._fov,t,this._near,this._far)},s.__defineGetter__("near",function(){return this._near}),s.__defineGetter__("far",function(){return this._far}),e.exports=n},{"./Camera":4,"gl-matrix":2}],7:[function(t,e){"use strict";function i(t,e){this._easing=e||.1,this._value=t,this._targetValue=t,r.addEF(this,this._update)}var r=t("./Scheduler"),n=i.prototype;n._update=function(){this._checkLimit(),this._value+=(this._targetValue-this._value)*this._easing},n.setTo=function(t){this._targetValue=this._value=t},n.add=function(t){this._targetValue+=t},n.limit=function(t,e){this._min=t,this._max=e,this._checkLimit()},n.setEasing=function(t){this._easing=t},n._checkLimit=function(){void 0!==this._min&&this._targetValue<this._min&&(this._targetValue=this._min),void 0!==this._max&&this._targetValue>this._max&&(this._targetValue=this._max)},n.__defineGetter__("value",function(){return this._value}),n.__defineGetter__("targetValue",function(){return this._targetValue}),n.__defineSetter__("value",function(t){this._targetValue=t}),e.exports=i},{"./Scheduler":20}],8:[function(t,e){"use strict";function i(){this._eventListeners=null}var r=!0;try{var n=document.createEvent("CustomEvent");n=null}catch(s){r=!1}var a=i.prototype;a.addEventListener=function(t,e){return null===this._eventListeners&&(this._eventListeners={}),this._eventListeners[t]||(this._eventListeners[t]=[]),this._eventListeners[t].push(e),this},a.removeEventListener=function(t,e){null===this._eventListeners&&(this._eventListeners={});var i=this._eventListeners[t];if("undefined"==typeof i)return this;for(var r=i.length,n=0;r>n;n++)i[n]===e&&(i.splice(n,1),n--,r--);return this},a.dispatchEvent=function(t){null===this._eventListeners&&(this._eventListeners={});var e=t.type;try{null===t.target&&(t.target=this),t.currentTarget=this}catch(i){var r={type:e,detail:t.detail,dispatcher:this};return this.dispatchEvent(r)}var n=this._eventListeners[e];if(null!==n&&void 0!==n)for(var s=this._copyArray(n),a=s.length,o=0;a>o;o++){var h=s[o];h.call(this,t)}return this},a.dispatchCustomEvent=function(t,e){var i;return r?(i=document.createEvent("CustomEvent"),i.dispatcher=this,i.initCustomEvent(t,!1,!1,e)):i={type:t,detail:e,dispatcher:this},this.dispatchEvent(i)},a._destroy=function(){if(null!==this._eventListeners){for(var t in this._eventListeners)if(this._eventListeners.hasOwnProperty(t)){for(var e=this._eventListeners[t],i=e.length,r=0;i>r;r++)e[r]=null;delete this._eventListeners[t]}this._eventListeners=null}},a._copyArray=function(t){for(var e=new Array(t.length),i=e.length,r=0;i>r;r++)e[r]=t[r];return e},e.exports=i},{}],9:[function(t,e){"use strict";var i=t("gl-matrix"),r=function(t,e,i){this._vertexA=t,this._vertexB=e,this._vertexC=i,this._init()},n=r.prototype;n._init=function(){var t=i.vec3.create(),e=i.vec3.create();i.vec3.sub(t,this._vertexB,this._vertexA),i.vec3.sub(e,this._vertexC,this._vertexA),this._faceNormal=i.vec3.create(),i.vec3.cross(this._faceNormal,t,e),i.vec3.normalize(this._faceNormal,this._faceNormal)},n.contains=function(t){return s(t,this._vertexA)||s(t,this._vertexB)||s(t,this._vertexC)},n.__defineGetter__("faceNormal",function(){return this._faceNormal});var s=function(t,e){return t[0]===e[0]&&t[1]===e[1]&&t[2]===e[2]};e.exports=r},{"gl-matrix":2}],10:[function(t,e){"use strict";var i,r=t("./GLTools"),n=t("./GLTexture"),s=function(t){return 0!==t&&!(t&t-1)},a=function(t,e,n){i=r.gl,n=n||{},this.width=t,this.height=e,this.magFilter=n.magFilter||i.LINEAR,this.minFilter=n.minFilter||i.LINEAR,this.wrapS=n.wrapS||i.MIRRORED_REPEAT,this.wrapT=n.wrapT||i.MIRRORED_REPEAT,s(t)&&s(e)||(this.wrapS=this.wrapT=i.CLAMP_TO_EDGE,this.minFilter===i.LINEAR_MIPMAP_NEAREST&&(this.minFilter=i.LINEAR)),this._init()},o=a.prototype;o._init=function(){if(this.texture=i.createTexture(),this.glTexture=new n(this.texture,!0),this.frameBuffer=i.createFramebuffer(),i.bindFramebuffer(i.FRAMEBUFFER,this.frameBuffer),this.frameBuffer.width=this.width,this.frameBuffer.height=this.height,i.bindTexture(i.TEXTURE_2D,this.texture),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,this.magFilter),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,this.minFilter),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),r.depthTextureExt?i.texImage2D(i.TEXTURE_2D,0,i.RGBA,this.frameBuffer.width,this.frameBuffer.height,0,i.RGBA,i.FLOAT,null):i.texImage2D(i.TEXTURE_2D,0,i.RGBA,this.frameBuffer.width,this.frameBuffer.height,0,i.RGBA,i.FLOAT,null),this.minFilter===i.LINEAR_MIPMAP_NEAREST&&i.generateMipmap(i.TEXTURE_2D),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,this.texture,0),null===r.depthTextureExt){var t=i.createRenderbuffer();i.bindRenderbuffer(i.RENDERBUFFER,t),i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_COMPONENT16,this.frameBuffer.width,this.frameBuffer.height),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,this.texture,0),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,t)}else this.depthTexture=i.createTexture(),this.glDepthTexture=new n(this.depthTexture,!0),i.bindTexture(i.TEXTURE_2D,this.depthTexture),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.texImage2D(i.TEXTURE_2D,0,i.DEPTH_COMPONENT,this.width,this.height,0,i.DEPTH_COMPONENT,i.UNSIGNED_SHORT,null),i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,this.depthTexture,0);i.bindTexture(i.TEXTURE_2D,null),i.bindRenderbuffer(i.RENDERBUFFER,null),i.bindFramebuffer(i.FRAMEBUFFER,null)},o.bind=function(){i.bindFramebuffer(i.FRAMEBUFFER,this.frameBuffer)},o.unbind=function(){i.bindFramebuffer(i.FRAMEBUFFER,null)},o.getTexture=function(){return this.glTexture},o.getDepthTexture=function(){return this.glDepthTexture},o.destroy=function(){i.deleteFramebuffer(this.frameBuffer),this.glTexture.destroy(),this.glDepthTexture&&this.glDepthTexture.destroy()},e.exports=a},{"./GLTexture":13,"./GLTools":14}],11:[function(t,e){"use strict";var i,r=t("./GLTools"),n=t("./GLTexture"),s=function(t,e){var s=!1;t[0]instanceof n&&(s=!0),e=e||{},i=r.gl,this.texture=i.createTexture(),this.magFilter=e.magFilter||i.LINEAR,this.minFilter=e.minFilter||i.LINEAR_MIPMAP_NEAREST,this.wrapS=e.wrapS||i.CLAMP_TO_EDGE,this.wrapT=e.wrapT||i.CLAMP_TO_EDGE,i.bindTexture(i.TEXTURE_CUBE_MAP,this.texture);for(var a=[i.TEXTURE_CUBE_MAP_POSITIVE_X,i.TEXTURE_CUBE_MAP_NEGATIVE_X,i.TEXTURE_CUBE_MAP_POSITIVE_Y,i.TEXTURE_CUBE_MAP_NEGATIVE_Y,i.TEXTURE_CUBE_MAP_POSITIVE_Z,i.TEXTURE_CUBE_MAP_NEGATIVE_Z],o=0;6>o;o++)s?console.log("Texture : ",t[o].texture):i.texImage2D(a[o],0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,t[o]),i.texParameteri(i.TEXTURE_CUBE_MAP,i.TEXTURE_WRAP_S,this.wrapS),i.texParameteri(i.TEXTURE_CUBE_MAP,i.TEXTURE_WRAP_T,this.wrapT);i.generateMipmap(i.TEXTURE_CUBE_MAP),i.bindTexture(i.TEXTURE_CUBE_MAP,null)},a=s.prototype;a.bind=function(t){void 0===t&&(t=0),r.shader&&(i.bindTexture(i.TEXTURE_CUBE_MAP,this.texture),i.uniform1i(r.shader.uniformTextures[t],t),this._bindIndex=t)},a.unbind=function(){i.bindTexture(i.TEXTURE_CUBE_MAP,null)},a.destroy=function(){i.deleteTexture(this.texture)},e.exports=s},{"./GLTexture":13,"./GLTools":14}],12:[function(t,e){"use strict";var i,r=t("./GLTools"),n=t("./ShaderLibs"),s=function(t){for(var e=t.split("\n"),i=0;i<e.length;i++)e[i]=i+1+": "+e[i];return e.join("\n")},a=function(t,e){i=r.gl,this.idVertex=t,this.idFragment=e,this.parameters=[],this.uniformValues={},this.uniformTextures=[],this.vertexShader=void 0,this.fragmentShader=void 0,this._isReady=!1,this._loadedCount=0,(void 0===t||null===t)&&this.createVertexShaderProgram(n.getShader("copyVert")),(void 0===e||null===t)&&this.createFragmentShaderProgram(n.getShader("copyFrag")),this.init()},o=a.prototype;o.init=function(){this.idVertex&&this.idVertex.indexOf("main(void)")>-1?this.createVertexShaderProgram(this.idVertex):this.getShader(this.idVertex,!0),this.idFragment&&this.idFragment.indexOf("main(void)")>-1?this.createFragmentShaderProgram(this.idFragment):this.getShader(this.idFragment,!1)},o.getShader=function(t,e){if(t){var i=new XMLHttpRequest;i.hasCompleted=!1;var r=this;i.onreadystatechange=function(t){4===t.target.readyState&&(e?r.createVertexShaderProgram(t.target.responseText):r.createFragmentShaderProgram(t.target.responseText))},i.open("GET",t,!0),i.send(null)}},o.createVertexShaderProgram=function(t){if(i){var e=i.createShader(i.VERTEX_SHADER);if(i.shaderSource(e,t),i.compileShader(e),!i.getShaderParameter(e,i.COMPILE_STATUS))return console.warn("Error in Vertex Shader : ",this.idVertex,":",i.getShaderInfoLog(e)),console.log(s(t)),null;this.vertexShader=e,void 0!==this.vertexShader&&void 0!==this.fragmentShader&&this.attachShaderProgram(),this._loadedCount++}},o.createFragmentShaderProgram=function(t){if(i){var e=i.createShader(i.FRAGMENT_SHADER);if(i.shaderSource(e,t),i.compileShader(e),!i.getShaderParameter(e,i.COMPILE_STATUS))return console.warn("Error in Fragment Shader: ",this.idFragment,":",i.getShaderInfoLog(e)),console.log(s(t)),null;this.fragmentShader=e,void 0!==this.vertexShader&&void 0!==this.fragmentShader&&this.attachShaderProgram(),this._loadedCount++}},o.attachShaderProgram=function(){this._isReady=!0,this.shaderProgram=i.createProgram(),i.attachShader(this.shaderProgram,this.vertexShader),i.attachShader(this.shaderProgram,this.fragmentShader),i.linkProgram(this.shaderProgram)},o.bind=function(){this._isReady&&(i.useProgram(this.shaderProgram),void 0===this.shaderProgram.pMatrixUniform&&(this.shaderProgram.pMatrixUniform=i.getUniformLocation(this.shaderProgram,"uPMatrix")),void 0===this.shaderProgram.mvMatrixUniform&&(this.shaderProgram.mvMatrixUniform=i.getUniformLocation(this.shaderProgram,"uMVMatrix")),void 0===this.shaderProgram.normalMatrixUniform&&(this.shaderProgram.normalMatrixUniform=i.getUniformLocation(this.shaderProgram,"normalMatrix")),void 0===this.shaderProgram.invertMVMatrixUniform&&(this.shaderProgram.invertMVMatrixUniform=i.getUniformLocation(this.shaderProgram,"invertMVMatrix")),r.setShader(this),r.setShaderProgram(this.shaderProgram),this.uniformTextures=[])},o.isReady=function(){return this._isReady},o.clearUniforms=function(){this.parameters=[],this.uniformValues={}},o.uniform=function(t,e,r){if(this._isReady){"texture"===e&&(e="uniform1i");for(var n,s=!1,a=0;a<this.parameters.length;a++)if(n=this.parameters[a],n.name===t){n.value=r,s=!0;break}if(s?this.shaderProgram[t]=n.uniformLoc:(this.shaderProgram[t]=i.getUniformLocation(this.shaderProgram,t),this.parameters.push({name:t,type:e,value:r,uniformLoc:this.shaderProgram[t]})),-1===e.indexOf("Matrix"))if(s)this.checkUniform(t,e,r)&&i[e](this.shaderProgram[t],r);else{var o=Array.isArray(r);this.uniformValues[t]=o?r.concat():r,i[e](this.shaderProgram[t],r)}else i[e](this.shaderProgram[t],!1,r),s||(i[e](this.shaderProgram[t],!1,r),this.uniformValues[t]=r);"uniform1i"===e&&(this.uniformTextures[r]=this.shaderProgram[t])}},o.checkUniform=function(t,e,i){var r=Array.isArray(i);if(!this.uniformValues[t])return this.uniformValues[t]=i,!0;if("uniform1i"===e)return this.uniformValues[t]=i,!0;var n=this.uniformValues[t],s=!1;if(r){for(var a=0;a<n.length;a++)if(n[a]!==i[a]){s=!0;break}}else s=n!==i;return s&&(this.uniformValues[t]=r?i.concat():i),s},o.unbind=function(){},o.destroy=function(){i.detachShader(this.shaderProgram,this.vertexShader),i.detachShader(this.shaderProgram,this.fragmentShader),i.deleteShader(this.vertexShader),i.deleteShader(this.fragmentShader),i.deleteProgram(this.shaderProgram)},e.exports=a},{"./GLTools":14,"./ShaderLibs":21}],13:[function(t,e){"use strict";var i,r=t("./GLTools"),n=function(t){var e=0!==t&&!(t&t-1);return e},s=function(t){var e=t.width||t.videoWidth,i=t.height||t.videoHeight;return e&&i?n(e)&&n(i):!1},a=function(t,e,n){if(e=e||!1,n=n||{},i=r.gl,e)this.texture=t;else{this._source=t,this.texture=i.createTexture(),this._isVideo="VIDEO"===t.tagName,this.magFilter=n.magFilter||i.LINEAR,this.minFilter=n.minFilter||i.LINEAR_MIPMAP_NEAREST,this.wrapS=n.wrapS||i.MIRRORED_REPEAT,this.wrapT=n.wrapT||i.MIRRORED_REPEAT;var a=t.width||t.videoWidth;a?s(t)||(this.wrapS=this.wrapT=i.CLAMP_TO_EDGE,this.minFilter===i.LINEAR_MIPMAP_NEAREST&&(this.minFilter=i.LINEAR)):(this.wrapS=this.wrapT=i.CLAMP_TO_EDGE,this.minFilter===i.LINEAR_MIPMAP_NEAREST&&(this.minFilter=i.LINEAR)),i.bindTexture(i.TEXTURE_2D,this.texture),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!0),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,t),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,this.magFilter),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,this.minFilter),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,this.wrapS),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,this.wrapT),this.minFilter===i.LINEAR_MIPMAP_NEAREST&&i.generateMipmap(i.TEXTURE_2D),i.bindTexture(i.TEXTURE_2D,null)
}},o=a.prototype;o.updateTexture=function(t){t&&(this._source=t),i.bindTexture(i.TEXTURE_2D,this.texture),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!0),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,i.RGBA,i.UNSIGNED_BYTE,this._source),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,this.magFilter),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,this.minFilter),this.minFilter===i.LINEAR_MIPMAP_NEAREST&&i.generateMipmap(i.TEXTURE_2D),i.bindTexture(i.TEXTURE_2D,null)},o.bind=function(t){void 0===t&&(t=0),r.shader&&(i.activeTexture(i.TEXTURE0+t),i.bindTexture(i.TEXTURE_2D,this.texture),i.uniform1i(r.shader.uniformTextures[t],t),this._bindIndex=t)},o.unbind=function(){i.bindTexture(i.TEXTURE_2D,null)},o.destroy=function(){i.deleteTexture(this.texture)},e.exports=a},{"./GLTools":14}],14:[function(t,e){"use strict";function i(){this.aspectRatio=1,this.fieldOfView=45,this.zNear=5,this.zFar=3e3,this.canvas=null,this.gl=null,this.shader=null,this.shaderProgram=null}var r=t("gl-matrix"),n=i.prototype;n.init=function(t,e,i,n){null===this.canvas&&(this.canvas=t||document.createElement("canvas"));var s=n||{};s.antialias=!0,this.gl=this.canvas.getContext("webgl",s)||this.canvas.getContext("experimental-webgl",s),console.log("GL TOOLS : ",this.gl),void 0!==e&&void 0!==i?this.setSize(e,i):this.setSize(window.innerWidth,window.innerHeight),this.gl.viewport(0,0,this.gl.viewportWidth,this.gl.viewportHeight),this.gl.enable(this.gl.DEPTH_TEST),this.gl.enable(this.gl.CULL_FACE),this.gl.enable(this.gl.BLEND),this.gl.clearColor(0,0,0,1),this.gl.clearDepth(1),this.matrix=r.mat4.create(),r.mat4.identity(this.matrix),this.normalMatrix=r.mat3.create(),this.invertMVMatrix=r.mat3.create(),this.depthTextureExt=this.gl.getExtension("WEBKIT_WEBGL_depth_texture"),this.floatTextureExt=this.gl.getExtension("OES_texture_float"),this.floatTextureLinearExt=this.gl.getExtension("OES_texture_float_linear"),this.standardDerivativesExt=this.gl.getExtension("OES_standard_derivatives"),this.enabledVertexAttribute=[],this.enableAlphaBlending(),this._viewport=[0,0,this.width,this.height]},n.getGL=function(){return this.gl},n.setShader=function(t){this.shader=t},n.setShaderProgram=function(t){this.shaderProgram=t},n.setViewport=function(t,e,i,r){var n=!1;t!==this._viewport[0]&&(n=!0),e!==this._viewport[1]&&(n=!0),i!==this._viewport[2]&&(n=!0),r!==this._viewport[3]&&(n=!0),n&&(this.gl.viewport(t,e,i,r),this._viewport=[t,e,i,r])},n.setMatrices=function(t){this.camera=t},n.rotate=function(t){r.mat4.copy(this.matrix,t),r.mat4.multiply(this.matrix,this.camera.getMatrix(),this.matrix),r.mat3.fromMat4(this.normalMatrix,this.matrix),r.mat3.invert(this.normalMatrix,this.normalMatrix),r.mat3.transpose(this.normalMatrix,this.normalMatrix),r.mat3.fromMat4(this.invertMVMatrix,this.matrix),r.mat3.invert(this.invertMVMatrix,this.invertMVMatrix)},n.enableAlphaBlending=function(){this.gl.blendFunc(this.gl.SRC_ALPHA,this.gl.ONE_MINUS_SRC_ALPHA)},n.enableAdditiveBlending=function(){this.gl.blendFunc(this.gl.ONE,this.gl.ONE)},n.clear=function(t,e,i,r){this.gl.clearColor(t,e,i,r),this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT)},n.draw=function(t){function e(t,e,i){return void 0===e.cacheAttribLoc&&(e.cacheAttribLoc={}),void 0===e.cacheAttribLoc[i]&&(e.cacheAttribLoc[i]=t.getAttribLocation(e,i)),e.cacheAttribLoc[i]}if(!this.shaderProgram)return void console.warn("Shader program not ready yet");if(this.shaderProgram.pMatrixValue){var i=this.camera.projection||this.camera.getMatrix();r.mat4.str(this.shaderProgram.pMatrixValue)!==r.mat4.str(i)&&(this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform,!1,this.camera.projection||this.camera.getMatrix()),r.mat4.copy(this.shaderProgram.pMatrixValue,i))}else this.shaderProgram.pMatrixValue=r.mat4.create(),this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform,!1,this.camera.projection||this.camera.getMatrix()),r.mat4.copy(this.shaderProgram.pMatrixValue,this.camera.projection||this.camera.getMatrix());this.shaderProgram.mvMatrixValue?r.mat4.str(this.shaderProgram.mvMatrixValue)!==r.mat4.str(this.matrix)&&(this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform,!1,this.matrix),r.mat4.copy(this.shaderProgram.mvMatrixValue,this.matrix)):(this.shaderProgram.mvMatrixValue=r.mat4.create(),this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform,!1,this.matrix),r.mat4.copy(this.shaderProgram.mvMatrixValue,this.matrix)),this.shaderProgram.invertMVMatrixValue?r.mat3.str(this.shaderProgram.invertMVMatrixValue)!==r.mat3.str(this.invertMVMatrix)&&(this.gl.uniformMatrix3fv(this.shaderProgram.invertMVMatrixUniform,!1,this.invertMVMatrix),r.mat3.copy(this.shaderProgram.invertMVMatrixValue,this.invertMVMatrix)):(this.shaderProgram.invertMVMatrixValue=r.mat3.create(),this.gl.uniformMatrix3fv(this.shaderProgram.invertMVMatrixUniform,!1,this.invertMVMatrix),r.mat3.copy(this.shaderProgram.invertMVMatrixValue,this.invertMVMatrix)),this.shaderProgram.normalMatrixValue?r.mat3.str(this.shaderProgram.normalMatrixValue)!==r.mat3.str(this.normalMatrix)&&(this.gl.uniformMatrix3fv(this.shaderProgram.normalMatrixUniform,!1,this.normalMatrix),r.mat3.copy(this.shaderProgram.normalMatrixValue,this.normalMatrix)):(this.shaderProgram.normalMatrixValue=r.mat4.create(),this.gl.uniformMatrix3fv(this.shaderProgram.normalMatrixUniform,!1,this.normalMatrix),r.mat3.copy(this.shaderProgram.normalMatrixValue,this.normalMatrix)),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,t.vBufferPos);var n=e(this.gl,this.shaderProgram,"aVertexPosition");this.gl.vertexAttribPointer(n,t.vBufferPos.itemSize,this.gl.FLOAT,!1,0,0),-1===this.enabledVertexAttribute.indexOf(n)&&(this.gl.enableVertexAttribArray(n),this.enabledVertexAttribute.push(n)),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,t.vBufferUV);var s=e(this.gl,this.shaderProgram,"aTextureCoord");this.gl.vertexAttribPointer(s,t.vBufferUV.itemSize,this.gl.FLOAT,!1,0,0),-1===this.enabledVertexAttribute.indexOf(s)&&(this.gl.enableVertexAttribArray(s),this.enabledVertexAttribute.push(s)),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,t.iBuffer);for(var a=0;a<t.extraAttributes.length;a++){this.gl.bindBuffer(this.gl.ARRAY_BUFFER,t.extraAttributes[a].buffer);var o=e(this.gl,this.shaderProgram,t.extraAttributes[a].name);this.gl.vertexAttribPointer(o,t.extraAttributes[a].itemSize,this.gl.FLOAT,!1,0,0),-1===this.enabledVertexAttribute.indexOf(o)&&(this.gl.enableVertexAttribArray(o),this.enabledVertexAttribute.push(o))}t.drawType===this.gl.POINTS?this.gl.drawArrays(t.drawType,0,t.vertexSize):this.gl.drawElements(t.drawType,t.iBuffer.numItems,this.gl.UNSIGNED_SHORT,0)},n.setSize=function(t,e){this._width=t,this._height=e,this.canvas.width=this._width,this.canvas.height=this._height,this.gl.viewportWidth=this._width,this.gl.viewportHeight=this._height,this.gl.viewport(0,0,this._width,this._height),this.aspectRatio=this._width/this._height},n.__defineGetter__("width",function(){return this._width}),n.__defineGetter__("height",function(){return this._height}),n.__defineGetter__("viewport",function(){return this._viewport});var s=null;i.getInstance=function(){return null===s&&(s=new i),s},e.exports=i.getInstance()},{"gl-matrix":2}],15:[function(t,e){"use strict";var i=t("./Face"),r=t("./GLTools"),n=t("gl-matrix"),s=function(t,e,i){this.gl=r.gl,this.vertexSize=t,this.indexSize=e,this.drawType=i,this.extraAttributes=[],this.vBufferPos=void 0,this._floatArrayVertex=void 0,this._init()},a=s.prototype;a._init=function(){},a.bufferVertex=function(t,e){var i=[],r=e?this.gl.DYNAMIC_DRAW:this.gl.STATIC_DRAW;this._vertices=[];for(var s=0;s<t.length;s++){for(var a=0;a<t[s].length;a++)i.push(t[s][a]);this._vertices.push(n.vec3.clone(t[s]))}if(void 0===this.vBufferPos&&(this.vBufferPos=this.gl.createBuffer()),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.vBufferPos),void 0===this._floatArrayVertex)this._floatArrayVertex=new Float32Array(i);else if(t.length!==this._floatArrayVertex.length)this._floatArrayVertex=new Float32Array(i);else for(var o=0;o<t.length;o++)this._floatArrayVertex[o]=t[o];this.gl.bufferData(this.gl.ARRAY_BUFFER,this._floatArrayVertex,r),this.vBufferPos.itemSize=3},a.bufferTexCoords=function(t){for(var e=[],i=0;i<t.length;i++)for(var r=0;r<t[i].length;r++)e.push(t[i][r]);this.vBufferUV=this.gl.createBuffer(),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,this.vBufferUV),this.gl.bufferData(this.gl.ARRAY_BUFFER,new Float32Array(e),this.gl.STATIC_DRAW),this.vBufferUV.itemSize=2},a.bufferData=function(t,e,i,r){var n=-1,s=r?this.gl.DYNAMIC_DRAW:this.gl.STATIC_DRAW,a=0;for(a=0;a<this.extraAttributes.length;a++)if(this.extraAttributes[a].name===e){this.extraAttributes[a].data=t,n=a;break}var o=[];for(a=0;a<t.length;a++)for(var h=0;h<t[a].length;h++)o.push(t[a][h]);var u,c;if(-1===n)u=this.gl.createBuffer(),this.gl.bindBuffer(this.gl.ARRAY_BUFFER,u),c=new Float32Array(o),this.gl.bufferData(this.gl.ARRAY_BUFFER,c,s),this.extraAttributes.push({name:e,data:t,itemSize:i,buffer:u,floatArray:c});else{for(u=this.extraAttributes[n].buffer,this.gl.bindBuffer(this.gl.ARRAY_BUFFER,u),c=this.extraAttributes[n].floatArray,a=0;a<o.length;a++)c[a]=o[a];this.gl.bufferData(this.gl.ARRAY_BUFFER,c,s)}},a.bufferIndices=function(t){this._indices=t,this.iBuffer=this.gl.createBuffer(),this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER,this.iBuffer),this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(t),this.gl.STATIC_DRAW),this.iBuffer.itemSize=1,this.iBuffer.numItems=t.length},a.computeNormals=function(){if(this.drawType===this.gl.TRIANGLES){void 0===this._faces&&this._generateFaces(),console.log("Start computing");var t=(new Date).getTime(),e=0;this._normals=[];for(var i=0;i<this._vertices.length;i++){var r=n.vec3.create(),s=0;for(e=0;e<this._faces.length;e++)this._faces[e].contains(this._vertices[i])&&(n.vec3.add(r,r,this._faces[e].faceNormal),s++);n.vec3.normalize(r,r),this._normals.push(r)}this.bufferData(this._normals,"aNormal",3);var a=(new Date).getTime()-t;console.log("Total Time : ",a)}},a.computeTangent=function(){},a._generateFaces=function(){this._faces=[];for(var t=0;t<this._indices.length;t+=3){var e=this._vertices[this._indices[t+0]],r=this._vertices[this._indices[t+1]],n=this._vertices[this._indices[t+2]];this._faces.push(new i(e,r,n))}},e.exports=s},{"./Face":9,"./GLTools":14,"gl-matrix":2}],16:[function(t,e){"use strict";var i=t("./GLTools"),r=t("./Mesh"),n={};n.createPlane=function(t,e,n,s,a){a=void 0===a?"xy":a,s=void 0===s?!1:s;for(var o=[],h=[],u=[],c=[],f=t/n,l=e/n,d=1/n,p=0,v=.5*-t,m=.5*-e,_=0;n>_;_++)for(var g=0;n>g;g++){var x=f*_+v,M=l*g+m;"xz"===a?(o.push([x,0,M+l]),o.push([x+f,0,M+l]),o.push([x+f,0,M]),o.push([x,0,M]),c.push([0,1,0]),c.push([0,1,0]),c.push([0,1,0]),c.push([0,1,0])):"yz"===a?(o.push([0,x,M]),o.push([0,x+f,M]),o.push([0,x+f,M+l]),o.push([0,x,M+l]),c.push([1,0,0]),c.push([1,0,0]),c.push([1,0,0]),c.push([1,0,0])):(o.push([x,M,0]),o.push([x+f,M,0]),o.push([x+f,M+l,0]),o.push([x,M+l,0]),c.push([0,0,1]),c.push([0,0,1]),c.push([0,0,1]),c.push([0,0,1]));var T=_/n,E=g/n;h.push([T,E]),h.push([T+d,E]),h.push([T+d,E+d]),h.push([T,E+d]),u.push(4*p+0),u.push(4*p+1),u.push(4*p+2),u.push(4*p+0),u.push(4*p+2),u.push(4*p+3),p++}var b=new r(o.length,u.length,i.gl.TRIANGLES);return b.bufferVertex(o),b.bufferTexCoords(h),b.bufferIndices(u),s&&b.bufferData(c,"aNormal",3),b},n.createSphere=function(t,e,n){n=void 0===n?!1:n;for(var s=[],a=[],o=[],h=[],u=0,c=1/e,f=function(i,r,n){n=void 0===n?!1:n;var s=i/e*Math.PI-.5*Math.PI,a=r/e*Math.PI*2,o=n?1:t,h=[];h[1]=Math.sin(s)*o;var u=Math.cos(s)*o;h[0]=Math.cos(a)*u,h[2]=Math.sin(a)*u;var c=1e4;return h[0]=Math.floor(h[0]*c)/c,h[1]=Math.floor(h[1]*c)/c,h[2]=Math.floor(h[2]*c)/c,h},l=0;e>l;l++)for(var d=0;e>d;d++){s.push(f(l,d)),s.push(f(l+1,d)),s.push(f(l+1,d+1)),s.push(f(l,d+1)),n&&(h.push(f(l,d,!0)),h.push(f(l+1,d,!0)),h.push(f(l+1,d+1,!0)),h.push(f(l,d+1,!0)));var p=d/e,v=l/e;a.push([1-p,v]),a.push([1-p,v+c]),a.push([1-p-c,v+c]),a.push([1-p-c,v]),o.push(4*u+0),o.push(4*u+1),o.push(4*u+2),o.push(4*u+0),o.push(4*u+2),o.push(4*u+3),u++}var m=new r(s.length,o.length,i.gl.TRIANGLES);return m.bufferVertex(s),m.bufferTexCoords(a),m.bufferIndices(o),console.log("With normals :",n),n&&m.bufferData(h,"aNormal",3),m},n.createCube=function(t,e,n,s){s=void 0===s?!1:s,e=e||t,n=n||t;var a=t/2,o=e/2,h=n/2,u=[],c=[],f=[],l=[],d=0;u.push([-a,o,-h]),u.push([a,o,-h]),u.push([a,-o,-h]),u.push([-a,-o,-h]),l.push([0,0,-1]),l.push([0,0,-1]),l.push([0,0,-1]),l.push([0,0,-1]),c.push([0,0]),c.push([1,0]),c.push([1,1]),c.push([0,1]),f.push(4*d+0),f.push(4*d+1),f.push(4*d+2),f.push(4*d+0),f.push(4*d+2),f.push(4*d+3),d++,u.push([a,o,-h]),u.push([a,o,h]),u.push([a,-o,h]),u.push([a,-o,-h]),l.push([1,0,0]),l.push([1,0,0]),l.push([1,0,0]),l.push([1,0,0]),c.push([0,0]),c.push([1,0]),c.push([1,1]),c.push([0,1]),f.push(4*d+0),f.push(4*d+1),f.push(4*d+2),f.push(4*d+0),f.push(4*d+2),f.push(4*d+3),d++,u.push([a,o,h]),u.push([-a,o,h]),u.push([-a,-o,h]),u.push([a,-o,h]),l.push([0,0,1]),l.push([0,0,1]),l.push([0,0,1]),l.push([0,0,1]),c.push([0,0]),c.push([1,0]),c.push([1,1]),c.push([0,1]),f.push(4*d+0),f.push(4*d+1),f.push(4*d+2),f.push(4*d+0),f.push(4*d+2),f.push(4*d+3),d++,u.push([-a,o,h]),u.push([-a,o,-h]),u.push([-a,-o,-h]),u.push([-a,-o,h]),l.push([-1,0,0]),l.push([-1,0,0]),l.push([-1,0,0]),l.push([-1,0,0]),c.push([0,0]),c.push([1,0]),c.push([1,1]),c.push([0,1]),f.push(4*d+0),f.push(4*d+1),f.push(4*d+2),f.push(4*d+0),f.push(4*d+2),f.push(4*d+3),d++,u.push([-a,o,h]),u.push([a,o,h]),u.push([a,o,-h]),u.push([-a,o,-h]),l.push([0,1,0]),l.push([0,1,0]),l.push([0,1,0]),l.push([0,1,0]),c.push([0,0]),c.push([1,0]),c.push([1,1]),c.push([0,1]),f.push(4*d+0),f.push(4*d+1),f.push(4*d+2),f.push(4*d+0),f.push(4*d+2),f.push(4*d+3),d++,u.push([-a,-o,-h]),u.push([a,-o,-h]),u.push([a,-o,h]),u.push([-a,-o,h]),l.push([0,-1,0]),l.push([0,-1,0]),l.push([0,-1,0]),l.push([0,-1,0]),c.push([0,0]),c.push([1,0]),c.push([1,1]),c.push([0,1]),f.push(4*d+0),f.push(4*d+1),f.push(4*d+2),f.push(4*d+0),f.push(4*d+2),f.push(4*d+3),d++;var p=new r(u.length,f.length,i.gl.TRIANGLES);return p.bufferVertex(u),p.bufferTexCoords(c),p.bufferIndices(f),s&&p.bufferData(l,"aNormal",3),p},n.createSkyBox=function(t,e){e=void 0===e?!1:e;var n=[],s=[],a=[],o=[],h=0;n.push([t,t,-t]),n.push([-t,t,-t]),n.push([-t,-t,-t]),n.push([t,-t,-t]),o.push([0,0,-1]),o.push([0,0,-1]),o.push([0,0,-1]),o.push([0,0,-1]),s.push([0,0]),s.push([1,0]),s.push([1,1]),s.push([0,1]),a.push(4*h+0),a.push(4*h+1),a.push(4*h+2),a.push(4*h+0),a.push(4*h+2),a.push(4*h+3),h++,n.push([t,-t,-t]),n.push([t,-t,t]),n.push([t,t,t]),n.push([t,t,-t]),o.push([1,0,0]),o.push([1,0,0]),o.push([1,0,0]),o.push([1,0,0]),s.push([0,0]),s.push([1,0]),s.push([1,1]),s.push([0,1]),a.push(4*h+0),a.push(4*h+1),a.push(4*h+2),a.push(4*h+0),a.push(4*h+2),a.push(4*h+3),h++,n.push([-t,t,t]),n.push([t,t,t]),n.push([t,-t,t]),n.push([-t,-t,t]),o.push([0,0,1]),o.push([0,0,1]),o.push([0,0,1]),o.push([0,0,1]),s.push([0,0]),s.push([1,0]),s.push([1,1]),s.push([0,1]),a.push(4*h+0),a.push(4*h+1),a.push(4*h+2),a.push(4*h+0),a.push(4*h+2),a.push(4*h+3),h++,n.push([-t,-t,t]),n.push([-t,-t,-t]),n.push([-t,t,-t]),n.push([-t,t,t]),o.push([-1,0,0]),o.push([-1,0,0]),o.push([-1,0,0]),o.push([-1,0,0]),s.push([0,0]),s.push([1,0]),s.push([1,1]),s.push([0,1]),a.push(4*h+0),a.push(4*h+1),a.push(4*h+2),a.push(4*h+0),a.push(4*h+2),a.push(4*h+3),h++,n.push([t,t,t]),n.push([-t,t,t]),n.push([-t,t,-t]),n.push([t,t,-t]),o.push([0,1,0]),o.push([0,1,0]),o.push([0,1,0]),o.push([0,1,0]),s.push([0,0]),s.push([1,0]),s.push([1,1]),s.push([0,1]),a.push(4*h+0),a.push(4*h+1),a.push(4*h+2),a.push(4*h+0),a.push(4*h+2),a.push(4*h+3),h++,n.push([t,-t,-t]),n.push([-t,-t,-t]),n.push([-t,-t,t]),n.push([t,-t,t]),o.push([0,-1,0]),o.push([0,-1,0]),o.push([0,-1,0]),o.push([0,-1,0]),s.push([0,0]),s.push([1,0]),s.push([1,1]),s.push([0,1]),a.push(4*h+0),a.push(4*h+1),a.push(4*h+2),a.push(4*h+0),a.push(4*h+2),a.push(4*h+3);var u=new r(n.length,a.length,i.gl.TRIANGLES);return u.bufferVertex(n),u.bufferTexCoords(s),u.bufferIndices(a),e&&u.bufferData(o,"aNormal",3),u},e.exports=n},{"./GLTools":14,"./Mesh":15}],17:[function(t,e){"use strict";function i(){this._clearAll()}var r,n=t("./GLTools"),s=t("./Mesh"),a=i.prototype;a._clearAll=function(){this._callback=null,this._callbackError=null,this._mesh=[],this._drawingType=""},a.load=function(t,e,i,s,a){this._clearAll(),r||(r=n.gl),this._drawingType=void 0===a?r.TRIANGLES:a,this._ignoreNormals=void 0===s?!0:s,this._callback=e,this._callbackError=i;var o=new XMLHttpRequest;o.onreadystatechange=this._onXHTPState.bind(this),o.open("GET",t,!0),o.send()},a._onXHTPState=function(t){4===t.target.readyState&&this._parseObj(t.target.response)},a.parse=function(t,e,i,n,s){this._clearAll(),this._drawingType=void 0===s?r.TRIANGLES:s,this._ignoreNormals=void 0===n?!0:n,this._parseObj(t)},a._parseObj=function(t){function e(t){var e=parseInt(t);return 3*(e>=0?e-1:e+d.length/3)}function i(t){var e=parseInt(t);return 3*(e>=0?e-1:e+p.length/3)}function r(t){var e=parseInt(t);return 2*(e>=0?e-1:e+v.length/2)}function n(t,e,i){c.push([d[t],d[t+1],d[t+2]]),c.push([d[e],d[e+1],d[e+2]]),c.push([d[i],d[i+1],d[i+2]]),m.push(3*_+0),m.push(3*_+1),m.push(3*_+2),_++}function s(t,e,i){f.push([v[t],v[t+1]]),f.push([v[e],v[e+1]]),f.push([v[i],v[i+1]])}function a(t,e,i){l.push([p[t],p[t+1],p[t+2]]),l.push([p[e],p[e+1],p[e+2]]),l.push([p[i],p[i+1],p[i+2]])}function o(t,o,h,u,c,f,l,d,p,v,m,_){var g,x=e(t),M=e(o),T=e(h);void 0===u?n(x,M,T):(g=e(u),n(x,M,g),n(M,T,g)),void 0!==c&&(x=r(c),M=r(f),T=r(l),void 0===u?s(x,M,T):(g=r(d),s(x,M,g),s(M,T,g))),void 0!==p&&(x=i(p),M=i(v),T=i(m),void 0===u?a(x,M,T):(g=i(_),a(x,M,g),a(M,T,g)))}for(var h,u=t.split("\n"),c=[],f=[],l=[],d=[],p=[],v=[],m=[],_=0,g=/v( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/,x=/vn( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/,M=/vt( +[\d|\.|\+|\-|e|E]+)( +[\d|\.|\+|\-|e|E]+)/,T=/f( +-?\d+)( +-?\d+)( +-?\d+)( +-?\d+)?/,E=/f( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+))?/,b=/f( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))( +(-?\d+)\/(-?\d+)\/(-?\d+))?/,R=/f( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))( +(-?\d+)\/\/(-?\d+))?/,A=0;A<u.length;A++){var w=u[A];w=w.trim(),0!==w.length&&"#"!==w.charAt(0)&&(null!==(h=g.exec(w))?d.push(parseFloat(h[1]),parseFloat(h[2]),parseFloat(h[3])):null!==(h=x.exec(w))?p.push(parseFloat(h[1]),parseFloat(h[2]),parseFloat(h[3])):null!==(h=M.exec(w))?v.push(parseFloat(h[1]),parseFloat(h[2])):null!==(h=T.exec(w))?o(h[1],h[2],h[3],h[4]):null!==(h=E.exec(w))?o(h[2],h[5],h[8],h[11],h[3],h[6],h[9],h[12]):null!==(h=b.exec(w))?o(h[2],h[6],h[10],h[14],h[3],h[7],h[11],h[15],h[4],h[8],h[12],h[16]):null!==(h=R.exec(w))&&o(h[2],h[5],h[8],h[11],void 0,void 0,void 0,void 0,h[3],h[6],h[9],h[12]))}this._generateMeshes({positions:c,coords:f,normals:l,indices:m})},a._generateMeshes=function(t){r=n.gl;var e=new s(t.positions.length,t.indices.length,this._drawingType);e.bufferVertex(t.positions),e.bufferTexCoords(t.coords),e.bufferIndices(t.indices),this._ignoreNormals||e.bufferData(t.normals,"aNormal",3),this._callback&&this._callback(e,t)},e.exports=i},{"./GLTools":14,"./Mesh":15}],18:[function(t,e){"use strict";function i(t){void 0===t&&(t=document),this._isRotateZ=0,this.matrix=r.mat4.create(),this.m=r.mat4.create(),this._vZaxis=r.vec3.clone([0,0,0]),this._zAxis=r.vec3.clone([0,0,-1]),this.preMouse={x:0,y:0},this.mouse={x:0,y:0},this._isMouseDown=!1,this._rotation=r.quat.clone([0,0,1,0]),this.tempRotation=r.quat.clone([0,0,0,0]),this._rotateZMargin=0,this.diffX=0,this.diffY=0,this._currDiffX=0,this._currDiffY=0,this._offset=.004,this._easing=.1,this._slerp=-1,this._isLocked=!1;var e=this;t.addEventListener("mousedown",function(t){e._onMouseDown(t)}),t.addEventListener("touchstart",function(t){e._onMouseDown(t)}),t.addEventListener("mouseup",function(t){e._onMouseUp(t)}),t.addEventListener("touchend",function(t){e._onMouseUp(t)}),t.addEventListener("mousemove",function(t){e._onMouseMove(t)}),t.addEventListener("touchmove",function(t){e._onMouseMove(t)})}var r=t("gl-matrix"),n=i.prototype;n.inverseControl=function(t){this._isInvert=void 0===t?!0:t},n.lock=function(t){this._isLocked=void 0===t?!0:t},n.getMousePos=function(t){var e,i;return void 0!==t.changedTouches?(e=t.changedTouches[0].pageX,i=t.changedTouches[0].pageY):(e=t.clientX,i=t.clientY),{x:e,y:i}},n._onMouseDown=function(t){if(!this._isLocked&&!this._isMouseDown){var e=this.getMousePos(t),i=r.quat.clone(this._rotation);this._updateRotation(i),this._rotation=i,this._isMouseDown=!0,this._isRotateZ=0,this.preMouse={x:e.x,y:e.y},e.y<this._rotateZMargin||e.y>window.innerHeight-this._rotateZMargin?this._isRotateZ=1:(e.x<this._rotateZMargin||e.x>window.innerWidth-this._rotateZMargin)&&(this._isRotateZ=2),this._currDiffX=this.diffX=0,this._currDiffY=this.diffY=0}},n._onMouseMove=function(t){this._isLocked||(t.touches&&t.preventDefault(),this.mouse=this.getMousePos(t))},n._onMouseUp=function(){this._isLocked||this._isMouseDown&&(this._isMouseDown=!1)},n.setCameraPos=function(t,e){if(e=e||this._easing,this._easing=e,!(this._slerp>0)){var i=r.quat.clone(this._rotation);this._updateRotation(i),this._rotation=r.quat.clone(i),this._currDiffX=this.diffX=0,this._currDiffY=this.diffY=0,this._isMouseDown=!1,this._isRotateZ=0,this._targetQuat=r.quat.clone(t),this._slerp=1}},n.resetQuat=function(){this._rotation=r.quat.clone([0,0,1,0]),this.tempRotation=r.quat.clone([0,0,0,0]),this._targetQuat=void 0,this._slerp=-1},n.update=function(){r.mat4.identity(this.m),void 0===this._targetQuat?(r.quat.set(this.tempRotation,this._rotation[0],this._rotation[1],this._rotation[2],this._rotation[3]),this._updateRotation(this.tempRotation)):(this._slerp+=.1*(0-this._slerp),this._slerp<.001?(r.quat.set(this._rotation,this._targetQuat[0],this._targetQuat[1],this._targetQuat[2],this._targetQuat[3]),this._targetQuat=void 0,this._slerp=-1):(r.quat.set(this.tempRotation,0,0,0,0),r.quat.slerp(this.tempRotation,this._targetQuat,this._rotation,this._slerp))),r.vec3.transformQuat(this._vZaxis,this._vZaxis,this.tempRotation),r.mat4.fromQuat(this.matrix,this.tempRotation)},n._updateRotation=function(t){this._isMouseDown&&!this._isLocked&&(this.diffX=-(this.mouse.x-this.preMouse.x),this.diffY=this.mouse.y-this.preMouse.y,this._isInvert&&(this.diffX=-this.diffX,this.diffY=-this.diffY)),this._currDiffX+=(this.diffX-this._currDiffX)*this._easing,this._currDiffY+=(this.diffY-this._currDiffY)*this._easing;var e,i;if(this._isRotateZ>0)1===this._isRotateZ?(e=-this._currDiffX*this._offset,e*=this.preMouse.y<this._rotateZMargin?-1:1,i=r.quat.clone([0,0,Math.sin(e),Math.cos(e)]),r.quat.multiply(i,t,i)):(e=-this._currDiffY*this._offset,e*=this.preMouse.x<this._rotateZMargin?1:-1,i=r.quat.clone([0,0,Math.sin(e),Math.cos(e)]),r.quat.multiply(i,t,i));else{var n=r.vec3.clone([this._currDiffX,this._currDiffY,0]),s=r.vec3.create();r.vec3.cross(s,n,this._zAxis),r.vec3.normalize(s,s),e=r.vec3.length(n)*this._offset,i=r.quat.clone([Math.sin(e)*s[0],Math.sin(e)*s[1],Math.sin(e)*s[2],Math.cos(e)]),r.quat.multiply(t,i,t)}},e.exports=i},{"gl-matrix":2}],19:[function(t,e){"use strict";var i=t("./GLTools"),r=t("./QuatRotation"),n=t("./CameraOrtho"),s=t("./SimpleCamera"),a=t("gl-matrix"),o=function(){null!==i.canvas&&(this.gl=i.gl,this._children=[],this._init())},h=o.prototype;h._init=function(){this.camera=new s(i.canvas),this.camera.setPerspective(45*Math.PI/180,i.aspectRatio,5,3e3),this.camera.lockRotation();var t=a.vec3.clone([0,0,500]),e=a.vec3.create(),o=a.vec3.clone([0,-1,0]);this.camera.lookAt(t,e,o),this.sceneRotation=new r(i.canvas),this.rotationFront=a.mat4.create(),a.mat4.identity(this.rotationFront),this.cameraOrtho=new n,this.cameraOrthoScreen=new n,this.cameraOtho=this.cameraOrtho,this.cameraOrtho.lookAt(t,e,o),this.cameraOrtho.ortho(1,-1,1,-1),this.cameraOrthoScreen.lookAt(t,e,o),this.cameraOrthoScreen.ortho(0,i.width,i.height,0),this._initTextures(),this._initViews(),window.addEventListener("resize",this._onResize.bind(this))},h._initTextures=function(){},h._initViews=function(){},h.loop=function(){this.update(),this.render()},h.update=function(){this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT),this.sceneRotation.update(),i.setViewport(0,0,i.width,i.height),i.setMatrices(this.camera),i.rotate(this.sceneRotation.matrix)},h.resize=function(){},h.render=function(){},h._onResize=function(){this.cameraOrthoScreen.ortho(0,i.width,i.height,0)},e.exports=o},{"./CameraOrtho":5,"./GLTools":14,"./QuatRotation":18,"./SimpleCamera":22,"gl-matrix":2}],20:[function(t,e){"use strict";function i(){this.FRAMERATE=60,this._delayTasks=[],this._nextTasks=[],this._deferTasks=[],this._highTasks=[],this._usurpTask=[],this._enterframeTasks=[],this._idTable=0,window.requestAnimFrame(this._loop.bind(this))}void 0===window.requestAnimFrame&&(window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){window.setTimeout(t,1e3/60)}}());var r=i.prototype;r._loop=function(){window.requestAnimFrame(this._loop.bind(this)),this._process()},r._process=function(){var t,e,i,r=0;for(r=0;r<this._enterframeTasks.length;r++)t=this._enterframeTasks[r],null!==t&&void 0!==t&&t.func.apply(t.scope,t.params);for(;this._highTasks.length>0;)t=this._highTasks.pop(),t.func.apply(t.scope,t.params);var n=(new Date).getTime();for(r=0;r<this._delayTasks.length;r++)t=this._delayTasks[r],n-t.time>t.delay&&(t.func.apply(t.scope,t.params),this._delayTasks.splice(r,1));for(n=(new Date).getTime(),e=1e3/this.FRAMERATE;this._deferTasks.length>0;){if(t=this._deferTasks.shift(),i=(new Date).getTime(),!(e>i-n)){this._deferTasks.unshift(t);break}t.func.apply(t.scope,t.params)}for(n=(new Date).getTime(),e=1e3/this.FRAMERATE;this._usurpTask.length>0&&(t=this._usurpTask.shift(),i=(new Date).getTime(),e>i-n);)t.func.apply(t.scope,t.params);this._highTasks=this._highTasks.concat(this._nextTasks),this._nextTasks=[],this._usurpTask=[]},r.addEF=function(t,e,i){i=i||[];var r=this._idTable;return this._enterframeTasks[r]={scope:t,func:e,params:i},this._idTable++,r},r.removeEF=function(t){return void 0!==this._enterframeTasks[t]&&(this._enterframeTasks[t]=null),-1},r.delay=function(t,e,i,r){var n=(new Date).getTime(),s={scope:t,func:e,params:i,delay:r,time:n};this._delayTasks.push(s)},r.defer=function(t,e,i){var r={scope:t,func:e,params:i};this._deferTasks.push(r)},r.next=function(t,e,i){var r={scope:t,func:e,params:i};this._nextTasks.push(r)},r.usurp=function(t,e,i){var r={scope:t,func:e,params:i};this._usurpTask.push(r)};var n=null;i.getInstance=function(){return null===n&&(n=new i),n},e.exports=i.getInstance()},{}],21:[function(t,e){"use strict";var i=function(){};i.shaders={},i.shaders.copyVert="#define GLSLIFY 1\n\n#define SHADER_NAME BASIC_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n    vTextureCoord = aTextureCoord;\n}",i.shaders.copyNormalVert="#define GLSLIFY 1\n\n// copyWithNormals.vert\n\n#define SHADER_NAME BASIC_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec3 aNormal;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vNormal;\nvarying vec3 vVertex;\n\nvoid main(void) {\n	gl_Position   = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);\n	vTextureCoord = aTextureCoord;\n	vNormal       = aNormal;\n	vVertex 	  = aVertexPosition;\n}",i.shaders.generalVert="#define GLSLIFY 1\n\n#define SHADER_NAME GENERAL_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform vec3 position;\nuniform vec3 scale;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n    vec3 pos = aVertexPosition;\n    pos *= scale;\n    pos += position;\n    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);\n    vTextureCoord = aTextureCoord;\n}",i.shaders.generalNormalVert="#define GLSLIFY 1\n\n#define SHADER_NAME GENERAL_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec3 aNormal;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform vec3 position;\nuniform vec3 scale;\n\nvarying vec3 vVertex;\nvarying vec3 vNormal;\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n	vec3 pos      = aVertexPosition;\n	pos           *= scale;\n	pos           += position;\n	gl_Position   = uPMatrix * uMVMatrix * vec4(pos, 1.0);\n	vTextureCoord = aTextureCoord;\n	\n	vNormal       = aNormal;\n	vVertex       = pos;\n}",i.shaders.generalWithNormalVert="#define GLSLIFY 1\n\n#define SHADER_NAME GENERAL_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec3 aNormal;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform vec3 position;\nuniform vec3 scale;\n\nvarying vec3 vVertex;\nvarying vec3 vNormal;\nvarying vec2 vTextureCoord;\n\nvoid main(void) {\n	vec3 pos      = aVertexPosition;\n	pos           *= scale;\n	pos           += position;\n	gl_Position   = uPMatrix * uMVMatrix * vec4(pos, 1.0);\n	vTextureCoord = aTextureCoord;\n	\n	vNormal       = aNormal;\n	vVertex       = pos;\n}",i.shaders.copyFrag="#define GLSLIFY 1\n\n#define SHADER_NAME SIMPLE_TEXTURE\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\n\nvoid main(void) {\n    gl_FragColor = texture2D(texture, vTextureCoord);\n}\n",i.shaders.alphaFrag="#define GLSLIFY 1\n\n#define SHADER_NAME TEXTURE_WITH_ALPHA\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform float opacity;\n\nvoid main(void) {\n    gl_FragColor = texture2D(texture, vTextureCoord);\n    gl_FragColor.a *= opacity;\n}",i.shaders.simpleColorFrag="#define GLSLIFY 1\n\n#define SHADER_NAME SIMPLE_COLOR_FRAGMENT\n\nprecision highp float;\nuniform vec3 color;\nuniform float opacity;\n\nvoid main(void) {\n    gl_FragColor = vec4(color, opacity);\n}",i.shaders.depthFrag="#define GLSLIFY 1\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform float n;\nuniform float f;\n\nfloat getDepth(float z) {\n	return (6.0 * n) / (f + n - z*(f-n));\n}\n\nvoid main(void) {\n    float r = texture2D(texture, vTextureCoord).r;\n    float grey = getDepth(r);\n    gl_FragColor = vec4(grey, grey, grey, 1.0);\n}",i.shaders.simpleCopyLighting="#define GLSLIFY 1\n\n#define SHADER_NAME SIMPLE_TEXTURE_LIGHTING\n\nprecision highp float;\n\nuniform vec3 ambient;\nuniform vec3 lightPosition;\nuniform vec3 lightColor;\nuniform float lightWeight;\n\nuniform sampler2D texture;\n\nvarying vec2 vTextureCoord;\nvarying vec3 vVertex;\nvarying vec3 vNormal;\n\nvoid main(void) {\n	vec3 L        = normalize(lightPosition-vVertex);\n	float lambert = max(dot(vNormal, L), .0);\n	vec3 light    = ambient + lightColor * lambert * lightWeight;\n	vec4 color 	  = texture2D(texture, vTextureCoord);\n	color.rgb 	  *= light;\n	\n	gl_FragColor  = color;\n}",i.shaders.simpleColorLighting="#define GLSLIFY 1\n\n// simpleColorLighting.frag\n\n#define SHADER_NAME SIMPLE_COLOR_LIGHTING\n\nprecision highp float;\n\nuniform vec3 ambient;\nuniform vec3 lightPosition;\nuniform vec3 lightColor;\nuniform float lightWeight;\n\nuniform vec3 color;\nuniform float opacity;\n\nvarying vec3 vVertex;\nvarying vec3 vNormal;\n\nvoid main(void) {\n	vec3 L        = normalize(lightPosition-vVertex);\n	float lambert = max(dot(vNormal, L), .0);\n	vec3 light    = ambient + lightColor * lambert * lightWeight;\n	\n	gl_FragColor  = vec4(color * light, opacity);\n}",i.getShader=function(t){return this.shaders[t]},i.get=i.getShader,e.exports=i},{}],22:[function(t,e){"use strict";var i=t("gl-matrix"),r=t("./CameraPerspective"),n=t("./EaseNumber"),s=function(t){this._listenerTarget=t||window,r.call(this),this._init()
},a=s.prototype=new r,o=r.prototype;a._init=function(){this.radius=new n(500),this.position[2]=this.radius.value,this.positionOffset=i.vec3.create(),this.center=i.vec3.create(),this.up=i.vec3.clone([0,-1,0]),this.lookAt(this.position,this.center,this.up),this._mouse={},this._preMouse={},this._isMouseDown=!1,this._rx=new n(0),this._rx.limit(-Math.PI/2,Math.PI/2),this._ry=new n(0),this._preRX=0,this._preRY=0,this._isLockZoom=!1,this._isLockRotation=!1,this._isInvert=!1,this._listenerTarget.addEventListener("mousewheel",this._onWheel.bind(this)),this._listenerTarget.addEventListener("DOMMouseScroll",this._onWheel.bind(this)),this._listenerTarget.addEventListener("mousedown",this._onMouseDown.bind(this)),this._listenerTarget.addEventListener("touchstart",this._onMouseDown.bind(this)),this._listenerTarget.addEventListener("mousemove",this._onMouseMove.bind(this)),this._listenerTarget.addEventListener("touchmove",this._onMouseMove.bind(this)),window.addEventListener("mouseup",this._onMouseUp.bind(this)),window.addEventListener("touchend",this._onMouseUp.bind(this))},a.inverseControl=function(t){this._isInvert=void 0===t?!0:t},a.lock=function(t){void 0===t?(this._isLockZoom=!0,this._isLockRotation=!0):(this._isLockZoom=t,this._isLockRotation=t)},a.lockRotation=function(t){this._isLockRotation=void 0===t?!0:t},a.lockZoom=function(t){this._isLockZoom=void 0===t?!0:t},a._onMouseDown=function(t){this._isLockRotation||(this._isMouseDown=!0,h(t,this._mouse),h(t,this._preMouse),this._preRX=this._rx.targetValue,this._preRY=this._ry.targetValue)},a._onMouseMove=function(t){if(!this._isLockRotation&&(h(t,this._mouse),t.touches&&t.preventDefault(),this._isMouseDown)){var e=this._mouse.x-this._preMouse.x;this._isInvert&&(e*=-1),this._ry.value=this._preRY-.01*e;var i=this._mouse.y-this._preMouse.y;this._isInvert&&(i*=-1),this._rx.value=this._preRX-.01*i}},a._onMouseUp=function(){this._isLockRotation||(this._isMouseDown=!1)},a._onWheel=function(t){if(!this._isLockZoom){var e=t.wheelDelta,i=t.detail,r=0;r=i?e?e/i/40*i>0?1:-1:-i/3:e/120,this.radius.add(5*-r)}},a.getMatrix=function(){return this._updateCameraPosition(),this.lookAt(this.position,this.center,this.up),o.getMatrix.call(this)},a._updateCameraPosition=function(){this.position[1]=Math.sin(this._rx.value)*this.radius.value;var t=Math.cos(this._rx.value)*this.radius.value;this.position[0]=Math.cos(this._ry.value+.5*Math.PI)*t,this.position[2]=Math.sin(this._ry.value+.5*Math.PI)*t,i.vec3.add(this.position,this.position,this.positionOffset)};var h=function(t,e){var i=e||{};return t.touches?(i.x=t.touches[0].pageX,i.y=t.touches[0].pageY):(i.x=t.clientX,i.y=t.clientY),i};a.__defineGetter__("rx",function(){return this._rx.targetValue}),a.__defineSetter__("rx",function(t){this._rx.value=t}),a.__defineGetter__("ry",function(){return this._ry.targetValue}),a.__defineSetter__("ry",function(t){this._ry.value=t}),e.exports=s},{"./CameraPerspective":6,"./EaseNumber":7,"gl-matrix":2}],23:[function(t,e){"use strict";var i=function(){this._imgs={},this._loadedCount=0,this._toLoadCount=0,this._scope=void 0,this._callback=void 0,this._callbackProgress=void 0},r=i.prototype;r.load=function(t,e,i,r){this._imgs={},this._loadedCount=0,this._toLoadCount=t.length,this._scope=e,this._callback=i,this._callbackProgress=r,this._imgLoadedBind=this._onImageLoaded.bind(this);for(var n=0;n<t.length;n++){var s=new Image;s.onload=this._imgLoadedBind;var a=t[n],o=a.split("/"),h=o[o.length-1].split(".")[0];this._imgs[h]=s,s.src=a}},r._onImageLoaded=function(){if(this._loadedCount++,this._loadedCount===this._toLoadCount)this._callback.call(this._scope,this._imgs);else{var t=this._loadedCount/this._toLoadCount;this._callbackProgress&&this._callbackProgress.call(this._scope,t)}},e.exports=i},{}],24:[function(t,e){"use strict";var i=t("./GLShader"),r=function(t,e){this.shader=new i(t,e),this._init()},n=r.prototype;n._init=function(){},n.render=function(){},e.exports=r},{"./GLShader":12}],25:[function(t,e){"use strict";var i=t("./GLTools"),r=t("./View"),n=t("./Mesh"),s="precision highp float;attribute vec3 aVertexPosition;attribute vec2 aTextureCoord;attribute vec3 aColor;uniform mat4 uMVMatrix;uniform mat4 uPMatrix;varying vec2 vTextureCoord;varying vec3 vColor;void main(void) {    gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);    vTextureCoord = aTextureCoord;    vColor = aColor;}",a="precision mediump float;varying vec3 vColor;void main(void) {    gl_FragColor = vec4(vColor, 1.0);}",o=function(t,e){this.lineWidth=void 0===t?2:t;var i=void 0===e?a:e;r.call(this,s,i)},h=o.prototype=new r;h._init=function(){var t=[],e=[],r=[],s=[0,1,2,3,4,5],a=9999;t.push([-a,0,0]),t.push([a,0,0]),t.push([0,-a,0]),t.push([0,a,0]),t.push([0,0,-a]),t.push([0,0,a]),e.push([1,0,0]),e.push([1,0,0]),e.push([0,1,0]),e.push([0,1,0]),e.push([0,0,1]),e.push([0,0,1]),r.push([0,0]),r.push([0,0]),r.push([0,0]),r.push([0,0]),r.push([0,0]),r.push([0,0]),this.mesh=new n(t.length,s.length,i.gl.LINES),this.mesh.bufferVertex(t),this.mesh.bufferTexCoords(r),this.mesh.bufferIndices(s),this.mesh.bufferData(e,"aColor",3,!1)},h.render=function(){this.shader.isReady()&&(this.shader.bind(),i.gl.lineWidth(this.lineWidth),i.draw(this.mesh),i.gl.lineWidth(1))},e.exports=o},{"./GLTools":14,"./Mesh":15,"./View":24}],26:[function(t,e){"use strict";var i=t("./View"),r=t("./GLTools"),n=t("./MeshUtils"),s=function(t,e){i.call(this,t,e)},a=s.prototype=new i;a._init=function(){r.gl&&(this.mesh=n.createPlane(2,2,1))},a.render=function(t){this.shader.isReady()&&(this.shader.bind(),this.shader.uniform("texture","uniform1i",0),t.bind(0),r.draw(this.mesh))},e.exports=s},{"./GLTools":14,"./MeshUtils":16,"./View":24}],27:[function(t,e){"use strict";var i=t("./GLTools"),r=t("./View"),n=t("./ShaderLibs"),s=t("./Mesh"),a=function(t,e){var i=.75;this.color=void 0===t?[i,i,i]:t;var s=void 0===e?n.get("simpleColorFrag"):e;r.call(this,null,s)},o=a.prototype=new r;o._init=function(){var t,e,r=[],n=[],a=[],o=0,h=100,u=3e3,c=u/h;for(t=-u/2;u>t;t+=c)for(e=-u/2;u>e;e+=c)r.push([t,e,0]),n.push([0,0]),a.push(o),o++,r.push([t,0,e]),n.push([0,0]),a.push(o),o++;this.mesh=new s(r.length,a.length,i.gl.DOTS),this.mesh.bufferVertex(r),this.mesh.bufferTexCoords(n),this.mesh.bufferIndices(a)},o.render=function(){this.shader.bind(),this.shader.uniform("color","uniform3fv",this.color),this.shader.uniform("opacity","uniform1f",1),i.draw(this.mesh)},e.exports=a},{"./GLTools":14,"./Mesh":15,"./ShaderLibs":21,"./View":24}],28:[function(t,e){"use strict";var i=t("./Pass"),r=function(){this._passes=[]},n=r.prototype=new i;n.addPass=function(t){this._passes.push(t)},n.render=function(t){this.texture=t;for(var e=0;e<this._passes.length;e++)this.texture=this._passes[e].render(this.texture);return this.texture},n.getTexture=function(){return this.texture},e.exports=r},{"./Pass":29}],29:[function(t,e){"use strict";var i,r=t("../GLTools"),n=t("../ViewCopy"),s=t("../FrameBuffer"),a=function(t,e,s,a){e=void 0===e?512:e,s=void 0===s?512:s,i=r.gl,t&&(this.view="string"==typeof t?new n(null,t):t,this.width=e,this.height=s,this._fboParams=a,this._init())},o=a.prototype;o._init=function(){this._fbo=new s(this.width,this.height,this._fboParams),this._fbo.bind(),r.setViewport(0,0,this._fbo.width,this._fbo.height),r.clear(0,0,0,0),this._fbo.unbind(),r.setViewport(0,0,r.canvas.width,r.canvas.height)},o.render=function(t){return this._fbo.bind(),r.setViewport(0,0,this._fbo.width,this._fbo.height),r.clear(0,0,0,0),this.view.render(t),this._fbo.unbind(),r.setViewport(0,0,r.canvas.width,r.canvas.height),this._fbo.getTexture()},o.getTexture=function(){return this._fbo.getTexture()},o.getFbo=function(){return this._fbo},e.exports=a},{"../FrameBuffer":10,"../GLTools":14,"../ViewCopy":26}],30:[function(t,e){"use strict";var i=t("./Pass"),r=function(t,e,r){i.call(this,"#define GLSLIFY 1\n\n// greyscale.frag\n\n#define SHADER_NAME FRAGMENT_GREYSCALE\n\nprecision highp float;\n\nvarying vec2 vTextureCoord;\n\nuniform sampler2D texture;\n\nvoid main(void) {\n	vec4 color = texture2D(texture, vTextureCoord);\n	float grey = (color.r + color.g + color.b) / 3.0;\n	gl_FragColor = vec4(vec3(grey), color.a);\n}",t,e,r)};r.prototype=new i,e.exports=r},{"./Pass":29}]},{},[1])(1)});
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],24:[function(require,module,exports){
// SubsceneLantern.js

var GL = bongiovi.GL, gl;

var ViewSave = require("./ViewSave");
var ViewRender = require("./ViewRender");
var ViewSimulation = require("./ViewSimulation");
var ViewBoxes = require("./ViewBoxes");

function SubsceneLantern(scene) {
	gl                 = GL.gl;
	this.scene         = scene;
	this.camera        = scene.camera;
	this.cameraOtho    = scene.cameraOtho;
	this.rotationFront = scene.rotationFront;
	this.count         = 0;
	this.percent       = 0;

	window.addEventListener("resize", this.resize.bind(this));

	this._initTextures();
	this._initViews();
	this.resize();
}


var p = SubsceneLantern.prototype;

p._initTextures = function() {
	this._texture = new bongiovi.GLTexture(images.gold);
	this._textureNormal = new bongiovi.GLTexture(images.paperNormal)
	if(!gl) gl = GL.gl;

	var num = params.numParticles;
	var o = {
		minFilter:gl.NEAREST,
		magFilter:gl.NEAREST
	}
	this._fboCurrent 	= new bongiovi.FrameBuffer(num*2, num*2, o);
	this._fboTarget 	= new bongiovi.FrameBuffer(num*2, num*2, o);

};

p._initViews = function() {
	this._vAxis     = new bongiovi.ViewAxis();
	this._vDotPlane = new bongiovi.ViewDotPlane();
	this._vSave     = new ViewSave();
	this._vCopy 	= new bongiovi.ViewCopy();
	this._vRender 	= new ViewRender();
	this._vSim 		= new ViewSimulation();
	this._vBoxes	= new ViewBoxes();


	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	this._fboCurrent.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	this._vSave.render();
	this._fboCurrent.unbind();
};


p.updateFbo = function() {
	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	this._fboTarget.bind();
	GL.setViewport(0, 0, this._fboCurrent.width, this._fboCurrent.height);
	GL.clear(0, 0, 0, 0);
	this._vSim.render(this._fboCurrent.getTexture() );
	this._fboTarget.unbind();


	var tmp = this._fboTarget;
	this._fboTarget = this._fboCurrent;
	this._fboCurrent = tmp;
};

p.update = function() {
	if(this.count % params.skipCount == 0) {
		this.updateFbo();	
		this.count = 0;
	}

	this.count++;
	this.percent = this.count / params.skipCount;
};


p.render = function(textureEnv) {
	this._vBoxes.render(this._fboTarget.getTexture(), this._fboCurrent.getTexture(), this._texture, this.percent, this._textureNormal, textureEnv);
};



p.resize = function() {
	var scale = 1.5;
	GL.setSize(window.innerWidth*scale, window.innerHeight*scale);
	this.camera.resize(GL.aspectRatio);

	this._fboRender = new bongiovi.FrameBuffer(GL.width, GL.height);
};


module.exports = SubsceneLantern;
},{"./ViewBoxes":25,"./ViewRender":26,"./ViewSave":27,"./ViewSimulation":28}],25:[function(require,module,exports){
// ViewBoxes.js

var GL = bongiovi.GL;
var gl;

var random = function(min, max) { return min + Math.random() * (max - min);	}

function ViewBoxes() {
	this.count = 0xFFFF;
	bongiovi.View.call(this, "#define GLSLIFY 1\n// box.vert\n\n#define SHADER_NAME BASIC_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\nattribute vec2 aUV;\nattribute vec3 aNormal;\n\nuniform sampler2D texture;\nuniform sampler2D textureNext;\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform float percent;\nuniform float time;\n\nvarying vec2 vUV;\nvarying vec2 vTextureCoord;\nvarying vec3 vNormal;\nvarying vec3 vVertex;\nvarying float vOpacity;\nvarying float vTime;\nvarying float vRotation;\n\n\nvec3 getPos(vec3 value) {\n\treturn value;\n}\n\nvec2 rotate(vec2 value, float a) {\n\tfloat c = cos(a);\n\tfloat s = sin(a);\n\tmat2 r = mat2(c, -s, s, c);\n\treturn r * value;\n}\n\n\nconst float PI = 3.141592657;\n\nvoid main(void) {\n\tvOpacity = 1.0;\n\tvec3 pos           = aVertexPosition;\n\tvec2 uvPos         = aTextureCoord * .5;\n\tvec3 posOffset     =  texture2D(texture, uvPos).rgb;\n\tposOffset          = getPos(posOffset);\n\t\n\tvec3 posOffsetNext =  texture2D(textureNext, uvPos).rgb;\n\tposOffsetNext      = getPos(posOffsetNext);\n\n\tif(posOffsetNext.y < posOffset.y) vOpacity = 0.0;\n\n\n\tposOffset          = mix(posOffset, posOffsetNext, percent);\n\tfloat r            = atan(posOffset.z, posOffset.x);\n\tfloat rz \t\t   = sin(time*mix(uvPos.x, 1.0, .5)) * 0.35;\n\tfloat rotation     = aTextureCoord.x * PI * 2.0 - r;\n\n\tconst float maxY = 700.0;\n\tconst float minY = 0.0;\n\tconst float range = 100.0;\n\tif(posOffset.y > maxY-range) {\n\t\tfloat a = 1.0 - smoothstep(maxY-range, maxY, posOffset.y);\n\t\tvOpacity *= a;\n\t}\n\t\n\tif(posOffset.y < minY) {\n\t\tfloat a = smoothstep(minY-range, minY, posOffset.y);\n\t\tvOpacity *= a;\n\t}\n\t\n\tpos.xz             = rotate(pos.xz, rotation);\n\tpos.xy             = rotate(pos.xy, rz);\n\tvVertex            = vec3(pos);\n\n\tpos                += posOffset;\n\tgl_Position        = uPMatrix * uMVMatrix * vec4(pos, 1.0);\n\t\n\tvTextureCoord      = aTextureCoord;\n\tvNormal            = aNormal;\n\t\n\tvNormal.xz         = rotate(vNormal.xz, rotation);\n\tvNormal.xy         = rotate(vNormal.xy, rz);\n\tvTime \t\t\t   = time;\n\tvUV \t\t\t   = aUV;\n\tvRotation \t\t   = rz;\n}", "#define GLSLIFY 1\n// box.frag\n\n#define SHADER_NAME SIMPLE_TEXTURE\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nvarying vec3 vNormal;\nvarying vec3 vVertex;\nvarying float vOpacity;\nvarying float vTime;\nvarying vec2 vUV;\nvarying float vRotation;\n\nuniform float gamma;\nuniform sampler2D textureMap;\nuniform sampler2D textureNormal;\nuniform sampler2D textureEnv;\n// const float gamma = 2.2;\nconst float PI = 3.141592657;\nconst float TwoPI = PI * 2.0;\n\nfloat diffuse(vec3 lightPos, vec3 normal) {\n\tfloat d = max(dot(normal, normalize(lightPos)), 0.0);\n\treturn d;\n}\n\n\nvec3 diffuse(vec3 lightPos, vec3 lightColor, vec3 normal) {\n\treturn diffuse(lightPos, normal) * lightColor;\n}\n\n\nvec2 envMapEquirect(vec3 wcNormal, float flipEnvMap) {\n  float phi = acos(-wcNormal.y);\n  float theta = atan(flipEnvMap * wcNormal.x, wcNormal.z) + PI;\n  return vec2(theta / TwoPI, phi / PI);\n}\n\nvec2 envMapEquirect(vec3 wcNormal) {\n    return envMapEquirect(wcNormal, -1.0);\n}\n\nvec2 rotate(vec2 value, float a) {\n\tfloat c = cos(a);\n\tfloat s = sin(a);\n\tmat2 r = mat2(c, -s, s, c);\n\treturn r * value;\n}\n\n\nconst vec3 LIGHT = vec3(1.0, 10.0, 10.0);\n\nvoid main(void) {\n\tif(vOpacity < .01) discard;\n\tvec3 light = vec3(0.0, -10.0+vTextureCoord.y * 5.0, 0.0);\n\tlight.xy = rotate(light.xy, vRotation);\n\tvec3 normalOffset = texture2D(textureNormal, vUV).rgb * 2.0 - 1.0;\n\tvec3 N = normalize(vNormal + normalOffset * .5);\n\n\tfloat diff = diffuse(light - vVertex, -N);\n\n\tfloat g = distance(vVertex, light);\n\tfloat radius = 10.0 + 10.0 * vTextureCoord.x;\n\n\t\n\tg /= radius;\n\tg = smoothstep(0.0, 1.0, 1.0-g);\n\tfloat t = sin(vTime*mix(vTextureCoord.y, 1.0, .5)) * .5 + .5;\n\tfloat t1 = cos(vTime*.5*mix(vTextureCoord.x, 1.0, .5)) * .5 + .5;\n\tt *= t1;\n\tt = mix(1.0, t, .8) ;\n\n\tvec2 uv = vTextureCoord;\n\tuv.x = mod(uv.x + vTime*.25*vTextureCoord.y, 1.0);\n\n\tvec3 color = texture2D(textureMap, uv).rgb;\n\tcolor *= g*t+diff;\n\tcolor *= 1.2;\n\tcolor *= color;\n\n\tvec2 uvEnv = envMapEquirect(N);\n\tvec3 colorEnv = texture2D(textureEnv, uvEnv).rgb;\n\t\n\tcolor += colorEnv * .75;\n\tcolor = pow(color, vec3(1.0 / gamma));\n    gl_FragColor = vec4(color, pow(vOpacity, 2.0));\n    // gl_FragColor *= vOpacity;\n}");
}

var p = ViewBoxes.prototype = new bongiovi.View();
p.constructor = ViewBoxes;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords    = [];
	var uvs       = [];
	var indices   = []; 
	var normals   = [];
	var count     = 0;


	

	function createCube(i, j) {
		var size = random(2, 5);
		var x = y = z = size;	
		var ux = i/numParticles;
		var uy = j/numParticles;
		var yScale = random(1.25, 2);
		// var xzScale = random(1, 2);
		// x *= xzScale;
		y *= yScale;
		// z *= xzScale;



		// BACK
		positions.push([-x,  y, -z]);
		positions.push([ x,  y, -z]);
		positions.push([ x, -y, -z]);
		positions.push([-x, -y, -z]);

		normals.push([0, 0, -1]);
		normals.push([0, 0, -1]);
		normals.push([0, 0, -1]);
		normals.push([0, 0, -1]);

		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);

		uvs.push([0, 0]);
		uvs.push([1, 0]);
		uvs.push([1, 1]);
		uvs.push([0, 1]);

		indices.push(count*4 + 0);
		indices.push(count*4 + 1);
		indices.push(count*4 + 2);
		indices.push(count*4 + 0);
		indices.push(count*4 + 2);
		indices.push(count*4 + 3);

		count ++;

		// RIGHT
		positions.push([ x,  y, -z]);
		positions.push([ x,  y,  z]);
		positions.push([ x, -y,  z]);
		positions.push([ x, -y, -z]);

		normals.push([1, 0, 0]);
		normals.push([1, 0, 0]);
		normals.push([1, 0, 0]);
		normals.push([1, 0, 0]);

		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);

		uvs.push([0, 0]);
		uvs.push([1, 0]);
		uvs.push([1, 1]);
		uvs.push([0, 1]);

		indices.push(count*4 + 0);
		indices.push(count*4 + 1);
		indices.push(count*4 + 2);
		indices.push(count*4 + 0);
		indices.push(count*4 + 2);
		indices.push(count*4 + 3);

		count ++;

		// FRONT
		positions.push([ x,  y,  z]);
		positions.push([-x,  y,  z]);
		positions.push([-x, -y,  z]);
		positions.push([ x, -y,  z]);

		normals.push([0, 0, 1]);
		normals.push([0, 0, 1]);
		normals.push([0, 0, 1]);
		normals.push([0, 0, 1]);

		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);

		uvs.push([0, 0]);
		uvs.push([1, 0]);
		uvs.push([1, 1]);
		uvs.push([0, 1]);

		indices.push(count*4 + 0);
		indices.push(count*4 + 1);
		indices.push(count*4 + 2);
		indices.push(count*4 + 0);
		indices.push(count*4 + 2);
		indices.push(count*4 + 3);

		count ++;


		// LEFT
		positions.push([-x,  y,  z]);
		positions.push([-x,  y, -z]);
		positions.push([-x, -y, -z]);
		positions.push([-x, -y,  z]);

		normals.push([-1, 0, 0]);
		normals.push([-1, 0, 0]);
		normals.push([-1, 0, 0]);
		normals.push([-1, 0, 0]);

		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);

		uvs.push([0, 0]);
		uvs.push([1, 0]);
		uvs.push([1, 1]);
		uvs.push([0, 1]);

		indices.push(count*4 + 0);
		indices.push(count*4 + 1);
		indices.push(count*4 + 2);
		indices.push(count*4 + 0);
		indices.push(count*4 + 2);
		indices.push(count*4 + 3);

		count ++;

		// TOP
		positions.push([-x,  y,  z]);
		positions.push([ x,  y,  z]);
		positions.push([ x,  y, -z]);
		positions.push([-x,  y, -z]);

		normals.push([0, 1, 0]);
		normals.push([0, 1, 0]);
		normals.push([0, 1, 0]);
		normals.push([0, 1, 0]);

		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);

		uvs.push([0, 0]);
		uvs.push([1, 0]);
		uvs.push([1, 1]);
		uvs.push([0, 1]);

		indices.push(count*4 + 0);
		indices.push(count*4 + 1);
		indices.push(count*4 + 2);
		indices.push(count*4 + 0);
		indices.push(count*4 + 2);
		indices.push(count*4 + 3);

		count ++;

		// BOTTOM
		positions.push([-x, -y, -z]);
		positions.push([ x, -y, -z]);
		positions.push([ x, -y,  z]);
		positions.push([-x, -y,  z]);

		normals.push([0, -1, 0]);
		normals.push([0, -1, 0]);
		normals.push([0, -1, 0]);
		normals.push([0, -1, 0]);

		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);
		coords.push([ux, uy]);

		uvs.push([0, 0]);
		uvs.push([1, 0]);
		uvs.push([1, 1]);
		uvs.push([0, 1]);

		indices.push(count*4 + 0);
		indices.push(count*4 + 1);
		indices.push(count*4 + 2);
		indices.push(count*4 + 0);
		indices.push(count*4 + 2);
		indices.push(count*4 + 3);

		count ++;
	}


	var numParticles = params.numParticles;

	for(var j=0; j<numParticles; j++) {
		for(var i=0; i<numParticles; i++) {
			createCube(i, j);
		}
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(normals, "aNormal", 3);
	this.mesh.bufferData(uvs, "aUV", 2);
};

p.render = function(texture, textureNext, textureMap, percent, textureNormal, textureEnv) {
	this.count += .1;
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureNext", "uniform1i", 1);
	textureNext.bind(1);
	this.shader.uniform("textureMap", "uniform1i", 2);
	textureMap.bind(2);
	this.shader.uniform("textureNormal", "uniform1i", 3);
	textureNormal.bind(3);
	this.shader.uniform("textureEnv", "uniform1i", 4);
	textureEnv.bind(4);
	this.shader.uniform("time", "uniform1f", this.count);
	this.shader.uniform("gamma", "uniform1f", params.gamma);
	this.shader.uniform("percent", "uniform1f", percent);
	GL.draw(this.mesh);
};

module.exports = ViewBoxes;
},{}],26:[function(require,module,exports){
// ViewRender.js
var GL = bongiovi.GL;
var gl;

var random = function(min, max) { return min + Math.random() * (max - min);	}

function ViewRender() {
	this.time = Math.random() * 0xFF;
	bongiovi.View.call(this, "#define GLSLIFY 1\n// line.vert\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec3 aExtra;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform float time;\nuniform sampler2D texture;\nvarying vec2 vTextureCoord;\nvarying float vOpacity;\n\nvec3 getPos(vec3 value) {\n\tvec3 pos;\n\n\tpos.y = value.y;\n\tpos.x = cos(value.z) * value.x;\n\tpos.z = sin(value.z) * value.x;\n\treturn pos;\n}\n\nvoid main(void) {\n\tvec3 pos = getPos(aVertexPosition);\n\tvec2 uv = aTextureCoord * .5;\n\tpos.xyz = texture2D(texture, uv).rgb;\n\tpos = getPos(pos);\n\tpos.y += 25.0;\n    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);\n    vTextureCoord = aExtra.xy;\n\n    gl_PointSize = aExtra.z;\n\n    float c = sin(time * mix(aExtra.x, 1.0, .5));\n    vOpacity = smoothstep(.5, 1.0, c);\n}", "#define GLSLIFY 1\nprecision mediump float;\n\nvarying float vOpacity;\nvarying vec2 vTextureCoord;\nuniform sampler2D textureMap;\n\nconst vec2 center = vec2(.5);\n\nvoid main(void) {\n\tif(distance(center, gl_PointCoord) > .4) discard;\n\n\tvec3 color = texture2D(textureMap, vTextureCoord).rgb;\n    gl_FragColor = vec4(color, vOpacity);\n}");
}

var p = ViewRender.prototype = new bongiovi.View();
p.constructor = ViewRender;


p._init = function() {
	gl = GL.gl;
	var positions    = [];
	var coords       = [];
	var extra		 = [];
	var indices      = []; 
	var count        = 0;
	var numParticles = params.numParticles;

	for(var j=0; j<numParticles; j++) {
		for(var i=0; i<numParticles; i++) {
			positions.push([0, 0, 0]);
			extra.push([Math.random(), Math.random(), random(1, 5)])

			ux = i/numParticles;
			uy = j/numParticles;
			coords.push([ux, uy]);
			indices.push(count);
			count ++;

		}
	}

	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.POINTS);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
	this.mesh.bufferData(extra, "aExtra", 3);
};

p.render = function(texture, textureMap) {
	this.time += .01;
	this.shader.bind();
	this.shader.uniform("time", "uniform1f", this.time);
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureMap", "uniform1i", 1);
	textureMap.bind(1);
	GL.draw(this.mesh);
};

module.exports = ViewRender;
},{}],27:[function(require,module,exports){
// ViewSave.js

var GL = bongiovi.GL;
var gl;

var random = function(min, max) { return min + Math.random() * (max - min);	};

function ViewSave() {
	bongiovi.View.call(this, "#define GLSLIFY 1\n// line.vert\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nvarying vec2 vTextureCoord;\nvarying vec3 vColor;\n\nvoid main(void) {\n\tvColor = aVertexPosition;\n\tvec3 pos = vec3(aTextureCoord, 0.0);\n    gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0);\n    vTextureCoord = aTextureCoord;\n\n    gl_PointSize = 1.0;\n}", "#define GLSLIFY 1\nprecision mediump float;\n\nvarying vec3 vColor;\n\nvoid main(void) {\n    gl_FragColor = vec4(vColor, 1.0);\n    // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);\n}");
}

var p = ViewSave.prototype = new bongiovi.View();
p.constructor = ViewSave;


p._init = function() {
	gl = GL.gl;

	var positions = [];
	var coords = [];
	var indices = []; 
	var count = 0;

	var numParticles = params.numParticles;
	var totalParticles = numParticles * numParticles;
	console.log('Total Particles : ', totalParticles);
	var ux, uy;
	var range = 200.0;

	for(var j=0; j<numParticles; j++) {
		for(var i=0; i<numParticles; i++) {
			var x = random(-range, range);
			var y = random(-100, -750);
			var z = random(-range, range);

			positions.push([x, y, z]);

			ux = i/numParticles-1.0 + .5/numParticles;
			uy = j/numParticles-1.0 + .5/numParticles;
			coords.push([ux, uy]);
			indices.push(count);
			count ++;

			positions.push([Math.random(), Math.random(), Math.random()]);

			coords.push([ux+1.0, uy+1.0]);
			indices.push(count);
			count ++;

		}
	}


	// this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.POINTS);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function() {
	this.shader.bind();
	GL.draw(this.mesh);
};

module.exports = ViewSave;
},{}],28:[function(require,module,exports){
// ViewSimulation.js

var GL = bongiovi.GL;
var gl;


function ViewSimulation() {
	this._count = Math.random() * 0xFF;
	bongiovi.View.call(this, null, "#define GLSLIFY 1\n// sim1.frag\n\n#define SHADER_NAME SIMPLE_TEXTURE\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform float time;\nuniform float skipCount;\n\nconst float PI = 3.141592657;\n\nvec4 permute(vec4 x) { return mod(((x*34.00)+1.00)*x, 289.00); }\nvec4 taylorInvSqrt(vec4 r) { return 1.79 - 0.85 * r; }\n\nfloat snoise(vec3 v){\n\tconst vec2 C = vec2(1.00/6.00, 1.00/3.00) ;\n\tconst vec4 D = vec4(0.00, 0.50, 1.00, 2.00);\n\t\n\tvec3 i = floor(v + dot(v, C.yyy) );\n\tvec3 x0 = v - i + dot(i, C.xxx) ;\n\t\n\tvec3 g = step(x0.yzx, x0.xyz);\n\tvec3 l = 1.00 - g;\n\tvec3 i1 = min( g.xyz, l.zxy );\n\tvec3 i2 = max( g.xyz, l.zxy );\n\t\n\tvec3 x1 = x0 - i1 + 1.00 * C.xxx;\n\tvec3 x2 = x0 - i2 + 2.00 * C.xxx;\n\tvec3 x3 = x0 - 1. + 3.00 * C.xxx;\n\t\n\ti = mod(i, 289.00 );\n\tvec4 p = permute( permute( permute( i.z + vec4(0.00, i1.z, i2.z, 1.00 )) + i.y + vec4(0.00, i1.y, i2.y, 1.00 )) + i.x + vec4(0.00, i1.x, i2.x, 1.00 ));\n\t\n\tfloat n_ = 1.00/7.00;\n\tvec3 ns = n_ * D.wyz - D.xzx;\n\t\n\tvec4 j = p - 49.00 * floor(p * ns.z *ns.z);\n\t\n\tvec4 x_ = floor(j * ns.z);\n\tvec4 y_ = floor(j - 7.00 * x_ );\n\t\n\tvec4 x = x_ *ns.x + ns.yyyy;\n\tvec4 y = y_ *ns.x + ns.yyyy;\n\tvec4 h = 1.00 - abs(x) - abs(y);\n\t\n\tvec4 b0 = vec4( x.xy, y.xy );\n\tvec4 b1 = vec4( x.zw, y.zw );\n\t\n\tvec4 s0 = floor(b0)*2.00 + 1.00;\n\tvec4 s1 = floor(b1)*2.00 + 1.00;\n\tvec4 sh = -step(h, vec4(0.00));\n\t\n\tvec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n\tvec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\t\n\tvec3 p0 = vec3(a0.xy,h.x);\n\tvec3 p1 = vec3(a0.zw,h.y);\n\tvec3 p2 = vec3(a1.xy,h.z);\n\tvec3 p3 = vec3(a1.zw,h.w);\n\t\n\tvec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n\tp0 *= norm.x;\n\tp1 *= norm.y;\n\tp2 *= norm.z;\n\tp3 *= norm.w;\n\t\n\tvec4 m = max(0.60 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.00);\n\tm = m * m;\n\treturn 42.00 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );\n}\n\nfloat snoise(float x, float y, float z){\n\treturn snoise(vec3(x, y, z));\n}\n\nfloat rand(vec2 co){\n    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);\n}\n\n\nconst float maxHeight = 1000.0;\n\nvoid main(void) {\n\tif(vTextureCoord.y < .5) {\n\t\tif(vTextureCoord.x < .5) {\n\t\t\tvec2 uvVel = vTextureCoord + vec2(.5, .0);\n\t\t\tvec3 pos = texture2D(texture, vTextureCoord).xyz;\n\t\t\tvec3 vel = texture2D(texture, uvVel).xyz;\n\t\t\tpos += vel;\n\t\t\tif(pos.y > maxHeight) {\n\t\t\t\t// pos.y = -rand(vec2(time,vTextureCoord.x+vTextureCoord.y)) * 100.0;\n\t\t\t\tpos.y = -100.0;\n\t\t\t\tconst float radius = 400.0;\n\t\t\t\tpos.x = (rand(vTextureCoord*time)-.5) * radius;\n\t\t\t\tpos.z = (rand(vTextureCoord.yx*time)-.5) * radius;\n\t\t\t}\n\t\t\tgl_FragColor = vec4(pos, 1.0);\n\t\t} else {\n\t\t\tvec2 uvPos   = vTextureCoord + vec2(-.5, .0);\n\t\t\tvec2 uvExtra = vTextureCoord + vec2(0.0, 0.5);\n\t\t\tvec3 pos     = texture2D(texture, uvPos).xyz;\n\t\t\tvec3 vel     = texture2D(texture, vTextureCoord).xyz;\n\t\t\tvec3 extra   = texture2D(texture, uvExtra).xyz;\n\n\t\t\tfloat posOffset = .003 + mix(extra.x, 1.0, .5) * .002;\n\t\t\tfloat decreaseRate = .95;\n\t\t\tfloat speed = .1;\n\n\t\t\tfloat ax = snoise(pos.xyz * posOffset + time) * speed;\n\t\t\tfloat ay = (snoise(pos.yzx * posOffset + time)*.5+.5) * speed;\n\t\t\tfloat az = snoise(pos.zxy * posOffset + time) * speed;\n\n\t\t\tvel += vec3(ax, ay, az) * skipCount;\n\t\t\tvel *= decreaseRate;\n\n\t\t\tgl_FragColor = vec4(vel, 1.0);\n\t\t}\n\t} else {\n\t\tgl_FragColor = texture2D(texture, vTextureCoord);\n\t}\n    // gl_FragColor = texture2D(texture, vTextureCoord);\n}");
}

var p = ViewSimulation.prototype = new bongiovi.View();
p.constructor = ViewSimulation;


p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture) {
	if(!this.shader.isReady() ) return;

	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("time", "uniform1f", this._count);
	this.shader.uniform("skipCount", "uniform1f", params.skipCount);
	texture.bind(0);
	GL.draw(this.mesh);

	this._count += .01;
};

module.exports = ViewSimulation;
},{}],29:[function(require,module,exports){
// SubsceneTerrain.js
var GL = bongiovi.GL, gl;

var ViewTerrain = require("./ViewTerrain");
var ViewNoise = require("./ViewNoise");
var ViewNormal = require("./ViewNormal");
var ViewNightSky = require("./ViewNightSky");

function SubsceneTerrain(scene) {
	gl                 = GL.gl;
	this.scene         = scene;
	this.camera        = scene.camera;
	this.cameraOtho    = scene.cameraOtho;
	this.rotationFront = scene.rotationFront;

	window.addEventListener("resize", this.resize.bind(this));

	this._initTextures();
	this._initViews();
	this.resize();
}


var p = SubsceneTerrain.prototype;


p._initTextures = function() {
	this._textureNoise        = new bongiovi.GLTexture(images.noise);
	this._textureDetailHeight = new bongiovi.GLTexture(images.detailHeight);
	this._textureStars		  = new bongiovi.GLTexture(images.starsmap);

	var noiseSize             = 512;
	this._fboNoise            = new bongiovi.FrameBuffer(noiseSize, noiseSize);
	this._fboNormal           = new bongiovi.FrameBuffer(noiseSize, noiseSize);
};


p._initViews = function() {
	this._vCopy 	 = new bongiovi.ViewCopy();
	this._vTerrain   = new ViewTerrain();
	this._vNoise     = new ViewNoise(params.terrain.noise);
	this._vNormal    = new ViewNormal(params.terrain.terrainNoiseHeight/300*3.0);
	this._vSky 		 = new ViewNightSky();


	GL.setMatrices(this.cameraOtho);
	GL.rotate(this.rotationFront);

	this._fboNoise.bind();
	GL.clear();
	GL.setViewport(0, 0, this._fboNoise.width, this._fboNoise.height);
	this._vNoise.setNoise(params.terrain.noise);
	this._vNoise.render(this._textureDetailHeight);
	this._fboNoise.unbind();

	this._fboNormal.bind();
	GL.clear();
	this._vNormal.render(this._fboNoise.getTexture());
	this._fboNormal.unbind();
};


p.render = function(textureEnv) {
	// GL.setMatrices(this.cameraOtho);
	// GL.rotate(this.rotationFront);

	// this._vCopy.render(this._fboNoise.getTexture());
	GL.enableAdditiveBlending();
	this._vSky.render(this._textureStars);
	GL.enableAlphaBlending();

	// return;
	var numTiles = 2;
	var size = 3000;
	for(var j=0; j<numTiles; j++) {
		for(var i=0; i<numTiles; i++) {
			var uvOffset = [i/numTiles, j/numTiles];
			this._vTerrain.render(this._fboNoise.getTexture(), numTiles, size, uvOffset, this._fboNormal.getTexture(), this._textureNoise, this.camera, textureEnv);
		}
	}

	
};


p.resize = function(e) {
	
};


module.exports = SubsceneTerrain;
},{"./ViewNightSky":30,"./ViewNoise":31,"./ViewNormal":32,"./ViewTerrain":33}],30:[function(require,module,exports){
// ViewNightSky.js
var GL = bongiovi.GL;
var gl;
var glm = bongiovi.glm;


function ViewNightSky() {
	this.angle = 0;
	this._axis = glm.vec3.clone([0.9170600771903992, 0.39874908328056335, 0]);
	bongiovi.View.call(this, "#define GLSLIFY 1\n// nightsky.vert\n\n#define SHADER_NAME VERTEX_NIGHTSKY\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform vec3 axis;\nuniform float angle;\nuniform float near;\nuniform float far;\n\nvarying vec2 vTextureCoord;\nvarying float vDepth;\n\nfloat getDepth(float z, float n, float f) {\n\treturn (2.0 * n) / (f + n - z*(f-n));\n}\n\nvec4 quat_from_axis_angle(vec3 axis, float angle) { \n\tvec4 qr;\n\tfloat half_angle = (angle * 0.5) * 3.14159 / 180.0;\n\tqr.x = axis.x * sin(half_angle);\n\tqr.y = axis.y * sin(half_angle);\n\tqr.z = axis.z * sin(half_angle);\n\tqr.w = cos(half_angle);\n\treturn qr;\n}\n\nvec3 rotate_vertex_position(vec3 position, vec3 axis, float angle) { \n\tvec4 q = quat_from_axis_angle(axis, angle);\n\tvec3 v = position.xyz;\n\treturn v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v);\n}\n\nvoid main(void) {\n\tvec3 pos = rotate_vertex_position(aVertexPosition, axis, angle);\n\tvec4 V = uPMatrix * (uMVMatrix * vec4(pos, 1.0));\n    gl_Position = V;\n    vTextureCoord = aTextureCoord;\n\n    float d       = getDepth(V.z/V.w, near, far);\n\tvDepth        = d;\n}", "#define GLSLIFY 1\n// nightsky.frag\n\nprecision mediump float;\n\nuniform sampler2D texture;\nvarying vec2 vTextureCoord;\nvarying float vDepth;\n\nconst vec3 FOG_COLOR = vec3(0.0)/255.0;\n\nvoid main(void) {\n\tvec4 color = texture2D(texture, vTextureCoord);\n\n    gl_FragColor = color;\n    // gl_FragColor.rgb = mix(gl_FragColor.rgb, FOG_COLOR, vDepth);\n}");
}

var p = ViewNightSky.prototype = new bongiovi.View();
p.constructor = ViewNightSky;


p._init = function() {
	gl = GL.gl;
	// this.mesh = bongiovi.MeshUtils.createSphere(1800, 24);
	var numSegments = 24;
	var size = 1500;

	var positions = [];
	var coords    = [];
	var indices   = [];
	var index     = 0;
	var gapUV     = 1/numSegments;

	var getPosition = function(i, j, isNormal) {	//	rx : -90 ~ 90 , ry : 0 ~ 360
		isNormal = isNormal === undefined ? false : isNormal;
		var rx = i/numSegments * Math.PI - Math.PI * 0.5;
		var ry = j/numSegments * Math.PI * 2;
		var r = isNormal ? 1 : size;
		var pos = [];
		pos[1] = Math.sin(rx) * r;
		var t = Math.cos(rx) * r;
		pos[0] = Math.cos(ry) * t;
		pos[2] = Math.sin(ry) * t;
		return pos;
	};

	
	for(var i=0; i<numSegments; i++) {
		for(var j=0; j<numSegments; j++) {
			positions.push(getPosition(i, j));
			positions.push(getPosition(i+1, j));
			positions.push(getPosition(i+1, j+1));
			positions.push(getPosition(i, j+1));
			var u = j/numSegments;
			var v = i/numSegments;
			
			
			coords.push([1.0 - u, v]);
			coords.push([1.0 - u, v+gapUV]);
			coords.push([1.0 - u - gapUV, v+gapUV]);
			coords.push([1.0 - u - gapUV, v]);

			indices.push(index*4 + 3);
			indices.push(index*4 + 2);
			indices.push(index*4 + 0);
			indices.push(index*4 + 2);
			indices.push(index*4 + 1);
			indices.push(index*4 + 0);

			index++;
		}
	}


	var mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	mesh.bufferVertex(positions);
	mesh.bufferTexCoords(coords);
	mesh.bufferIndices(indices);
	this.mesh = mesh;
};

p.render = function(texture) {
	this.angle += .02;
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("axis", "uniform3fv", this._axis);
	this.shader.uniform("angle", "uniform1f", this.angle);
	this.shader.uniform("near", "uniform1f", GL.camera.near);
	this.shader.uniform("far", "uniform1f", GL.camera.far);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewNightSky;
},{}],31:[function(require,module,exports){
// ViewNoise.js

var GL = bongiovi.GL;
var gl;


function ViewNoise(mNoise) {
	this._noise = mNoise == undefined ? 1.0 : mNoise;
	bongiovi.View.call(this, null, "#define GLSLIFY 1\n#define SHADER_NAME FRAGMENT_NOISE\n\nprecision highp float;\nvarying vec2 vTextureCoord;\n\nfloat map(float value, float sx, float sy, float tx, float ty) {\n\tfloat p = (value - sx) / ( sy - sx);\n\treturn tx + p * ( ty - tx);\n}\n\n\nfloat hash( vec2 p ) {\n\tfloat h = dot(p,vec2(127.1,311.7)); \n\treturn fract(sin(h)*43758.5453123);\n}\n\nfloat noise( in vec2 p ) {\n\tvec2 i = floor( p );\n\tvec2 f = fract( p );    \n\tvec2 u = f*f*(3.0-2.0*f);\n\treturn -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ), \n\t\t\t\t\t hash( i + vec2(1.0,0.0) ), u.x),\n\t\t\t\tmix( hash( i + vec2(0.0,1.0) ), \n\t\t\t\t\t hash( i + vec2(1.0,1.0) ), u.x), u.y);\n}\n\nconst float RX = 1.6;\nconst float RY = 1.2;\nconst mat2 rotation = mat2(RX,RY,-RY,RX);\nconst int NUM_ITER = 10;\nconst float PI = 3.141592657;\nuniform float time;\nuniform\tfloat noiseOffset;\nuniform\tfloat detailMapScale;\nuniform\tfloat detailMapHeight;\nuniform\tfloat noiseScale;\nuniform sampler2D texture;\n\n\nfloat contrast(float mValue, float mScale, float mMidPoint) {\n\treturn clamp( (mValue - mMidPoint) * mScale + mMidPoint, 0.0, 1.0);\n}\n\nfloat contrast(float mValue, float mScale) {\n\treturn contrast(mValue,  mScale, .5);\n}\n\nvec2 contrast(vec2 mValue, float scale) {\n\treturn vec2(contrast(mValue.x, scale), contrast(mValue.y, scale));\n}\n\n\nmat2 rotate(in float theta) {\n\tfloat c = cos(theta);\n\tfloat s = sin(theta);\n\treturn mat2(c, s, -s, c);\n}\n\nvoid main(void) {   \n\tfloat offset = 5.000;\n\tvec2 uv      = vec2(.5) + rotate(time) * (vTextureCoord - vec2(.5)) + sin(time+cos(time)) * .01;\n\tvec3 detail  = texture2D(texture, vTextureCoord * detailMapScale).rgb * detailMapHeight;\n\tfloat grey = 0.0;\n\n\tfloat scale = noiseScale;\n\tfor(int i=0; i<NUM_ITER; i++) {\n\t\tgrey += noise(uv*offset) * scale;\n\t\toffset *= 1.5 * noiseOffset;\n\t\tscale *= 0.6 * noiseOffset;\n\t\tuv *= rotation;\n\t}\n\n\tvec2 hillPos = vec2(.45, .35);\n\tfloat d = distance(vTextureCoord, hillPos);\n\tconst float hillRadius = .15;\n\tif(d < hillRadius) {\n\t\tfloat hill = 1.0 - d/hillRadius;\n\t\thill = sin(hill * PI * .5);\n\t\thill = pow(hill, 2.0);\n\t\tgrey += hill * 0.7;\n\t}\n\n\tfloat p = sin(vTextureCoord.x * PI) * sin(vTextureCoord.y * PI);\n\tp = pow(p, 1.5);\n\tgrey = mix(grey, -p, .25);\n\n\tgl_FragColor = vec4(vec3(grey)+detail*p, 1.0);\n}");
	this._time = Math.random() * 0xFF;
	gl = GL.gl;
}

var p = ViewNoise.prototype = new bongiovi.View();
p.constructor = ViewNoise;

p._onShaderUpdate = function(shader) {
	this.shader.attachShaderProgram();
};

p._init = function() {
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.setNoise = function(mNoise) {
	this._noise = mNoise;
};

p.render = function(texture) {
	this._time += .001;
	this.shader.bind();
	this.shader.uniform("noiseOffset", "uniform1f", this._noise);
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("time", "uniform1f", this._time);
	this.shader.uniform("detailMapScale", "uniform1f", params.terrain.detailMapScale);
	this.shader.uniform("detailMapHeight", "uniform1f", params.terrain.detailMapHeight);
	this.shader.uniform("noiseScale", "uniform1f", params.terrain.noiseScale);

	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewNoise;
},{}],32:[function(require,module,exports){
// ViewNormal.js

var GL = bongiovi.GL;
var gl;


function ViewNormal(mScale) {
	this._scale = mScale === undefined ? 1.0 : mScale;
	bongiovi.View.call(this, null, "#define GLSLIFY 1\n#define SHADER_NAME NORMAL_FRAGMENT\n\nprecision highp float;\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform float scale;\n\nvec3 getPos(vec2 uv) {\n    vec3 pos = vec3(.0);\n\tpos.y = texture2D(texture, uv).r * scale;\n    pos.xz = uv;\n    \n    return pos;\n}\n\nvoid main(void) {\n    const float gap = .01;\n    vec2 uvRight = vTextureCoord + vec2(gap, .0);\n    vec2 uvBottom = vTextureCoord + vec2(0.0, gap);\n    \n    vec3 posCurr = getPos(vTextureCoord);\n    vec3 posRight = getPos(uvRight);\n    vec3 posBottom = getPos(uvBottom);\n    \n    vec3 vRight = posRight - posCurr;\n    vec3 vBottom = posBottom - posCurr;\n    \n    // vec3 normal = normalize(cross(vRight, vBottom));\n    vec3 normal = normalize(cross(vBottom, vRight));\n    // normal = (normal + 1.0) * .5;\n    // normal.g *= 0.;\n    \n    gl_FragColor = vec4(normal, 1.0);\n}\n");
}

var p = ViewNormal.prototype = new bongiovi.View();
p.constructor = ViewNormal;


p._init = function() {
	gl = GL.gl;
	this.mesh = bongiovi.MeshUtils.createPlane(2, 2, 1);
};

p.render = function(texture) {
	this.shader.bind();
	this.shader.uniform("texture", "uniform1i", 0);
	this.shader.uniform("scale", "uniform1f", this._scale);
	texture.bind(0);
	GL.draw(this.mesh);
};

module.exports = ViewNormal;
},{}],33:[function(require,module,exports){
// ViewTerrain.js

var GL = bongiovi.GL;
var gl;


function ViewTerrain() {
	bongiovi.View.call(this, "#define GLSLIFY 1\n#define SHADER_NAME BASIC_VERTEX\n\nprecision highp float;\nattribute vec3 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat4 uMVMatrix;\nuniform mat4 uPMatrix;\nuniform vec2 uvOffset;\nuniform float numTiles;\nuniform float size;\nuniform float height;\nuniform float near;\nuniform float far;\nuniform sampler2D texture;\n\nvarying float vDepth;\nvarying vec2 vTextureCoord;\nvarying vec3 vEye;\nvarying vec3 vVertex;\n\nfloat getDepth(float z, float n, float f) {\n\treturn (2.0 * n) / (f + n - z*(f-n));\n}\n\n\nvec3 getPosition(vec2 uv) {\n\tvec3 pos = vec3(0.0, 0.0, 0.0);\n\tpos.x = -size/2.0 + uv.x * size;\n\tpos.z = size/2.0 - uv.y * size;\n\n\tfloat h = texture2D(texture, uv).r * height;\n\tpos.y += h;\n\n\treturn pos;\n}\n\n\nfloat map(float value, float sx, float sy, float tx, float ty) {\n\tfloat p = (value - sx) / ( sy - sx);\n\tp = clamp(p, 0.0, 1.0);\n\treturn tx + p * ( ty-tx );\n}\n\n\nvoid main(void) {\n\tvec2 uv       = aTextureCoord / numTiles + uvOffset;\n\tvec3 pos      = getPosition(uv);\n\tpos.y \t\t  += aVertexPosition.y - 0.0;\n\n\tvec4 mvPosition = uMVMatrix * vec4(pos, 1.0);\n\tvec4 V        = uPMatrix * mvPosition;\n\tgl_Position   = V;\n\t\n\n\tfloat d       = getDepth(V.z/V.w, near, far);\n\tvDepth        = d;\n\tvTextureCoord = uv;\n\tvEye \t\t  = normalize(mvPosition.xyz);\n\tvVertex \t  = pos;\n}", "#define GLSLIFY 1\n// terrain.frag\n\nprecision highp float;\n\nuniform sampler2D textureNormal;\nuniform sampler2D textureNoise;\nuniform sampler2D textureEnv;\nuniform vec3 lightColor;\nuniform vec3 lightDir;\nuniform float bumpOffset;\nuniform float albedo;\nuniform float roughness;\nuniform float ambient;\nuniform float shininess;\nuniform float gamma;\nuniform mat3 normalMatrix;\nuniform vec3 cameraPos;\n\nvarying vec2 vTextureCoord;\nvarying float vDepth;\nvarying vec3 vEye;\nvarying vec3 vVertex;\n\nconst vec3 FOG_COLOR = vec3(243.0, 230.0, 214.0)/255.0;\nconst vec3 FLOOR_COLOR = vec3(230.0, 227.0, 222.0)/255.0;\n\n\nconst float PI = 3.151592657;\nconst float TwoPI = PI * 2.0;\n\nfloat orenNayarDiffuse(vec3 lightDirection,\tvec3 viewDirection,\tvec3 surfaceNormal, float roughness, float albedo) {\n\n\tfloat LdotV = dot(lightDirection, viewDirection);\n\tfloat NdotL = dot(lightDirection, surfaceNormal);\n\tfloat NdotV = dot(surfaceNormal, viewDirection);\n\n\tfloat s = LdotV - NdotL * NdotV;\n\tfloat t = mix(1.0, max(NdotL, NdotV), step(0.0, s));\n\n\tfloat sigma2 = roughness * roughness;\n\tfloat A = 1.0 + sigma2 * (albedo / (sigma2 + 0.13) + 0.5 / (sigma2 + 0.33));\n\tfloat B = 0.45 * sigma2 / (sigma2 + 0.09);\n\n\treturn albedo * max(0.0, NdotL) * (A + B * s / t) / PI;\n\n}\n\n\nfloat gaussianSpecular(vec3 lightDirection, vec3 viewDirection, vec3 surfaceNormal, float shininess) {\n\n\tvec3 H = normalize(lightDirection + viewDirection);\n\tfloat theta = acos(dot(H, surfaceNormal));\n\tfloat w = theta / shininess;\n\treturn exp(-w*w);\n\n}\n\nvec2 envMapEquirect(vec3 wcNormal, float flipEnvMap) {\n  //I assume envMap texture has been flipped the WebGL way (pixel 0,0 is a the bottom)\n  //therefore we flip wcNorma.y as acos(1) = 0\n  float phi = acos(-wcNormal.y);\n  float theta = atan(flipEnvMap * wcNormal.x, wcNormal.z) + PI;\n  return vec2(theta / TwoPI, phi / PI);\n}\n\nvec2 envMapEquirect(vec3 wcNormal) {\n    //-1.0 for left handed coordinate system oriented texture (usual case)\n    return envMapEquirect(wcNormal, -1.0);\n}\n\n\n\nvoid main(void) {\n\tgl_FragColor = vec4(FLOOR_COLOR, 1.0);\n\n\t//\tGET NORMAL\n\tvec3 N       = texture2D(textureNormal, vTextureCoord).rgb;\n\tN            += (texture2D(textureNoise, vTextureCoord*15.0).rgb - vec3(.5))* bumpOffset;\n\tN            = normalize(N);\n\n\t//\tGET LIGHT\n\tvec3 L = normalize(lightDir);\n\n\n\t//\tDIFFUSE\n\tfloat diffuse = orenNayarDiffuse(L, vEye, N, roughness, albedo);\n\n\t//\tSPECULAR\n\tfloat specular = gaussianSpecular(L, vEye, N, shininess) * .25;\n\n\t//\tENV LIGHT\n\tvec2 uvEnv = envMapEquirect(N);\n\tvec3 colorEnv = texture2D(textureEnv, uvEnv).rgb;\n\n\n\tgl_FragColor.rgb = ambient + lightColor/255.0 * (diffuse + specular);\n\n\n\tgl_FragColor.rgb += colorEnv*.3;\n\tgl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0 / gamma));\n\tgl_FragColor.rgb = mix(gl_FragColor.rgb, FOG_COLOR, vDepth);\n\n\n\t// float maxRange = 1100.0;\n\t// float range = 300.0;\n\t// float d = length(vVertex);\n\t// float a = smoothstep(maxRange-range, maxRange, d);\n\t// gl_FragColor *= (1.0 - a);\n\t// gl_FragColor.rgb = vec3(vDepth);\n}");
}

var p = ViewTerrain.prototype = new bongiovi.View();
p.constructor = ViewTerrain;


p._init = function() {
	gl = GL.gl;
	var positions = [];
	var coords = [];
	var indices = []; 
	var count = 0;
	var num = 20;
	var size = 200, uvGap = 1/num;

	function getPosition(i, j) {
		var pos = [0, -150, 0]
		pos[0] = -size/2 + size * i/num;
		pos[2] = size/2 - size * j/num;

		return pos;
	}

	for(var j=0; j<num; j++) {
		for(var i=0; i<num; i++) {
			positions.push(getPosition(i, j));
			positions.push(getPosition(i+1, j));
			positions.push(getPosition(i+1, j+1));
			positions.push(getPosition(i, j+1));

			coords.push([i/num, j/num]);
			coords.push([i/num+uvGap, j/num]);
			coords.push([i/num+uvGap, j/num+uvGap]);
			coords.push([i/num, j/num+uvGap]);

			indices.push(count*4 + 0);
			indices.push(count*4 + 1);
			indices.push(count*4 + 2);
			indices.push(count*4 + 0);
			indices.push(count*4 + 2);
			indices.push(count*4 + 3);

			count ++;
		}
	}


	this.mesh = new bongiovi.Mesh(positions.length, indices.length, GL.gl.TRIANGLES);
	this.mesh.bufferVertex(positions);
	this.mesh.bufferTexCoords(coords);
	this.mesh.bufferIndices(indices);
};

p.render = function(texture, numTiles, size, uvOffset, textureNormal, textureNoise, camera, textureEnv) {
	this.shader.bind();

	this.shader.uniform("size", "uniform1f", size);
	this.shader.uniform("numTiles", "uniform1f", numTiles);
	this.shader.uniform("height", "uniform1f", params.terrain.terrainNoiseHeight);
	this.shader.uniform("uvOffset", "uniform2fv", uvOffset);
	this.shader.uniform("bumpOffset", "uniform1f", params.terrain.bump);
	this.shader.uniform("roughness", "uniform1f", params.terrain.roughness);
	this.shader.uniform("albedo", "uniform1f", params.terrain.albedo);
	this.shader.uniform("ambient", "uniform1f", params.terrain.ambient);
	this.shader.uniform("gamma", "uniform1f", params.post.gamma);
	this.shader.uniform("shininess", "uniform1f", params.terrain.shininess);
	this.shader.uniform("lightDir", "uniform3fv", params.terrain.lightPos);
	this.shader.uniform("lightColor", "uniform3fv", params.terrain.lightColor);
	this.shader.uniform("cameraPos", "uniform3fv", camera.position);
	this.shader.uniform("texture", "uniform1i", 0);
	texture.bind(0);
	this.shader.uniform("textureNormal", "uniform1i", 1);
	textureNormal.bind(1);
	this.shader.uniform("textureNoise", "uniform1i", 2);
	textureNoise.bind(2);
	this.shader.uniform("textureEnv", "uniform1i", 3);
	textureEnv.bind(3);
	if(camera) {
		this.shader.uniform("near", "uniform1f", camera.near);
		this.shader.uniform("far", "uniform1f", camera.far);
	}
	GL.draw(this.mesh);
};

module.exports = ViewTerrain;
},{}]},{},[22]);
