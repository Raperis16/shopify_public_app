import { NavigationProp, ParamListBase } from '@react-navigation/core';
import React from 'react';
import { ColorSchemeName, useColorScheme, View, FlatList, Text, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GenericHeader } from '../components/GenericHeader';
import Colors from '../constants/Colors';
import { useDispatch, useSelector } from "react-redux"
import { colorSchemeType, graphqlProductEnum, productsEdgesEnum, reduxCartItemInnerType, reduxCartItemType, reduxFavouritesType } from '../types';
import { RenderCartItems } from '../components/cartpage/cartItems';
import Svg, { Path } from 'react-native-svg';
import { SVG_ChevronBackwardSemibold } from '../assets/svgs/chevron_backward_regular';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import shopClient from '../constants/shopify';
import * as WebBrowser from 'expo-web-browser';
import { Portal } from 'react-native-portalize';
import { ADD_ITEM_TO_CART, REMOVE_FAVOURITE, SET_CHECKOUT_ID, SET_CHECKOUT_URL, UPDATE_FAVOURITE } from '../redux/asyncStorageRedux';
import { useLazyQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../graphql/schemas';
import { RenderProductList } from '../components/RenderProductList';
import { AppDispatch, RootState } from '../redux/store';



type defaultScreenType = {
    navigation: NavigationProp<ParamListBase>,
    route: routeType
}

type routeType = {
    params: paramsType
}

type paramsType = {
}



export default function FavoriteScreen({ navigation, route }: defaultScreenType) {
    const colorScheme:ColorSchemeName = useColorScheme();
    const insets: EdgeInsets = useSafeAreaInsets();
    const favoruiteItemsRedux = useSelector((state:RootState) => state.storage.favouriteItems);
    const dispatch = useDispatch<AppDispatch>();
    //used when user presses checkout. For first inital checkout creation process
    const [loading, setLoading] = React.useState<boolean>(false);
    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = async () => {
        if(Object.keys(favoruiteItemsRedux || {}).length > 0 ){
            setRefreshing(true);
            getLatestDataFromAPI();
        }
    };
    
    const [getFavouritesGRAPHQL] = useLazyQuery<graphqlProductEnum>(GET_PRODUCTS, {
        fetchPolicy: "network-only",
        onCompleted: (data:graphqlProductEnum) =>{
            Object.keys(favoruiteItemsRedux).forEach((item) => {
                let objectKey = item;
                let foundObject = data.products.edges.filter(item => item.node.id == objectKey)
                if(foundObject.length > 0){
                    if(
                        foundObject[0].node.title != favoruiteItemsRedux[foundObject[0].node.id].node.title ||
                        foundObject[0].node.priceRange.maxVariantPrice.amount != favoruiteItemsRedux[foundObject[0].node.id].node.priceRange.maxVariantPrice.amount ||
                        foundObject[0].node.priceRange.minVariantPrice.amount != favoruiteItemsRedux[foundObject[0].node.id].node.priceRange.minVariantPrice.amount || 
                        foundObject[0].node.compareAtPriceRange.maxVariantPrice.amount != favoruiteItemsRedux[foundObject[0].node.id].node.compareAtPriceRange.maxVariantPrice.amount ||
                        foundObject[0].node.compareAtPriceRange.minVariantPrice.amount != favoruiteItemsRedux[foundObject[0].node.id].node.compareAtPriceRange.minVariantPrice.amount || 
                        foundObject[0].node.images.edges[0].node.transformedSrc != favoruiteItemsRedux[foundObject[0].node.id].node.images.edges[0].node.transformedSrc ||
                        foundObject[0].node.availableForSale != favoruiteItemsRedux[foundObject[0].node.id].node.availableForSale
                    ){
                        dispatch({
                            type: UPDATE_FAVOURITE,
                            payload: {
                                favouriteItems: foundObject[0]
                            }
                        })
                    }
                }else{
                    dispatch({
                        type: REMOVE_FAVOURITE,
                        payload: {
                            favouriteItems: foundObject[0]
                        }
                    })
                }
            }),

            setTimeout(() => setRefreshing(false) , 500)
        },
        onError: (error) =>{
            console.log(error)
            setRefreshing(false);
        },
    })

    const getLatestDataFromAPI = async () => {

        if(Object.keys(favoruiteItemsRedux || {}).length > 0 ){
            let queryForGRAPQHL = "";
            for (const key in favoruiteItemsRedux) {
                queryForGRAPQHL = queryForGRAPQHL + " OR '" + favoruiteItemsRedux[key].node.handle + "'"
            }
            
            getFavouritesGRAPHQL({
                variables: {
                    first: 100,
                    query: queryForGRAPQHL
                },
            })
        }
        
    }


    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getLatestDataFromAPI()
        });
    
        return unsubscribe;
      }, []);


    React.useEffect(() => {

        getLatestDataFromAPI()

    }, [favoruiteItemsRedux]);


    return (
        <View
            style={{
                backgroundColor: Colors[colorScheme || "light"].background,
                flex: 1
            }}
        >
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
                <FlatList
                    style={{
                        marginTop: insets.top,
                        backgroundColor: Colors[colorScheme || "light"].background,
                        width: "100%",
                    }}
                    refreshControl={
                        <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        />
                    }
                    initialNumToRender={1}
                    numColumns={2}
                    columnWrapperStyle={{
                        justifyContent: "space-between",
                        flexWrap: "wrap"
                    }}
                    contentContainerStyle={{
                        paddingVertical: 15,
                        paddingHorizontal: 20,
                    }}
                    ListHeaderComponent={
                        <View
                            style={{
                            }}
                        >
                            <GenericHeader
                                colorScheme={colorScheme || "light"}
                                title={"Favourites"}
                                subtitle={Object.keys(favoruiteItemsRedux || {}).length == 0 ? "No favourites found" : null}
                            />
                        </View>
                    }
                    ListEmptyComponent={
                        Object.keys(favoruiteItemsRedux).length == 0?
                        <View style={{
                            paddingHorizontal: 20
                        }}>
                            <Svg width="201" height="288" viewBox="0 0 201 288" fill="none" >
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M133.494 43.0021C137.419 38.3955 140.075 32.75 139.631 26.4241C138.352 8.19737 112.98 12.207 108.045 21.4063C103.109 30.6056 103.696 53.9403 110.074 55.5845C112.618 56.2402 118.037 54.634 123.552 51.3097L120.091 75.8008H140.531L133.494 43.0021Z" fill="#B28B67"/>
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M148.542 20.357C149.202 19.7027 149.562 18.7689 149.873 17.8822C150.197 16.961 150.511 16.0304 150.726 15.0716C151.155 13.156 151.159 10.9529 149.793 9.46544C148.697 8.2726 147.052 7.73759 145.535 7.62131C144.523 7.54377 143.485 7.68538 142.516 8.00404C141.554 8.32015 140.725 8.95017 139.793 9.3412C139.757 7.27681 139.403 5.11673 138.356 3.35405C137.348 1.65806 135.741 0.706331 133.911 0.454543C132.033 0.196144 130.179 0.635651 128.497 1.54492C128.076 1.77264 127.659 2.01121 127.26 2.28122C126.926 2.50732 126.578 2.77962 126.186 2.87157C125.749 2.9742 125.533 2.72174 125.248 2.40283C124.915 2.02892 124.54 1.69958 124.143 1.40763C122.387 0.116904 120.083 -0.413792 118.049 0.359878C117.111 0.716331 116.2 1.32169 115.564 2.15587C114.997 2.89946 114.593 4.07899 113.81 4.59706C113.478 4.81698 113.244 4.52561 112.942 4.31027C112.488 3.9867 112.055 3.62965 111.595 3.31489C110.95 2.87268 110.251 2.5419 109.502 2.36876C108.407 2.11528 106.893 2.17469 106.579 3.60965C106.462 4.14865 106.552 4.72511 106.59 5.26818C106.642 6.01388 106.697 6.75933 106.761 7.50393C106.81 8.06929 106.873 8.61533 106.979 9.17052C107.036 9.46646 107.214 10.0182 107.087 10.3145C106.929 10.685 106.197 10.4744 105.884 10.4873C105.267 10.5128 104.646 10.6211 104.075 10.885C103.633 11.0896 103.167 11.3904 102.98 11.8977C102.866 12.2093 102.896 12.5294 102.95 12.85C103.015 13.2348 102.941 13.4389 102.892 13.8271C102.063 13.4186 99.188 12.5111 98.8263 13.9977C98.7059 14.4927 98.9801 15.0521 99.1894 15.4695C99.5563 16.2018 100.037 16.871 100.529 17.5093C101.555 18.8408 102.78 19.9892 104.098 20.9713C102.554 21.6577 102.151 23.6823 103.488 24.8885C104.078 25.4211 104.871 25.5396 105.616 25.5056C105.888 25.4931 106.281 25.3884 106.495 25.4358C106.611 25.4613 106.734 25.5591 106.894 25.5701C107.945 25.642 109.131 25.3889 110.158 25.1557C111.988 24.7403 113.721 23.8732 115.136 22.5527C115.499 22.2139 115.799 22.0189 116.287 22.0239C116.715 22.0282 117.135 22.1456 117.563 22.1565C118.695 22.1854 119.715 21.6321 120.766 21.2639C120.83 22.6835 121.234 24.247 121.815 25.5242C122.289 26.5657 123.278 26.717 124.249 26.8084C127.357 27.1008 130.475 26.7745 133.587 26.7788C130.575 27.4596 127.462 27.7402 124.477 28.5413C123.128 28.9034 124.158 29.8128 124.735 30.4433C125.685 31.4814 126.392 32.7678 126.882 34.1229C128.355 32.2023 130.959 30.9368 133.266 31.5269C135.816 32.1787 137.611 35.6262 135.981 38.1046C135.034 39.5434 133.325 40.0989 131.903 40.717C133.012 41.8704 133.281 43.574 133.949 45.0089C134.278 45.7166 134.74 46.5167 135.477 46.7633C135.749 46.8546 136.069 46.8624 136.284 47.0845C136.55 47.3595 136.613 47.667 136.953 47.9034C138.31 48.8468 140.43 48.7741 141.633 47.5429C142.72 46.4295 142.437 44.6676 141.529 43.5387C142.975 42.936 145.61 42.1608 145.035 39.908C148.168 39.6999 155.776 34.6182 151.57 30.9049C153.878 29.6005 155.999 26.4128 154.516 23.6028C153.375 21.439 150.72 20.4717 148.542 20.357Z" fill="#191847"/>
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M177.474 182.263H111.676L103.055 287.874H201L177.474 182.263Z" fill="#C5CFD6"/>
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M177.474 182.263H157.237L145.125 287.874H201L177.474 182.263Z" fill="#B1BAC1" fill-opacity="0.1"/>
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M36.6642 164.17C29.649 159.958 17.8791 165.37 17.8871 171.395C17.9113 189.42 34.3618 274.375 35.2207 279.746C36.0796 285.116 45.2805 286.535 45.8163 279.764C46.6689 268.989 48.2528 231.69 46.668 214.426C46.0139 207.3 45.3094 200.513 44.6158 194.458C53.248 210.046 66.598 232.365 84.666 261.415L94.4746 256.934C86.7722 231.556 80.4564 213.641 75.5271 203.187C67.0869 185.287 59.1729 169.958 55.8421 164.558C50.6028 156.065 41.483 159.029 36.6642 164.17Z" fill="#B28B67"/>
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M93.7704 242.841L60.1049 163.09C52.0399 150.116 29.4278 165.73 32.1781 173.254C38.4223 190.337 70.1785 245.642 72.0388 250.732L93.7704 242.841Z" fill="#1F28CF"/>
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M95.6401 251.904C97.737 253.631 99.1012 255.041 99.7326 256.134C100.501 257.464 101.4 259.533 102.43 262.341C100.887 263.232 87.0195 271.238 60.8282 286.359C57.6837 283.41 57.1937 281.12 59.3584 279.49C61.5231 277.86 63.3094 276.486 64.7174 275.367L79.0766 255.583C79.3529 255.202 79.8855 255.118 80.2662 255.394C80.2727 255.399 80.2791 255.404 80.2855 255.408L83.2691 257.706C86.0061 257.467 88.0487 256.958 89.3968 256.18C90.4921 255.548 91.7493 254.232 93.1684 252.233L93.1684 252.233C93.713 251.466 94.7764 251.286 95.5435 251.83C95.5765 251.854 95.6088 251.878 95.6401 251.904Z" fill="#E4E4E4"/>
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M47.9692 275.441C48.922 277.984 49.3984 279.888 49.3984 281.15C49.3984 282.686 49.1426 284.927 48.6309 287.874C46.8492 287.874 30.8367 287.874 0.593616 287.874C-0.654701 283.747 0.0658989 281.519 2.75542 281.19C5.44494 280.861 7.67917 280.564 9.45811 280.299L31.7854 270.345C32.215 270.153 32.7185 270.346 32.91 270.776C32.9133 270.783 32.9165 270.791 32.9196 270.798L34.3547 274.28C36.8445 275.441 38.8677 276.022 40.4244 276.022C41.6891 276.022 43.4357 275.511 45.6642 274.49L45.6642 274.49C46.5194 274.098 47.5304 274.473 47.9225 275.328C47.9394 275.365 47.955 275.403 47.9692 275.441Z" fill="#E4E4E4"/>
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M15.5261 177.522C15.5261 200.149 26.2718 252.929 26.2786 257.911L49.3984 257.929C46.0144 210.834 44.8145 187.033 45.7986 186.526C47.2748 185.764 106.312 192.42 124.019 192.42C149.551 192.42 160.114 176.319 160.971 146.492H110.392C100.093 147.594 46.3759 158.429 26.4264 162.154C17.8857 163.748 15.5261 171.289 15.5261 177.522Z" fill="#2B44FF"/>
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M102.51 93.4318L72.9476 77.2407C68.0316 71.4029 63.1879 66.8691 58.4166 63.6392C56.9587 63.0305 54.4091 62.6621 56.7934 66.8941C59.1778 71.126 61.4954 75.6847 60.2807 76.9884C59.066 78.2922 56.0369 76.4709 54.5878 78.6371C53.6217 80.0813 58.7966 82.3627 70.1124 85.4812L91.5929 105.149L102.51 93.4318ZM56.2099 107.093L43.2245 99.9592C41.4024 93.0262 39.2244 89.5379 36.6904 89.4944C34.7437 88.5887 38.1338 97.3493 34.4436 96.5895C30.7534 95.8298 21.7466 89.1312 20.1946 90.4912C17.8987 92.5034 19.9459 98.6819 22.358 101.755C26.8662 107.5 30.5989 109.464 39.8246 112.036C44.6483 113.381 49.8636 116.077 55.4704 120.124L56.2099 107.093Z" fill="#997659"/>
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M116.906 89.8247C106.551 89.7154 92.7436 87.5284 78.0105 78.1764L72.2245 91.0796C82.387 101.165 96.6765 109.451 109.171 109.101C119.017 108.824 124.05 96.9141 116.906 89.8247Z" fill="#2026A2"/>
                                <Path fill-rule="evenodd" clip-rule="evenodd" d="M102.966 110.517C91.9733 113.259 73.5393 110.026 47.6639 100.819C41.2457 114.097 38.2788 123.563 38.763 129.217C60.9603 140.812 79.9853 145.982 95.6593 146.323C95.1612 155.623 96.2933 164.473 100.096 172.559C107.914 189.183 153.692 173.787 169.084 176.818C178.723 145.514 160.086 132.792 160.071 112.762C160.055 90.8271 142.442 57.064 139.851 57.064H116.219C114.915 73.816 108.352 92.2782 102.966 110.517Z" fill="#1F28CF"/>
                            </Svg>

                        </View>
                        :
                        <ActivityIndicator/>
                    }
                    data={Object.keys(favoruiteItemsRedux || {})}
                    renderItem={
                        ({ item, index }) =>
                        <RenderProductList 
                            item={favoruiteItemsRedux[item]} 
                            index={index}
                            colorScheme={colorScheme || "light"} 
                            gridSize={2}
                            navigation={navigation}
                        />
                    }
                    keyExtractor={item => favoruiteItemsRedux[item].node.id}
                />
        </View>
    )
}
