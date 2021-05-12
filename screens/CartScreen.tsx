import { NavigationProp, ParamListBase } from '@react-navigation/core';
import React from 'react';
import { ColorSchemeName, useColorScheme, View, FlatList, Text, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GenericHeader } from '../components/GenericHeader';
import Colors from '../constants/Colors';
import { useDispatch, useSelector } from "react-redux"
import { colorSchemeType, graphqlProductEnum, navigationType, productsEdgesEnum, reduxCartItemInnerType, reduxCartItemType } from '../types';
import { RenderCartItems } from '../components/cartpage/cartItems';
import Svg, { Path } from 'react-native-svg';
import { SVG_ChevronBackwardSemibold } from '../assets/svgs/chevron_backward_regular';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import shopClient from '../constants/shopify';
import * as WebBrowser from 'expo-web-browser';
import { Portal } from 'react-native-portalize';
import { ADD_ITEM_TO_CART, DELETE_ITEM_FROM_CART, SET_CHECKOUT_ID, SET_CHECKOUT_URL, UPDATE_ITEM_IN_CART } from '../redux/asyncStorageRedux';
import { useLazyQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../graphql/schemas';
import { AppDispatch, RootState } from '../redux/store';



type defaultScreenType = {
    route: routeType
} & navigationType

type routeType = {
    params: paramsType
}

type paramsType = {
}

type createCheckoutType = {
    cartItems: reduxCartItemType,
    setLoading?: any,
    dispatch: AppDispatch
} & navigationType


// Creates checkout from cart items and opens web
const createCheckout = async ({ cartItems, navigation, setLoading, dispatch }: createCheckoutType) => {
    if(navigation != null)
        navigation.navigate("StartCheckoutProcess", {"startLoadingProcess": true})
}



export default function CartScreen({ navigation, route }: defaultScreenType) {
    const colorScheme:ColorSchemeName = useColorScheme();
    const insets:EdgeInsets = useSafeAreaInsets();
    const getCartItems = useSelector((state:RootState)  => state.storage.cartItems);
    const dispatch = useDispatch<AppDispatch>();
    const [totalPrice, setTotalPrice] = React.useState<string>("");
    const [currencyCode, setCurrencyCode] = React.useState<string>("USD");
    //used when user presses checkout. For first inital checkout creation process
    const [loading, setLoading] = React.useState<boolean>(false);

    const checkoutID = useSelector((state:RootState) => state.storage.checkoutID);
    const [ cartItemsAPI, setCartItemsAPI ] = React.useState<Array<reduxCartItemInnerType>>();

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = async () => {
        setRefreshing(true);
        getLatestDataFromAPI();
    };

    const [getCartItemsGRAPHQL] = useLazyQuery<graphqlProductEnum>(GET_PRODUCTS, {
        fetchPolicy: "network-only",
        onCompleted: (data:graphqlProductEnum) =>{
            let dummyCartItemsAPI:Array<reduxCartItemInnerType> = [];
            Object.keys(getCartItems).forEach((item) => {
                // data.products.edges.forEach((item) => {
                let objectKey = item;
                let mainNodeItems = (data.products.edges.filter(item => getCartItems[objectKey].id == item.node.id ));
                let variantFound = false;
                if(mainNodeItems.length > 0){

                    mainNodeItems[0].node.variants.edges.forEach(variantItem => {
                        if(getCartItems[variantItem.node.id] != undefined){
                            variantFound = true;
                            let dummyCartItemsAPISingle = {
                                title: mainNodeItems[0].node.title,
                                amount: variantItem.node.priceV2.amount,
                                maxQuantity: variantItem.node.quantityAvailable,
                                id: mainNodeItems[0].node.id,
                                handle: mainNodeItems[0].node.handle,
                                currencyCode: variantItem.node.priceV2.currencyCode,
                                lineItemId: getCartItems[variantItem.node.id].lineItemId,
                                quantity: getCartItems[variantItem.node.id].quantity,
                                imageSrc: variantItem.node.image.transformedSrc,
                                variantId: variantItem.node.id
                            }
                            dummyCartItemsAPI.push(dummyCartItemsAPISingle)
    
                            if(
                                getCartItems[variantItem.node.id].title != mainNodeItems[0].node.title
                            ||  parseFloat(getCartItems[variantItem.node.id].amount || "0") != parseFloat(variantItem.node.priceV2.amount)
                            ||  getCartItems[variantItem.node.id].imageSrc != variantItem.node.image.transformedSrc
                            ){
                                dispatch({
                                    type: UPDATE_ITEM_IN_CART,
                                    payload: {
                                        cartItems: {
                                            variantId: variantItem.node.id,
                                            title: mainNodeItems[0].node.title,
                                            imageSrc: variantItem.node.image.transformedSrc,
                                            amount: variantItem.node.priceV2.amount
                                        }
                                    }
                                })
                            }
    
                            //Check if item is not available anymore
                            if(variantItem.node.quantityAvailable <= 0){
                                dispatch({
                                    type: ADD_ITEM_TO_CART,
                                    payload: {
                                        cartItems: {
                                            variantId: variantItem.node.id,
                                            quantity: 0,
                                            maxQuantity: 0
                                        }
                                    }
                                })
                                let lineItemsToAdd = [
                                    getCartItems[variantItem.node.id].lineItemId
                                ];
                                shopClient.checkout.removeLineItems(checkoutID, lineItemsToAdd).then((checkout) => {})
                            //Check if product is back again in the sell, if yes set it back to 1 quantity
                            }else if(variantItem.node.quantityAvailable >= 0 && getCartItems[variantItem.node.id].quantity == 0){
                                dispatch({
                                    type: ADD_ITEM_TO_CART,
                                    payload: {
                                        cartItems: {
                                            variantId: variantItem.node.id,
                                            quantity: 1,
                                            maxQuantity: variantItem.node.quantityAvailable
                                        }
                                    }
                                })
                                let lineItemsToAdd = [
                                    {
                                        quantity: 1,
                                        variantId: variantItem.node.id,
                                    }
                                ];
                                shopClient.checkout.addLineItems(checkoutID, lineItemsToAdd).then((checkout) => {
                                })
                            //Update max quantity
                            }else if(variantItem.node.quantityAvailable != getCartItems[variantItem.node.id].maxQuantity ){
                                if(getCartItems[variantItem.node.id].quantity > variantItem.node.quantityAvailable){
                                    let lineItemsToAdd = [
                                        {
                                            quantity: variantItem.node.quantityAvailable,
                                            id: getCartItems[variantItem.node.id].lineItemId
                                        }
                                    ];
                                    shopClient.checkout.updateLineItems(checkoutID, lineItemsToAdd).then((checkout) => {
                                    })
                                }
                                dispatch({
                                    type: ADD_ITEM_TO_CART,
                                    payload: {
                                        cartItems: {
                                            variantId: variantItem.node.id,
                                            //quantity 0, because we won't want to add new items, 
                                            quantity: getCartItems[variantItem.node.id].quantity <= variantItem.node.quantityAvailable? 0 : variantItem.node.quantityAvailable,
                                            maxQuantity: variantItem.node.quantityAvailable
                                        }
                                    }
                                })
                            }
                            
                        }
                    });   
                    if(variantFound == false){
                        dispatch({
                            type: DELETE_ITEM_FROM_CART,
                            payload: {
                                cartItems: {
                                    variantId: variantItem.node.id
                                }
                            }
                        })
                    }
                }else{
                    dispatch({
                        type: DELETE_ITEM_FROM_CART,
                        payload: {
                            cartItems: {
                                variantId: variantItem.node.id
                            }
                        }
                    })
                }
            });
            setCartItemsAPI(dummyCartItemsAPI)
            setTimeout(() => setRefreshing(false) , 500)
        },
        onError: (error) =>{
            console.log(error)
            setRefreshing(false);
        },
    })

    const getLatestDataFromAPI = async () => {
        let queryForGRAPQHL = "";
        for (const key in getCartItems) {
            queryForGRAPQHL = queryForGRAPQHL + " OR '" + getCartItems[key].handle + "'"
        }

        
        getCartItemsGRAPHQL({
            variables: {
                first: 100,
                query: queryForGRAPQHL
            },
        })
        
    }

    const refreshPrice = async () =>{
        let totalPriceDisposable = 0;

        for (const key in getCartItems) {
            if(cartItemsAPI?.filter(item => item.variantId == key).length != 0){ 
                totalPriceDisposable += getCartItems[key].quantity * getCartItems[key].amount  
                setCurrencyCode(getCartItems[key].currencyCode);
            }
        }
        if(totalPriceDisposable != 0){
            setTotalPrice(totalPriceDisposable.toFixed(2));
        }
    }

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getLatestDataFromAPI()

        });
    
        return unsubscribe;
      }, [navigation]);


    React.useEffect(() => {

        refreshPrice();

        if(Object.keys(getCartItems).length == 0){
            dispatch({
                type: SET_CHECKOUT_ID,
                payload: null
            })
        }

    }, [getCartItems, cartItemsAPI]);


    // React.useEffect(() => {
    //     getLatestDataFromAPI();
    // }, [getCartItems]);

    React.useEffect(() => {

        refreshPrice();


    }, [cartItemsAPI]);

    return (
        <>
            <Portal>
            {
                    loading? 
                        <View
                            style={{
                                position: "absolute",
                                width: "100%",
                                height: Dimensions.get("screen").height,
                                zIndex: 1100,
                                backgroundColor: "rgba(166,166,166,0.5)",
                                justifyContent: "center",
                                alignItems: "center"
                            }}
                        >
                            <ActivityIndicator color={"black"}/>
                        </View>
                    : null
            }
            </Portal>
            {/* <SafeAreaView
                style={{
                    flex: 1,
                    marginBottom: -insets.bottom,
                    backgroundColor: Colors[colorScheme || "light"].background
                }}
            > */}
                {
                    Object.keys(getCartItems).length > 0 ?

                        <View
                            style={{
                                position: "absolute",
                                zIndex: 20,
                                bottom: 0,
                                backgroundColor: Colors[colorScheme  || "light" ].cartCheckoutBanner
                            }}
                        >
                            <View
                                style={{
                                    // backgroundColor: Colors[colorScheme].cartCheckoutBanner,
                                    backgroundColor: Colors[colorScheme  || "light" ].cartCheckoutBanner,
                                    width: Dimensions.get("window").width,
                                    height: 65,
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    paddingHorizontal: 25,
                                    shadowColor: "#000",
                                    shadowOffset: {
                                        width: 0,
                                        height: -2,
                                    },
                                    shadowOpacity: colorScheme == "light" ? 0.15 : 0,
                                    shadowRadius: 1.84,

                                    elevation: 3
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: "600",
                                        color: Colors[colorScheme || "light" ].cartCheckoutBannerText
                                    }}
                                >
                                    Total :  {currencyCode == "EUR" ? "€" : "$"}{totalPrice}
                                </Text>

                                <TouchableWithoutFeedback
                                    style={{
                                        // backgroundColor: "yellow",
                                        paddingVertical: 7
                                    }}
                                    onPress={() => {
                                        createCheckout({ cartItems: getCartItems, navigation, setLoading, dispatch: dispatch });
                                    }}
                                    >
                                    <View
                                        style={{
                                            backgroundColor: 
                                                Colors[colorScheme || "light" ].cartCheckoutBannerButtonBackground != Colors[colorScheme || "light" ].cartCheckoutBanner?
                                                    Colors[colorScheme || "light" ].cartCheckoutBannerButtonBackground
                                                    :
                                                    undefined
                                                ,
                                            paddingHorizontal: 
                                                Colors[colorScheme || "light" ].cartCheckoutBannerButtonBackground != Colors[colorScheme || "light" ].cartCheckoutBanner?
                                                     20 : 0,
                                            borderRadius: 
                                                Colors[colorScheme || "light" ].cartCheckoutBannerButtonBackground != Colors[colorScheme || "light" ].cartCheckoutBanner?
                                                    60 : 0,
                                            paddingVertical: 13,
                                            flexDirection: "row",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: "600",
                                                color: Colors[colorScheme || "light" ].cartCheckoutBannerButtonText
                                            }}
                                        >
                                            Checkout
                                        </Text>
                                        <SVG_ChevronBackwardSemibold
                                            style={{
                                                transform: [
                                                    { rotateX: "0deg" },
                                                    { rotateZ: "-180deg" }
                                                ],
                                                marginTop: 3,
                                                marginLeft: 10,
                                            }}
                                            width={14}
                                            height={14}
                                            color={Colors[colorScheme || "light" ].cartCheckoutBannerButtonText}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    : null
                }
                <FlatList
                    refreshControl={
                        <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        />
                    }
                    ListHeaderComponent={
                        <View
                            style={{
                                flex: 1,
                                paddingHorizontal: 20,
                                paddingTop: 15,
                                marginBottom: 9,
                            }}
                        >
                            <GenericHeader
                                colorScheme={colorScheme || "light" }
                                title={"Cart (" + Object.keys(getCartItems || {}).length + ")"}
                                subtitle={Object.keys(getCartItems || {}).length == 0 ? "Your cart is empty" : null}
                            />
                        </View>
                    }
                    style={{
                        paddingTop: insets.top,
                        marginBottom: 65,
                        backgroundColor: Colors[colorScheme || "light"].background
                    }}
                    ListEmptyComponent={
                        <View style={{
                            paddingHorizontal: 20
                        }}>
                            <Svg width="240" height="307" viewBox="0 0 240 307" >
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M81.2106 45.8191C77.1102 41.0061 74.335 35.1077 74.7988 28.4984C76.1349 9.45508 102.644 13.6444 107.8 23.2558C112.957 32.8672 112.344 57.2474 105.68 58.9653C103.022 59.6503 97.3602 57.9722 91.5979 54.499L95.2148 80.0874H73.8584L81.2106 45.8191Z" fill="#B28B67" />
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M117.262 9.93147C116.82 8.37695 115.631 7.04595 114.028 6.65108C113.639 6.5553 113.237 6.51662 112.837 6.53275C112.694 6.53847 112.654 6.57985 112.587 6.47951C112.537 6.40512 112.536 6.22337 112.515 6.13595C112.451 5.86409 112.372 5.59563 112.274 5.33411C111.938 4.44217 111.374 3.65278 110.695 2.98781C109.424 1.74377 107.706 0.88519 105.922 0.729861C104.946 0.644891 103.976 0.803552 103.053 1.12122C102.575 1.28567 102.112 1.49044 101.66 1.71683C101.524 1.78497 101.083 2.11871 100.947 2.09709C100.796 2.07325 100.494 1.69889 100.371 1.60492C98.8571 0.443337 96.9875 -0.01336 95.1017 0.000296677C92.9732 0.0163267 90.9236 0.122685 89.1484 1.42025C88.7726 1.69497 88.4147 1.99576 88.0739 2.31243C87.8945 2.47916 87.7207 2.65214 87.5549 2.8323C87.4549 2.941 87.3575 3.05215 87.2638 3.16628C87.1047 3.36 87.1302 3.42364 86.9075 3.28847C86.0532 2.76942 85.0631 2.52667 84.066 2.64921C83.4738 2.72203 82.8977 2.8998 82.3507 3.13379C82.1645 3.21344 81.7334 3.53117 81.5349 3.53427C81.3379 3.5373 80.9129 3.24277 80.71 3.16791C79.6144 2.76346 78.4335 2.66377 77.2819 2.85065C76.094 3.0435 74.9271 3.51744 73.9207 4.17236C73.4366 4.4874 73.0142 4.83645 72.675 5.30489C72.5285 5.50715 72.3961 5.72109 72.2301 5.90862C72.1329 6.01843 71.9405 6.1311 71.8883 6.27006C71.9195 6.18685 70.5892 5.67399 70.4637 5.64121C69.7949 5.46654 69.1139 5.50195 68.459 5.71747C67.2275 6.12274 66.1684 7.03158 65.298 7.96338C64.851 8.44199 64.4597 8.97103 64.1277 9.53467C63.9685 9.80466 63.823 10.0824 63.6898 10.366C63.6253 10.5033 63.5825 10.6752 63.4975 10.799C63.3879 10.9585 63.3143 10.9615 63.1159 11.031C62.108 11.3841 61.1893 11.9818 60.4896 12.7893C59.7819 13.6064 59.3227 14.6125 59.1302 15.6721C59.1189 15.7345 59.1121 15.9931 59.0756 16.0269C59.0255 16.0734 58.8228 16.0528 58.7461 16.0618C58.4806 16.093 58.217 16.1393 57.9569 16.2009C57.4774 16.3144 57.0107 16.4814 56.5692 16.6999C54.8482 17.5514 53.6175 19.1477 53.0152 20.944C52.3832 22.8291 52.3944 24.9889 53.1497 26.8388C53.2718 27.1376 53.4169 27.4276 53.5875 27.702C53.6922 27.8704 53.726 27.8708 53.658 28.0475C53.5822 28.2441 53.4438 28.4351 53.3538 28.6272C53.0602 29.2541 52.8549 29.919 52.7253 30.598C52.5126 31.7119 52.4072 32.8825 52.617 34.0049C52.7144 34.526 52.8842 35.0355 53.1432 35.4997C53.2752 35.7363 53.4297 35.9608 53.6042 36.1684C53.6948 36.2762 53.791 36.3792 53.8916 36.4779C53.9491 36.5342 54.0246 36.5835 54.0735 36.6465C54.1929 36.7999 54.218 36.6737 54.1564 36.8991C54.0703 37.2141 53.8751 37.525 53.7555 37.8315C53.6324 38.1474 53.521 38.4677 53.4192 38.7911C53.2129 39.446 53.0385 40.1127 52.9295 40.7909C52.7201 42.0929 52.7568 43.4803 53.3727 44.6753C53.636 45.1865 54.0138 45.6349 54.472 45.9837C54.6963 46.1543 54.9392 46.3014 55.194 46.4222C55.325 46.4844 55.4921 46.511 55.5519 46.6377C55.6162 46.7738 55.5207 47.0442 55.499 47.1965C55.3096 48.5208 55.2146 49.9113 55.6083 51.2091C55.9709 52.4045 56.7692 53.4599 57.8057 54.1586C59.8164 55.5141 62.5268 55.4376 64.6395 54.3525C65.1903 54.0696 65.7055 53.7184 66.1651 53.3041C67.3354 54.8796 69.7438 54.8298 71.4543 54.3808C73.5853 53.8216 75.2953 52.3398 76.2805 50.3928C77.6277 52.0328 80.4549 51.5007 81.3891 49.7216C81.6177 49.2862 81.7534 48.8063 81.8201 48.3207C81.8553 48.0653 81.8328 47.8077 81.8592 47.5543C81.8929 47.2315 82.1086 46.9178 82.2325 46.6055C82.4739 45.9978 82.6238 45.37 82.6302 44.7144C82.6336 44.3721 82.5902 44.0386 82.5577 43.699C82.5284 43.3934 82.6132 43.1086 82.6613 42.807C82.1148 42.897 81.4489 42.7496 80.934 42.5911C80.4287 42.4356 79.9554 42.026 79.5987 41.6519C78.7706 40.7833 78.2647 39.6446 77.9187 38.5113C77.1593 36.024 77.4706 33.0397 79.9724 31.6746C81.1379 31.0386 84.6295 31.0407 86.0177 31.355C87.4772 31.6855 89.1319 34.9061 89.2133 35.2088C89.2637 35.3962 89.2384 35.628 89.4105 35.7529C89.7887 36.0274 90.4125 35.551 90.6915 35.3159C91.1729 34.9102 91.5164 34.3703 91.8138 33.8231C92.4618 32.631 92.9842 31.3525 93.3533 30.0474C93.6378 29.0412 93.8197 28.0036 94.1915 27.0231C94.5616 26.0474 95.1449 25.1753 96.0519 24.6226C97.0385 24.0213 98.1694 23.7047 99.2525 23.3268C100.326 22.9523 101.381 22.4946 102.213 21.7001C102.396 21.5253 102.574 21.3397 102.721 21.134C102.838 20.9716 102.953 20.6607 103.13 20.5577C103.405 20.3975 103.807 20.8141 104.045 20.9653C105.22 21.7116 106.201 22.7523 106.991 23.8893C107.777 25.0201 108.423 26.1082 108.947 27.3709C109.336 28.3073 109.578 29.5067 110.262 30.2741C110.568 30.6168 112.837 30.8241 113.572 30.525C114.308 30.2258 115.131 29.4489 115.378 28.9621C115.631 28.4638 115.691 27.9164 115.583 27.3709C115.52 27.0499 115.39 26.7501 115.319 26.4349C115.259 26.1701 115.205 25.9198 115.076 25.6773C114.832 25.2176 114.415 24.8872 113.912 24.749C114.435 24.2661 114.869 23.6885 115.17 23.0427C115.482 22.3719 115.746 21.556 115.821 20.8197C115.882 20.2216 115.788 19.602 115.461 19.088C115.117 18.5489 114.509 18.1971 113.982 17.8608C114.786 17.2317 115.475 16.4665 116.04 15.6194C117.141 13.972 117.821 11.8955 117.262 9.93147Z" fill="#191847" />
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M14.2376 191.318H116.57C124.434 191.318 130.808 197.693 130.808 205.556V287.423C130.808 295.286 124.434 301.66 116.57 301.66H14.2376C6.37439 301.66 0 295.286 0 287.423V205.556C0 197.693 6.37439 191.318 14.2376 191.318ZM28.4752 216.234C26.5094 216.234 24.9158 217.828 24.9158 219.794V273.185C24.9158 275.151 26.5094 276.744 28.4752 276.744H102.333C104.299 276.744 105.892 275.151 105.892 273.185V219.794C105.892 217.828 104.299 216.234 102.333 216.234H28.4752Z" fill="#C5CFD6" />
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M194.441 298.688C183.039 273.453 174.794 251.479 171.484 239.886C165.817 220.036 161.506 202.569 160.417 196.046C157.818 180.49 180.404 179.585 183.39 187.315C187.908 199.016 195.797 237.459 205.275 295.527L194.441 298.688ZM62.1904 219.494C72.6513 215.359 109.285 202.419 126.953 198.758C132.03 197.706 136.951 196.729 141.577 195.846C155.329 193.22 162.454 218.029 149.209 219.935C116.225 224.682 69.4645 229.585 65.4628 230.135C59.8543 230.906 55.6161 222.093 62.1904 219.494Z" fill="#B28B67" />
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M150.018 189.019L93.4346 160.215V153.944H100.164C154.905 167.893 182.878 176.833 184.082 180.763C184.095 180.805 184.107 180.847 184.118 180.89C184.146 180.926 184.173 180.962 184.199 180.999C195.048 195.919 201.545 268.76 203.678 274.214L182.889 277.315C174.937 247.827 149.495 227.285 150.171 191.967C149.988 190.931 149.942 189.948 150.018 189.019Z" fill="#1F28CF" />
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M98.1332 206.126C92.9559 205.089 88.1883 204.165 84.1087 203.449C57.7572 198.827 50.0729 184.721 54.6163 153.944H103.168C111.1 156.223 152.317 173.508 173.702 182.701C187.856 188.786 183.394 210.721 175.379 216.43C175.336 216.78 175.191 217.018 174.934 217.124C131.817 234.995 97.7077 225.618 86.3131 228.614L81.0427 211.988L98.1332 206.126Z" fill="#2B44FF" />
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M65.7667 216.852C62.9417 217.122 60.9363 217.546 59.7505 218.124C58.3082 218.828 56.3208 220.095 53.7882 221.925C54.6043 223.598 61.9381 238.635 75.7897 267.035C80.2369 266.317 81.999 264.62 81.0762 261.943C80.1534 259.267 79.4091 257.033 78.8433 255.241L77.9642 229.715C77.9473 229.224 77.5355 228.84 77.0443 228.857C77.0359 228.857 77.0275 228.857 77.0191 228.858L73.0926 229.105C70.8613 227.299 69.3892 225.665 68.6763 224.203C68.097 223.015 67.7767 221.141 67.7154 218.581L67.7154 218.581C67.6918 217.598 66.8762 216.82 65.8935 216.844C65.8512 216.845 65.8089 216.848 65.7667 216.852Z" fill="#E4E4E4" />
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M189.25 294.01C188.255 296.667 187.757 298.656 187.757 299.975C187.757 301.58 188.024 303.921 188.559 307C190.42 307 207.15 307 238.748 307C240.052 302.688 239.299 300.36 236.489 300.017C233.679 299.673 231.345 299.362 229.486 299.085L206.159 288.686C205.71 288.486 205.184 288.687 204.984 289.136C204.98 289.144 204.977 289.152 204.974 289.159L203.474 292.797C200.873 294.01 198.759 294.617 197.133 294.617C195.812 294.617 193.987 294.084 191.658 293.016L191.658 293.016C190.765 292.607 189.709 292.999 189.299 293.892C189.281 293.931 189.265 293.97 189.25 294.01Z" fill="#E4E4E4" />
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M145.085 139.816L170.293 164.408C177.627 167.536 183.637 170.991 188.321 174.771C189.375 176.042 190.522 178.477 185.565 177.387C180.609 176.298 175.346 175.375 174.414 176.987C173.483 178.599 176.228 181.069 174.506 183.178C173.358 184.585 169.498 180.111 162.925 169.758L136.713 154.303L145.085 139.816ZM33.1985 143.285L51.7941 143.358C40.3122 180.423 34.1137 200.09 33.1985 202.358C31.1395 207.461 35.4967 215.233 37.3601 219.409C31.2913 222.125 31.9379 212.068 24.2822 215.629C17.2945 218.88 11.979 224.771 3.90566 219.789C2.91309 219.177 1.8254 216.871 4.4534 215.069C11.0007 210.579 20.4358 202.722 21.7106 200.136C23.449 196.609 27.2784 177.659 33.1985 143.285Z" fill="#B28B67" />
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M86.0447 65.2552L93.7394 63.9354C106.987 97.0293 130.116 127.099 163.127 154.145L138.182 184.451C105.176 145.941 84.8303 106.209 86.0447 65.2552Z" fill="#191847" />
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M52.498 161.954H121.017C105.142 123.357 97.2053 90.5689 97.2053 63.5903L76.5366 60.5107C60.293 86.6355 55.7058 118.8 52.498 161.954Z" fill="#DDE3E9" />
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M76.1003 60.5254C76.103 60.5205 76.1057 60.5156 76.1084 60.5107H77.4576C79.0719 60.5663 81.5309 60.6665 84.8343 60.8112L89.8286 75.0838C90.3569 92.4854 93.442 127.554 99.0839 180.291H54.1687C54.2864 183.933 54.4806 187.609 54.7511 191.319H21.3545C26.35 134.96 44.5931 91.3567 76.0838 60.5107L76.1003 60.5254V60.5254Z" fill="#2F3676" />
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M57.1352 133.687C58.4135 156.391 61.6139 172.043 66.7365 180.641H54.1799C53.6302 164.306 54.6153 148.655 57.1352 133.687V133.687Z" fill="black" fill-opacity="0.1" />
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M64.166 153.056L86.3136 142.76V153.056H64.166Z" fill="white" fill-opacity="0.2" />
                            </Svg>
                        </View>
                    }
                    data={Object.keys(getCartItems)}
                    renderItem={
                        ({ item, index }) =>
                            <RenderCartItems
                                colorScheme={colorScheme || "light" }
                                id={getCartItems[item].id}
                                lineItemId={getCartItems[item].lineItemId}
                                handle={getCartItems[item].handle}
                                variantId={getCartItems[item].variantId}
                                title={getCartItems[item].title}
                                quantity={getCartItems[item].quantity }
                                maxQuantity={getCartItems[item].maxQuantity}
                                amount={getCartItems[item].amount}
                                currencyCode={getCartItems[item].currencyCode}
                                imageSrc={getCartItems[item].imageSrc}
                                dispatch={dispatch}
                                navigation={navigation}
                                checkoutID={checkoutID || ""}
                                setLoading={setLoading}
                                getLatestDataFromAPI={getLatestDataFromAPI}
                            />
                    }
                    keyExtractor={(item) => getCartItems[item].variantId}
                />
            {/* </SafeAreaView> */}
        </>
    )
}
