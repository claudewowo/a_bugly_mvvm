import { CompileUtil, directives } from './directives';

class Compile {
    constructor(el, vm) {
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        this.vm = vm;
        if (el) {
            const fragment = document.createDocumentFragment();
            let firstChild;
            // 1, 将页面的真实DOM全部放到内存中
            while (firstChild = this.el.firstChild) {
                fragment.appendChild(firstChild);
            }
            // 2, 编译 => 提取想要的元素节点 v-model 和文本节点 {{}}
            this.compile(fragment);

            // 3, 把编译好的 fragment 放回页面
            this.el.appendChild(fragment);
        }
    }
    isElementNode(node) {
        return node.nodeType === 1;
    }
    /* 核心方法 */
    compileElement(node) {
        const $this = this;
        // 将所有指令设置到 node.directions 上: [{name: '', value: ''}]
        const attrs = node.directions || node.attributes; // 获取当前节点的属性
        // 将attrs类数组转换为数组进行遍历
        Array.from(attrs).forEach((attr) => {
            // 判断属性名字是不是包含 v- 指令
            const attrName = attr.name;
            if (attrName.indexOf('v-') === 0) {
                const exp = attr.value;
                let [, type] = attrName.split('-');

                if (!node.directions) {
                    node.directions = [];
                    if (node.directions.length <= 0) {
                        node.directions.push({
                            name: attrName,
                            value: exp
                        });
                    }
                }
                // 移除DOM上的 v-属性
                // node.removeAttribute(attrName);

                if (type === 'for') {
                    // 如果有 for 循环
                    type = 'forloop';
                } else if (type === 'if') {
                    // 如果有 if 判断
                    type = 'ifjudge';
                }
                // 指令实操
                directives[type] && directives[type](node, $this.vm, exp);
            }
        });
    }
    compileText(node) {
        // 带{{asd}}
        const exp = node.textContent; // 获取文本中的内容
        const reg = CompileUtil.reg; // 转换为 {{a}} {{b}} {{c}}
        if (reg.test(exp)) {
            // node this.vm.$data text
            CompileUtil.text(node, this.vm, exp);
        }
    }
    compile(fragment) {
        // 需要递归
        const childNodes = fragment.childNodes;
        Array.from(childNodes).forEach((node) => {
            if (this.isElementNode(node)) {
                // 是元素节点，还需要继续深入检查
                // 编译元素
                this.compileElement(node);
                this.compile(node);
            } else {
                // 文本节点
                // 编译文本
                this.compileText(node);
            }
        });
    }
}

export default Compile;
