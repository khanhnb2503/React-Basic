import moment from "moment";
import {
  DATE_FORMAT_TEST_TIME,
  DATE_FORMAT_YYYY_MM_DD,
} from "../constants/DateConstant";

const OPTIONS_DEFAULT = {
  outputDefault: null,
  format: DATE_FORMAT_YYYY_MM_DD,
};

export default function TimeHelper(
  input = undefined,
  options = OPTIONS_DEFAULT
) {
  const { format, outputDefault } = options;
  if (!input && outputDefault) {
    return outputDefault;
  }
  return moment(input).format(format ? format : DATE_FORMAT_YYYY_MM_DD);
}

export function JapanTime(input) {
  if (!input) {
    return "-";
  }
  const time = moment(input);
  const year = time.year();
  const r = year - 2018;
  return `R${r > 0 ? r : ""}/${time.format("MM/DD")}`;
}

export function getUsageTime(seconds) {
  const milliseconds =
    moment().startOf("day").seconds(seconds) - moment().startOf("day");
  const duration = moment.duration(milliseconds).asHours().toFixed(2);
  return `${duration}h`;
}
export function getTestTime(seconds) {
  return moment().startOf("day").seconds(seconds).format(DATE_FORMAT_TEST_TIME);
}
