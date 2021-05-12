import React from 'react'
import { View, Image, Text, FlatList, ColorSchemeName, useColorScheme } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { useQuery } from '@apollo/client';
import Colors from '../constants/Colors';


import { colorSchemeType, navigationType, articleInnerByHandleType } from '../types';
import { GET_ARTICLE_BY_HANDLE } from '../graphql/schemas';
import HTML from 'react-native-render-html';
import { Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { SVG_ChevronBackwardSemibold } from '../assets/svgs/chevron_backward_regular';

  type blogPostType = {
    id: String
    title: String
    contentHtml: String
    publishedAt: String
    imageUrl: String
  } & colorSchemeType

export default function BlogScreen ({navigation, route}:blogPostType) {
    const [ blogPosts, setBlogPosts] = React.useState<articleInnerByHandleType>()
    const colorScheme:NonNullable<ColorSchemeName>  = useColorScheme();
    const PostHandle  = route.params["handle"];

    const {} = useQuery(GET_ARTICLE_BY_HANDLE, {
        onCompleted: (data) => {
          setBlogPosts(data)
        }, 
        variables: { 
            handle: PostHandle,
        },
      });

      const BlogArticle = ({
        title,
        contentHtml,
        publishedAt,
        imageUrl,
        colorScheme,
        id
      }: blogPostType) => {
          return (
            <View>
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
                            alignItems: "center",
                            position: 'absolute',
                            zIndex: 100,
                            marginLeft: 20,
                            marginTop: 30
                        }}
                    >
                        <SVG_ChevronBackwardSemibold
                            color={Colors[colorScheme].text}
                            width={16}
                            height={16}
                        />
                    </TouchableOpacity>
                {imageUrl? <Image source={{uri: imageUrl}} style={{ width: Dimensions.get('screen').width, height: 300, flex: 1}} />: null}
                <View style={{paddingHorizontal: 20}}>
                    <Text style={{color: Colors[colorScheme].text, fontSize: 24, fontWeight: '600', paddingBottom: 10, paddingTop: 15}}>{title}</Text>
                    <Text style={{color: Colors[colorScheme].gray02, paddingBottom: 15, fontSize: 12}}>{publishedAt}</Text>
                    <HTML
                                style={{
                                    marginTop: 10,
                                    fontSize: 15,
                                    fontWeight: "400",
                                    lineHeight: 27.98,
                                    color: Colors[colorScheme].text,
                                    marginBottom: 20,
                                    // letterSpacing: 0.1
                                }} 
                                contentWidth={Dimensions.get("screen").width - 40}
                                containerStyle={{
                                    marginTop: 10,
                                    marginBottom: 20,
                                }}
                                baseFontStyle={{
                                    fontSize: 15,
                                    color: Colors[colorScheme].text,
                                }}
                                source={{ html: contentHtml || "<span></span>"}}
                            /> 
                </View>
            </View>

          )
      }


    return(
        <ScrollView style={{backgroundColor: Colors[colorScheme].background}}>
            {blogPosts?.blogs.edges.map((item, e) => 
                <BlogArticle 
                    key={e}
                    title={item.node.articleByHandle.title}
                    colorScheme={colorScheme}
                    contentHtml={item.node.articleByHandle.contentHtml}
                    imageUrl={item.node.articleByHandle.image.transformedSrc}
                    publishedAt={item.node.articleByHandle.publishedAt}
                />
            )}
        </ScrollView>
    )
}