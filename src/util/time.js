import moment from 'moment';

export const getDate = apiDateFormat => {
  if (!apiDateFormat) return null;
  return moment(apiDateFormat).format('YYYY-MM-DD');
};
export const getTime = apiDateFormat => {
  if (!apiDateFormat) return null;
  return moment(apiDateFormat).format('hh:mm A');
};
export const getWeekDays = apiDateFormat => {
  if (!apiDateFormat) return null;
  const sevenDaysAgo = moment().subtract(7, 'days');
  const givenDate = moment(apiDateFormat);
  if (givenDate.isBefore(sevenDaysAgo)) {
    return getDate(givenDate);
  }
  return moment(apiDateFormat).format('dddd');
};
