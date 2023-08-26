import fetch from "../auth/FetchInterceptor";
import { getResponse } from "../helpers/getResponse";

const DashboardService = {
  async analytics() {
    return fetch
      .get("/admin/dashboard")
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  async chartStudy({ schools, faculty, education_id, year }) {
    return fetch
      .get("/admin/dashboard/chart-study-results", {
        params: { schools, faculty, education_id, year },
      })
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  async chartUsageTime({ schools, faculty, education_id, year }) {
    return fetch
      .get("/admin/dashboard/chart-used-time-app", {
        params: { schools, faculty, education_id, year },
      })
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
};

export default DashboardService;
