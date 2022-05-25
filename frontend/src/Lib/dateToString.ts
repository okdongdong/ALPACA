const WEEK_DAY = ['일', '월', '화', '수', '목', '금', '토'];

const dateToString = (date: Date | null | undefined, includeYear: boolean = true) => {
  if (!date) return '';

  const tempDate = dateToStringDate(date, includeYear);
  const tempTime = dateToStringTime(date);

  return tempDate + tempTime;
};

export const dateToStringDate = (date: Date | null | undefined, includeYear: boolean = true) => {
  if (!date) return '';

  const tempDate =
    (includeYear ? date.getFullYear() + '.' : '') +
    (date.getMonth() + 1) +
    '.' +
    date.getDate() +
    ` (${WEEK_DAY[date.getDay()]}) `;
  return tempDate;
};

export const dateToStringTime = (date: Date | null | undefined) => {
  if (!date) return '';

  const tempMinutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();

  const tempHours =
    date.getHours() < 12 ? '오전 ' + date.getHours() : '오후 ' + (date.getHours() - 12 || 12);
  const tempTime = tempHours + '시 ' + tempMinutes + '분';

  return tempTime;
};

export const dateToStringTimeSimple = (date: Date | null | undefined) => {
  if (!date) return '';

  const tempMinutes = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
  const tempHours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours();

  const tempTime = tempHours + ':' + tempMinutes;

  return tempTime;
};

export default dateToString;
