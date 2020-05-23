import Barrage from '../../dist/barrage.umd';
import faker from 'faker/locale/zh_CN';

function mockBarrage() {
  return {
    text: faker.lorem.words(),
    color: Math.random() > 0.5 ? '#fff' : faker.internet.color().toUpperCase()
  };
}

const $ = (selector) => document.querySelector(selector);
export const HTML_ELEMENT_NATIVE_EVENTS = 'click,dblclick,mousedown,mousemove,mouseout,mouseover,mouseup'.split(',');

const player = $('#my-player');
const barrage = new Barrage('#container', {
  proxyObject: player,
  scroll: {
    fontSize: 28,
    duration: 5000
  }
});

['click'].forEach(eventName => {
  player.addEventListener(eventName, e => {
    console.log(`${eventName} call by player`, e);
  });
});

let timer= null;
player.onpause = () => {
  console.log('pause');
  clearTimeout(timer);
  barrage.stop();
};
player.onplay = () => {
  console.log('start');
  barrage.start();
  timer = setTimeout(function insertBarrage() {
    let sum = 1 + Math.floor(20 * Math.random());
    while(sum--) {
      barrage.add(mockBarrage());
    }
    timer = setTimeout(insertBarrage, 2000 + Math.floor(Math.random() * 10000));
  }, 2000);
};
player.onresize = () => {
  console.log('onresize');
  const { width } = player.getBoundingClientRect();
  barrage.resize(width);
};
player.onseeked = () => {
  barrage.clear();
};

new Vue({
  el: '#dashboard',
  data() {
    return {
      barrageText: '哔哩哔哩干杯',
      opacity: 1,
      fontBase: 1
    }
  },
  methods: {
    sendBarrage() {
      if (this.barrageText.trim() === '') {
        this.$notify.error({
          title: '失败',
          message: '弹幕内容不能为空'
        });
        return;
      }
      barrage.add({
        text: this.barrageText
      });
      this.barrageText = '';
      this.$notify({
        title: '成功',
        message: '弹幕发送成功',
        type: 'success'
      });
    },
    opacityChange(val) {
      barrage.setOpacity(val);
    },
    fontSizeChange(val) {
      barrage.setFontSize(val);
    }
  }
});