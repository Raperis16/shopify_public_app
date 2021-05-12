import React, { FunctionComponent } from "react"; // importing FunctionComponent
import { Text, Dimensions, ColorSchemeName, TextInput, TextStyle, StyleProp, NativeSyntheticEvent, TextInputFocusEventData, View, KeyboardTypeOptions } from "react-native";
import { SVG_WarningRegular } from "../assets/svgs/warning";
import Colors from "../constants/Colors";
import { GenericTextInputType } from "../types";
import { CoreTextInput } from "./core/CoreTextInput";

// Addition to main generic input
type PhoneNumberTextInputType = {
  titleTextCustomStyle: StyleProp<TextStyle>;
  callingCodeValue: String;
  onChangeCallingCodeText: any;
} & GenericTextInputType;

export const PhoneNumberTextInput = React.forwardRef(
  (
    {
      colorScheme,
      editable,
      title,
      placeholder,
      value,
      callingCodeValue,
      onChangeCallingCodeText,
      onChangeText,
      titleTextCustomStyle,
      textInputCustomStyle,
      multiline,
      numberOfLines,
      autoCapitalize,
      textContentType,
      autoCompleteType,
      secureTextEntry,
      onSubmitEditing,
      onFocus,
      validateTextInput,
      validateType,
      keyboardType
    } :PhoneNumberTextInputType,
    ref: any
  ) => {
    
    const [isTextInputValid, setIsTextInputValid] = React.useState(true);

    React.useEffect( () => {
      if(validateTextInput === true && validateType != undefined){
        if(validateType == "required"){
          if(value == ""){
            setIsTextInputValid(false);
          }else{
            setIsTextInputValid(true);
          }
        }
      }
    
    }, [validateTextInput, value] )

    
    return(
    <View
      style={{
        // flexDirection: "row"
        // height: 85
      }}
    >
      <Text
        style={[
          {
            color: Colors[colorScheme].text,
            marginTop: 15,
            fontSize: Dimensions.get("window").width >= 500 ? 16 : 15,
            marginBottom: Dimensions.get("window").width >= 500 ? 6 : 6,
            // color: Colors[colorScheme].secondaryTextColor
          },
          titleTextCustomStyle,
        ]}
      >
        {title}
      </Text>
      <>
      <View
        style={{
          flexDirection: "row",
          flex: 1,
          width: "100%"
        }}
      >
         <CoreTextInput
          ref={ref}
          textInputCustomStyle={
            {
              flex: 1/8.8,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              borderRightColor: Colors[colorScheme].gray04,
              borderRightWidth: 1,
            }
          }
          colorScheme={colorScheme}
          onSubmitEditing={onSubmitEditing}
          secureTextEntry={secureTextEntry}
          autoCompleteType={autoCompleteType}
          autoCapitalize={autoCapitalize}
          textContentType={textContentType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          placeholder={placeholder}
          keyboardType={keyboardType}
          onFocus={onFocus}
          onChangeText={onChangeCallingCodeText}
          value={callingCodeValue}
          placeholderTextColor={Colors[colorScheme].placeholderColor}
        />
        <CoreTextInput
          ref={ref}
          textInputCustomStyle={
            {
              flex: 1,
              borderTopLeftRadius: 0,
              borderBottomLeftRadius: 0,
            }
          }
          colorScheme={colorScheme}
          onSubmitEditing={onSubmitEditing}
          secureTextEntry={secureTextEntry}
          autoCompleteType={autoCompleteType}
          autoCapitalize={autoCapitalize}
          textContentType={textContentType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          editable={editable}
          placeholder={placeholder}
          keyboardType={keyboardType}
          onFocus={onFocus}
          onChangeText={onChangeText}
          value={value}
          title={title}
          validateType={validateType}
          validateTextInput={validateTextInput}
          placeholderTextColor={Colors[colorScheme].placeholderColor}
        />
      </View>
      {
        isTextInputValid == false?
            <Text
              style={{
                marginTop: -9,
                fontSize: 12,
                marginBottom: 13,
                color: Colors[colorScheme].red
              }}
            >{title} is mandatory</Text>
            : null
      }
      {
        isTextInputValid == false?
          <View style={{
            marginTop: 27,
            padding: 7,
            paddingTop: 16,
            paddingBottom: 16,
            marginBottom: 10,
            position: "absolute",
            justifyContent: "flex-end",
            right: 0,
            flexDirection: "row",
          }}>
            <SVG_WarningRegular
                style={{
                  alignSelf: "flex-end",
                  marginRight: 5,
                }}
                width={14}
                height={14}
                color={Colors[colorScheme].red}
            />
          </View>
        : null
      }
      </>
    </View>)
  }
);
