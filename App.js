import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
 
import WelcomeScreen from './src/components/screen/WelcomeScreen';
import RegisterScreen from './src/components/screen/RegisterScreen';
import LoginScreen from './src/components/screen/LoginScreen';
import HomeScreen from './src/components/screen/HomeScreen';
import ReportsScreen from './src/components/screen/Reports';
import PerdidosScreen from './src/components/screen/PerdidosScreen';
import PerfilScreen from './src/components/screen/PerfilScreen';
 
const Stack = createNativeStackNavigator();
 
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Reports" component={ReportsScreen} />
        <Stack.Screen name="Perdidos" component={PerdidosScreen} />
        <Stack.Screen name="Perfil" component={PerfilScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
 
 