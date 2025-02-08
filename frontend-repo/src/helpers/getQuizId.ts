import moment from "moment";

export default function getQuizId() {
  let days: string | number = moment().get("dayOfYear");
  let getMinutes: string | number = moment().get("minutes") + moment().get("hours") * 60;
  let getSeconds: string | number = moment().get("seconds");

  if (getMinutes < 1000) {
    getMinutes = "0" + getMinutes;
  } else if (getMinutes < 100) {
    getMinutes = "00" + getMinutes;
  } else if (getMinutes < 10) {
    getMinutes = "000" + getMinutes;
  }

  if (days < 100) {
    days = "0" + days;
  } else if (days < 10) {
    days = "00" + days;
  }

  if (getSeconds < 10) {
    getSeconds = "0" + getSeconds;
  }

  return `${days}${getMinutes}${getSeconds}`;
}
