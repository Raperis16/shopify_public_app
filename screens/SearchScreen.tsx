import { NavigationProp, ParamListBase } from '@react-navigation/core';
import React from 'react';
import { ColorSchemeName, useColorScheme, View, FlatList, Text, Dimensions, ActivityIndicator,TextInput, TouchableOpacity } from 'react-native';
import { EdgeInsets, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';
import { useDispatch, useSelector } from "react-redux"
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { SVG_ChevronBackwardRegular } from '../assets/svgs/chevron_backward_regular';
import { GET_SINGLE_COLLECTION, SEARCH_PRODUCTS } from '../graphql/schemas';
import { useQuery } from '@apollo/client';
import { colorSchemeType, searchConcaticatedBodyEnum, searchConcaticatedEnum, searchGraphQLResponse } from '../types';
import { visualConfig } from "../constants/visualConfig"


type defaultScreenType = {
    navigation: NavigationProp<ParamListBase>,
    route: routeType
}

type routeType = {
    params: paramsType
}

type paramsType = {
}

type renderSearchType = {
    item: searchConcaticatedBodyEnum,
    index: number,
    colorScheme: NonNullable<ColorSchemeName>,
    navigation: NavigationProp<ParamListBase>,
}




const RenderSearchItems =({ item, index, colorScheme, navigation}:renderSearchType) =>{
    return(
        <TouchableWithoutFeedback
            onPress={()=>{
                if(item.type == "product"){
                    navigation.navigate("Product", { 
                        handle: item.handle,
                        title: item.title,
                    })
                    navigation.reset({
                        index: 1,
                        routes: [{ name: 'Home' },{ name: 'Product', params: {handle: item.handle,title: item.title,} }],
                    })
                }else if(item.type == "collection"){
                    navigation.navigate(
                        "SingleCollection", 
                        { 
                            id: item.id,
                            title: item.title,
                            handle: item.handle 
                        })
                        navigation.reset({
                            index: 1,
                            routes: [{ name: 'Home' },{ name: 'SingleCollection', params: {
                                id: item.id,
                            title: item.title,
                            handle: item.handle 
                            } }],
                        })
                }
            }}
            style={{
                borderColor: Colors[colorScheme].gray05,
                borderBottomWidth: 1,
                flex: 1,
                height: 50,
                justifyContent: "space-between",
                alignItems: "center",
                // backgroundColor: "pink"
                flexDirection: "row"
            }}
        >
            {
                item.title != null?
                <>
                    <Text
                        style={{
                            fontSize: 15,
                            color: Colors[colorScheme].text,
                            flex: 1
                        }}
                    >
                        {item.title.substring(0,70)}{item.title.length > 70? "...": ""}
                    </Text>
                    <SVG_ChevronBackwardRegular
                        style={{
                            transform: [
                                { rotateY: "0deg" },
                                { rotateZ: "180deg" }
                            ]
                        }}
                        color={Colors[colorScheme].text}
                        width={15}
                        height={15}
                    />
                </>
                : null
            } 
        </TouchableWithoutFeedback>
    )
}



export default function SearchScreen({ navigation, route }: defaultScreenType) {
    const colorScheme:ColorSchemeName = useColorScheme();
    const insets:EdgeInsets = useSafeAreaInsets();

    //states
    const [ searchValue, onChangeSearchValue ] = React.useState("");
    const [ searchGraphQLData, setSaerchGraphQLData ] = React.useState<searchConcaticatedEnum>();

    const {loading, error, data, fetchMore, refetch } = useQuery<searchGraphQLResponse>(SEARCH_PRODUCTS, {
        onCompleted: (data:searchGraphQLResponse) => {
            let dummyState:searchConcaticatedEnum = []
            console.log(data.products.edges)
            data.collections.edges.forEach(item=>{
                console.log("is this printing???")
                // dummyState = [...dummyState,{
                //     title: item.node.title,
                //     handle: item.node.handle,
                //     id: item.node.id,
                //     type: "collection"
                // }]
                dummyState.push({
                    title: item.node.title,
                    handle: item.node.handle,
                    id: item.node.id,
                    type: "collection"
                })
            })
            data.products.edges.forEach(item=>{
                // dummyState = [...dummyState,{
                //     title: item.node.title,
                //     handle: item.node.handle,
                //     id: item.node.id,
                //     type: "product"
                // }]
                dummyState.push({
                    title: item.node.title,
                    handle: item.node.handle,
                    id: item.node.id,
                    type: "product"
                })
            })
            setSaerchGraphQLData(dummyState)
            // for(var i = dummyState.length; i < 9; i++){
            //     dummyState.push({})
            // }
            // console.log(dummyState)
        }, 
        onError: (error) =>{
            console.log(error)
        },
        variables: { 
            search: "title:*"+searchValue+"*"
        },
    });
    console.log(searchValue)
    // console.log(data,  Date.now())
    // console.log(data)

    return (
        <>
            <SafeAreaView
                style={{
                    flex: 1,
                    marginBottom: -insets.bottom,
                    backgroundColor: Colors[colorScheme || "light"].background
                }}
            >
                <FlatList
                    keyboardShouldPersistTaps={"handled"}
                    style={{
                        paddingHorizontal: 20,
                        paddingTop: 12,
                    }}
                    ListHeaderComponent={
                        <View
                            style={{
                                flexDirection: "row",
                                width: "100%",
                                flex: 1,
                                marginBottom: 10
                            }}
                        >
                            <TextInput
                                    clearButtonMode={"while-editing"}
                                    style={{
                                        backgroundColor: Colors[colorScheme || "light"].searchBarBackground_search_screen,
                                        color: Colors[colorScheme || "light"].text,
                                        flex: 1,
                                        borderRadius: 20,
                                        height: 45,
                                        paddingHorizontal: 20,
                                        justifyContent: "center",
                                        alignContent: "center",
                                        alignItems: "center",
                                        fontSize: 16,
                                        // paddingRight: 20,
                                    }}
                                    autoFocus={true}
                                    placeholder={"Search anything" +  (visualConfig.global.shopName != null? " on " + visualConfig.global.shopName : "")}
                                    placeholderTextColor={Colors[colorScheme || "light"].gray02}
                                    value={searchValue}
                                    onChangeText={(text)=> { 
                                        onChangeSearchValue(text)
                                    
                                    }}
                            />
                            <TouchableOpacity
                                style={{
                                    flex: 1/4,
                                    height: "100%",
                                    justifyContent: "center",
                                    alignContent: "center"
                                }}
                                onPress={()=>{
                                    navigation.goBack()
                                }}
                            >
                                <Text style={{
                                    textAlign: "right",
                                    color: Colors[colorScheme || "light"].text,
                                    textDecorationLine: "underline"
                                }}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                        </View>
                    }
                    data={searchGraphQLData || []}
                    renderItem={({item, index}) =>

                        <RenderSearchItems 
                            item={item}
                            index={index}
                            colorScheme={colorScheme}
                            navigation={navigation}
                        />
                    }
                    keyExtractor={(item, index)=> JSON.stringify(item) + index}
                />
            </SafeAreaView>
        </>
    )
}
