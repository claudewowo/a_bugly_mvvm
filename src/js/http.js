import { showMessage } from 'js/common';
import { getUrlParams, getCookie, setCookie, generateUUID } from 'js/utils';

import Fatch from './fetch.js';

const token = getUrlParams('token');
function getSecurityId() {
    let sid = getCookie(`token${token}`);
    if (!sid) {
        sid = generateUUID();
        setCookie(`token${token}`, sid, 2 / 24);
    }
    return sid;
}

const sid = getSecurityId();

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
                        showMessage(window.$t('message.netWorkErr'));
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
                        showMessage(window.$t('message.netWorkErr'));
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
    options.sid = sid;
    options.token = token;
    if (window.fetch) {
        return new Fatch()[type](url, options);
    }
    return promiseAjax[type](url, options);
};
