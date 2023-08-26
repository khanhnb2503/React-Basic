import { RESPONSE_STATUS } from "../constants/ApiConstant";

export function getResponseArray(response) {
  let data = [];
  let total = 0;
  let status = false;
  if (response && response.message === RESPONSE_STATUS.DONE) {
    data = response.data.items || [];
    total = response.data.headers["x-total-count"];
    status = true;
  }
  return { total, data, status };
}

export function getResponse(response) {
  let data = null;
  let status = false;
  const statusCode = response.statusCode || null;
  const message = response?.message || "";
  if (response && [200, 201].includes(statusCode)) {
    data = response.data || null;
    status = true;
  }
  return { data, status, statusCode, message };
}


export function toResponseObject(response) {
  let data, message; 
  if (response && response.message === RESPONSE_STATUS.DONE) {
    data = response.data || "";
    message = response.message; 
  }
  return { data, message };
}