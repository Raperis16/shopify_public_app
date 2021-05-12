import { useQuery } from '@apollo/client';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { FlatList, Image, StyleSheet, Text, View, ActivityIndicator, ImageBackground, useColorScheme, Dimensions, ColorSchemeName } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GenericHeader } from '../components/GenericHeader';
import Colors from '../constants/Colors';

import shopClient from '../constants/shopify'
import { visualConfig } from '../constants/visualConfig';
import { GET_ALL_COLLECTIONS } from '../graphql/schemas';
import { colorSchemeType, getAllCollectionsType, navigationType } from '../types';
import { RenderCategoryTiles } from "../components/category/RenderCategoryTiles"

type defaultScreenType = {
    route: routeType
} & navigationType

type routeType = {
    params: paramsType
  }
  
type paramsType = {

}


export default function AllCollectionScreen({ navigation }:defaultScreenType) {
    const colorScheme:ColorSchemeName = useColorScheme();
    const insets = useSafeAreaInsets();
    const [ collectionsGraphQLResponse , setCollectionsGraphQLResponse ] = React.useState<getAllCollectionsType>()
    const {loading, error, data, fetchMore, refetch } = useQuery<getAllCollectionsType>(GET_ALL_COLLECTIONS, {
        onCompleted: (data:getAllCollectionsType) =>{
            console.log(data);
            setCollectionsGraphQLResponse(data)
        },
        onError: (error) =>{
            console.log(error)
        },
        variables:{
            first: 20,
            query: visualConfig.allCollectionView.filterOutByTitle
        }
    })

    const ItemSeperatorComponent = () => {
        return (
            <View
                style={{
                    paddingVertical: 10
                }}
            >

            </View>
        )
    }






    return (
            <FlatList
                style={{
                    paddingTop: insets.top,
                    backgroundColor: Colors[colorScheme || "light"].background,
                    width: "100%",
                    paddingHorizontal: 20,
                }}
                ListHeaderComponentStyle={{
                    marginTop: 15,
                }}
                ListHeaderComponent={
                    <GenericHeader
                        colorScheme={colorScheme || "light"}
                        title={"Categories"}
                    />
                }
                numColumns={visualConfig.allCollectionView.colummView? 2 : 0}
                columnWrapperStyle={{
                    justifyContent: "space-between",
                    flexWrap: "wrap"
                }}
                ListEmptyComponent={
                    <View>
                        {
                            loading?
                                <ActivityIndicator />
                            : null
                        }
                    </View>
                }
                ItemSeparatorComponent={
                    ItemSeperatorComponent
                }
                data={collectionsGraphQLResponse?.collections.edges}
                renderItem={({item,index})=> 
                    <RenderCategoryTiles
                        item={item}
                        index={index}
                        navigation={navigation}
                        colorScheme={colorScheme || "light"}
                    />
                }
                keyExtractor={(item) => item.node.id}
            />
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
