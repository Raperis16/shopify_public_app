import React from 'react';
import { Image, View, Text, Pressable } from 'react-native';
import Colors from '../../constants/Colors';
import { colorSchemeType, navigationType } from '../../types';


type blogPostType = {
    id: String
    title: String
    publishedAt: String
    backgroundURL: string
    handle: String
  } & colorSchemeType & navigationType
  
export const BlogPost = ({
    backgroundURL,
    colorScheme,
    title,
    publishedAt,
    navigation,
    handle
  }: blogPostType) => {
    return (
      <Pressable onPress={() => navigation.navigate("Blog", {handle: handle})} style={{ marginVertical: 15}}>
        {backgroundURL? <Image source={{uri: backgroundURL}} style={{ height: 400,  borderRadius: 4}} />: null}
        <View style={{ marginVertical: 15}}>
          <Text style={{fontSize: 18, fontWeight: 'bold', color: Colors[colorScheme].text}}>{title}</Text>
          <Text style={{color: Colors[colorScheme].gray02, fontSize: 12, paddingTop: 10}}>{publishedAt}</Text>
        </View>
      </Pressable>
    )
  }