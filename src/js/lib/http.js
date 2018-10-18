
import Fatch from './fetch.js';

const promiseAjax = {
    get(url) {
        const promise$Ajax = new Promise((resolve, reject) => {
            $.get({
                url,
                timeout: 60000,
                success: (data) => {
                    resolve(data);
                },
                complete: (XMLHttpRequest, status) => { // 请求完成后最终执行参数
                    if (status === 'timeout') {
                        promise$Ajax.abort();
                        // showMessage
                    }
                },
                error: (e) => {
                    reject(e);
                }
            });
        });
        return promise$Ajax;
    },
    post(url, options) {
        const promise$Ajax = new Promise((resolve, reject) => {
            $.post({
                url,
                timeout: 60000,
                data: JSON.stringify(options),
                contentType: 'application/json;charset=utf-8',
                dataType: 'json',
                success: (data) => {
                    resolve(data);
                },
                complete: (XMLHttpRequest, status) => { // 请求完成后最终执行参数
                    if (status === 'timeout') {
                        promise$Ajax.abort();
                        // showMessage
                    }
                },
                error: (e) => {
                    reject(e);
                }
            });
        });
        return promise$Ajax;
    }
};

export const http = (url, type, options) => {
    type = String(type).toLocaleLowerCase();

    if (window.fetch) {
        return new Fatch()[type](url, options);
    }
    return promiseAjax[type](url, options);
};
