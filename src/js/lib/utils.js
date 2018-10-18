
// 添加class
function addClass(obj, cls) {
    if (hasClass(obj, cls)) {
        return;
    }
    const elClassName = obj.className; // 获取 class 内容.
    const blank = (elClassName !== '') ? ' ' : ''; // 判断获取到的 class 是否为空, 如果不为空在前面加个'空格'.
    const added = elClassName + blank + cls; // 组合原来的 class 和需要添加的 class.
    obj.className = added; // 替换原来的 class.
}

// 移除class
function removeClass(obj, cls) {
    let elClassName = ` ${obj.className} `; // 获取 class 内容, 并在首尾各加个空格. ex) 'abc  bcd' -> ' abc  bcd '
    elClassName = elClassName.replace(/(\s+)/gi, ' ');// 将多余的空字符替换成空格. ex) ' abc  bcd ' -> ' abc bcd '
    let removed = elClassName.replace(` ${cls} `, ' ');// 在原来的 class 替换掉首尾加了空格的 class. ex) ' abc bcd ' -> 'bcd '
    removed = removed.replace(/(^\s+)|(\s+$)/g, '');// 去掉首尾空格. ex) 'bcd ' -> 'bcd'
    obj.className = removed;// 替换原来的 class.
}

function hasClass(obj, cls) {
    const elClassName = obj.className; // 获取 class 内容.
    const elClassNameList = elClassName.split(/\s+/); // 通过split空字符将cls转换成数组.
    let i = 0;
    for (i in elClassNameList) {
        if (elClassNameList[i] === cls) { // 循环数组, 判断是否包含cls
            return true;
        }
    }
    return false;
}

// 查找最近的父级
function closest(el, selector) {
    if (!el) return;
    const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
    while (el) {
        if (matchesSelector.call(el, selector)) {
            break;
        }
        el = el.parentElement;
    }
    return el; // eslint-disable-line
}

function getUrlParams(name) {
    const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    const r = window.location.search.substr(1).match(reg);
    if (r != null) return decodeURI(r[2]);
    return null;
}

function setCookie(name, value) {
    const Days = 30;
    const exp = new Date();
    exp.setTime(exp.getTime() + (Days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${escape(value)};expires=${exp.toGMTString()}`;
}

function getCookie(name) {
    let arr;
    const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
    if (arr = document.cookie.match(reg)) {
        return unescape(arr[2]);
    }
    return null;

}

function throttle(fn, delay, isDebounce) {
    let timer;
    let lastCall = 0;
    return (...args) => {
        if (isDebounce) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(() => {
                fn(...args);
            }, delay);
        } else {
            const now = new Date().getTime();
            if (now - lastCall < delay) return;
            lastCall = now;
            fn(...args);
        }
    };
}

function generateUUID() {
    let d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-0xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (d + Math.random() * 16) % 16 | 0; // eslint-disable-line
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16); // eslint-disable-line
    });
    return uuid;
}
// 获取浏览器版本
function getBrowserNameAndVersion() {
    const agent = navigator.userAgent.toLowerCase();
    const regStrIE = /msie [\d.]+/gi;
    const regStrIEregStrFF = /firefox\/[\d.]+/gi;
    const regStrChrome = /chrome\/[\d.]+/gi;
    const regStrSafari = /safari\/[\d.]+/gi;
    let browserNV = '';
    // IE
    if (agent.indexOf('msie') > 0) {
        browserNV = agent.match(regStrIE);
    }
    // firefox
    if (agent.indexOf('firefox') > 0) {
        browserNV = agent.match(regStrIEregStrFF);
    }
    // Chrome
    if (agent.indexOf('chrome') > 0) {
        browserNV = agent.match(regStrChrome);
    }
    // Safari
    if (agent.indexOf('safari') > 0 && agent.indexOf('chrome') < 0) {
        browserNV = agent.match(regStrSafari);
    }
    browserNV = browserNV.toString();
    // other
    if (browserNV === '') {
        browserNV = 'Is not a standard browser';
    }
    // Here does not display "/"
    if (browserNV.indexOf('firefox') !== -1 || browserNV.indexOf('chrome') !== -1) {
        browserNV = browserNV.replace('/', '');
    }
    // Here does not display space
    if (browserNV.indexOf('msie') !== -1) {
    // msie replace IE & trim space
        browserNV = browserNV.replace('msie', 'ie').replace(/\s/g, '');
    }
    // return eg:ie9.0 firefox34.0 chrome37.0
    return browserNV;

}
function getDeviceType() {
    const u = window.navigator.userAgent;
    const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
    const isIos = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    return isAndroid ? 'android' : isIos ? 'ios' : 'other';
}

export {
    addClass,
    getUrlParams,
    removeClass,
    hasClass,
    closest,
    getCookie,
    setCookie,
    throttle,
    generateUUID,
    getBrowserNameAndVersion,
    getDeviceType,
};
