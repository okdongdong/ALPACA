const WEEK_DAY = ['일', '월', '화', '수', '목', '금', '토'];

const dateToString = (date: Date) => {
  const tempDate =
    date.getFullYear() +
    '.' +
    date.getMonth() +
    '.' +
    date.getDate() +
    ` (${WEEK_DAY[date.getDay()]}) `;
  const tempTime = date.getHours() + '시 ' + date.getMinutes() + '분';

  return tempDate + tempTime;
};

export const dateToStringDate = (date: Date) => {
  const tempDate =
    date.getFullYear() +
    '.' +
    date.getMonth() +
    '.' +
    date.getDate() +
    ` (${WEEK_DAY[date.getDay()]}) `;
  return tempDate;
};

export const dateToStringTime = (date: Date) => {
  const tempTime = date.getHours() + '시 ' + date.getMinutes() + '분';

  return tempTime;
};

export default dateToString;
