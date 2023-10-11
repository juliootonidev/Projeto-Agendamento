const moment = require('moment');

module.exports = {
  toCents: (price) => {
    return parseInt(price.toString().replace('.', '').replace(',', '')); 
  },
  hourToMinutes: (hourMinute) => {
    const [hour, minutes] = hourMinute.split(':');
    return parseInt(hour) * 60 + parseInt(minutes);
  }
};
