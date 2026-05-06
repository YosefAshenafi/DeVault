import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ResourcesProvider } from '../context/ResourcesContext';
import { useAuthUser } from '../hooks/useAuthUser';
import { AddEditResourceScreen } from '../screens/AddEditResourceScreen';
import { DetailScreen } from '../screens/DetailScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import type { MainStackParamList } from './types';

const Stack = createNativeStackNavigator<MainStackParamList>();

function MainStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Detail" component={DetailScreen} options={{ title: 'Resource' }} />
      <Stack.Screen
        name="AddEdit"
        component={AddEditResourceScreen}
        options={{ title: 'Edit', headerShown: false }}
      />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: 'Settings' }} />
    </Stack.Navigator>
  );
}

export function MainNavigator() {
  const { userId } = useAuthUser();
  if (!userId) {
    return null;
  }
  return (
    <ResourcesProvider userId={userId}>
      <MainStack />
    </ResourcesProvider>
  );
}
