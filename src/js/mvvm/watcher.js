// 发布订阅模式  先订阅再发布 [fn1, fn2, fn3] 依次执行

class Watcher {
    constructor(vm, exp, cb) {
        this.vm = vm;
        this.exp = exp; // 属性表达式
        this.fn = cb;
        this.value = this.get(); // 获取旧值
    }
    get() {
        Dep.target = this; // 在初始化时不添加监听回调
        const value = this.getVal(this.vm, this.exp);
        Dep.target = null; // 使用完即销毁
        return value;
    }
    getVal(vm, exp) { // 获取实例上对应的数据
        exp = exp.split('.'); // [a, b] 多层对象
        return exp.reduce((prev, next) => prev[next], vm.$data);
    }
    // 对外暴露的方法
    update() {
        const newValue = this.getVal(this.vm, this.exp);
        const oldValue = this.value;
        if (newValue !== oldValue) {
            this.value = newValue; // 每次更新值以后都要将新值设为旧值
            this.fn(newValue); // 对应 watcher 的 callback
        }
    }
}

class Dep {
    constructor() {
        this.subs = [];
    }
    addSub(watcher) {
        this.subs.push(watcher);
    }
    notify(soure) {
        if (soure) {
            this.subs.forEach(sub => sub());
        } else {
            this.subs.forEach(watcher => watcher.update());
        }
    }
}

export {
    Watcher,
    Dep,
};
