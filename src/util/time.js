import moment from "moment"

export const getDate=(apiDateFormat) => {
    return moment(apiDateFormat).format('YYYY-MM-DD') || null
}
export const getTime=(apiDateFormat) => {
    return moment(apiDateFormat).format('hh:mm A') || null
}
export const getWeekDays = (apiDateFormat) => {
    const sevenDaysAgo = moment().subtract(7,'days');
    const givenDate = moment(apiDateFormat);
    if(givenDate.isBefore(sevenDaysAgo)){
        return getDate(givenDate);
    }
    return moment(apiDateFormat).format('dddd') || null
}