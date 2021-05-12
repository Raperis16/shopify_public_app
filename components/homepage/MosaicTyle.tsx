import React, { MutableRefObject } from 'react';
import { Text, ImageBackground, Pressable } from 'react-native';
import { ColorValue } from 'react-native';
import { View } from 'react-native';


type mosaicTileType = {
  backgroundURL: string,
  backgroundOverlayColor: ColorValue,
  headerTextFontSize: number,
  headerTextColor: ColorValue,
  headerTextWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  headerText: String,
  bodyTextSize: number,
  bodyTextColor: ColorValue,
  bodyTextWeight: 'normal' | 'bold' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  bodyText: String,
  buttonColor: ColorValue,
  buttonText: String,
  buttonTextColor: ColorValue,
  navigationType: String,
  navigationHandle: String

}

export const MosaicTyle = ({backgroundURL, backgroundOverlayColor, navigation, headerTextFontSize, headerTextColor,headerTextWeight, headerText, bodyTextSize, bodyTextColor, bodyTextWeight, bodyText, buttonColor, buttonText, buttonTextColor, navigationHandle, navigationType}: mosaicTileType) => {
  console.log(navigationType, navigationHandle)
  return(
    <Pressable onPress={() => navigation.navigate(navigationType.toString(), {handle: navigationHandle})} style={{ aspectRatio: 1, paddingVertical: 11}}>
      <ImageBackground source={{uri: backgroundURL || undefined}} style={{flex: 1}} imageStyle={{borderRadius: 5}}>
      <View style={{backgroundColor: backgroundOverlayColor, flex: 1, padding: 15, borderRadius: 5}}>
        <Text 
          style={{
            width: "60%",
            fontSize: headerTextFontSize,
            color: headerTextColor,
            fontWeight: headerTextWeight
          }}>
          {headerText}
        </Text>
        <Text 
          style={{
            marginTop: 12,
            fontSize: bodyTextSize,
            color: bodyTextColor,
            fontWeight: bodyTextWeight,
            width: "90%",
            letterSpacing: 0.2,
            lineHeight: 35,
          }}>
            {bodyText}
        </Text>
        <View style={{
              backgroundColor: buttonColor,
              width: 131,
              borderRadius: 9,
              alignItems: 'center',
              justifyContent: 'center',
              height: 45,
              marginTop: 20,
            }}>
          <Text style={{
            color:buttonTextColor,
            fontWeight: "600",
            fontSize: 17
          }}>
            {buttonText}
          </Text>
        </View>
      </View>
      </ImageBackground>
    </Pressable>
  )
}