import React from 'react';
import { NavigationProp, ParamListBase } from "@react-navigation/core";
import { ColorSchemeName, Dimensions, TouchableOpacity, View, Share } from "react-native";
import { EdgeInsets } from "react-native-safe-area-context";
import { SVG_ChevronBackwardSemibold } from "../../assets/svgs/chevron_backward_regular";
import { SVG_HeartFullRegular, SVG_HeartSemibold } from "../../assets/svgs/heart";
import { SVG_ShareSemibold } from "../../assets/svgs/share";
import Colors from '../../constants/Colors';
import { visualConfig } from '../../constants/visualConfig';
import { ADD_FAVOURITE, REMOVE_FAVOURITE } from '../../redux/asyncStorageRedux';
import { productsEdgesNodeEnum } from '../../types';
import { AppDispatch } from '../../redux/store';

type renderProductPageHeader = {
    colorScheme: NonNullable<ColorSchemeName>,
    navigation: NavigationProp<ParamListBase>,
    insets: EdgeInsets,
    onlineStoreUrl: string,
    id: String,
    handle: String
    dispatch: AppDispatch,
    isFavourite: boolean,
    productNode: productsEdgesNodeEnum
}

const onShare = async (onlineStoreUrl:string) => {
    try {
      const result = await Share.share({
        url: onlineStoreUrl,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };


/** 
 *
 * Showcased in header of product page 
 * 
*/
export const RenderProductPageHeader = ({ colorScheme, navigation, insets, onlineStoreUrl, id, handle, isFavourite, dispatch, productNode }: renderProductPageHeader ) =>{
    return(
        <View
                    style={{
                        marginTop: insets.top,
                        position: "absolute",
                        flex: 1,
                        width: Dimensions.get("screen").width,
                        zIndex: 200,
                        paddingHorizontal: 20,
                        flexDirection: "row",
                        justifyContent: "space-between"
                    }}
                >
                    <TouchableOpacity
                        onPress={() =>{
                            navigation.goBack();
                        }}
                        style={{
                            width: 36,
                            height: 36,
                            backgroundColor: Colors[colorScheme].background,
                            borderRadius: 20,
                            justifyContent: "center",
                            alignContent: "center",
                            alignItems: "center"
                        }}
                    >
                        <SVG_ChevronBackwardSemibold
                            color={Colors[colorScheme].text}
                            width={16}
                            height={16}
                        />
                    </TouchableOpacity>
                    <View
                        style={{
                            flexDirection: "row"
                        }}
                    >
                        <TouchableOpacity
                            onPress={() =>{
                                onShare(onlineStoreUrl)
                            }}
                            style={{
                                width: 36,
                                height: 36,
                                backgroundColor: Colors[colorScheme].background,
                                borderRadius: 20,
                                justifyContent: "center",
                                alignContent: "center",
                                alignItems: "center",
                                marginRight:  visualConfig.global.enableFavorites? 15 : 0
                            }}
                        >
                            <SVG_ShareSemibold
                                color={Colors[colorScheme].text}
                                width={17}
                                height={17}
                            />
                        </TouchableOpacity>
                        {
                            visualConfig.global.enableFavorites?
                                <TouchableOpacity
                                    onPress={() =>{
                                        if(isFavourite){
                                            dispatch({
                                                type: REMOVE_FAVOURITE,
                                                payload: 
                                                    { 
                                                        "favouriteItems": {
                                                            "cursor": "",
                                                            "node": productNode
                                                        }
                                                    }
                                            })
                                        }else{
                                            dispatch({
                                                type: ADD_FAVOURITE,
                                                payload: 
                                                    { 
                                                        "favouriteItems": {
                                                            "cursor": "",
                                                            "node": productNode
                                                        }
                                                    }
                                            })
                                        }
                                    }}
                                    style={{
                                        width: 36,
                                        height: 36,
                                        backgroundColor: Colors[colorScheme].background,
                                        borderRadius: 20,
                                        justifyContent: "center",
                                        alignContent: "center",
                                        alignItems: "center"
                                    }}
                                >
                                    {
                                        isFavourite?
                                            <SVG_HeartFullRegular
                                                color={isFavourite? Colors[colorScheme].red : Colors[colorScheme].text}
                                                width={16}
                                                height={16}
                                            />
                                        :
                                            <SVG_HeartSemibold
                                                color={isFavourite? Colors[colorScheme].red : Colors[colorScheme].text}
                                                width={16}
                                                height={16}
                                            />
                                    }
                                </TouchableOpacity>
                            : null 
                        }
                    </View>
                </View>
    )
}