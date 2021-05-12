import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import * as React from 'react';
import { Image, View } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import AllCollectionScreen from '../screens/AllCollectionScreen';
import AllCategoryScreen from '../screens/AllCollectionScreen';
import SingleColectionScreen from '../screens/SingleCollectionScreen';
import ProductPage from '../screens/ProductPage';
import TabOneScreen from '../screens/HomeScreen';
import { BottomTabParamList, CartParamList, CategoriesParamList, FavoriteParamList, HomeParamList, TabOneParamList, TabTwoParamList } from '../types';
import ProductScreen from '../screens/ProductScreen';
import CartScreen from '../screens/CartScreen';
import ShippingAddressSelection from '../screens/ShippingAddressSelection';
import Homescreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import BlogScreen from '../screens/blogScreen';
import FavoriteScreen from '../screens/FavoriteScreen';

const LogoTitle = ({ navigation, props }) =>{
  return(
      <View style={{ flexDirection: "row" }}>
          {/* <Image source={require("../assets/images/1024_black_partner.png")} 
          style={{
              width: 240,
              height: 40
          }}
          /> */}
      </View>
  )
}


const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{ 
        activeTintColor: Colors[colorScheme].tint,
        style: {
          backgroundColor: Colors[colorScheme].background
        }
      }}>
      <BottomTab.Screen
        name="Home"
        component={HomeNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-home" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Categories"
        component={AllCategoryStackNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-list" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Favourites"
        component={FavoriteNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-heart" color={color} />,
        }}
      />
      <BottomTab.Screen
        name="Cart"
        component={CartNavigator}
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="ios-cart" color={color} />,
        }}
      />
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const HomeStack = createNativeStackNavigator<HomeParamList>();

function HomeNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={Homescreen}
        options={{ 
          title: "Home",
          headerShown: false,
          headerTitle: 'Home' 
        }}
      />
      <HomeStack.Screen
        name="SingleCollection"
        component={SingleColectionScreen}
        options={{ 
          title: "Product",
          headerShown: false,
          headerTitle: 'Product' 
        }}
      />
      <HomeStack.Screen
        name="Product"
        component={ProductScreen}
        options={{ 
          title: "Product",
          headerShown: false,
          headerTitle: 'Product' 
        }}
      />
      <HomeStack.Screen
        name="Search"
        component={SearchScreen}
        options={{ 
          title: "Saerch",
          // stackAnimation: "c",
          // stackAnimation: "push",
          stackPresentation: "containedModal",
          headerShown: false,
          headerTitle: 'Saerch' 
        }}
      />
      <HomeStack.Screen
        name="Blog"
        component={BlogScreen}
        options={{ 
          title: "Blog",
          headerShown: false,
          headerTitle: 'Blog' 
        }}
      />
    </HomeStack.Navigator>
  );
}

const AllCategoryStack = createNativeStackNavigator<CategoriesParamList>();

function AllCategoryStackNavigator() {
  return (
    <AllCategoryStack.Navigator>
      <AllCategoryStack.Screen
        name="AllCollections"
        component={AllCollectionScreen}
        options={ ({ navigation, route }) =>  ({ 
          title: "All Collections",
          headerShown: false,
          headerTitle: 'All Collections',
        })}
      />
      <AllCategoryStack.Screen
        name="SingleCollection"
        component={SingleColectionScreen}
        options={ ({ navigation, route }) =>  ({ 
          title: "Collection",
          headerShown: false  
        })}
      />
      <AllCategoryStack.Screen
        name="Product"
        component={ProductScreen}
        options={{ 
          headerShown: false,
          title: "Product page",
          headerTitle: 'Product page',
        }}
      />
    </AllCategoryStack.Navigator>
  );
}

const CartStack = createNativeStackNavigator<CartParamList>();

function CartNavigator() {
  return (
    <CartStack.Navigator>
      <CartStack.Screen
        name="Cart"
        component={CartScreen}
        options={{ 
          title: "Cart",
          headerShown: false,
          headerTitle: 'Cart' 
        }}
      />
      <CartStack.Screen
        name="Product"
        component={ProductScreen}
        options={{ 
          headerShown: false,
          title: "Product page",
          headerTitle: 'Product page',
        }}
      />
    </CartStack.Navigator>
  );
}

const FavoriteStack = createNativeStackNavigator<FavoriteParamList>();

function FavoriteNavigator() {
  return (
    <FavoriteStack.Navigator>
      <FavoriteStack.Screen
        name="Favourites"
        component={FavoriteScreen}
        options={{ 
          title: "Favourites",
          headerShown: false,
          headerTitle: 'Favorite' 
        }}
      />
      <FavoriteStack.Screen
        name="Product"
        component={ProductScreen}
        options={{ 
          headerShown: false,
          title: "Product page",
          headerTitle: 'Product page',
        }}
      />
    </FavoriteStack.Navigator>
  );
}
