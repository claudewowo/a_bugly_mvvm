import { addClass, removeClass } from 'src/js/lib/utils';
import { Watcher } from './watcher';

// 编译方法工具类
const CompileUtil = {
    // reg: /$$([^$$]+)$$/g,
    reg: /\{\{([^}]+)\}\}/g, // 匹配 {{ }}
    getVal(vm, exp) { // 获取实例上对应的数据
        exp = exp.split('.'); // [a, b]
        return exp.reduce((prev, next) => prev[next], vm.$data);
    },
    getTextVal(vm, exp) { // 获取编译文本后的结果
        return exp.replace(this.reg, (...args) => this.getVal(vm, args[1]));
    },
    text(node, vm, exp) { // 处理文本
        const updateFn = directives.updater.textUpdater;
        // {{a.c}};
        const value = this.getTextVal(vm, exp);
        // {{a}} {{b}}
        exp.replace(this.reg, (...args) => {
            new Watcher(vm, args[1], () => {
                // 如果数据变化了，文本节点需要重新获取依赖的属性更新文本中的内容
                updateFn && updateFn(node, this.getTextVal(vm, exp));
            });
        });
        updateFn && updateFn(node, value);
    },
    setVal(vm, exp, value) { // [a, c]
        exp = exp.split('.');
        // 收敛
        return exp.reduce((prev, next, currentIndex) => {
            if (currentIndex === exp.length - 1) prev[next] = value;
            return prev[next];
        }, vm.$data);
    },
};

const directives = {
    // 处理 v-model 指令
    model(node, vm, exp) {
        const updateFn = this.updater.modelUpdater;
        let val = CompileUtil.getVal(vm, exp);

        if (typeof val === 'object') {
            val = JSON.stringify(val);
        }
        // 默认执行1次绑定 data 里的值
        updateFn && updateFn(node, val);

        // input 事件处理
        node.addEventListener('input', (e) => {
            const newValue = e.target.value;
            CompileUtil.setVal(vm, exp, newValue);
        });
        node.addEventListener('blur', (e) => {
            const newValue = e.target.value;
            CompileUtil.setVal(vm, exp, newValue);
        });

        // 加个监控 数据变化了 应该调用这个 watcher.callback
        new Watcher(vm, exp, () => {
            // 当值变化后会调用cb 将新的值传递过来
            updateFn && updateFn(node, CompileUtil.getVal(vm, exp));
        });
    },
    updater: {
        // 文本更新
        textUpdater(node, value) {
            node.textContent = value;
        },
        // 输入框更新
        modelUpdater(node, value) {
            node.value = value;
        }
    },
    // 处理 v-html
    html(node, vm, exp) {
        node.innerHTML = CompileUtil.getVal(vm, exp);
        new Watcher(vm, exp, () => {
            // 当值变化后会调用cb 将新的值传递过来
            node.innerHTML = CompileUtil.getVal(vm, exp);
        });
    },
    // v-placeholder
    placeholder(node, vm, exp) {
        node.setAttribute('placeholder', CompileUtil.getVal(vm, exp));
        new Watcher(vm, exp, () => {
            // 当值变化后会调用cb 将新的值传递过来
            node.setAttribute('placeholder', CompileUtil.getVal(vm, exp));
        });
    },
    // v-show
    show(node, vm, exp) {
        const hasor = exp.indexOf('||');
        const hasand = exp.indexOf('&&');
        if (hasor >= 0 || hasand >= 0) {
            const expressions = exp.split('||');
            const expv1Reverse = expressions[0][0] === '!';
            const expv2Reverse = expressions[0][0] === '!';
            const expv1 = $.trim(expressions[0]).replace(/!/, '');
            const expv2 = $.trim(expressions[1]).replace(/!/, '');
            const v1 = CompileUtil.getVal(vm, expv1);
            const v2 = CompileUtil.getVal(vm, expv2);
            console.log(`${expv1Reverse ? '!' : ''}${v1}`);
            console.log(expv1Reverse, expv2Reverse, expv1, expv2, v1, v2);

        } else {
            // exp = $.trim(exp).replace(/!/, '');
            const className = node['v-className'] || node.getAttribute('v-className');

            if (CompileUtil.getVal(vm, exp)) {
                node.style.display = 'block';
                className && addClass(node, className);
            } else {
                node.style.display = 'none';
                className && removeClass(node, className);
            }

            new Watcher(vm, exp, () => {
                // 当值变化后会调用cb 将新的值传递过来
                if (CompileUtil.getVal(vm, exp)) {
                    node.style.display = 'block';
                    className && addClass(node, className);
                } else {
                    node.style.display = 'none';
                    className && removeClass(node, className);
                }
            });
        }
    },
    select(node, vm, exp) {
        node.onchange = (e) => {
            CompileUtil.setVal(vm, exp, e.target.value);
        };
    },
    maxlength(node, vm, exp) {
        const maxlen = CompileUtil.getVal(vm, exp);
        node.setAttribute('maxlength', maxlen);
        new Watcher(vm, exp, () => {
            const max = CompileUtil.getVal(vm, exp);
            node.setAttribute('maxlength', max);
            CompileUtil.setVal(vm, exp, max);
        });
    },
    // v-for (分析绑定事件, index, arr[index])
    /* forloop(node, vm, exp) {
        console.log(node, vm, exp);
    },
    */
};

export {
    CompileUtil,
    directives,
};
