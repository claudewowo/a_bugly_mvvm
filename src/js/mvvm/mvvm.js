import Observer from './observer';
import Compile from './compile';

class Kvm {
    constructor(options) {
        // 先把 data, el 挂载在实例上
        this.$el = options.el;
        this.$data = options.data;

        // 如果有要编译的模板就开始编译
        if (this.$el) {
            // 数据劫持 把对应的所有属性 改成get和set方法
            new Observer(this.$data);
            this.proxyData(this.$data);
            this.initComputed();
            // 用数据和元素进行编译
            new Compile(this.$el, this);
        }
    }
    proxyData(data) {
        Object.keys(data).forEach((key) => {
            Object.defineProperty(this, key, {
                get() {
                    return data[key];
                },
                set(newValue) {
                    data[key] = newValue;
                }
            });
        });
    }
    initComputed() {
        const vm = this;
        const { computed } = vm;
        if (computed) {
            Object.keys(computed).forEach((key) => {
                Object.defineProperty(vm, key, { // computed[key]
                    enumerable: true,
                    get: typeof computed[key] === 'function' ? computed[key] : computed[key].get,
                    set() {

                    }
                });
            });
        }
    }
}

export default Kvm;
