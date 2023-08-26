import fetch from "../auth/FetchInterceptor";
import { getResponse, getResponseArray } from "../helpers/getResponse";

const FeedbackService = {
  getFeedbacks(params) {
    return fetch
      .get("/admin/feedbacks", { params })
      .then((res) => getResponseArray(res))
      .catch((err) => getResponse(err));
  },
  detail(id) {
    return fetch
      .get(`/admin/feedbacks/${id}`)
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  send(id, data) {
    return fetch
      .post(`/admin/feedbacks/${id}`, data)
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  deleteMany(ids) {
    return fetch
      .delete("/admin/feedbacks", { data: ids })
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
};

export default FeedbackService;
