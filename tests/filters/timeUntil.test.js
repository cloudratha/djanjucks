import djanjucks from '../../src';
import { addMinutes, addDays, addYears, addHours } from 'date-fns';

describe('timeuntil filter', () => {
  it('renders value and preserves autoescape', () => {
    const now = new Date();
    const result = djanjucks.renderString('{{ value|timeuntil }}', {
      value: addMinutes(now, 2)
    });
    expect(result).toEqual('2\xa0minutes');
  });

  it('shows hour and minutes', () => {
    const now = new Date();
    const result = djanjucks.renderString('{{ value|timeuntil }}', {
      value: addHours(addMinutes(now, 1), 1)
    });
    expect(result).toEqual('1\xa0hour,\xa01\xa0minute');
  });

  it('shows day only', () => {
    const now = new Date();
    const result = djanjucks.renderString('{{ value|timeuntil }}', {
      value: addDays(addMinutes(now, 1), 1)
    });
    expect(result).toEqual('1\xa0day');
  });

  it('shows year', () => {
    const now = new Date();
    const result = djanjucks.renderString('{{ value|timeuntil }}', {
      value: addYears(addHours(addMinutes(now, 1), 1), 1)
    });
    expect(result).toEqual('1\xa0year');
  });

  it('compares correctly day changes', () => {
    const now = new Date();
    const result = djanjucks.renderString('{{ a|timeuntil:b }}', {
      a: addDays(now, 2),
      b: addDays(now, 1)
    });
    expect(result).toEqual('1\xa0day');
  });

  it('compares correctly minute changes', () => {
    const now = new Date();
    const result = djanjucks.renderString('{{ a|timeuntil:b }}', {
      a: addDays(addMinutes(now, 30), 2),
      b: addDays(now, 2)
    });
    expect(result).toEqual('30\xa0minutes');
  });

  it('returns 0 minutes with a past value', () => {
    const now = new Date();
    const result = djanjucks.renderString('{{ value|timeuntil }}', {
      value: addDays(now, -1)
    });
    expect(result).toEqual('0\xa0minutes');
  });

  it('returns 0 minutes with exact dates', () => {
    const now = new Date();
    const result = djanjucks.renderString('{{ a|timeuntil:b }}', {
      a: now,
      b: now
    });
    expect(result).toEqual('0\xa0minutes');
  });

  it('converts a string into a date for comparision', () => {
    const result = djanjucks.renderString('{{ a|timeuntil:b }}', {
      a: '2019-01-01 08:30:00',
      b: '2019-01-01 00:30:00'
    });
    expect(result).toEqual('8\xa0hours');
  });

  it('fails silently if not a valid date', () => {
    const result = djanjucks.renderString('{{ value|timeuntil }}', {
      value: 'x'
    });
    expect(result).toEqual('');
  });

  it('fails silently if date is undefined', () => {
    const result = djanjucks.renderString('{{ value|timeuntil }}');
    expect(result).toEqual('');
  });
});
