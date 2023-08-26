const dev = {
  API_ENDPOINT_URL: "http://13.230.156.157:3000/api",
  MEDIA_ENDPOINT_URL: "http://13.230.156.157:3000",
};

const prod = {
  API_ENDPOINT_URL: "http://13.230.156.157:3000/api",
  MEDIA_ENDPOINT_URL: "http://13.230.156.157:3000",
};

const test = {
  API_ENDPOINT_URL: "http://45.76.203.138:3000/api",
  MEDIA_ENDPOINT_URL: "http://45.76.203.138:3000",
};

const getEnv = () => {
  switch (process.env.NODE_ENV) {
    case "development":
      return dev;
    case "production":
      return prod;
    case "test":
      return test;
    default:
      break;
  }
};

export const env = getEnv();
