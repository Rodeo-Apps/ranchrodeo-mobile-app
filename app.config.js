// Expo app config. Values that differ per build environment come from
// EXPO_PUBLIC_* env vars so a fresh clone runs without editing this file.
module.exports = {
  expo: {
    name: "Ranch Rodeo",
    slug: "ranchrodeo",
    scheme: "ranchrodeo",
    version: '0.1.0',
    orientation: 'portrait',
    userInterfaceStyle: 'dark',
    newArchEnabled: true,
    splash: {
      resizeMode: 'contain',
      backgroundColor: "#14100c",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "pro.ranchrodeo.app",
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
        NSCameraUsageDescription: 'Record your runs so RanchRodeo can analyse them.',
        NSMicrophoneUsageDescription: 'Capture audio alongside your run video.',
        NSPhotoLibraryUsageDescription: 'Pick a run video to analyse.',
      },
    },
    android: {
      package: "pro.ranchrodeo.app",
      adaptiveIcon: {
        backgroundColor: "#14100c",
      },
      edgeToEdgeEnabled: true,
    },
    web: { bundler: 'metro', output: 'static' },
    plugins: ['expo-router', 'expo-video'],
    experiments: { typedRoutes: true },
    extra: {
      eas: {
        projectId: "8282a1ec-f88e-419d-8730-fbe7a6b2573d"
      },
      domain: "ranchrodeo.pro",
      eventType: "ranchrodeo",
    },
  },
};
