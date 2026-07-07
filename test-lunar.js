const { Solar, Lunar } = require('lunar-typescript');

const solar = Solar.fromYmdHms(2000, 11, 14, 3, 30, 0);
try {
  console.log("solar.getEightChar:", typeof solar.getEightChar);
} catch (e) {
  console.log("solar error:", e.message);
}

try {
  const lunar = solar.getLunar();
  console.log("lunar.getEightChar:", typeof lunar.getEightChar);
  console.log("eight char:", lunar.getEightChar().getYearGan());
} catch (e) {
  console.log("lunar error:", e.message);
}
