import React, { FunctionComponent } from 'react'; // importing FunctionComponent
import { TouchableOpacity } from 'react-native';
import { View } from 'react-native';
import { Dimensions, Image, ImageBackground, Text, Pressable } from 'react-native';

// import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import { visualConfig } from '../../constants/visualConfig';
import { collectionBlockEdgesEnum, colorSchemeType, navigationType } from '../../types';


type renderCategoryTilesType = {
    item: collectionBlockEdgesEnum,
    index: number,
} & colorSchemeType & navigationType


export const RenderCategoryTiles = ({ item, index, colorScheme, navigation }: renderCategoryTilesType) => {
    let titleFontSize = 25;
    const itemNode = item.node;
    return (
        <Pressable
            style={{
                flex: 0.48,
                backgroundColor: Colors[colorScheme].background,
                overflow: "hidden",
                // marginLeft:  visualConfig.allCollectionView.colummView && index % 2? 10 : 0,
            }}
            onPress={() => navigation.navigate("SingleCollection", { id: itemNode.id, title: itemNode.title, handle: itemNode.handle  })}>
            {
                    (visualConfig.allCollectionView.colummView?
                            <>
                                <Image
                                    defaultSource={require('../../assets/images/icon.png')}
                                    source={{ uri: itemNode.image?.transformedSrc || undefined }} style={{
                                        // height: 200,
                                        flex: 1,
                                        width: (Dimensions.get("window").width - 60) / 2,
                                        aspectRatio: 1,
                                        borderRadius: 3,
                                    }}
                                >
                                </Image>
                                        <Text style={{
                                            fontSize: 15,
                                            color: Colors[colorScheme].text,
                                            textAlign: "center",
                                            paddingTop: 8,
                                            letterSpacing: -0.2
                                        }} >{itemNode.title}</Text>
                            </>
                        
                            //END OF IMAGE CHECK
                        :
                        <ImageBackground
                            defaultSource={require('../../assets/images/icon.png')}
                            source={{ uri: itemNode.image?.transformedSrc || undefined }} style={{
                                // height: 200,
                                aspectRatio: 1,
                                width: "100%"
                            }}
                        >
                            <View
                                style={{
                                    width: "100%",
                                    height: "100%",
                                    backgroundColor: "rgba(0,0,0,.25)",
                                    justifyContent: "center",
                                    alignContent: "center",
                                    alignItems: "center"
                                }}
                            >
                                <Text style={{
                                    fontSize: titleFontSize,
                                    color: "white",
                                }} >{itemNode.title}</Text>
                            </View>
                        </ImageBackground>
                        
                    )
            }
        </Pressable>
    )
}