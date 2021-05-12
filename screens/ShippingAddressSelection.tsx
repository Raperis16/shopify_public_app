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
import { REMOVE_ADDRESS_CHECKOUT, SET_CART_ITEMS, SET_CHECKOUT_ID, SET_CHECKOUT_URL } from '../redux/asyncStorageRedux';
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
    startLoadingProcess: Boolean
}



export default function ShippingAddressSelection({ navigation, route }: defaultScreenType) {
    const colorScheme: NonNullable<ColorSchemeName> = useColorScheme();
    const dispatch = useDispatch();
    const insets: EdgeInsets = useSafeAreaInsets();
    const shippingAddresses: Array<addressType> = useSelector(state => state.storage.shippingAddresses);
    const checkoutURL:String = useSelector(state => state.storage.checkoutURL);
    const [ JSinjectLoading, setJSInjectLoading ] = React.useState(true);
    const [ navigatorObject, setNavigatorObject ] = React.useState("");

    const [ showLoadingView, setShowLoadingView ] = React.useState(true);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setShowLoadingView(true)
        });
    
        return unsubscribe;
      }, [navigation]);

    const onMessage = (event) => {

        if(event.nativeEvent.data == "JSDONE"){
            setShowLoadingView(false)
        //   setJSInjectLoading(false);
          return true
        }

        if( navigatorURL.match(/\/dd/g) ){
          event.nativeEvent.data = "Dīzeļdegviela"
        }

        navigation.navigate("SecondLevelScreen", { url: navigatorURL, headerTitle: event.nativeEvent.data  });

    }
    const injectedJavaScript=
    colorScheme == "dark"?
    `
        var x = document.getElementsByClassName("order-summary-toggle");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].style.backgroundColor = "` + Colors[colorScheme].checkoutShowOrderSummary + `";
                x[i].style.borderColor = "` + Colors[colorScheme].checkoutShowOrderSummary + `";
        }

        var x = document.getElementsByClassName("breadcrumb__item");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.color = "` + Colors[colorScheme].gray01 + `";
        }
        var x = document.getElementsByClassName("breadcrumb__item--current");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.color = "` + Colors[colorScheme].text + `";
        }


        //
        //SUMMARY :)
        //


        var x = document.getElementsByClassName("sidebar");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].style.backgroundColor = "` + Colors[colorScheme].checkoutShowOrderSummary + `";
                x[i].style.left = "-3.5%";
                x[i].style.paddinngLeft = "10px";
                x[i].style.width = "107%";
        }

        var x = document.getElementsByClassName("sidebar__content");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].style.marginLeft = "10px";
                x[i].style.marginRight = "10px";
        }
        var x = document.getElementsByClassName("order-summary-toggle__icon");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].style.fill = "` + Colors[colorScheme].mainActionColor + `";
        }

        var x = document.getElementsByClassName("order-summary-toggle__dropdown");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].style.fill = "` + Colors[colorScheme].mainActionColor + `";
        }

        var x = document.getElementsByClassName("order-summary-toggle__text ");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.color = "` + Colors[colorScheme].mainActionColor + `";
        }
        //END

        var x = document.getElementsByClassName("content-box");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].style.backgroundColor = "` + Colors[colorScheme].textInputBackground + `";
                x[i].style.borderColor = "` + Colors[colorScheme].textInputBackground + `";
        }

        var x = document.getElementsByClassName(" review-block__content");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].style.color = "` + Colors[colorScheme].text + `";
        }

        var x = document.getElementsByClassName(" review-block");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].style.borderTopColor = "` + Colors[colorScheme].gray04 + `";
        }
        var x = document.getElementsByClassName("content-box__row");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.borderTopColor = "` + Colors[colorScheme].gray04 + `";
        }
        var x = document.getElementsByClassName("content-box__emphasis");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.color = "` + Colors[colorScheme].gray01 + `";
        }

        var x = document.getElementsByClassName("radio__label__primary");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.color = "` + Colors[colorScheme].text + `";
        }

        var x = document.getElementsByClassName("skeleton-while-loading--inline");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.color = "` + Colors[colorScheme].gray00 + `";
        }

        var x = document.getElementsByClassName("content-box__row--secondary");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.backgroundColor = "` + Colors[colorScheme].gray05 + `";
            x[i].style.borderColor = "` + Colors[colorScheme].gray04 + `";
        }

        
        var x = document.getElementsByClassName("content");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].style.backgroundColor = "` + Colors[colorScheme].background + `";
        }
        var x = document.getElementsByClassName("total-recap__final-price");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].style.color = "` + Colors[colorScheme].text + `";
        }


        var x = document.getElementsByClassName("field__input");
            var i;
            for (i = 0; i < x.length; i++) {
                x[i].style.backgroundColor = "` + Colors[colorScheme].textInputBackground + `";
                x[i].style.borderColor = "` + Colors[colorScheme].textInputBackground + `";
                x[i].style.color = "` + Colors[colorScheme].text + `";
        }

        var x = document.getElementsByClassName("section__title");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.color = "` + Colors[colorScheme].text + `";
        }

        // IF QUANTITY HAS CHANGED
        var x = document.getElementsByClassName('product__description__name');
          var i;
          for (i = 0; i < x.length; i++) {
            x[i].style.color = "` +  Colors[colorScheme].text + `";
          }

          var x = document.getElementsByTagName('tbody');
          var i;
          for (i = 0; i < x.length; i++) {
            x[i].style.color = "` +  Colors[colorScheme].text + `";
          }

          var x = document.getElementsByTagName('th');
          var i;
          for (i = 0; i < x.length; i++) {
            x[i].style.color = "` +  Colors[colorScheme].text  + `";
            x[i].style.borderColor = "` +  Colors[colorScheme].gray04  + `";
          }

          var x = document.getElementsByClassName('section__text');
          var i;
          for (i = 0; i < x.length; i++) {
            x[i].style.borderColor = "` +  Colors[colorScheme].gray01  + `";
          }


          var x = document.getElementsByClassName('stock-problem-table');
          var i;
          for (i = 0; i < x.length; i++) {
            x[i].style.borderBottomColor = "` +  Colors[colorScheme].gray04 + `";
          }

          var x = document.getElementsByClassName(' product__description');
          var i;
          for (i = 0; i < x.length; i++) {
            x[i].style.borderColor = "` +  Colors[colorScheme].gray04 + `";
          }

          var x = document.getElementsByClassName('product-table');
          var i;
          for (i = 0; i < x.length; i++) {
            x[i].style.borderColor = "` +  Colors[colorScheme].gray04 + `";
          }

          //THE END


          var x = document.getElementsByClassName('main__footer');
          var i;
          for (i = 0; i < x.length; i++) {
            x[i].style.borderColor = "` +  Colors[colorScheme].gray04 + `";
          }

        //GLOBAL
        var x = document.getElementsByTagName("body");
        var i;
        for (i = 0; i < x.length; i++) {
        x[i].style.backgroundColor = "` + Colors[colorScheme].background + `"
        }

        var x = document.getElementsByTagName("main-content");
        var i;
        for (i = 0; i < x.length; i++) {
        x[i].style.backgroundColor = "` + Colors[colorScheme].background + `"
        }
        
        var x = document.getElementsByClassName("banner");
        var i;
        for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
        }

        var x = document.getElementsByTagName("html");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.backgroundColor = "` +  Colors[colorScheme].background + `";
        }
        //END
    
        //THANK YOU PAGE
        var x = document.getElementsByClassName('os-order-number');
        var i;
        for (i = 0; i < x.length; i++) {
        x[i].style.color = "` +  Colors[colorScheme].gray01 + `";
        }

        var x = document.getElementsByClassName('os-header__title');
        var i;
        for (i = 0; i < x.length; i++) {
        x[i].style.color = "` +  Colors[colorScheme].text + `";
        }

        var x = document.getElementsByClassName('heading-2 ');
        var i;
        for (i = 0; i < x.length; i++) {
        x[i].style.color = "` +  Colors[colorScheme].text + `";
        }

        var x = document.getElementsByClassName('os-step__description');
        var i;
        for (i = 0; i < x.length; i++) {
        x[i].style.color = "` +  Colors[colorScheme].gray01 + `";
        }

        var x = document.getElementsByClassName('heading-3');
        var i;
        for (i = 0; i < x.length; i++) {
        x[i].style.color = "` +  Colors[colorScheme].text + `";
        }

        // var x = document.getElementsByClassName("address");
        // var i;
        // for (i = 0; i < x.length; i++) {
        //     x[i].style.color = "` +  Colors[colorScheme].text + `";
        // }

        var x = document.getElementsByClassName("content-box");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.color = "` +  Colors[colorScheme].text + `";
        }

        var x = document.getElementsByClassName("payment-method-list__item__info");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.color = "` +  Colors[colorScheme].text + `";
        }

        var x = document.getElementsByClassName("payment-method-list__item__amount");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.color = "` +  Colors[colorScheme].text + `";
        }

        var x = document.getElementsByTagName("h2");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.color = "` +  Colors[colorScheme].text + `";
        }



          //END

        //SUMMARY
        var x = document.getElementsByClassName("payment-due-label__total");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.color = "` +  Colors[colorScheme].text + `";
        }

        var x = document.getElementsByClassName("skeleton-while-loading");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.color = "` +  Colors[colorScheme].text + `";
        }

        var x = document.getElementsByClassName("skeleton-while-loading--lg");
        var i;
        for (i = 0; i < x.length; i++) {
            x[i].style.color = "` +  Colors[colorScheme].text + `";
        }

        //END


        window.ReactNativeWebView.postMessage(
            "JSDONE"
        )

        
        
    `
    :
    `
        var x = document.getElementsByClassName("banner");
        var i;
        for (i = 0; i < x.length; i++) {
        x[i].style.display = "none";
        }

        window.ReactNativeWebView.postMessage(
            "JSDONE"
        )

    `


    const deleteOldCart = async () =>{
          
        dispatch({
            type: SET_CHECKOUT_ID,
            payload: null
        })

        dispatch({
            type: SET_CART_ITEMS,
            payload: {}
        })
        
    }

    // React.useEffect(()=>{

    //     if(navigatorObject.title != null){
    //         if(navigatorObject.title.includes("Thank you") && navigatorObject.url.includes("dialog") ){
                                
    //             deleteOldCart()
    //             // return false
    //         }
    //     }

    // },[navigatorObject])

    return (
        <>
        {/* <ExpoStatusBar style="dark"/> */}
        <SafeAreaView
            style={{
                flex: 1,
                marginBottom: -insets.bottom,
                backgroundColor: Colors[colorScheme].background,
            }}
        >
            <View style={{
            paddingTop: 10,
            borderBottomWidth: 1,
            paddingBottom: 17,
            // marginBottom: 20,
            backgroundColor: Colors[colorScheme].background,
            borderBottomColor: Colors[colorScheme].gray05
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
                  color={Colors[colorScheme].text}
                  />
              </TouchableOpacity>
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: "600",
                  justifyContent: "center",
                  textAlign: "center",
                  color: Colors[colorScheme].text
                }}
              >
                Checkout
              </Text>
            </View>
          </View>
            {
                showLoadingView?
                    <View
                        style={{
                            position: "absolute",
                            marginTop: 91,
                            width: "100%",
                            height: "100%",
                            backgroundColor: Colors[colorScheme].background,
                            zIndex: 200,
                            justifyContent: "center"
                        }}
                    >
                        <ActivityIndicator
                            style={{
                                marginBottom: 91,
                            }}
                            color={Colors[colorScheme].text}/>
                    </View>
                : null
            }
            <WebView
                style={{
                    flex: 1,
                    // backgroundColor: Colors[colorScheme].background,
                }}
                onMessage={onMessage}
                injectedJavaScript={injectedJavaScript}
                onShouldStartLoadWithRequest={
                    (navigator) =>{
                      
                        // if(navigator.url == "about:srcdoc"){
                        //     return true
                        // }
                        if(navigator.title.includes("Thank you")){
                            
                            deleteOldCart()
                        }

                        // All things which were added, are not in stock anymore
                        if(navigator.url.includes("cart")){
                            
                            dispatch({
                                type: SET_CART_ITEMS,
                                payload: {}
                            })

                            dispatch({
                                type: SET_CHECKOUT_ID,
                                payload: null
                            })

                            dispatch({
                                type: SET_CHECKOUT_URL,
                                payload: null
                            })


                            navigation.goBack();
                        }


                        // if(navigator.navigationType == "formsubmit"){
                        //     return true
                        // }

                        // if(navigator.url.includes("/checkouts/") ){
                        //     return true
                        // }

                        setNavigatorObject(navigator);
            
                      return true;
                    }
                }
                source={{ uri: checkoutURL }}  
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
                pullToRefreshEnabled={true}
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
