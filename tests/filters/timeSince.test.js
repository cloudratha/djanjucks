import djanjucks from '../../src';
import {
  setMinutes,
  setDate,
  getMinutes,
  getDate,
  getHours,
  setHours
} from 'date-fns';

describe('timesince filter', () => {
  it('renders value and preserves autoescape', () => {
    const now = new Date();
    const result = djanjucks.renderString('{{ value|timesince }}', {
      value: setMinutes(now, getMinutes(now) - 2)
    });
    expect(result).toEqual('2\xa0minutes');
  });

  it('shows hour and minutes', () => {
    const now = new Date();
    const result = djanjucks.renderString('{{ value|timesince }}', {
      value: setHours(setMinutes(now, getMinutes(now) - 1), getHours(now) - 1)
    });
    expect(result).toEqual('1\xa0hour,\xa01\xa0minute');
  });

  it('shows day only', () => {
    const now = new Date();
    const result = djanjucks.renderString('{{ value|timesince }}', {
      value: setDate(setMinutes(now, getMinutes(now) - 1), getDate(now) - 1)
    });
    expect(result).toEqual('1\xa0day');
  });

  it('shows day and hours', () => {
    const now = new Date();
    const result = djanjucks.renderString('{{ value|timesince }}', {
      value: setDate(
        setHours(setMinutes(now, getMinutes(now) - 1), getHours(now) - 1),
        getDate(now) - 1
      )
    });
    expect(result).toEqual('1\xa0day,\xa01\xa0hour');
  });

  it('compares correctly day changes', () => {
    const now = new Date();
    const result = djanjucks.renderString('{{ now|timesince:before }}', {
      now: setDate(now, getDate(now) - 2),
      before: setDate(now, getDate(now) - 1)
    });
    expect(result).toEqual('1\xa0day');
  });

  it('compares correctly minute changes', () => {
    const now = new Date();
    const result = djanjucks.renderString('{{ a|timesince:b }}', {
      a: setDate(setMinutes(now, getMinutes(now) - 30), getDate(now) - 2),
      b: setDate(now, getDate(now) - 2)
    });
    expect(result).toEqual('30\xa0minutes');
  });

  it('returns 0 minutes with a future value', () => {
    const now = new Date();
    const result = djanjucks.renderString('{{ value|timesince }}', {
      value: setDate(now, getDate(now) + 1)
    });
    expect(result).toEqual('0\xa0minutes');
  });

  it('returns 0 minutes with exact dates', () => {
    const now = new Date();
    const result = djanjucks.renderString('{{ a|timesince:b }}', {
      a: now,
      b: now
    });
    expect(result).toEqual('0\xa0minutes');
  });

  it('converts a string into a date for comparision', () => {
    const result = djanjucks.renderString('{{ a|timesince:b }}', {
      a: '2019-01-01 00:30:00',
      b: '2019-01-01 08:30:00'
    });
    expect(result).toEqual('8\xa0hours');
  });

  it('fails silently if not a valid date', () => {
    const result = djanjucks.renderString('{{ value|timesince }}', {
      value: 'x'
    });
    expect(result).toEqual('');
  });

  it('fails silently if date is undefined', () => {
    const result = djanjucks.renderString('{{ value|timesince }}');
    expect(result).toEqual('');
  });
});
