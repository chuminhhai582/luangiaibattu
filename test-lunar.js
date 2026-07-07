const { Solar, Lunar } = require('lunar-typescript');

const solar = Solar.fromYmdHms(2000, 11, 14, 3, 30, 0);
const lunar = solar.getLunar();
const eightChar = lunar.getEightChar();
const yun = eightChar.getYun(1);

console.log("Yun keys:", Object.keys(yun).concat(Object.getOwnPropertyNames(Object.getPrototypeOf(yun))));
console.log("yun.getStartYear():", yun.getStartYear());
console.log("yun.getStartSolar():", yun.getStartSolar().toYmd());

const daYuns = yun.getDaYun();
const firstDaYun = daYuns[0];
console.log("DaYun keys:", Object.keys(firstDaYun).concat(Object.getOwnPropertyNames(Object.getPrototypeOf(firstDaYun))));

