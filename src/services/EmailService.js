import fetch from "../auth/FetchInterceptor";
import { getResponse, getResponseArray } from "../helpers/getResponse";

const EmailService = {
    getListEmail(params) {
        return fetch
            .get("/admin/receiver-feedback/indexs", { params })
            .then((res) => getResponseArray(res))
            .catch((err) => getResponse(err));
    },
    async createEmails(emails) {
        return fetch
            .post("/admin/receiver-feedback/create", { emails })
            .then((res) => getResponse(res))
            .catch((err) => getResponse(err));
    },
    deleteEmail(id) {
        return fetch
            .delete(`admin/receiver-feedback/delete/${id}`)
            .then((res) => getResponse(res))
            .catch((err) => getResponse(err));
    }
}

export default EmailService;
