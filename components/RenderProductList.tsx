import React from 'react';
import { ColorSchemeName, Image, Text, TouchableOpacity, View,Pressable } from "react-native";
import Colors from '../constants/Colors';
import { visualConfig } from "../constants/visualConfig";
import { colorSchemeType, navigationType, productsEdgesEnum } from '../types';

type RenderProductListEnum = {
    item: productsEdgesEnum,
    index: number,
    gridSize: number
} &colorSchemeType & navigationType


export const RenderProductList = ({ item, index , colorScheme, navigation, gridSize } : RenderProductListEnum ) => {
    let currencyType = item.node.priceRange.minVariantPrice.currencyCode;
    let isProductAvailable = item.node.availableForSale;
    let shownComparePrice = item.node.compareAtPriceRange?.maxVariantPrice.amount != "0.0"  ? parseFloat( item.node.compareAtPriceRange.maxVariantPrice.amount ).toFixed(2) : null;
    let shownPrice =  parseFloat( item.node.priceRange.minVariantPrice.amount ).toFixed(2);
    let variantImage = item.node.images.edges[0].node.transformedSrc;

    return (
        <Pressable
            style={{
                flex: (1/gridSize),
                marginRight: index % 2 ? 0 : 10,
            }}
            onPress={() => navigation.navigate("Product", { 
                handle: item.node.handle,
                title: item.node.title,
                images: item.node.images.edges 
            })}>
            {
                item.node.images ?
                    <Image
                        defaultSource={require('../assets/images/icon.png')}
                        source={{ uri: variantImage || undefined }} style={{
                            aspectRatio: 1,
                            borderRadius: colorScheme == "light"? 0 : 3
                        }}
                    ></Image>

                    :
                    <View
                        style={{
                            backgroundColor: "rgb(3, 152, 252)",
                            aspectRatio: 1,
                        }}
                    ></View>
            }
            <View
                style={{
                    flex: 1,
                    minHeight: 70,
                    justifyContent: "space-between",
                    paddingBottom: 10,
                }}
            >
                <View
                    style={{
                        marginTop: 11,
                    }}
                >
                    {
                        visualConfig.collectionView.showVendor?
                            <Text style={{
                                fontSize: 14,
                                marginBottom: 5,
                                color: Colors[colorScheme].gray01,
                            }} >{
                                    item.node.vendor.length >= 45 ?
                                        item.node.vendor.substring(0, 45) + "..."
                                        :
                                        item.node.vendor
                                }</Text>
                        : null
                    }
                    <Text style={{
                        fontSize: 14,
                        color: Colors[colorScheme].text,
                    }} >{
                            item.node.title.length >= 45 ?
                                item.node.title.substring(0, 45) + "..."
                                :
                                item.node.title
                        }</Text>
                    {
                    shownComparePrice != null && visualConfig.collectionView.showDiscountBig && isProductAvailable && parseFloat(( ( (shownComparePrice-shownPrice) * 100 ) / shownComparePrice)  ).toFixed(0) != 0?
                        <View
                            style={{
                                marginTop: 4,
                                height: 25,
                                padding: 3,
                                marginBottom: 5,
                            }}
                        >
                            <View
                                style={{
                                    position: "absolute",
                                    borderRadius: 90,
                                    padding: 3,
                                    backgroundColor: Colors[colorScheme].orange00,
                                    flexDirection: "row"
                                }}
                            >

                                <Text style={{
                                    fontSize: 13,
                                    marginBottom: 2,
                                    marginLeft: 4,
                                    letterSpacing: 0.2,
                                    color: Colors[colorScheme].text,
                                    textDecorationLine: "line-through",
                                }} >
                                {currencyType == "EUR" ? "€" : "$"}{shownComparePrice}
                                </Text>


                                <Text style={{
                                    
                                    fontSize: 13,
                                    marginBottom: 2,
                                    marginLeft: 4,
                                    color: Colors[colorScheme].text
                                }} >
                                    ({ parseFloat(( ( (shownComparePrice-shownPrice) * 100 ) / shownComparePrice)  ).toFixed(0) }% off)
                                </Text>
                            </View>

                        </View>
                    : null
                }
                </View>
                {
                    isProductAvailable ?
                        <View style={{
                            flexDirection: "row",
                            alignContent: "flex-end",
                            alignItems: "flex-end",
                            marginTop: 10,
                        }}>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: "600",
                                letterSpacing: 0.1,
                                color: Colors[colorScheme].text,
                            }} >
                                {currencyType == "EUR" ? "€" : "$"}{shownPrice}
                            </Text>
                            {
                                shownComparePrice != null && visualConfig.collectionView.showDiscountSmall?
                                    <Text style={{
                                        fontSize: 10,
                                        marginBottom: 2,
                                        marginLeft: 4,
                                        color: Colors[colorScheme].text,
                                        letterSpacing: 0.2,
                                        textDecorationLine: "line-through",
                                    }} >
                                    {currencyType == "EUR" ? "€" : "$"}{shownComparePrice}
                                    </Text>
                                : null
                            }
                        </View>
                        :
                        <Text style={{
                            marginTop: 10,
                            fontSize: 14,
                            fontWeight: "bold",
                            color: Colors[colorScheme].text,
                        }} >OUT OF STOCK</Text>
                }
            </View>
        </Pressable>
    )
}