import { Ionicons } from '@expo/vector-icons';
import React, { FunctionComponent } from 'react'; // importing FunctionComponent
import { View, Text, Dimensions, Platform, ColorSchemeName, GestureResponderEvent } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SVG_ChevronBackwardRegular } from '../assets/svgs/chevron_backward_regular';
import { SVG_CloseRegular } from '../assets/svgs/close';
import { SVG_ToggleRegualr } from '../assets/svgs/toggle';
import Colors from '../constants/Colors';

type GenericHeaderEnum  = {
    colorScheme: NonNullable<ColorSchemeName>,
    title: string,
    subtitle?: string|null,
    navigation?: any,
    showGoBackButton?: boolean,
    showCloseButton?: boolean,
    showRightAction?: boolean,
    showRightActionSVG?: any,
    showRightActionTitle?: String,
    rightActionFunction?: (event: GestureResponderEvent) => void,
    smallTitle?: boolean
}


export const GenericHeader: FunctionComponent<GenericHeaderEnum> = (
  { 
    colorScheme,
    title,
    subtitle,
    navigation,
    showGoBackButton,
    showRightAction,
    showRightActionSVG,
    showRightActionTitle,
    rightActionFunction,
    showCloseButton,
    smallTitle
  }
  ) => {
    return(
        <View
                style={{
                  marginBottom: smallTitle? 20: 0
                }}
              >
                <View style={{ 
                  flexDirection: "row"
                 }}>
                  {
                    showGoBackButton || showCloseButton?
                        <TouchableOpacity 
                        onPress={()=>{
                          if(navigation !=null){
                            navigation.goBack()
                          }
                        }}
                        style={{
                          flexDirection: "row",
                          alignItems: "center"
                        }}>

                          {
                            showGoBackButton?
                              <SVG_ChevronBackwardRegular
                                color={Colors[colorScheme].text}
                                width={13}
                                height={13}
                                style={{
                                  // marginLeft: -2,
                                  marginRight: 7
                                }}
                              />
                            :
                                <SVG_CloseRegular
                                  color={Colors[colorScheme].text}
                                  width={13}
                                  height={13}
                                  style={{
                                    // marginLeft: -2,
                                    marginRight: 7
                                  }}
                                />
                          }

                          {
                            smallTitle?
                              <Text
                                style={{
                                  fontSize: 17,
                                  fontWeight: "500",
                                  marginLeft: 10,
                                  color: Colors[colorScheme].text
                                }}
                              >
                                {title}
                              </Text>
                            : null

                          }
                        </TouchableOpacity>
                    : null
                  }
                  {
                  showRightAction?
                    <View style={{
                      // height: "100%",
                      justifyContent: "center",
                      right: 0,
                      flex: 1
                        }}>
                        <TouchableOpacity
                          onPress={rightActionFunction}
                        >
                            <View
                                style={{
                                    alignItems: "flex-end",
                                    alignContent: "center",
                                    justifyContent: "flex-end",
                                    flexDirection: "row",
                                    marginTop: 2
                                }}
                            >
                                {
                                  showRightActionSVG != null?
                                    <>
                                    {showRightActionSVG}
                                    <Text
                                        style={{
                                          marginLeft: 7,
                                          fontSize: 15,
                                          color: Colors[colorScheme].text
                                        }}
                                      >
                                        {showRightActionTitle}
                                      </Text>
                                    </>
                                  :
                                    <>
                                      <SVG_ToggleRegualr width={16} height={16} color={Colors[colorScheme].text} />
                                      <Text
                                        style={{
                                          marginLeft: 7,
                                          fontSize: 15,
                                          color: Colors[colorScheme].text
                                        }}
                                      >
                                        {showRightActionTitle || "Filter"}
                                      </Text>
                                    </>
                                }
                            </View>
                      </TouchableOpacity>
                    </View>
                  :
                    null
                  }
                </View>
                {
                  smallTitle != true?
                    <Text style={{
                      fontSize: Dimensions.get("window").width >= 200? 29 : 27,
                      marginTop: showGoBackButton || showCloseButton? 15 : 0,
                      fontWeight: "bold",
                      color: Colors[colorScheme].text,
                      marginBottom: Dimensions.get("window").width >= 500?  10 : 13
                    }}>
                        {title}
                    </Text>
                 : null}
                {
                  subtitle != null && subtitle != ""?
                    <Text style={{
                        fontSize: Dimensions.get("window").width >= 500? 20 : 16,
                        marginBottom: Dimensions.get("window").width >= 500? 30 : 30,
                        color: Colors[colorScheme].gray01
                      }}>
                      {subtitle}
                    </Text>
                  : null
                }

                {  
                  smallTitle?
                    <View
                      style={{
                        flex:1,
                        marginRight: -25,
                        marginLeft: -25,
                        backgroundColor: Colors[colorScheme].gray00,
                        height: 1,
                        marginTop:  smallTitle? 15 : 7,
                      }}
                    >
                    </View>
                  : null
                }
        </View>
    )
}