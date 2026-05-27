import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: "com.keyce.quizai",
  appName: "QuizAI",
  webDir: 'out',
  server: {
    "androidScheme":"https"
  },
  android: {
    path: '../mobile/generated/source/android',
  }
};

export default config;
