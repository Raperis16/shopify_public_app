import React, { MutableRefObject } from 'react';
import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity, useColorScheme, Dimensions, ActivityIndicator, ColorSchemeName } from 'react-native';
import { EdgeInsets } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';

import { useLazyQuery, useQuery } from '@apollo/client';
import { Portal } from 'react-native-portalize';
import { Modalize } from 'react-native-modalize';

import { GET_PRODUCT_BY_HANDLE, GET_PRODUCT_RECOMMENDATIONS } from '../graphql/schemas';

import { productByHandleType, imagesEdgesBlockEnum, variantBlock, reduxFavouritesType, reduxCartItemType, colorSchemeType } from "../types"
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { SVG_CheckmarkMedium } from '../assets/svgs/checkmark';
import { PickerModalize } from '../components/PickerModalize';
import { ParamListBase } from '@react-navigation/routers';
import { NavigationProp } from '@react-navigation/core';
import { RenderProductPageHeader } from '../components/productpage/ProductPageHeader';
import { DropdownPickerComponent } from '../components/productpage/DropdownPicker';
import { SVG_CloseMedium } from '../assets/svgs/close';
import HTML from 'react-native-render-html';

import { useDispatch, useSelector } from "react-redux"
import { ADD_ITEM_TO_CART, SET_CART_ITEMS, SET_CHECKOUT_ID, SET_CHECKOUT_URL } from '../redux/asyncStorageRedux';
import shopClient from '../constants/shopify';
import { AppDispatch, RootState } from '../redux/store';


type renderProductPageEnum = {
    colorScheme: colorSchemeType,
    image: imagesEdgesBlockEnum,
    images: Array<imagesEdgesBlockEnum>,
    index: number,
    setCurrentSelectedImage: any,
    currentSelectedImage: number,
    mainBigImageRef?: MutableRefObject<FlatList<any> | undefined>,
    loading: Boolean,
    navigation: NavigationProp<ParamListBase>,
}


const RenderProductImages = ({image , images, index, colorScheme, loading, navigation } : renderProductPageEnum )  =>{
    return(
        <TouchableWithoutFeedback
            onPress={() =>{
                 navigation.navigate("ProductImageViewer", { images: images, openAtIndex: index });
            }}
            style={{
                flex: 1
            }}
        >
           
                <Image
                    defaultSource={ index == 0? require('../assets/images/icon.png') : null}
                    source={{ uri: image.node.transformedSrc }} style={{
                        height: Dimensions.get("screen").height / 2.2,
                        width: Dimensions.get("screen").width,
                    }}
                >
                </Image>
            

        </TouchableWithoutFeedback>
    )
}

const ClickableImage = ({image , index, colorScheme, setCurrentSelectedImage, currentSelectedImage, mainBigImageRef } : renderProductPageEnum )  =>{
    return(
        <View
            style={{
                paddingRight: 8
            }}
        >
            <TouchableOpacity
                onPress={() =>{
                    setCurrentSelectedImage(index);
                    mainBigImageRef.current?.scrollToIndex({ index: index, animated: false });
                }}
                style={{
                    flex: 1,
                }}
                >
                <Image
                    defaultSource={require('../assets/images/icon.png')}
                    resizeMode={"cover"}
                    source={{ uri: image.node.transformedSrc }} style={[{
                        flex: 1,
                        width: 50,
                        aspectRatio: 1,
                        borderRadius: 9,
                    },
                    currentSelectedImage == index?
                        {
                            borderWidth: 2,
                            borderColor: Colors[colorScheme].selectedPicture
                        }: 
                        {

                        }
                ]}
                >

                </Image>
            </TouchableOpacity>
        </View>
    )
}




type variantsType = {
    title: string,
    selected: number,
    values: Array<NonNullable<string>>
}

type defaultScreenType = {
    navigation: NavigationProp<ParamListBase>,
    route: productScreenMainRouteType
}

type productScreenMainRouteType = {
    params: productScreenRouteType
}

type productScreenRouteType = {
    handle: string,
    title?: string
}

type reducerType = {
    type: string,
    payload: any
}

type setPriceForVariantsWhenNoneSelectedType = {
    setSelectedPrice: any,
    minVariantPrice: string,
    maxVariantPrice: string,
    currencyCode: string
}

/** 
*   Sets price for variants
*/
const setPriceForVariantsWhenNoneSelected = (
    {setSelectedPrice, minVariantPrice, maxVariantPrice, currencyCode}: setPriceForVariantsWhenNoneSelectedType) =>{
        // Checks if compare prices are same and if are then don't show min max when not selected
        if(minVariantPrice == maxVariantPrice){
            setSelectedPrice (
                parseFloat(minVariantPrice).toFixed(2)
            )
        }else{
            setSelectedPrice (
                parseFloat(minVariantPrice).toFixed(2)
                + "-" 
                + (currencyCode == "EUR"? "€": "$")
                + parseFloat(maxVariantPrice).toFixed(2)
            )
        }
}
/**
 * 
 * @param {String} title - title of product
 * @param {String=} handle - used to get product data from the GRAHQHL API
 */
export default function ProductScreen({ navigation, route } : defaultScreenType) {
    const colorScheme:colorSchemeType = useColorScheme();
    const insets:EdgeInsets = useSafeAreaInsets();
    const [ currentSelectedImage, setCurrentSelectedImage ] = React.useState<number>(0);
    const mainBigImageRef = React.useRef<FlatList>(null);
    const [ selectedCount, setSelectedCount ] = React.useState<number>(1);
    const [ currentSelectedPrice, setSelectedPrice ] = React.useState<number>(0);
    const [ currentSelectedCompareAtPrice, setSelectedCompareAtPrice ] = React.useState<number>(0.0);
    const initalVariantState:variantsType = {title: "", selected: -1, values: []};
    //REDUX
    const getCartItems = useSelector((state:RootState) => state.storage.cartItems);
    const checkoutID = useSelector((state:RootState) => state.storage.checkoutID);
    const favouritesRedux = useSelector((state:RootState) => state.storage.favouriteItems);
    const dispatch = useDispatch<AppDispatch>();
    ///
    function reducer(state, action:reducerType) {
        switch (action.type) {
            case 'setTitle':
                return { ...state, title: action.payload};
            case 'setSelected':
                return {...state, selected: action.payload};
            case 'setValue':
                return {...state, values: action.payload};
            case 'setInital':
                    return action.payload;
            default:
                throw new Error();
        }
      }
    const [ variant1, setVariant1 ] = React.useReducer(reducer,initalVariantState);
    const [ variant2, setVariant2 ] = React.useReducer(reducer,initalVariantState);
    const [ variant3, setVariant3 ] = React.useReducer(reducer,initalVariantState);
    const pickerModalizeVariant1Ref = React.useRef<Modalize>();
    const pickerModalizeVaraint2Ref = React.useRef<Modalize>();
    const pickerModalizeVaraint3Ref = React.useRef<Modalize>();
    const pickerModalizeQuanityRef = React.useRef<Modalize>();
    const [ productId, setProductId ] = React.useState("");
    const [ productQuantity, setProductQuantity ] = React.useState(100);
    const [ productRecommendations, setProductRecommendations ] = React.useState<productByHandleType>()
    const [ selectedVariant, setSelectedVariant ] = React.useState<variantBlock>()
    /**
     * 0 - product not available
     * 1 - product available
     * 2 - variant not selected
     */
    const [ productReadyForPurchase, setProductReadyForPurchase ] = React.useState(0);
    const [getProductRecommendations] = useLazyQuery<productByHandleType>(GET_PRODUCT_RECOMMENDATIONS, {
        onCompleted: (data) =>{
            setProductRecommendations(data)
        }
    });

    const [displayLoading, seDisplayLoading] = React.useState(false);

    // Loads data from API
    const {loading, error, data, fetchMore, refetch } = useQuery<productByHandleType>(GET_PRODUCT_BY_HANDLE, {
        onCompleted: (data:productByHandleType) =>{
            // If there are no multiple variants then just pick all things from first
            if(data.productByHandle.variants.edges.length == 1){
                let maxVariantPrice:number =   parseFloat( data.productByHandle.priceRange.maxVariantPrice.amount ).toFixed(2);
                setSelectedPrice( 
                    maxVariantPrice
                )
                setSelectedCompareAtPrice(
                    data?.productByHandle.compareAtPriceRange.maxVariantPrice.amount != "0.0" && data?.productByHandle.compareAtPriceRange.maxVariantPrice.amount != data.productByHandle.priceRange.maxVariantPrice.amount
                        ?
                            parseFloat( data.productByHandle.compareAtPriceRange.maxVariantPrice.amount || "0" ).toFixed(2) 
                        : 
                            0.0
                )
                setSelectedVariant(data.productByHandle.variants.edges[0].node)
                setProductId(data.productByHandle.id)
                setProductReadyForPurchase(data.productByHandle.availableForSale? 1 : 0);
                setProductQuantity(data.productByHandle.variants.edges[0].node.quantityAvailable)
            }else{
                let setPrice:NonNullable<Boolean> = false;
                let variant1Disposable:variantsType = initalVariantState;
                let variant2Disposable:variantsType = initalVariantState;
                let variant3Disposable:variantsType = initalVariantState;
                setProductReadyForPurchase(data.productByHandle.availableForSale? 1 : 0);
                data.productByHandle.variants.edges.forEach((item,index:number)=>{
                    // select only those who are available
                    if(item.node.availableForSale){
                        //put all available in matching set so that when user picks variants then we can match with its price

                        // only set for first price and then user can toggle by himself it
                        if(setPrice == false){
                            setPrice = true;
                        }

                        // select only those who are only unique 
                        let addNewValue = true; // checks in loop if we already have an existing value and if no then sets this as false and adds it in values
                        variant1Disposable.values.forEach(item2=>{
                            if(item2 == item.node.selectedOptions[0].value){
                                addNewValue = false;
                            }
                        })
                        // Adds new value
                        if( addNewValue ){
                            variant1Disposable = { 
                                "title": item.node.selectedOptions[0].name,
                                "selected": setPrice == false? index : variant1Disposable.selected,
                                "values": [...variant1Disposable.values, item.node.selectedOptions[0].value]
                            }
                        }
                        addNewValue = true;

                        //Next variant -  same code
                        if(item.node.selectedOptions.length > 1){
                            variant2Disposable.values.forEach(item2=>{
                                if(item2 == item.node.selectedOptions[1].value){
                                    addNewValue = false;
                                }
                            })
                            // Adds new value
                            if( addNewValue ){
                                variant2Disposable = { 
                                    "title": item.node.selectedOptions[1].name,
                                    "selected": setPrice == false? index : variant2Disposable.selected,
                                    "values": [...variant2Disposable.values, item.node.selectedOptions[1].value]
                                }
                            }
                        }
                        addNewValue = true;
                        if(item.node.selectedOptions.length > 2){
                            variant3Disposable.values.forEach(item2=>{
                                if(item2 == item.node.selectedOptions[2].value){
                                    addNewValue = false;
                                }
                            })
                            // Adds new value
                            if( addNewValue ){
                                variant3Disposable = { 
                                    "title": item.node.selectedOptions[2].name,
                                    "selected": setPrice == false? index : variant3Disposable.selected,
                                    "values": [...variant3Disposable.values, item.node.selectedOptions[2].value]
                                }
                            }
                        }
                    }
                })
                setVariant1({
                    type: "setInital",
                    payload: variant1Disposable
                })
                setVariant2({
                    type: "setInital",
                    payload: variant2Disposable
                })
                setVariant3({
                    type: "setInital",
                    payload: variant3Disposable
                })

            }

        },
        variables: { 
            handle: route.params.handle
        },
    });

    const onImagesChangedSelected = async (index:number) =>{
        setCurrentSelectedImage(index)

    }

    const onViewableItemsChanged = React.useCallback(({ viewableItems, changed }) => {
        onImagesChangedSelected(viewableItems[0].index);
    },[])
    
    
    const [refreshing, setRefreshing] = React.useState(false);


    const [ fetchingMoreData, setFetchindMoreData ] = React.useState(true);


    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        refetch();
        setRefreshing(false)
    }, []);

    
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
          
            // dispatch({
            //     type: SET_CART_ITEMS,
            //     payload: {}
            // });
        });
    
        return unsubscribe;
      }, [navigation]);

    React.useEffect(() =>{

        let mySelectedSet = variant1.values[variant1.selected];
        if(variant2.selected != -1){
            mySelectedSet += " / " + variant2.values[variant2.selected] 
        }
        if(variant3.selected != -1){
            mySelectedSet += " / " + variant3.values[variant3.selected] 
        }

        if(data?.productByHandle){
            if( data?.productByHandle.variants.edges.length != 1){
                for (let index = 0; index < data.productByHandle.variants.edges.length; index++) {
                    const item = data.productByHandle.variants.edges[index];
                    if(item.node.title == mySelectedSet){
                        setSelectedVariant(item.node)
                        setProductReadyForPurchase(item.node.availableForSale? 1 : 0);
                        setProductId(item.node.id);
                        setSelectedPrice( parseFloat(item.node.priceV2.amount).toFixed(2) )
                        setProductQuantity(item.node.quantityAvailable)
                        setSelectedCompareAtPrice(
                                item.node.compareAtPriceV2?.amount != "0.0" && item.node.compareAtPriceV2?.amount != item.node.priceV2.amount
                                ?
                                    parseFloat( item.node.compareAtPriceV2?.amount || "0" ).toFixed(2) 
                                : 
                                    0.0
                            )
                        break;
                    }else{
                        setSelectedVariant(undefined);
                        setProductQuantity(100)
                        setProductReadyForPurchase( 2 );
                        setSelectedCompareAtPrice(0.0);
                        setPriceForVariantsWhenNoneSelected({
                            setSelectedPrice: setSelectedPrice,
                            minVariantPrice: data.productByHandle.priceRange.minVariantPrice.amount,
                            maxVariantPrice: data.productByHandle.priceRange.maxVariantPrice.amount,
                            currencyCode: data?.productByHandle.priceRange.maxVariantPrice.currencyCode
                        })
                    }
                    
                }
            }
        }



    },[variant1,variant2,variant3])


      /**
       *Used to set selected value in variant, will be passed in modalize to minimize complexity on that Component 
       */
      const setSelectedVariant1 = ( indexOfSelected: number ) => {
        setVariant1({ type: "setSelected", payload: indexOfSelected })
      }

      /**
       *Used to set selected value in variant, will be passed in modalize to minimize complexity on that Component 
       */
      const setSelectedVariant2 = ( indexOfSelected: number ) => {
        setVariant2({ type: "setSelected", payload: indexOfSelected })
      }

      /**
       *Used to set selected value in variant, will be passed in modalize to minimize complexity on that Component 
       */
      const setSelectedVariant3 = ( indexOfSelected: number ) => {
        setVariant3({ type: "setSelected", payload: indexOfSelected })
      }

      /**
       *Used to set selected quantity
       */
      const setSelectedQuantity = ( index: number ) => {
        setSelectedCount(index+1)
      }


        return (
            <>
            <Portal>
                {/* {displayLoading?
                    <View
                        style={{
                            position:"absolute",
                            width: "100%",
                            height: "100%",
                            justifyContent: "center",
                            backgroundColor: "rgba(0,0,0,.2)"
                        }}
                    >
                        <ActivityIndicator color={"white"}/>
                    </View>
                    : null
                } */}
                <PickerModalize
                    ref={pickerModalizeVariant1Ref}
                    colorScheme={colorScheme}
                    title={variant1?.title || ""}
                    data={variant1?.values || []}
                    selectedValue={variant1?.values[variant1.selected] || 0}
                    setSelectedValue={setSelectedVariant1}
                />
                <PickerModalize
                    ref={pickerModalizeVaraint2Ref}
                    colorScheme={colorScheme}
                    title={variant2?.title || ""}
                    data={variant2?.values || []}
                    selectedValue={variant2?.values[variant2.selected] || 0}
                    setSelectedValue={setSelectedVariant2}
                />
                <PickerModalize
                    ref={pickerModalizeVaraint3Ref}
                    colorScheme={colorScheme}
                    title={variant3?.title || ""}
                    data={variant3?.values || []}
                    selectedValue={variant2?.values[variant2.selected] || 0}
                    setSelectedValue={setSelectedVariant3}
                />
                 <PickerModalize
                    ref={pickerModalizeQuanityRef}
                    colorScheme={colorScheme}
                    title={"Quantity"}
                    data={Array.from( Array(productQuantity).keys(), n => n + 1 )}
                    selectedValue={selectedCount || 0}
                    setSelectedValue={setSelectedQuantity}
                />
            </Portal>
            {/* <SafeAreaView
                style={[
                    styles.container, {
                    backgroundColor: Colors[colorScheme].background,
                    marginBottom: -insets.bottom,
                    marginTop: -insets.top
                }]}
            > */}
                <RenderProductPageHeader
                    onlineStoreUrl={data?.productByHandle.onlineStoreUrl || ""}
                    colorScheme={colorScheme}
                    navigation={navigation}
                    insets={insets}
                    id={data?.productByHandle.id || ""}
                    productNode={data?.productByHandle|| {}}
                    handle={route.params.handle}
                    dispatch={dispatch}
                    isFavourite={favouritesRedux[data?.productByHandle.id || ""] != null? true : false}
                />
                <FlatList
                    style={
                        {
                            backgroundColor: Colors[colorScheme].background,
                        }
                    }
                    ListHeaderComponent={
                        <>
                        
                        <FlatList
                            ref={mainBigImageRef}
                            style={{
                                flex: 1
                            }}
                            horizontal={true}
                            pagingEnabled={true}
                            showsHorizontalScrollIndicator={false}
                            //Comment this when doing development in product page
                            onViewableItemsChanged={onViewableItemsChanged }
                            // viewabilityConfig={{
                            //     itemVisiblePercentThreshold: 50
                            // }}
                            ListEmptyComponent={
                                loading?
                                    <View
                                        style={{
                                            height: Dimensions.get("screen").height / 2.2,
                                            width: Dimensions.get("screen").width,
                                        }}
                                    >
    
                                    </View>
                                : null
                            }
                            data={data?.productByHandle.images.edges}
                            renderItem={({item, index}) => 
                                <RenderProductImages
                                    image={item}
                                    index={index}
                                    colorScheme={colorScheme}
                                    setCurrentSelectedImage={setCurrentSelectedImage}
                                    currentSelectedImage={currentSelectedImage}
                                    loading={loading}
                                    navigation={navigation}
                                    images={data?.productByHandle.images.edges || [SVG_CloseMedium]}
                                />
                            }
                            keyExtractor={item => item.node.id}
                        />
                        
                        
                        {
                            // Small images below the huge one
                        }
                        <FlatList
                            style={{
                                flex: 1,
                                paddingTop: 8,
                                paddingLeft: 20
                            }}
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                            data={data?.productByHandle.images.edges}
                            renderItem={({item, index}) => 
                             <ClickableImage
                                image={item}
                                index={index}
                                colorScheme={colorScheme}
                                currentSelectedImage={currentSelectedImage}
                                setCurrentSelectedImage={setCurrentSelectedImage}
                                mainBigImageRef={mainBigImageRef}
                             />
                            }
                            keyExtractor={item => item.node.id}
    
                        />
                    
                        <View
                            style={{
                                paddingTop: 17,
                                paddingHorizontal: 20
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 19,
                                    fontWeight: "300",
                                    letterSpacing: 0.04,
                                    color: Colors[colorScheme].text
                                }}
                            >
                                {route.params.title? route.params.title : data?.productByHandle.title}
                            </Text>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    marginTop: 17
                                }}
                            >   
                                <View>
                                    <View
                                        style={{
                                            flexDirection: "row"
                                        }}                                
                                    >
                                        <Text
                                            style={{
                                                fontSize: 19,
                                                fontWeight: "600",
                                                letterSpacing: 0.04,
                                                color: Colors[colorScheme].text
                                            }}
                                        >
                                            {data?.productByHandle.priceRange.maxVariantPrice.currencyCode == "EUR"? "€": "$"}
                                           {currentSelectedPrice}
                                            {/* { currentSelectedPrice.toFixed(2)}  */}
                                        </Text>
                                        {
                                            // showcase only if price is not equals to 0 and not equals same as compareAmount
                                            currentSelectedCompareAtPrice != 0.0
                                            ?
                                            <Text
                                                style={{
                                                    marginLeft: 2,
                                                    alignSelf: "flex-end",
                                                    lineHeight: 19,
                                                    fontSize: 14,
                                                    letterSpacing: 0.04,
                                                    color: Colors[colorScheme].gray01,
                                                    textDecorationLine: "line-through",
                                                }}
                                            >
                                                {data?.productByHandle.priceRange.maxVariantPrice.currencyCode == "EUR"? "€": "$"}
                                                {currentSelectedCompareAtPrice}
                                            </Text>
                                            : null
                                        }
    
                                    </View>
                                    {
                                            currentSelectedCompareAtPrice != 0.0
                                            ?
                                            <Text
                                                style={{
                                                    marginTop: 2,
                                                    fontSize: 13,
                                                    lineHeight: 16,
                                                    color: Colors[colorScheme].green
                                                }}
                                            >
                                                You save
                                                {" "}
                                                {data?.productByHandle.priceRange.maxVariantPrice.currencyCode == "EUR"? "€": "$"}
                                                {  ( currentSelectedCompareAtPrice  - currentSelectedPrice).toFixed(2)  }
                                                {" "}
                                                ({ 
                                                    (
                                                        ( 
                                                            ( 
                                                                (
                                                                    currentSelectedCompareAtPrice
                                                                    -
                                                                    currentSelectedPrice
                                                                
                                                                ) * 100 )
                                                                 / currentSelectedCompareAtPrice)  
                                                        ).toFixed(0) 
                                                }% off)
                                            </Text>
                                            :
                                            null
                                    }
                                    <Text
                                        style={{
                                            marginTop: 3,
                                            fontSize: 13,
                                            color: Colors[colorScheme].gray01
                                        }}
                                    >
                                        VAT included
                                    </Text>
                                </View>
                                <View 
                                    style={{
                                        flexDirection: "row",
                                        marginTop: 8
                                    }}
                                >
                                    {loading?
                                    <ActivityIndicator/>
                                    : 
                                    <>
                                        {
                                            productReadyForPurchase == 1 || productReadyForPurchase == 2?
                                                <SVG_CheckmarkMedium
                                                    color={Colors[colorScheme].text}
                                                    width={14}
                                                    height={14}
                                                />
                                            :
                                                <SVG_CloseMedium
                                                    color={Colors[colorScheme].text}
                                                    width={14}
                                                    height={14}
                                                />
    
                                        }
                                        <Text
                                            style={{
                                                marginLeft: 10,
                                                fontSize: 15,
                                                fontWeight: "500",
                                                color: Colors[colorScheme].text
                                            }}
                                        >
                                            {
                                                productReadyForPurchase == 1?
                                                    productQuantity < 5 && productQuantity > 0?
                                                        productQuantity == 1?
                                                            "Last in stock"
                                                        :
                                                            "Last "  + productQuantity + " in stock"
                                                    : 
                                                        "In stock"
                                                : 
                                                productReadyForPurchase == 2?
                                                    "In stock"
                                                :
                                                "Not available"
                                            }
                                        </Text>
                                    </>
                                        
                                    }
                                </View>
                            </View>
                            <View
                                style={{
                                    marginTop: 17
                                }}
                            >
                                {
                                    (data?.productByHandle.variants.edges.length || 0) > 1?
                                        // data?.productByHandle.variants.edges[0].node.selectedOptions.map((item, index:number) =>(
                                            <>
                                            <DropdownPickerComponent
                                                style={{
                                                    marginBottom: 10
                                                }}
                                                key={variant1?.title}
                                                title={variant1?.title || ""}
                                                selectedValue={variant1?.values[variant1.selected] || ""}
                                                setSelectedValue={setVariant1}
                                                colorScheme={colorScheme}
                                                pickerModalizeRef={pickerModalizeVariant1Ref}
                                            />
                                            {
                                                variant2?.values.length != 0?
                                                    <DropdownPickerComponent
                                                        style={{
                                                            marginBottom: 10
                                                        }}
                                                        key={variant2?.title}
                                                        title={variant2?.title || ""}
                                                        selectedValue={variant2?.values[variant2.selected] || ""}
                                                        setSelectedValue={setVariant1}
                                                        colorScheme={colorScheme}
                                                        pickerModalizeRef={pickerModalizeVaraint2Ref}
                                                    />
                                                : null
                                            }
                                            {
                                                variant3?.values.length != 0?
                                                    <DropdownPickerComponent
                                                        style={{
                                                            marginBottom: 10
                                                        }}
                                                        key={variant3?.title}
                                                        title={variant3?.title || ""}
                                                        selectedValue={variant3?.values[variant3.selected] || ""}
                                                        setSelectedValue={setVariant1}
                                                        colorScheme={colorScheme}
                                                        pickerModalizeRef={pickerModalizeVaraint3Ref}
                                                    />
                                                : null
                                            }
                                            </>
                                            
                                        // ))
                                    : null
                                }
                                <DropdownPickerComponent
                                    title={"Quantity"}
                                    selectedValue={selectedCount.toString()}
                                    setSelectedValue={setSelectedCount}
                                    colorScheme={colorScheme}
                                    pickerModalizeRef={pickerModalizeQuanityRef}
                                />
                            </View>
                            <TouchableOpacity
                                disabled={
                                    productReadyForPurchase == 1?
                                    false
                                    :   
                                    true
                                }
                                onPress={() =>{
                                        if( getCartItems != undefined && getCartItems[selectedVariant?.id]){
                                            navigation.navigate("Cart")
                                        }else{
                                            if(checkoutID == null && selectedVariant?.id != undefined && selectedVariant?.id != "" && selectedVariant?.id != null && data != undefined){
                                                seDisplayLoading(true);
                                                shopClient.checkout.create().then((checkout) => {
                                                    dispatch({
                                                        type: SET_CHECKOUT_ID,
                                                        payload: checkout.id
                                                    })
                                                    dispatch({
                                                        type: SET_CHECKOUT_URL,
                                                        payload: checkout.webUrl
                                                    })
                                                    let lineItemsToAdd = [
                                                        {
                                                            variantId: selectedVariant?.id,
                                                            quantity: selectedCount,
                                                        }
                                                    ];
                                                    shopClient.checkout.addLineItems(checkout.id, lineItemsToAdd).then((checkout) => {
                                                        dispatch(
                                                            {
                                                                type: ADD_ITEM_TO_CART,
                                                                payload: {
                                                                    cartItems:{
                                                                        id: data?.productByHandle.id,
                                                                        // should not be case where we recieve empty string id
                                                                        variantId: selectedVariant.id,
                                                                        lineItemId: checkout.lineItems.filter(item => item.title == data?.productByHandle.title )[0].id,
                                                                        handle: route.params.handle,
                                                                        title: data?.productByHandle.title ,
                                                                        quantity: selectedCount,
                                                                        maxQuantity: selectedVariant.quantityAvailable,
                                                                        currencyCode: data?.productByHandle.priceRange.minVariantPrice.currencyCode || "USD",
                                                                        amount: currentSelectedPrice.toString(),
                                                                        imageSrc:  selectedVariant?.image?.transformedSrc != null? selectedVariant?.image.transformedSrc : data?.productByHandle.images.edges[0].node.src 
                                                                    }
                                                                }
                                                            }
                                                        )
                                                        seDisplayLoading(false)
                                                    })
                                                    
                                                }).then
    
                                            }else{
                                                seDisplayLoading(true)
                                                let lineItemsToAdd = [
                                                    {
                                                        variantId: selectedVariant?.id,
                                                        quantity: selectedCount
                                                    }
                                                ];
                                                shopClient.checkout.addLineItems(checkoutID, lineItemsToAdd).then((checkout) => {
                                                    seDisplayLoading(false);
                                                    dispatch({
                                                        type: SET_CHECKOUT_URL,
                                                        payload: checkout.webUrl
                                                    })
                                                    // const filteredResponse = checkout.lineItems.filter(item => item.title == data?.productByHandle.title )
                                                    // console.log(filteredResponse);
                                                    dispatch(
                                                        {
                                                            type: ADD_ITEM_TO_CART,
                                                            payload: {
                                                                cartItems:{
                                                                    id: data?.productByHandle.id,
                                                                    variantId: selectedVariant?.id,
                                                                    lineItemId: checkout.lineItems.filter(item => item.title == data?.productByHandle.title )[0].id,
                                                                    handle: route.params.handle,
                                                                    title: data?.productByHandle.title,
                                                                    quantity: selectedCount,
                                                                    maxQuantity: selectedVariant?.quantityAvailable,
                                                                    currencyCode: data?.productByHandle.priceRange.minVariantPrice.currencyCode,
                                                                    amount: currentSelectedPrice,
                                                                    imageSrc:  selectedVariant?.image?.transformedSrc != null? selectedVariant?.image.transformedSrc : data?.productByHandle.images.edges[0].node.src
                                                                }
                                                            }
                                                        }
                                                    )
                                                })
                                            }
                                        }
                                    }
                                }
                                style={{
                                    marginTop: 18,
                                    borderRadius: 30,
                                    backgroundColor: 
                                        productReadyForPurchase == 1?
                                        Colors[colorScheme].addToCartButton
                                        :   
                                        Colors[colorScheme].gray04
                                    ,
                                    height: 53,
                                    justifyContent: "center",
    
                                }}
                            >
                                {displayLoading?
    
                                <ActivityIndicator/>
                                :
                                <Text
                                    style={{
                                        color: Colors[colorScheme].buyButtonText,
                                        fontWeight: "500",
                                        fontSize: 18,
                                        textAlign: "center",
                                    }}
                                >
                                    
                                   { 
                                   
                                        data?.productByHandle.availableForSale? 
                                             getCartItems != undefined && getCartItems[selectedVariant?.id]?
                                                "View in your cart"
                                            :
                                            productReadyForPurchase == 0?
                                                "Not available"
                                            :   
                                            productReadyForPurchase == 1?
                                                "Add to cart"
                                            :
                                            productReadyForPurchase == 2?
                                                "Select variant"
    
                                            : "Not available"
                                        : 
                                        "Not available" 
                                   }
                                </Text>
                                }
                            </TouchableOpacity>
                            <Text
                                style={{
                                    marginTop: 33,
                                    fontSize: 19,
                                    fontWeight: "500",
                                    color: Colors[colorScheme].text
                                }}
                            >
                                Description
                            </Text>
                            <HTML
                                style={{
                                    marginTop: 10,
                                    fontSize: 15,
                                    fontWeight: "400",
                                    lineHeight: 27.98,
                                    color: Colors[colorScheme].text,
                                    marginBottom: 20,
                                    // letterSpacing: 0.1
                                }} 
                                contentWidth={Dimensions.get("screen").width - 40}
                                containerStyle={{
                                    marginTop: 10,
                                    marginBottom: 20,
                                }}
                                baseFontStyle={{
                                    fontSize: 15,
                                    color: Colors[colorScheme].text,
                                }}
                                source={{ html: data?.productByHandle?.descriptionHtml || "<span></span>"}}
                            /> 
                        </View>
                    </>
                    }
                    data={[]}
                    renderItem={item => <></>}
                    keyExtractor={ index => index }
                />
                    
            {/* </SafeAreaView> */}
            </>
        );
    
}


const styles = StyleSheet.create({
    container: {
        flex: 1
    },
});
