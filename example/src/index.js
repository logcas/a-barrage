import Barrage from '../../dist/barrage.umd';

function getRandomWord() {
  const words = [
    'Thanks for visiting!',
    'ABarrage弹幕库',
    '干杯！！！🍻'
  ];
  const index = Math.floor(Math.random() * 3);
  return words[index];
}

function mockBarrage() {
  return {
    text: getRandomWord(),
    color: '#fff'
  };
}

const $ = (selector) => document.querySelector(selector);

const danmu = $('#danmu');
const barrage = new Barrage(danmu, {
  fontSize: 40,
  duration: 8000,
  trackHeight: 40 * 1.5,
  engine: 'canvas',
  usePointerEvents: true
});

const buildBarrageHandler = () => {
  const BUILD_COUNT = 20;
  for(let i = 0;i < BUILD_COUNT; ++i) {
    const text = mockBarrage();
    barrage.add(text, 'scroll');
  }
  setTimeout(buildBarrageHandler, 5000);
};

buildBarrageHandler();

const rect = document.body.getBoundingClientRect();
danmu.width = rect.width;
danmu.height = rect.height;

barrage.start();