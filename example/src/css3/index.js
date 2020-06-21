import Barrage from '../../../dist/barrage.umd';
import faker from 'faker/locale/zh_CN';

function mockBarrage() {
  return {
    text: faker.lorem.words(),
    color: '#fff'
  };
}

const $ = (selector) => document.querySelector(selector);
export const HTML_ELEMENT_NATIVE_EVENTS = 'click,dblclick,mousedown,mousemove,mouseout,mouseover,mouseup'.split(',');

const player = $('#my-player');
const danmu = $('#danmu');
const container = $('#container');
const barrage = new Barrage(danmu, {
  proxyObject: player,
  scroll: {
    fontSize: 28,
    duration: 5000
  },
  engine: 'css3',
  usePointerEvents: true,
  wrapper: container,
  interactive: true
});

barrage.onBarrageBlur((barrage) => {
  console.log(`blur: ${barrage.text}`);
});

barrage.onBarrageHover((barrage) => {
  console.log(`hover: ${barrage.text}`);
});

barrage.onBarrageClick((barrage) => {
  console.log(`click: ${barrage.text}`);
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
    let sumScroll = 1 + Math.floor(5 * Math.random());
    while(sumScroll--) {
      barrage.add(mockBarrage(), 'scroll');
    }

    let sumFixedTop = 1 + Math.floor(5 * Math.random());
    while(sumFixedTop--) {
      barrage.add(mockBarrage(), 'fixed-top');
    }

    let sumFixedBottom = 1 + Math.floor(5 * Math.random());
    while(sumFixedBottom--) {
      barrage.add(mockBarrage(), 'fixed-bottom');
    }

    timer = setTimeout(insertBarrage, 2000 + Math.floor(Math.random() * 10000));
  }, 2000);
};
player.onresize = () => {
  console.log('onresize');
  resizeDanmu();
};
player.onseeked = () => {
  barrage.clear();
};

resizeDanmu();

function resizeDanmu() {
  const { width, height } = player.getBoundingClientRect();
  danmu.width = width;
  danmu.height = height;
  danmu.style.width = width + 'px';
  danmu.style.height = height + 'px';
  barrage.resize(width);
}

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
    sendBarrage(type) {
      if (this.barrageText.trim() === '') {
        this.$notify.error({
          title: '失败',
          message: '弹幕内容不能为空'
        });
        return;
      }
      barrage.add({
        text: this.barrageText
      }, type);
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