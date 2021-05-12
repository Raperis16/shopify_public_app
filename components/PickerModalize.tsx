import { Modalize } from "react-native-modalize"
import React, { Dispatch, FunctionComponent, MutableRefObject } from 'react';
import { ColorSchemeName, Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Colors from "../constants/Colors";

type pickerModalizeType = {
    data: Array<string|number>
    title: string,
    colorScheme: NonNullable<ColorSchemeName>,
    setSelectedValue: any,
    selectedValue: string | number
}

type renderFlatListItem = {
    item: renderFlatListItemItem,
    index: number,
    colorScheme: NonNullable<ColorSchemeName>,
    selectedValue: string | number,
    setSelectedValue: any,
    ref?: MutableRefObject<Modalize>
}

type renderFlatListItemItem = {
    value: string,
    setSelectedValue: any
}

/** 
 * Renders item in the modal flatlist which is selectable
*/
const RenderFlatlistItem = React.forwardRef(({ item, index, colorScheme, selectedValue, setSelectedValue } : renderFlatListItem, ref ) =>{
    return(
        <Pressable
            onPress={() =>{
                console.log("is this working?")
                setSelectedValue(index);
                ref?.current?.close();
            }}
            style={{
                borderColor: Colors[colorScheme].gray04,
                paddingVertical: 25,
                marginHorizontal: selectedValue.toString() != item.toString()? 20 : 0,
                paddingHorizontal: selectedValue.toString() == item.toString()? 20 : 0,
                borderBottomWidth: StyleSheet.hairlineWidth,
                backgroundColor: selectedValue.toString() == item.toString()? Colors[colorScheme].gray04 : Colors[colorScheme].modalizeBackground
            }}
        >
            <Text
                style={{
                    color: Colors[colorScheme].text,
                    fontSize: 17,
                    fontWeight: "400"
                }}
            >
                {item}
            </Text>
        </Pressable>
    )
})


/** 
 * Modal where user can pick their variant or quantity 
 * @param {Array<string>} data - data to showcase in modal
 * @param {string} title - title of the modal
 * @param {NonNullable<ColorSchemeName>} colorScheme - title of the modal
 * @param {string|number} selected - title of the modal
 * @param {Dispatch<S>} setSelected - title of the modal
*/
export const PickerModalize = React.forwardRef( (props:pickerModalizeType, ref) =>{
    return(
        <Modalize
            handleStyle={{
                backgroundColor: Colors[props.colorScheme].gray01
            }}
            adjustToContentHeight={true}
            handlePosition={"inside"}
            ref={ref}
            modalStyle={{
                backgroundColor: Colors[props.colorScheme].modalizeBackground,
            }}
            flatListProps={{
                data: props.data,
                ListHeaderComponent: (
                    <View style={{
                        paddingTop: 30,
                        paddingHorizontal: 20,
                        paddingBottom: 14,
                    }}>
                        <Text
                            style={{
                                color: Colors[props.colorScheme].text,
                                fontSize: 16,
                                fontWeight: "600"
                            }}
                        >{props.title}</Text>
                    </View>
                ),
                renderItem: ({item, index}) => 
                        <RenderFlatlistItem
                            index={index}
                            item={item}
                            colorScheme={props.colorScheme}
                            selectedValue={props.selectedValue}
                            setSelectedValue={props.setSelectedValue}
                            ref={ref}
                        />,
                ListFooterComponent: (
                    <View
                        style={{
                            marginBottom: 100
                        }}
                    >

                    </View>
                ),
                keyExtractor: item => item.toString()
            }}
        
        />

    )
    
})