import React, { FunctionComponent } from "react"; // importing FunctionComponent
import { Text, Dimensions, ColorSchemeName, TextInput, TextStyle, StyleProp, NativeSyntheticEvent, TextInputFocusEventData, View, KeyboardTypeOptions } from "react-native";
import { SVG_WarningRegular } from "../assets/svgs/warning";
import Colors from "../constants/Colors";
import { GenericTextInputType } from "../types";
import { CoreTextInput } from "./core/CoreTextInput";

// Addition to main generic input
type GenericTextInputComponentType = {
  titleTextCustomStyle: StyleProp<TextStyle>;
} & GenericTextInputType;

export const GenericTextInputComponent = React.forwardRef(
  (
    {
      colorScheme,
      editable,
      title,
      placeholder,
      value,
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
    } :GenericTextInputComponentType,
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

    
    return(<View
      style={{
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
      <CoreTextInput
        ref={ref}
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
      </>
    </View>)
  }
);
