import fetch from "../auth/FetchInterceptor";
import { getResponse, getResponseArray, toResponseObject } from "../helpers/getResponse";

const UserService = {
  getUsers(params) {
    return fetch
      .get("/admin/users", { params: { ...params, role: "user" } })
      .then((res) => getResponseArray(res))
      .catch((err) => getResponse(err));
  },
  getMentors(params) {
    return fetch
      .get("/admin/users", { params: { ...params, role: "mentor" } })
      .then((res) => getResponseArray(res))
      .catch((err) => getResponse(err));
  },
  updateStatus(id, status) {
    return fetch
      .put("/admin/user/update-status", {}, { params: { id, status } })
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  detail(id) {
    return fetch
      .get(`/admin/users/${id}`)
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  create(data) {
    return fetch
      .post(`/admin/users`, data)
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  update(id, data) {
    return fetch
      .put(`/admin/users/${id}`, data)
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  delete(id) {
    return fetch
      .delete(`/admin/users/`, { data: [id] })
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  deleteMany(ids) {
    return fetch
      .delete(`/admin/users/`, { data: ids })
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  importUsers(file) {
    const formData = new FormData();
    formData.append("file", file);
    return fetch
      .post("/admin/users/import-users", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  downloadDataUsersExcel() {
    return fetch
      .get("/admin/user/user-form")
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  createMentor(data) {
    return fetch
      .post(`/admin/users/create-mentor`, data)
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
  updateMentor(id, data) {
    return fetch
      .put(`/admin/users/update-mentor/${id}`, data)
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },

  FilterCSV(params) {
    console.log(params);
    return fetch
      .get("/admin/user/download-csv", { params: { ...params, role: "user" } })
      .then((res) => toResponseObject(res))
      .catch((err) => getResponse(err));
  }, 
};

export default UserService;
