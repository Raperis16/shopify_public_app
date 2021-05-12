import { NavigationProp, ParamListBase } from '@react-navigation/core';
import { StatusBar } from 'expo-status-bar';
import React, { MutableRefObject } from 'react';
import { Dimensions, Image, Text, TouchableOpacity, View } from 'react-native';
import { FlatList } from 'react-native-gesture-handler';
import ImageViewer from 'react-native-image-zoom-viewer';
import { Portal } from 'react-native-portalize';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { SVG_CloseMedium } from '../assets/svgs/close';
import { imagesEdgesBlockEnum } from '../types';



type defaultScreenType = {
    navigation : NavigationProp<ParamListBase>,
    route: routeType
}

type routeType = {
    params: paramsType
}

type paramsType = {
  images: Array<imagesEdgesBlockEnum>,
  openAtIndex: number
}


export default function ProductImageViewer({ navigation, route } : defaultScreenType) {

    const insets = useSafeAreaInsets();
    
    const images = route.params?.images?.map( item=>  ({
            // Simplest usage.
            url: item.node.transformedSrc,
            
            // width: number
            // height: number
            // Optional, if you know the image size, you can set the optimization performance
            
            // You can pass props to <Image />.
            props: {

            }
        })
    ) || [];

    return(
            <>
                <StatusBar style={"light"} />
                <ImageViewer 
                    renderIndicator={
                        (currentIndex, allSize) =>
                            <View
                                style={{
                                    zIndex: 2000,
                                    marginTop: insets.top + 20,
                                    position: 'absolute',
                                    paddingHorizontal: 20,
                                    flexDirection: "row"
                                }}
                            >

                                <View
                                    style={{
                                        zIndex: 1,
                                        justifyContent: "center",
                                        flex: 1,
                                        width: Dimensions.get("screen").width,
                                        position: "absolute"
                                    }}
                                >
                                    <Text
                                        style={{
                                            textAlign: "center",
                                            color: "#FAFAFA",
                                            fontSize: 17,
                                            fontWeight: "600"
                                        }}
                                    >
                                        {currentIndex} / {allSize}
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    style={{
                                        zIndex: 2000,
                                        marginTop: 2,
                                    }}
                                    onPress={() =>{
                                        navigation.goBack()
                                    }}
                                >
                                    <SVG_CloseMedium
                                        color={"#FAFAFA"}
                                        width={15}
                                        height={15}
                                        />
                                </TouchableOpacity>
                            </View>
                    }
                    pageAnimateTime={200}
                    enablePreload={true}
                    index={route.params?.openAtIndex || 0}
                    enableSwipeDown={true} 
                    onSwipeDown={()=>{
                    navigation.goBack()
                }} imageUrls={images}/>
            </>
    )

}