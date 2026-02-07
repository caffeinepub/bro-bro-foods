import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ai.caffeine.brobrofoods',
  appName: 'Bro Bro Foods',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
    }
  }
};

export default config;
