import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SharePayload } from '../types/resource';

export type AuthStackParamList = {
  Onboarding: undefined;
  SignIn: { startGoogle?: boolean } | undefined;
};

export type MainStackParamList = {
  Home: undefined;
  Detail: { id: string };
  AddEdit: {
    id?: string;
    sharePayload?: SharePayload;
    requireUrl?: boolean;
  };
  Settings: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainStackParamList>;
};

export type AuthScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type MainScreenProps<T extends keyof MainStackParamList> = NativeStackScreenProps<
  MainStackParamList,
  T
>;
