import { Dep } from './watcher';

class Observer {
    constructor(data) {
        this.observe(data);
    }
    observe(data) {
        // 要对这个data数据将原有的属性改成set和get的形式
        if (!data || typeof data !== 'object') {
            return;
        }
        // 要将数据进行劫持处理 先获取到data 的 key 和 value
        Object.keys(data).forEach((key) => {
            this.defineReactive(data, key, data[key]);
            this.observe(data[key]); // 深度递归劫持
        });
    }
    // 响应式
    defineReactive(obj, key, value) {
        const that = this;
        const dep = new Dep(); // 每个变化的数据都会对应1个数组，这个数组用来存放所有更新的操作
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() { // 当取值时调用的方法
                Dep.target && dep.addSub(Dep.target); // 在初始化时不添加监听回调 [watcher]
                return value;
            },
            set(newValue) { // 当给data属性中设置值时 更改获取到的属性的值
                if (newValue !== value) {
                    // 这里的this不是实例
                    that.observe(newValue);// 如果是对象继续劫持
                    value = newValue;
                    dep.notify(); // 让所有 watcher.update 方法执行
                }
            }
        });
    }
}

export default Observer;
