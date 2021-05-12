import React, { FunctionComponent } from "react"; // importing FunctionComponent
import { Text, Dimensions, ColorSchemeName, TextInput, TextStyle, StyleProp, NativeSyntheticEvent, TextInputFocusEventData, View, KeyboardTypeOptions } from "react-native";
import { GenericTextInputType } from "../../types";
import { SVG_WarningRegular } from "../../assets/svgs/warning";
import Colors from "../../constants/Colors";

  
export const CoreTextInput = React.forwardRef(
    (
      {
        colorScheme,
        editable,
        title,
        placeholder,
        value,
        onChangeText,
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
        keyboardType,
      } :GenericTextInputType,
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
        <>
        <TextInput
          ref={ref}
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
          style={[
            {
              color: Colors[colorScheme].text,
              backgroundColor: Colors[colorScheme].textInputBackground,
              padding: 7,
              paddingTop: 16,
              paddingBottom: 16,
              // borderWidth: 0.9,
              marginBottom: 10,
              fontSize: 16,
              borderRadius: 7
            },
            textInputCustomStyle
          ]}
          onFocus={onFocus}
          onChangeText={onChangeText}
          value={value}
          placeholderTextColor={Colors[colorScheme].placeholderColor}
        />
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
      )
  
    } 
    
    )