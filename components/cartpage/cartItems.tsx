import React, { MutableRefObject } from 'react';
import { ColorSchemeName, Dimensions, Image, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native"
import { SVG_PlusRegular } from '../../assets/svgs/plus';
import { SVG_MinusRegular} from '../../assets/svgs/minus';

import Colors from '../../constants/Colors';
import { colorSchemeType, navigationType, reduxCartItemInnerType, reduxCartItemType } from "../../types"
import { SVG_TrashRegular } from '../../assets/svgs/trash';
import { ADD_ITEM_TO_CART, DECREASE_QUANTITY_ITEM_CART, DELETE_ITEM_FROM_CART, SET_CHECKOUT_ID, SET_CHECKOUT_URL } from '../../redux/asyncStorageRedux';
import { NavigationProp, ParamListBase } from '@react-navigation/core';
import shopClient from '../../constants/shopify';
import { AppDispatch } from '../../redux/store';


type renderCartItemType = reduxCartItemInnerType & { 
    dispatch: AppDispatch,
    checkoutID: String,
    setLoading: any,
    getLatestDataFromAPI: any
} & colorSchemeType & navigationType

export const RenderCartItems = ({ colorScheme, checkoutID ,id, lineItemId, variantId, title, quantity, maxQuantity, imageSrc, amount, currencyCode, handle, dispatch, navigation,setLoading, getLatestDataFromAPI   }:renderCartItemType) => {
    return(
        <View  
            style={{
                marginHorizontal: 20,
                flexDirection: "row",
                paddingBottom: 18,
                marginBottom: 20,
                borderBottomWidth: 1,
                borderBottomColor: Colors[colorScheme].gray00
            }}
        >
            <TouchableOpacity
                onPress={()=>{
                    navigation.navigate("Product", { 
                        handle: handle, 
                        title: title
                    })
                }}
                style={{
                    flex: 1/2.3,
                    aspectRatio: 1,
                }}
            >
                <Image
                    source={{ uri: imageSrc }}
                    style={{
                        aspectRatio: 1,
                        borderRadius: 3
                    }}
                /> 
            </TouchableOpacity>
            <View
                style={{
                    marginLeft: 20,
                    flex: 1,
                }}
            >   
                        <Text
                            style={{
                                fontSize: 15,
                                flexWrap: 'wrap',
                                color: Colors[colorScheme].text,
                                letterSpacing: -.5,
                            }}
                        >{title}</Text>
                        <Text
                            style={{
                                fontSize: 17,
                                marginTop: 12,
                                fontWeight: "600",
                                color: Colors[colorScheme].text
                            }}
                        >{currencyCode == "EUR"? "€": "$"}{(parseFloat(amount) * quantity).toFixed(2)}</Text>
                        { 
                            maxQuantity == 1 ?
                            <Text
                                style={{
                                    fontSize: 15,
                                    marginTop: 10,
                                    flexWrap: 'wrap',
                                    color: Colors[colorScheme].gray01,
                                    letterSpacing: -.5,
                                }}
                            >Last in stock</Text>
                            : 
                            maxQuantity == 0 ?
                                <Text
                                style={{
                                    fontSize: 15,
                                    marginTop: 10,
                                    flexWrap: 'wrap',
                                    color: Colors[colorScheme].gray01,
                                    letterSpacing: -.5,
                                }}
                            >Out of stock</Text>
                            :
                            null }
                        <View
                        style={{
                            marginTop: maxQuantity == 1 ? 10 : 22,
                            flexDirection: "row",
                            justifyContent: "space-between"
                        }}
                    >
                        
                        <View
                        style={{
                            height: 37,
                            width: 157,
                            backgroundColor: Colors[colorScheme].gray06,
                            borderRadius: 10,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            // paddingHorizontal: 14
                        }}
                        >
                            <TouchableOpacity
                                style={{
                                    paddingHorizontal: 20,
                                    height: "100%",
                                    justifyContent: "center",
                                    backgroundColor: quantity <= 1? Colors[colorScheme].gray05 : Colors[colorScheme].gray02,
                                    borderTopLeftRadius: 10,
                                    borderBottomLeftRadius: 10
                                }}
                                onPress={() =>{
                                    setLoading(true);
                                    getLatestDataFromAPI();
                                    let lineItemsToAdd = [
                                        {
                                            quantity: -1,
                                            variantId: variantId
                                        }
                                    ];
                                    shopClient.checkout.addLineItems(checkoutID, lineItemsToAdd).then((checkout) => {
                                        dispatch({
                                            type: SET_CHECKOUT_URL,
                                            payload: checkout.webUrl
                                        })
                                        dispatch({
                                            type: DECREASE_QUANTITY_ITEM_CART,
                                            payload: {
                                                cartItems: {
                                                    variantId: variantId
                                                }
                                            }
                                        })
                                        setLoading(false);
                                    })
                                    .catch(( error) =>{
                                        console.log(error);
                                    } ) 
                                } }
                                disabled={quantity <= 1? true : false}
                            >
                                <SVG_MinusRegular
                                    width={10}
                                    height={10}
                                    color={quantity <= 1? Colors[colorScheme].gray04 : Colors[colorScheme].text}
                                />
                            </TouchableOpacity>
                            <Text
                                style={{
                                    fontSize: 15,
                                    fontWeight: "400",
                                    color: Colors[colorScheme].text
                                }}
                            >
                                {
                                   maxQuantity == 0? maxQuantity : quantity
                                }
                            </Text>
                            <TouchableOpacity
                                style={{
                                    paddingHorizontal: 20,
                                    height: "100%",
                                    justifyContent: "center",
                                    backgroundColor: quantity == maxQuantity? Colors[colorScheme].gray05 : Colors[colorScheme].gray02,
                                    borderTopRightRadius: 10,
                                    borderBottomRightRadius: 10
                                }}
                                onPress={() =>{
                                    setLoading(true);
                                    getLatestDataFromAPI();
                                    let lineItemsToAdd = [
                                        {
                                            quantity: 1,
                                            variantId: variantId
                                        }
                                    ];
                                    shopClient.checkout.addLineItems(checkoutID, lineItemsToAdd).then((checkout) => {
                                        dispatch({
                                            type: SET_CHECKOUT_URL,
                                            payload: checkout.webUrl
                                        })
                                            dispatch({
                                                type: ADD_ITEM_TO_CART,
                                                payload: {
                                                    cartItems: {
                                                        variantId: variantId,
                                                        quantity: 1,
                                                        maxQuantity: maxQuantity
                                                    }
                                                }
                                            })
                                        setLoading(false);
                                    })
                                    .catch(
                                        (error) =>{
                                            console.log(error)
                                            setLoading(false);
                                        }
                                    )
                                } }
                                disabled={quantity == maxQuantity? true : false}
                            >
                                <SVG_PlusRegular
                                    width={10}
                                    height={10}
                                    color={quantity == maxQuantity? Colors[colorScheme].gray04 : Colors[colorScheme].text}
                                />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={()=>{
                                setLoading(true);
                                getLatestDataFromAPI();
                                let lineItemsToDelete = [
                                        lineItemId,
                                ];
                                try {
                                    shopClient.checkout.removeLineItems(checkoutID, lineItemsToDelete)
                                    .then((checkout) => {
                                        dispatch({
                                            type: DELETE_ITEM_FROM_CART,
                                            payload:{
                                                cartItems: {
                                                    variantId: variantId 
                                                }
                                            }
                                        })
                                        setLoading(false);
                                    }
                                    )
                                } catch (error) {
                                    alert(":( something went wrong")
                                    setLoading(false);
                                }
                            }}
                            style={{
                                alignSelf: "center"
                            }}
                        >
                            <SVG_TrashRegular
                                width={18}
                                height={18}
                                color={Colors[colorScheme].text}
                            />
                        </TouchableOpacity>
                    </View>
            </View> 
        </View>
    )
  
}

const styles = StyleSheet.create({
    fontPlusMinus: {
        fontWeight: "400",
       fontSize: 14
    },
});
