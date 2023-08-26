import fetch from "auth/FetchInterceptor";
// import axios from 'axios'
const JwtAuthService = {};

JwtAuthService.login = async function (data) {
  return new Promise((resolve, reject) => {
    fetch({
      url: "/admin/login",
      method: "post",
      headers: {
        "public-request": "true",
      },
      data: data,
    })
      .then((user) => resolve(user))
      .catch((err) => reject(err));
  });
};

JwtAuthService.signUp = function (data) {
  return fetch({
    url: "/auth/signup",
    method: "post",
    headers: {
      "public-request": "true",
    },
    data: data,
  });
};

export default JwtAuthService;
