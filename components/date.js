import { parseISO, format } from 'date-fns';

export default function Date({ dateString }) {
  const formatedDateString = dateString.replace(/\//g, '-');
  const date = parseISO(formatedDateString);
  return <time dateTime={dateString}>{format(date, 'LLLL d, yyyy')}</time>;
}
