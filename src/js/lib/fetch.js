// 封装 fetch
class Fetch {
    constructor() {
        this.timeout = 60000; // 默认超时60s
        this.timer = null;
    }
    fetch(fetch) {
        return Promise.race([
            fetch,
            new Promise((resolve, reject) => {
                this.timer = setTimeout(() => {
                    reject(new Error('request timeout'));
                    // showMessage
                }, this.timeout);
            }),
        ]);
    }
    get(url, query = '') {
        return this.fetch(fetch(`${url}${query ? `?${query}` : ''}`))
            .then((res) => {
                clearTimeout(this.timer);
                return res.json();
            }).catch((error) => {
                if (error.message) {
                    console.log(error.message);
                }
            });
    }

    post(url, data = {}) {
        return this.fetch(fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            },
        }))
            .then((res) => {
                clearTimeout(this.timer);
                return res.json();
            }).catch((error) => {
                if (error.message) {
                    console.log(error.message);
                }
            });
    }
}

export default Fetch;
