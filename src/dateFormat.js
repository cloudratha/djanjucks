import {
  format,
  getMonth,
  getDaysInMonth,
  isLeapYear,
  getISOYear
} from 'date-fns';

const DATE_FORMAT_REGEX = /([aAbBcdDeEfFgGhHiIjlLmMnNoOPrsStTUuwWyYzZ])/;

const MONTHS_AP = {
  0: 'Jan.',
  1: 'Feb.',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'Aug.',
  8: 'Sept.',
  9: 'Oct.',
  10: 'Nov.',
  11: 'Dec.'
};

class Formatter {
  constructor(data) {
    this.data = data;
  }

  format(formatStr) {
    const pieces = [];
    for (let i = 0; i < formatStr.length; i += 1) {
      const piece = formatStr.toString()[i];
      // If supported key, format
      if (piece.match(DATE_FORMAT_REGEX) && typeof this[piece] === 'function') {
        const formatted = this[piece]();
        pieces.push(formatted);
      } else if (piece === '\\') {
        pieces.push(formatStr[i + 1]);
        i += 1;
      } else {
        pieces.push(piece);
      }
    }

    return pieces.join('');
  }
}

class TimeFormat extends Formatter {
  a() {
    const time = format(this.data, 'a');
    return `${time[0]}.${time[1]}.`;
  }

  A() {
    return format(this.data, 'A');
  }

  B() {
    throw new Error('Time format "B" not implemented.');
  }

  e() {
    return '';
  }

  f() {
    const time = [format(this.data, 'h')];
    const minutes = format(this.data, 'mm');
    if (minutes !== '00') {
      time.push(minutes);
    }
    return time.join(':');
  }

  g() {
    return format(this.data, 'h');
  }

  G() {
    return format(this.data, 'H');
  }

  h() {
    return format(this.data, 'hh');
  }

  H() {
    return format(this.data, 'HH');
  }

  i() {
    return format(this.data, 'mm');
  }

  O() {
    return '';
  }

  P() {
    const time = this.f();
    const timeArray = time.split(':');
    const range = this.a();

    if (timeArray.length === 1 && timeArray[0] === '12') {
      return range === 'a.m.' ? 'midnight' : 'noon';
    }

    return `${time} ${range}`;
  }

  s() {
    return format(this.data, 'ss');
  }

  T() {
    return '';
  }

  u() {
    return format(this.data, 'SSS');
  }

  Z() {
    return '';
  }
}

class DateFormat extends TimeFormat {
  b() {
    return format(this.data, 'MMM').toLowerCase();
  }

  c() {
    return '';
  }

  d() {
    return format(this.data, 'DD');
  }

  D() {
    return format(this.data, 'ddd');
  }

  E() {
    // Does not implement alternative month names
    return format(this.data, 'MMMM');
  }

  F() {
    return format(this.data, 'MMMM');
  }

  I() {
    return '';
  }

  j() {
    return format(this.data, 'D');
  }

  l() {
    return format(this.data, 'dddd');
  }

  L() {
    return isLeapYear(this.data);
  }

  m() {
    return format(this.data, 'MM');
  }

  M() {
    return format(this.data, 'MMM');
  }

  n() {
    return format(this.data, 'M');
  }

  N() {
    return MONTHS_AP[getMonth(this.data)];
  }

  o() {
    return getISOYear(this.data);
  }

  r() {
    return this.format('D, j M Y H:i:s');
  }

  S() {
    const day = format(this.data, 'D');
    const dayWithSuffix = format(this.data, 'Do');
    return dayWithSuffix.replace(day, '');
  }

  t() {
    return getDaysInMonth(this.data);
  }

  U() {
    return '';
  }

  w() {
    return format(this.data, 'd');
  }

  W() {
    return format(this.data, 'W');
  }

  y() {
    return format(this.data, 'YY');
  }

  Y() {
    return format(this.data, 'YYYY');
  }

  z() {
    return format(this.data, 'DDD');
  }
}

export { DateFormat, TimeFormat };
