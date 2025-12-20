import moment from 'moment-timezone';
//import momentBusines from 'moment-business-days';
import 'moment/locale/es';

const FORMAT = {
  DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DATE: 'YYYY-MM-DD',
  DATESTRING: 'DD [de] MMMM [de] YYYY',
  TIME: 'h:mm:ss a',
  HOURS: 'hh:mm a',
  TIMESMS: 'HH:mm:ss',
};

/** Retorna la fecha actual */
const now = () => moment();

/** Retorna una fecha con el timezone por defecto 'America/Guayaquil' */
const format = (date) => {
  return moment(date).tz('America/Guayaquil');
};

/** Retorna los días entre una fecha y la fecha actual */
const daysFromToday = (date) => {
  return moment().diff(date, 'days');
};

/** Retorna la diferencia entre el total de días y los días entre una fecha
 * y la fecha actual
 * @example
 * // now = '20/01/2022'
 * const date =  '18/01/2022'
 * const total = 10 |
 * _.dueDaysUntil(date, total)
 * // => 8 */
const dueDaysUntil = (date, total) => {
  return total - daysFromToday(date);
};

/** Retorna una fecha como string*/
const toString = (date) => {
  return format(date).format(FORMAT.DATETIME);
};

/** Retorna una fecha como string*/
const DatetoString = (date) => {
  return moment(date).locale('es').format(FORMAT.DATESTRING);
};

/** Retorna una fecha como tiempo en string */
const toStringTime = (date) => {
  return format(date).format(FORMAT.TIME);
};

/** Retorna una fecha en horas en string */
const toStringHours = (date) => {
  return format(date).format(FORMAT.HOURS);
};

/** Retorna una fecha sin hora como string */
const toStringDate = (date) => {
  return format(date).format(FORMAT.DATE);
};

//** Retorna la fecha actual como string */
const nowToString = () => {
  return toString(new Date());
};

/** Agrega tiempo a una fecha en base al tipo especificado */
const addTime = (date, time, type) => {
  return format(date).add(time, type).format(FORMAT.DATETIME);
};

/** Agrega días a una fecha */
const addDays = (date, days) => {
  return addTime(date, days, 'days');
};

/** Agrega horas a una fecha */
const addHours = (date, hours) => {
  return addTime(date, hours, 'hours');
};

/** Agrega minutos a una fecha */
const addMinutes = (date, minutes) => {
  return addTime(date, minutes, 'minutes');
};

/** Verifica si una fecha es mayor a otra
 * @param date Fecha a comparar
 * @param flag Fecha límite
 * @param time Agregar horas y minutos a la validación
 */
const isForward = (date, flag) => {
  return moment(flag).diff(date, 'minutes') <= 0;
};

/** Retorna la diferencia de horas entre dos fechas */
const hoursBetween = (init, end) => {
  const initTime = moment(init, 'hh:mm A');
  const endTime = moment(end, 'hh:mm A');
  return moment.duration(endTime.diff(initTime)).asHours();
};
/** Retorna la diferencia de horas entre dos fechas con un formato diferente*/
const hoursFormat = (init, end) => {
  const initTime = moment(init, 'hh:mm A');
  const endTime = moment(end, 'hh:mm A');
  const result = moment.duration(endTime.diff(initTime));
  const hourNumber = moment.duration(endTime.diff(initTime)).asHours();
  const hour = result.hours() + ' hora ' + result.minutes() + ' minutos ';
  return { hour, hourNumber };
};

/** Retorna la diferencia de dias entre dos fechas para dias laborables*/
const dayFormat = (init, end) => {
  const dayNumber = init.diff(end, true);
  return dayNumber;
};

/** Suma dos horas diferentes*/
const sumHour = (inithour, endhour) => {
  const inDate = toStringTime(inithour);
  const outDate = toStringTime(endhour);
  const sum = hoursFormat(inDate, outDate);
  if (inDate === 'Invalid date' && outDate === 'Invalid date') return 0;
  else return sum;
};

/** Sumar la diferencia de dias*/
const sumDay = (initday, endday) => {
  if (initday !== undefined && endday !== undefined) {
    const inDay = moment(initday).startOf('day');
    const outDay = moment(endday).endOf('day');
    if (inDay.isValid() && outDay.isValid()) {
      const days = outDay.diff(inDay, 'days') + 1;
      return days;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};

const toFormatHour = (date) => {
  var seconds = moment.duration(date).seconds();
  var minutes = moment.duration(date).minutes();
  var hour = moment.duration(date).hours();

  return ` ${hour} hora con ${minutes} minutos y ${seconds} segundos`;
};

const toStringPerAcademic = (dateIn, dataOut) => {
  const initDate = format(dateIn).locale('es').format('YYYY');
  const outDate = format(dataOut).locale('es').format('YYYY');
  return `${initDate.toUpperCase()} - ${outDate.toUpperCase()}`;
};

const toFormatHourMS = (value) => {
  var seconds = moment.duration(value).seconds();
  var minutes = moment.duration(value).minutes();
  var hours = Math.trunc(moment.duration(value).asHours());
  var hour = hours < 10 ? '0' + hours : hours;
  var minute = minutes < 10 ? '0' + minutes : minutes;
  var second = seconds < 10 ? '0' + seconds : seconds;
  return `${hour}:${minute}:${second}`;
};

const diffHourMS = (entryHour, exitHour) => {
  var entryHours = moment(entryHour);
  var exitHours = moment(exitHour);
  var duration = exitHours.diff(entryHours);
  return duration;
};

const getTime = (hours) => {
  return hours.valueOf();
};

const getWeekdayName = (date) => {
  const _date = new Date(date);
  const weekday = _date.toLocaleDateString('es-EC', { weekday: 'long' });
  return weekday;
};

const formatDateTime = (dateTimeString) => {
  const fechaHoraOriginal = new Date(dateTimeString);
  const fechaHoraFormateada = fechaHoraOriginal.toLocaleString('es-EC', {
    timeZone: 'America/Guayaquil',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return fechaHoraFormateada;
};

const getFormatMoodle = (ps_fecha, ps_hora_ini) => {
  const fechaMoment = moment(ps_fecha);
  const [hora, minutos] = ps_hora_ini.split(':');
  fechaMoment.hour(hora);
  fechaMoment.minute(minutos);
  const sessdate = fechaMoment.unix();
  return sessdate;
};

export const dates = {
  now,
  format,
  daysFromToday,
  dueDaysUntil,
  toString,
  nowToString,
  addHours,
  addMinutes,
  addDays,
  isForward,
  toStringTime,
  toStringDate,
  hoursBetween,
  toStringHours,
  hoursFormat,
  dayFormat,
  sumDay,
  sumHour,
  toFormatHour,
  toFormatHourMS,
  diffHourMS,
  toStringPerAcademic,
  getTime,
  DatetoString,
  getWeekdayName,
  formatDateTime,
  getFormatMoodle,
};
