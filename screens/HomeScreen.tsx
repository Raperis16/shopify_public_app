import React from 'react';
import { FlatList, Image, Text, View, TouchableOpacity, useColorScheme, ColorSchemeName, ImageBackground, ColorValue } from 'react-native';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '../constants/Colors';


import { useDispatch, useSelector } from "react-redux"
import { NavigationProp, ParamListBase } from '@react-navigation/core';

import { RenderProductList } from '../components/RenderProductList';
import { useQuery } from '@apollo/client';
import {  blogPostArticleEdgeType, blogPostByHandleType, colorSchemeType, navigationType, productsEdgesEnum } from '../types';
import { GET_SINGLE_COLLECTION, GET_BLOG_BY_HANDLE } from '../graphql/schemas';
import { SVG_MagnifyingGlassRegular } from '../assets/svgs/magnifyingGlass';
import { visualConfig } from '../constants/visualConfig';
import { SearchBar } from '../components/homepage/SearchBar';
import { BlogPost } from "../components/homepage/BlogPost"
import { MosaicTyle } from "../components/homepage/MosaicTyle"
import { CLEAN_FAVOURITE } from '../redux/asyncStorageRedux';
import { AppDispatch } from '../redux/store';


type defaultScreenType = {
  route: routeType
} & navigationType

type routeType = {
  params: paramsType
}

type paramsType = {
}


export default function Homescreen({navigation}:defaultScreenType) {
  const dispatch = useDispatch<AppDispatch>();
  const insets = useSafeAreaInsets();
  const [Product, SetProduct] = React.useState([])
  const colorScheme:ColorSchemeName  = useColorScheme();
  const [ productList, setProductList ] = React.useState<Array<productsEdgesEnum>>()
  const [ searchText, setSearchText ] = React.useState<String>("")
  const [ blogPosts, setBlogPosts] = React.useState<blogPostByHandleType>()
  const [ blogHandle, setBlogHandle ] = React.useState("")
  const [ collectionHandle, setCollectionHandle ] = React.useState("")


  const {} = useQuery(GET_SINGLE_COLLECTION, {
    onCompleted: (data) => {
      setProductList(data)
    }, 
    variables: { 
        handle: collectionHandle,
        first: 4,
        sortBy: "COLLECTION_DEFAULT",
        reverse: false, 
    },
});

const {} = useQuery(GET_BLOG_BY_HANDLE, {
  onCompleted: (data) => {
    setBlogPosts(data)
    // console.log(data)
  }, 
  variables: { 
      handle: blogHandle,
  },
});

// console.log(blogPosts)

  React.useEffect(() => {
    mapData()

    // dispatch({
    //   type: CLEAN_FAVOURITE,
    //   payload: {}
    // })
  }, [])

  

  // Fetch all products in your shop and map it to a state
const mapData = () => {
  setBlogHandle(homePageSettings.blog.blogHandle)
  setCollectionHandle(homePageSettings.products.collectionHandle) 
}

const homePageSettings = {
  banner: {
    text: 'Free Shipping in Latvia 🇱🇻',
    allowed: true
  },
  mosaic: [{
    backgroundURL: 'http://cdn.home-designing.com/wp-content/uploads/2017/11/wide-open-space-beige-minimalist-1024x512.jpg',
    bodyText: "20% off all couches, offer is ending today",
    bodyTextSize: 22,
    bodyTextColor: "black",
    bodyTextWeight: '400',
    buttonColor: "black",
    buttonText: "Shop now",
    buttonTextColor: "white",
    backgroundOverlayColor: "rgba(166, 166, 166, 0.2)",
    headerText: "Living room essentials",
    headerTextColor: "black",
    headerTextFontSize: 28,
    headerTextWeight: "800",
    navigationType: "SingleCollection", // Product || SingleCollection
    navigationHandle: "frontpage"
  }],
  blog: {
    blogsTitle: "Newsletter",
    blogHandle: 'news'
  },
  products: {
    collectionHandle: 'mobilehomescreen',
    collectionTitle: "Explore trending products"
  }
}



const Banner = () => {
  if(homePageSettings.banner.allowed){
    return(
      <>
      <View
        style={{
          height: 800,
          marginTop: -800,
          backgroundColor: Colors[colorScheme  || "light"].bannerBackground,
        }}
      >

      </View>
      <View 
        style={{
          backgroundColor: Colors[colorScheme || "light"].bannerBackground,
          width: "100%",
          // alignSelf: 'center',
          // justifyContent: "center",
          paddingVertical: 13,
          paddingTop: insets.top == 0? 13: insets.top,
          marginBottom: 16
        }}
        >
        <Text style={{
          fontSize: 12,
          fontWeight: "500",
          color: Colors[colorScheme || "light"].text,
          textAlign: "center"
        }}>{homePageSettings.banner.text}</Text>
      </View>
      </>
    )
  }else{
    return(
      null
    )
  }
} 


    return (
        <>
        <FlatList
          // bounces={false}
          // bouncesZoom={true}
          style={{
            backgroundColor: Colors[colorScheme || "light"].background,  
          }}
          data={[{}]}
          ListHeaderComponent={
            <Banner />
          }
          keyExtractor={item => item + "TheID"}
          contentContainerStyle={{
            // paddingVertical: 12,
          }}
          renderItem={({item,index})=>
          <View
              style={{
                paddingHorizontal: 20,
              }}
            >
                  <SearchBar 
                    navigation={navigation}
                    colorScheme={colorScheme || "light"}
                  />
                  {
                    homePageSettings.mosaic.map(item =>
                      item.backgroundURL? <MosaicTyle
                      key={item.bodyText + item.headerText + item.backgroundURL}
                      backgroundURL={item.backgroundURL}
                      backgroundOverlayColor={item.backgroundOverlayColor}
                      headerText={item.headerText}
                      headerTextColor={item.headerTextColor}
                      headerTextFontSize={item.headerTextFontSize}
                      headerTextWeight={item.headerTextWeight}
                      bodyText={item.bodyText}
                      bodyTextColor={item.bodyTextColor}
                      bodyTextSize={item.bodyTextSize}
                      bodyTextWeight={item.bodyTextWeight}
                      buttonColor={item.buttonColor}
                      buttonTextColor={item.buttonTextColor}
                      buttonText={item.buttonText}
                      navigation={navigation}
                      navigationHandle={item.navigationHandle}
                      navigationType={item.navigationType}
                    />: null
                    )
                  }

                  <View>

                    {collectionHandle? <FlatList 
                      data={productList?.collectionByHandle?.products.edges || []}
                      initialNumToRender={1}
                      numColumns={2}
                      columnWrapperStyle={{
                        justifyContent: "space-between",
                        flexWrap: "wrap"
                      }}
                      ListHeaderComponent={
                        <Text 
                          style={{
                            fontSize: 22,
                            fontWeight: '700',
                            color: Colors[colorScheme || "light"].text,
                            // textAlign: 'center',
                            paddingVertical: 20,
                            marginBottom: 5,
                            }}>
                              {homePageSettings.products.collectionTitle}
                        </Text>
                      }
                      renderItem = {({item, index}) => (
                        <RenderProductList 
                                item={item} 
                                index={index}
                                colorScheme={colorScheme} 
                                gridSize={2}
                                navigation={navigation}
                            />
                      )}
                      keyExtractor={item => item.node.id}
                      />: null}
                  </View>
                  <View>
                    {blogHandle? <Text 
                      style={{
                        fontSize: 21,
                        fontWeight: '700',
                        color: Colors[colorScheme || "light"].text,
                        paddingVertical: 20,
                        marginBottom: -5,
                      }}>
                        {homePageSettings.blog.blogsTitle}
                    </Text>: null}
                    {blogPosts?.blogByHandle.articles.edges.map(item =>
                        <BlogPost
                          id={item.node.id +"BLOG"}
                          key={item.node.id +"BLOG"}
                          title={item.node.title}
                          publishedAt={item.node.publishedAt}
                          colorScheme={colorScheme || "light"}
                          navigation={navigation}
                          backgroundURL={item.node.image.transformedSrc}
                          handle={item.node.handle}
                        />
                      )
                      
                    }
                  </View>
            </View>
          }
        />
          

        </>
    );
}
