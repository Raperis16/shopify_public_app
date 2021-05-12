import React, { FunctionComponent } from 'react';
import { FlatList, Image, StyleSheet, Text, View, TouchableOpacity, ImageBackground, useColorScheme, Dimensions, ActivityIndicator, RefreshControl, ColorSchemeName } from 'react-native';
import { EdgeInsets, SafeAreaView } from 'react-native-safe-area-context';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GenericHeader } from '../components/GenericHeader';
import Colors from '../constants/Colors';

import { useLazyQuery, useQuery } from '@apollo/client';
import { Portal } from 'react-native-portalize';
import { FilterModalize } from '../components/FilterModalalize';
import { Modalize } from 'react-native-modalize';

import { visualConfig } from "../constants/visualConfig"
import { RenderProductList } from '../components/RenderProductList';
import { GET_SINGLE_COLLECTION, GET_SINGLE_COLLECTION_FILTERS } from '../graphql/schemas';

import { collectionByHandleEnum, sortByRulesEnum, priceRulesEnum } from "../types"
import { NavigationProp, ParamListBase } from '@react-navigation/core';

type loadNextPageEnum = {
    Collection: collectionByHandleEnum | null,
    SetCollection: any,
    sortByRules: sortByRulesEnum,
    priceRules: priceRulesEnum,
    handle?: string,
    setFetchindMoreData?: any,
    fetchMore: any,
    data?: collectionByHandleEnum
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
}


const loadNextPage = async ({ Collection, SetCollection, sortByRules, priceRules, handle, setFetchindMoreData, fetchMore, data }: loadNextPageEnum) => {
    if (Collection?.collectionByHandle.products.pageInfo.hasNextPage == true || data != null) {
        try {

            // Sets ActivityIndicatior Loading
            setFetchindMoreData(true);

            // Fetches more data or gets from initilization
            let result: collectionByHandleEnum = ((data == null) ? await fetchMore({
                variables: {
                    handle: handle,
                    first: 8,
                    cursor: Collection?.collectionByHandle.products.pageInfo.lastCursor,
                    sortBy: sortByRules.param,
                    reverse: sortByRules.reverse
                },
            }) : data)


            // from response we get result.loading, result.data, and we just have to pick up data
            if (data == null) {
                result = result.data;
            }

            // put products in single dynamic let
            let edges = result.collectionByHandle.products.edges;

            // Filter rules
            if (priceRules.min != null) {
                edges = edges.filter(item =>
                    (item.node.priceRange.minVariantPrice.amount >= priceRules.min)
                )
            }
            if (priceRules.max != null) {
                edges = edges.filter(item =>
                    (item.node.priceRange.minVariantPrice.amount <= priceRules.max)
                )
            }


            // reconstruct response
            SetCollection(
                {
                    collectionByHandle: {
                        products: {
                            edges: data == null ? Collection.collectionByHandle.products.edges.concat(edges) : edges,
                            pageInfo: {
                                hasNextPage: result.collectionByHandle.products.pageInfo.hasNextPage,
                                lastCursor: result.collectionByHandle.products.edges[result.collectionByHandle.products.edges.length - 1]?.cursor || null,
                            }
                        },
                        title: result.collectionByHandle.title
                    },
                }
            );

            if (edges.length == 0 && result.collectionByHandle.products.pageInfo.hasNextPage) {

                // if nothing was found while searching but still there is second page then due to slowness of states
                // we create dummy let and send it in the function to process
                let dummyOne = {
                    collectionByHandle: {
                        products: {
                            edges: data == null ? Collection.collectionByHandle.products.edges.concat(edges) : edges,
                            pageInfo: {
                                hasNextPage: result.collectionByHandle.products.pageInfo.hasNextPage,
                                lastCursor: result.collectionByHandle.products.edges[result.collectionByHandle.products.edges.length - 1]?.cursor || null,
                            }
                        },
                        title: result.collectionByHandle.title
                    },
                }

                loadNextPage({
                    Collection: dummyOne,
                    SetCollection: SetCollection,
                    sortByRules: sortByRules,
                    priceRules: priceRules,
                    handle: handle,
                    setFetchindMoreData: setFetchindMoreData,
                    fetchMore: fetchMore
                });
            } else {
                setFetchindMoreData(false);
            }
        } catch (e) {
            alert("Beep boop, error while getting new products")
            setFetchindMoreData(false);
        }
    }
}


const getDataForFilter = () => {

}



export default function SingleCollectionScreen({ navigation, route }: defaultScreenType) {
    const colorScheme: NonNullable<ColorSchemeName> = useColorScheme();
    const insets: EdgeInsets = useSafeAreaInsets();
    const [Collection, SetCollection] = React.useState<collectionByHandleEnum>();
    const [gridSize, setGridSize] = React.useState<Number>(visualConfig.collectionView.gridSize);
    const filterModalRef = React.useRef<Modalize>(null);
    const [sortByRules, setSortByRules] = React.useState<sortByRulesEnum>({ param: "COLLECTION_DEFAULT", reverse: false });
    const [priceRules, setPriceRules] = React.useState<priceRulesEnum>({ min: null, max: null });
    const [priceRulesMinMax, setPriceRulesMinMax] = React.useState<priceRulesEnum>({ min: 0, max: 9999 });

    const { loading, error, data, fetchMore, refetch } = useQuery(GET_SINGLE_COLLECTION, {
        onCompleted: (data) => {
            loadNextPage({
                Collection: Collection,
                SetCollection: SetCollection,
                sortByRules: sortByRules,
                priceRules: priceRules,
                handle: route.params.handle,
                setFetchindMoreData: setFetchindMoreData,
                data: data,
                fetchMore: fetchMore
            })
        },
        variables: {
            handle: route.params.handle,
            first: 8,
            sortBy: sortByRules.param,
            reverse: sortByRules.reverse,
        },
    });

    React.useEffect(() => {
        onRefresh({ disableRefresh: true });
    }, [priceRules])


    const [getAllSingleCollectionProducts] = useLazyQuery(GET_SINGLE_COLLECTION_FILTERS,
        {
            onCompleted: (data: collectionByHandleEnum) => {
                try {
                    if (data.collectionByHandle && data.collectionByHandle.products.edges.length != 0) {
                        let maxPricePerProduct: number = data.collectionByHandle.products.edges[
                            data.collectionByHandle.products.edges.length - 1
                        ].node.priceRange.maxVariantPrice.amount;

                        if (maxPricePerProduct > 9999) {
                            maxPricePerProduct = 9999
                        }

                        let minPricePerProduct: number = data.collectionByHandle.products.edges[
                            0
                        ].node.priceRange.maxVariantPrice.amount;


                        setPriceRulesMinMax({
                            min: parseInt(minPricePerProduct),
                            max: parseInt(maxPricePerProduct)
                        })
                    }
                } catch (e) {
                    console.log(e);
                }

            },
            variables: {
                handle: route.params.handle,
                first: 200,
                sortBy: "PRICE",
                reverse: false,
            }
        }
    );

    const getProducts = async () => {
        getAllSingleCollectionProducts();
    }

    const [refreshing, setRefreshing] = React.useState(false);


    const [fetchingMoreData, setFetchindMoreData] = React.useState(true);


    const onRefresh = async ({ disableRefresh = false }) => {
        if (!disableRefresh) {
            setRefreshing(true);
        }
        const data = await refetch();
        loadNextPage({
            Collection: Collection,
            SetCollection: SetCollection,
            sortByRules: sortByRules,
            priceRules: priceRules,
            handle: route.params.handle,
            setFetchindMoreData: setFetchindMoreData,
            data: data.data,
            fetchMore: fetchMore
        })
        if (!disableRefresh) {
            setRefreshing(false)
        }
    };


    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            getProducts()
        });

        return unsubscribe;
    }, [navigation]);


    const ItemSeperatorComponent = () => {
        return (
            <View
                style={{
                    paddingVertical: 7
                }}
            >

            </View>
        )
    }

    return (
        <View
            style={{
                backgroundColor: Colors[colorScheme].background,
                flex: 1
            }}
        >
            <Portal>
                <FilterModalize
                    colorScheme={colorScheme}
                    insetBottom={-insets.bottom}
                    sortByRules={sortByRules}
                    setSortByRules={setSortByRules}
                    priceRules={priceRules}
                    setPriceRules={setPriceRules}
                    priceRulesMinMax={priceRulesMinMax}
                    ref={filterModalRef}
                />
            </Portal>
            <FlatList
                style={{
                    marginTop: insets.top,
                    backgroundColor: Colors[colorScheme].background,
                    width: "100%",
                    paddingHorizontal: 20,
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                    />
                }
                initialNumToRender={1}
                numColumns={2}
                ListHeaderComponent={
                    <>
                        <GenericHeader
                            smallTitle
                            colorScheme={colorScheme}
                            title={route.params?.title || ""}
                            showGoBackButton={true}
                            navigation={navigation}
                            showRightAction
                            rightActionFunction={
                                () => {
                                    filterModalRef.current?.open();
                                }
                            }
                        />
                    </>
                }

                columnWrapperStyle={{
                    justifyContent: "space-between",
                    flexWrap: "wrap"
                }}
                contentContainerStyle={{
                    paddingVertical: 25,
                }}

                ListFooterComponent={
                    Collection?.collectionByHandle.products.pageInfo.hasNextPage == true ?

                        fetchingMoreData == false ?
                            null
                            :
                            Collection != null ?
                                <ActivityIndicator style={{ marginTop: 15, marginBottom: 10 }} />
                                : null
                        : null
                }
                onEndReached={() => loadNextPage({
                    Collection: Collection,
                    SetCollection: SetCollection,
                    sortByRules: sortByRules,
                    priceRules: priceRules,
                    handle: route.params.handle,
                    setFetchindMoreData: setFetchindMoreData,
                    fetchMore: fetchMore
                })}
                ListEmptyComponent={
                    fetchingMoreData ?
                        null
                        :
                        <View>
                            <Text>EMPTY RESPONSE</Text>
                        </View>
                }
                ItemSeparatorComponent={
                    ItemSeperatorComponent
                }
                data={Collection?.collectionByHandle?.products.edges || []}
                renderItem={({ item, index }) =>
                    <RenderProductList
                        item={item}
                        index={index}
                        colorScheme={colorScheme}
                        gridSize={gridSize}
                        navigation={navigation}
                    />
                }
                keyExtractor={item => item.node.id}
            />
        </View>
    );

}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
});
