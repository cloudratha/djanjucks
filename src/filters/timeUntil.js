import humanizeDuration from 'humanize-duration';
import { compareAsc } from 'date-fns';
import { avoidWrapping } from '../utilities';

const timeUntil = (start, end) => {
  let startDate = start;
  let endDate = end;

  if (!(start instanceof Date)) {
    startDate = new Date(start);
  }

  if (end === undefined) {
    endDate = new Date();
  } else if (!(end instanceof Date)) {
    endDate = new Date(end);
  }

  if (
    startDate.toString() === 'Invalid Date' ||
    endDate.toString() === 'Invalid Date'
  ) {
    return '';
  }

  if (startDate < endDate) {
    return avoidWrapping('0 minutes');
  }

  const diff = humanizeDuration(startDate - endDate, {
    units: ['y', 'mo', 'w', 'd', 'h', 'm'],
    largest: 2,
    round: true
  });

  return avoidWrapping(diff);
};

export default timeUntil;
