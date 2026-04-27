// app.config.ts
import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,

  name: "Green Lens",
  slug: "my-expo-app",
  version: "1.0.0",
  orientation: "portrait",

  icon: "./assets/images/systems/icon.png",
  scheme: "myexpoapp",

  userInterfaceStyle: "automatic",

  ios: {
    icon: "./assets/expo.icon",
    bundleIdentifier: "com.aki.greenlens",
    supportsTablet: false,
  },

  android: {
    package: "com.aki.greenlens",
    adaptiveIcon: {
      backgroundColor: "#E6F4FE",
      foregroundImage: "./assets/images/systems/android-icon-foreground.png",
      backgroundImage: "./assets/images/systems/android-icon-background.png",
      monochromeImage: "./assets/images/systems/android-icon-monochrome.png",
    },
    predictiveBackGestureEnabled: false,
  },

  web: {
    output: "static",
    favicon: "./assets/images/systems/favicon.png",
    bundler: "metro",
  },

  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        backgroundColor: "#208AEF",
        android: {
          image: "./assets/images/systems/splash-icon.png",
          imageWidth: 76,
        },
      },
    ],
    [
      "expo-secure-store",
      {
        configureAndroidBackup: true,
      },
    ],
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme: "com.googleusercontent.apps.263543007402-7h1jbskud17d6fnlnr7ml440nrlkg83f"
      }
    ],
  ],

  experiments: {
    typedRoutes: true,
    reactCompiler: true,
  },
  extra: {
    APP_ENV: process.env.EXPO_PUBLIC_APP_ENV ?? "development",
    API_URL: process.env.EXPO_PUBLIC_API_URL ?? "https://api.example.com",
    APP_TENANT_ID: process.env.EXPO_PUBLIC_TENANT_ID ?? "GREEN",
    APP_CLOUDINARY:
      process.env.EXPO_PUBLIC_CLOUDINARY ??
      "https://res.cloudinary.com/dk0w90uw9/image/upload/",
  },
});
