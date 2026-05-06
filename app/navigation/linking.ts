import * as Linking from 'expo-linking';
import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './types';

const prefix = Linking.createURL('/');

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, 'devault://'],
  config: {
    screens: {
      Auth: {
        screens: {
          Onboarding: 'onboarding',
          SignIn: 'sign-in',
        },
      },
      Main: {
        path: '',
        screens: {
          Home: '',
          Detail: 'resource/:id',
          AddEdit: 'add',
          Settings: 'settings',
        },
      },
    },
  },
};
