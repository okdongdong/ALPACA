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

  const tempTime = date.getHours() + '시 ' + date.getMinutes() + '분';

  return tempTime;
};

export const dateToStringTimeSimple = (date: Date | null) => {
  if (date === null) {
    return '';
  }

  const tempTime = date.getHours() + ':' + date.getMinutes();

  return tempTime;
};

export default dateToString;
