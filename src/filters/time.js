import { TimeFormat } from '../dateFormat';

const timeFilter = (time, timeFormat) => {
  const formatter = new TimeFormat(time);
  return formatter.format(timeFormat);
};

export default timeFilter;
