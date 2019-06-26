import format from 'date-fns/format';
import getDaysInMonth from 'date-fns/get_days_in_month';
import isLeapYear from 'date-fns/is_leap_year';
import getISOYear from 'date-fns/get_iso_year';

const DATE_FORMAT_REGEX = /([aAbBcdDeEfFgGhHiIjlLmMnNoOPrsStTUuwWyYzZ])/;

const dateFilter = (date, dateFormat) => {
  // Django's date format strings are individual letters, so we can map those to moment formats
  const map = {
    d: 'DD',
    j: 'D',
    D: 'ddd',
    l: 'dddd',
    S: function(date) {
      const day = format(date, 'D');
      const dayWithSuffix = format(date, 'Do');
      return dayWithSuffix.replace(day, '');
    },
    w: 'd',
    z: 'DDD',
    W: 'W',
    m: 'MM',
    n: 'M',
    M: 'MMM',
    b: function(date) {
      return format(date, 'MMM').toLowerCase();
    },
    // TODO: Localise Month
    E: 'MMMM',
    F: 'MMMM',
    t: function(date) {
      return getDaysInMonth(date);
    },
    y: 'YY',
    Y: 'YYYY',
    L: function(date) {
      return isLeapYear(date);
    },
    o: function(date) {
      return getISOYear(date);
    },
    g: 'h',
    G: 'H',
    h: 'hh',
    H: 'HH',
    i: 'mm',
    s: 'ss',
    u: 'SSS',
    a: function(date) {
      const time = format(date, 'a');
      return `${time[0]}.${time[1]}.`;
    },
    A: 'A',
    f: function(date) {
      const time = [format(date, 'h')];
      const minutes = format(date, 'mm');
      if (minutes !== '00') {
        time.push(minutes);
      }
      return time.join(':');
    },
    P: function(date) {
      const time = map.f(date);
      const timeArray = time.split(':');
      const range = map.a(date);

      if (timeArray.length === 1 && timeArray[0] === '12') {
        return range === 'a.m.' ? 'midnight' : 'noon';
      }

      return `${time} ${range}`;
    },
    e: '',
    I: '',
    O: '',
    T: '',
    Z: '',
    c: '',
    r: '',
    U: ''
  };

  const pieces = [];
  for (let i = 0; i < dateFormat.length; i += 1) {
    const piece = dateFormat.toString()[i];
    // If supported key, format
    if (piece.match(DATE_FORMAT_REGEX) && map[piece]) {
      const formatted =
        typeof map[piece] === 'function'
          ? map[piece](date)
          : format(date, map[piece]);
      pieces.push(formatted);
    } else if (piece === '\\') {
      pieces.push(dateFormat[i + 1]);
      i += 1;
    } else {
      pieces.push(piece);
    }
  }

  return pieces.join('');
};

export default dateFilter;
