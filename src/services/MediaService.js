import fetch from "../auth/FetchInterceptor";
import { getResponse, getResponseArray } from "../helpers/getResponse";

const MediaService = {
  async list() {
    return fetch
      .get("/admin/files")
      .then((res) => getResponseArray(res))
      .catch((err) => getResponse(err));
  },
  async upload(data, config) {
    return fetch
      .post("/admin/image-upload", data, config)
      .then((res) => getResponse(res))
      .catch((err) => getResponse(err));
  },
};

export default MediaService;
