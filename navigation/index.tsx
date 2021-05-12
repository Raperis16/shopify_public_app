import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { ColorSchemeName } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import { CheckoutStackParamList, RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';
import { Host } from 'react-native-portalize';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import ModalNavigator from './ModalNavigator';
import ProductImageViewer from '../screens/ProductImageViewer';
import ShippingAddressSelection from '../screens/ShippingAddressSelection';
import ShippingAddressInput from '../screens/ShippingAddressInput';
import ShippingSelection from '../screens/ShippingSelection';
import BlogScreen from '../screens/blogScreen';


// If you are not familiar with React Navigation, we recommend going through the
// "Fundamentals" guide: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Host>
          <RootNavigator />
        </Host>
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={BottomTabNavigator} />
      <Stack.Screen
        name="ProductImageViewer"
        component={ProductImageViewer}
        options={ ({ navigation, route }) =>  ({ 
          title: "Image",
          headerShown: false,
          headerTitle: 'Image',
        })}
      />
       <Stack.Screen
        name="StartCheckoutProcess"
        component={CheckoutNavigator}
        options={ ({ navigation, route }) =>  ({ 
          title: "Image",
          headerShown: false,
          headerTitle: 'Image',
          stackPresentation: "containedModal"
        })}
      />
      <Stack.Screen
        name="NewShippingAddress"
        component={ShippingAddressInput}
        options={ ({ navigation, route }) =>  ({ 
          title: "Image",
          headerShown: false,
          headerTitle: 'Image',
          stackPresentation: "containedModal"
        })}
      />
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}


const CheckoutStack = createNativeStackNavigator<CheckoutStackParamList>();

function CheckoutNavigator() {
  return (
    <CheckoutStack.Navigator>
      <CheckoutStack.Screen
        name="ShippingAddressSelection"
        component={ShippingAddressSelection}
        options={{ 
          title: "ShippingAddressSelection",
          headerShown: false,
          headerTitle: 'ShippingAddressSelection' 
        }}
      />
      <CheckoutStack.Screen
        name="ShippingSelection"
        component={ShippingSelection}
        options={{ 
          title: "ShippingSelection",
          headerShown: false,
          headerTitle: 'ShippingSelection' 
        }}
      />
    </CheckoutStack.Navigator>
  );
}