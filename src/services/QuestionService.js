import fetch from "../auth/FetchInterceptor";
import { getResponse, getResponseArray, toResponseObject } from "../helpers/getResponse";

const QuestionService = {
  getCategories(params = {}) {
    return fetch
      .get("/admin/question-type", { params })
      .then((res) => getResponseArray(res))
      .catch((err) => getResponse(err));
  },
  getCategoriesAll(params) {
    return fetch
      .get("/admin/question-type-all", { params })
      .then(getResponse)
      .catch((err) => getResponse(err));
  },
  updateCategory(id, data) {
    return fetch
      .put(`/admin/question-type/${id}`, data)
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  deleteCategory(id) {
    return fetch
      .delete(`/admin/question-type/${id}/delete`)
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  createCategory(data) {
    return fetch
      .post(`/admin/question-type`, data)
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  list(params) {
    return fetch
      .get("/admin/questions", { params })
      .then((res) => getResponseArray(res))
      .catch((err) => getResponse(err));
  },
  detail(id) {
    return fetch
      .get(`/admin/questions/${id}`)
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  detailCategory(id) {
    return fetch
      .get(`/admin/question-type/${id}`)
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  create(data) {
    return fetch
      .post(`/admin/questions`, data)
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  update(id, data) {
    return fetch
      .put(`/admin/questions/${id}`, data)
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  updateStatus(id, status) {
    return fetch
      .put(`/admin/question/update-status`, {}, { params: { id, status } })
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  importQuestions(file) {
    const formData = new FormData();
    formData.append("file", file);
    return fetch
      .post("/admin/import-questions", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  downloadQuestions() {
    return fetch
      .get("/admin/question/question-form")
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  uploadImage(file) {
    const formData = new FormData();
    formData.append("file", file);
    return fetch
      .post("/admin/image-upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        params: {
          mimetype: file.type,
        },
      })
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  deleteMultiple(ids) {
    return fetch
      .delete(`/admin/questions`, { data: ids })
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },


  getFilterCategories(params = {}) {
    return fetch
      .get("/admin/question-type", { params })
      .then((res) => toResponseObject(res))
      .catch((err) => getResponse(err));
  },
};

export default QuestionService;
