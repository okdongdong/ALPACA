const WEEK_DAY = ['일', '월', '화', '수', '목', '금', '토'];

const dateToString = (date: Date | null) => {
  const tempDate = dateToStringDate(date);
  const tempTime = dateToStringTime(date);

  return tempDate + tempTime;
};

export const dateToStringDate = (date: Date | null) => {
  if (date === null) {
    return '';
  }

  const tempDate =
    date.getFullYear() +
    '.' +
    date.getMonth() +
    '.' +
    date.getDate() +
    ` (${WEEK_DAY[date.getDay()]}) `;
  return tempDate;
};

export const dateToStringTime = (date: Date | null) => {
  if (date === null) {
    return '';
  }

  const tempMinutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

  const tempHours = (date.getHours() < 12 ? '오전 ' : '오후 ') + (date.getHours() - 12 || 12);
  const tempTime = tempHours + '시 ' + tempMinutes + '분';

  return tempTime;
};

export const dateToStringTimeSimple = (date: Date | null) => {
  if (date === null) {
    return '';
  }

  const tempMinutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

  const tempTime = date.getHours() + ':' + tempMinutes;

  return tempTime;
};

export default dateToString;
