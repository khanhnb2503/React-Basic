import fetch from "../auth/FetchInterceptor";
import { getResponse, getResponseArray } from "../helpers/getResponse";

const EducationService = {
  async getAll() {
    return fetch
      .get("/admin/educations-parent")
      .then((res) => res)
      .catch((err) => getResponse(err));
  },
  async list(params) {
    return fetch
      .get("/admin/educations", { params })
      .then((res) => getResponseArray(res))
      .catch((err) => getResponse(err));
  },
  async detail(id) {
    return fetch
      .get(`/admin/educations/${id}`)
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  async create(data) {
    return fetch
      .post(`/admin/educations`, data)
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  async update(id, data) {
    return fetch
      .put(`/admin/educations/${id}`, data)
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  async delete(id) {
    return fetch
      .delete(`/admin/educations/${id}`)
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
};

export default EducationService;
