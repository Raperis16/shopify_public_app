
import React, { MutableRefObject } from 'react';
import { ColorSchemeName, StyleProp, Text, View, ViewStyle } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Modalize } from 'react-native-modalize';
import { SVG_ChevronBackwardRegular } from '../../assets/svgs/chevron_backward_regular';
import Colors from '../../constants/Colors';

type dropDownPickerType = {
    colorScheme: NonNullable<ColorSchemeName>
    selectedValue: string
    setSelectedValue: any,
    title: string,
    style?: StyleProp<ViewStyle>,
    pickerModalizeRef: MutableRefObject<Modalize>,
    style2: Boolean|undefined
}

/** 
* 
* In main UI where user can press and after pressing on PickerModalize will pop up to pick value
* 
* @param {StyleProp<ViewStyle>}  style - Style for wrapper. Only can be used to set margin or padding to the component
* @param {NonNullable<ColorSchemeName>} colorScheme - colorscheme
* @param {string} title - Title of picker
* @param {string} selectedValue - Value which will be shown as selected
* @param {any} setSelectedValue - useState value where we can set newest selected value
* @param {MutableRefObject<Modalize>} pickerModalizeRef - used to open modal where user can pick his variant or quantity
* @param {Boolean=} style2 - Style without border and sets background color
* @param {any=} onPressAdditional - Adds additional functionality when user presses on picker

* */
export const DropdownPickerComponent = ({ style, colorScheme, title, selectedValue, setSelectedValue, pickerModalizeRef, style2, onPressAdditional } : dropDownPickerType ) =>{
return(
    <TouchableWithoutFeedback 
        onPress={
            () =>{
                pickerModalizeRef.current?.open();
                if(onPressAdditional != undefined){
                    onPressAdditional()
                }
            } 
        }
        style={style}
    >
        <Text
            style={{
                fontSize: style2? 15:13,
                fontWeight: style2? "400" : "600",
                marginBottom: 5,
                color: Colors[colorScheme].text
            }}
        >
            {title}
        </Text>
        <View
            style={{
                flexDirection: "row",
                borderRadius: style2? 7 : 10,
                borderWidth: style2? undefined : 1,
                borderColor: style2? undefined : Colors[colorScheme].gray05,
                backgroundColor: style2? Colors[colorScheme].textInputBackground : undefined,
                height: style2? undefined: 49,
                padding: style2? 7 : undefined,
                paddingTop: style2? 16 : undefined,
                paddingBottom: style2? 16 :undefined,
                paddingHorizontal: 11,
                alignItems: "center",
                justifyContent: "space-between"
            }}
        >
            <Text
                style={{
                    color: Colors[colorScheme].text,
                    fontSize: style2? 16 : 17
                }}
            >
                {selectedValue != ""? selectedValue : "Select " + title.toLowerCase()}
            </Text>
            <SVG_ChevronBackwardRegular
                style={{
                    transform: [
                        { rotateX: "0deg" },
                        { rotateZ: "-90deg" }
                    ]
                }}
                width={15}
                height={15}
                color={Colors[colorScheme].text}
            />
        </View>
    </TouchableWithoutFeedback>
)
}