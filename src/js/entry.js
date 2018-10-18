import 'css/style.css';
import 'js/polyfill/polyfills';

import Kvm from 'js/mvvm/mvvm.js';

const vm = new Kvm({
    el: '#app',
    data: {
        title: '简易 MVVM demo',
        $birthday: '日期',
        birthday: '2000-01-01',
        tip: '',
    }
});

document.getElementById('birthday').oninput = (e) => {
    console.log('[日期已更新]', e.target.value);
    vm.tip = '内容已更新';
};
