import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import EditarScreen from './src/components/EditarScreen';
import AdicionarScreen from './src/components/AdicionarScreen';
import DicasScreen from './src/screens/DicasScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Editar" component={EditarScreen} />
        <Stack.Screen name="Adicionar" component={AdicionarScreen} />
        <Stack.Screen name="Dicas" component={DicasScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
