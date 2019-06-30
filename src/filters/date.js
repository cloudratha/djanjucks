import { DateFormat } from '../dateFormat';

const dateFilter = (date, dateFormat) => {
  const formatter = new DateFormat(date);
  return formatter.format(dateFormat);
};

export default dateFilter;
