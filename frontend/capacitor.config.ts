import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.blader.quizapp',
  appName: 'Quizapp',
  webDir: 'out',
  server: {
    "androidScheme":"https"
  },
  android: {
    path: '../mobile/generated/source/android',
  }
};

export default config;
