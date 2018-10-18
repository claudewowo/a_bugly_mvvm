/**
 * Created by Liu.Jun on 2018/3/13.
 */

// 兼容ios 隐私模式
function createStorage() {
    let cacheStorage = {};
    return {
        getItem(key) {
            return cacheStorage[key] || null; // 标准浏览器api 返回null
        },
        clear() {
            cacheStorage = {};
        },
        setItem(key, value) {
            cacheStorage[key] = value;
        },
        removeItem(key) {
            delete cacheStorage[key];
        },
        valueOf() {
            return cacheStorage;
        }
    };
}

function isLocalStorageSupported() {
    const testKey = 'test';
    const storage = window.localStorage;
    if (!storage) { // 兼容 webview 没有开启 localStorage
        Object.defineProperty(window, 'localStorage', {
            configurable: true,
            writable: true,
            value: {}
        });
    }

    try {
        storage.setItem(testKey, 'testValue');
        storage.removeItem(testKey);
        return true;
    } catch (error) {
        return false;
    }
}

if (!isLocalStorageSupported()) {
    ['localStorage', 'sessionStorage'].forEach(item => Object.assign(window[item], createStorage(item)));
}
