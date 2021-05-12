import { NavigationProp, ParamListBase } from '@react-navigation/core';
import React from 'react';
import { ColorSchemeName, useColorScheme, View, FlatList, Text, Dimensions, Button, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { EdgeInsets, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GenericHeader } from '../components/GenericHeader';
import Colors from '../constants/Colors';
import { useDispatch, useSelector } from "react-redux"
import { addressType, reduxCartItemInnerType, reduxCartItemType } from '../types';
import { RenderCartItems } from '../components/cartpage/cartItems';
import Svg, { G, Path } from 'react-native-svg';
import { SVG_ChevronBackwardSemibold } from '../assets/svgs/chevron_backward_regular';
import shopClient from '../constants/shopify';
import * as WebBrowser from 'expo-web-browser';
import { REMOVE_ADDRESS_CHECKOUT } from '../redux/asyncStorageRedux';
import { SVG_PlusRegular } from '../assets/svgs/plus';
import WebView from 'react-native-webview';
import { SVG_CloseMedium } from '../assets/svgs/close';
import ExpoStatusBar from 'expo-status-bar/build/ExpoStatusBar';



type defaultScreenType = {
    navigation: NavigationProp<ParamListBase>,
    route: routeType
}

type routeType = {
    params: paramsType
}

type paramsType = {
  url: String
}



export default function ShippingSelection({ navigation, route }: defaultScreenType) {
    const colorScheme: NonNullable<ColorSchemeName> = useColorScheme();
    const dispatch = useDispatch();
    const insets: EdgeInsets = useSafeAreaInsets();
    const shippingAddresses: Array<addressType> = useSelector(state => state.storage.shippingAddresses);
    const checkoutID: Array<addressType> = useSelector(state => state.storage.checkoutID);
    const [ JSinjectLoading, setJSInjectLoading ] = React.useState(true);
    const onMessage = (event) => {

        if(event.nativeEvent.data == "JSDONE"){
          setJSInjectLoading(false);
          return true
        }

    }
    const injectedJavaScript=`
    var x = document.getElementsByClassName("banner");
    var i;
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
   
    window.ReactNativeWebView.postMessage(
        "JSDONE"
      )

    `


    // console.log(shippingAddresses);

    return (
        <>
        <ExpoStatusBar style="dark"/>
        <SafeAreaView
            style={{
                flex: 1,
                marginBottom: -insets.bottom,
                backgroundColor: "white",
            }}
        >
            <View style={{
            paddingTop: 10,
            borderBottomWidth: 1,
            paddingBottom: 17,
            // marginBottom: 20,
            backgroundColor: "white",
            borderBottomColor: "#E5E5EA"
          }}>
            <View
              style={{
                paddingHorizontal: 20,
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                onPress={() =>{
                  navigation.goBack()
                }}
                style={{
                  zIndex: 20000,
                  marginTop: 2,
                  paddingHorizontal: 20,
                  position: "absolute"
                }}
              >

                <SVG_CloseMedium
                  width="13"
                  height="13"
                  color={"black"}
                  />
              </TouchableOpacity>
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: "600",
                  justifyContent: "center",
                  textAlign: "center",
                  color: "black"
                }}
              >
                Shipping address
              </Text>
            </View>
          </View>
            <WebView
                style={{
                    flex: 1,
                    // backgroundColor: Colors[colorScheme].background,
                }}
                onMessage={onMessage}
                injectedJavaScript={injectedJavaScript}
                onShouldStartLoadWithRequest={
                    (navigator) =>{
                      // console.log(navigator)
                        
                      if(navigator.navigationType == "formsubmit"){
                          return true
                      }

                      if(navigator.url.includes("/checkouts/") ){
                        return true
                    }
            
                      return false;
                    }
                }
                source={{ uri: route.params.url }}  
                cacheEnabled={true}
                originWhitelist={["*"]}
                bounces={true}
                domStorageEnabled={true}
                automaticallyAdjustContentInsets={true}
                // scrollEnabled={false} 
                useSharedProcessPool={true}
                decelerationRate={1}
                pagingEnabled={false}
                directionalLockEnabled={false}
                pullToRefreshEnabled={false}
                bounce={true}
                allowsLinkPreview={false}
                sharedCookiesEnabled={true}
                allowsBackForwardNavigationGestures={true}
                allowsInlineMediaPlayback
                allowsFullscreenVideo
                mediaPlaybackRequiresUserAction
                useWebKit
                javaScriptEnabled={true}
            />
         </SafeAreaView>
         </>
    )
}
