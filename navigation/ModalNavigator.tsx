import * as React from 'react';
import { useColorScheme } from 'react-native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import ProductImageViewer from '../screens/ProductImageViewer';
import { ModalParamList } from '../types';


const ModalStack = createNativeStackNavigator<ModalParamList>();

export default function ModalNavigator() {
  const colorScheme = useColorScheme();

  return (
    <ModalStack.Navigator>
      <ModalStack.Screen
        name="ProductImageViewer"
        component={ProductImageViewer}
        options={ ({ navigation, route }) =>  ({ 
          title: "Image",
          headerShown: false,
          headerTitle: 'Image',
        })}
      />
    </ModalStack.Navigator>
  );
}