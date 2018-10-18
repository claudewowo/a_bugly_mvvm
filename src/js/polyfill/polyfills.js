/* eslint-disable */

//  regenerator-runtime
import 'regenerator-runtime/runtime';

// 垫片
import './shim';

// 正则表达式 1kb
import 'core-js/fn/regexp/escape';

// 避免反复执行
if (global.$babelPolyfill) {
    throw new Error('only one instance of babel-polyfill is allowed');
}
global.$babelPolyfill = true;

// 定义api
const DEFINE_PROPERTY = 'defineProperty';
function define(O, key, value) {
    if (!O[key]) {
        Object[DEFINE_PROPERTY](O, key, {
            writable: true,
            configurable: true,
            value
        });
    }
}

//
// define(String.prototype, 'padLeft', ''.padStart);
// define(String.prototype, 'padRight', ''.padEnd);

"pop,reverse,shift,keys,values,entries,indexOf,every,some,forEach,map,filter,find,findIndex,includes,join,slice,concat,push,splice,unshift,sort,lastIndexOf,reduce,reduceRight,copyWithin,fill".split(",").forEach(function (key) {
    [][key] && define(Array, key, Function.call.bind([][key]));
});

import './storage';
