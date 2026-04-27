import Constants from "expo-constants";

const extra = Constants.expoConfig?.extra ?? {};

const env = {
  APP_ENV: extra.APP_ENV ?? "development",
  API_URL: extra.API_URL ?? "",
  API_TENANT_ID: extra.APP_TENANT_ID ?? "",
  APP_CLOUDINARY: extra.APP_CLOUDINARY ?? "",
};

if (!env.API_URL) {
  throw new Error("Missing API_URL");
}

export default env;
