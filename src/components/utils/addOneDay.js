import { addDays, format } from "date-fns";
function addOneDay(dateString) {
    const newDate = addDays(new Date(dateString), 1);
    return format(newDate, 'dd-MM-yyyy');
  }

export default addOneDay