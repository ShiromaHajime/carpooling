// app.config.js
export default {
  expo: {
    name: "carpooling",
    slug: "carpooling",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/logo-carpooling.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash-carpooling.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON || "./google-services.json",
      adaptiveIcon: {
        foregroundImage: "./assets/images/logo-carpooling",
        backgroundColor: "#ffffff"
      },
      package: "com.fedevalle.carpooling",
      config: {
        googleMaps: {
          apiKey: process.env.EXPO_PUBLIC_GOOGLE_API_KEY
        }
      },
      permissions: [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION",
        "android.permission.RECORD_AUDIO"
      ]
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow $(PRODUCT_NAME) to use your location."
        }
      ],
      [
        "expo-image-picker",
        {
          photosPermission: "Carpooling quiere acceder a tus imágenes para que puedas compartir una foto de perfil"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "b1d7c086-1ab1-4c49-a6b6-b9272e150262"
      }
    },
    owner: "carpooling"
  }
}
