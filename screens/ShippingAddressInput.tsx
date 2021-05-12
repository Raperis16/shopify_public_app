import { NavigationProp, ParamListBase } from '@react-navigation/core';
import React, { MutableRefObject, RefObject } from 'react';
import { ColorSchemeName, useColorScheme, View, FlatList, Text, Dimensions, Button, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, FlatListProps, findNodeHandle, Keyboard } from 'react-native';
import { EdgeInsets, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { GenericHeader } from '../components/GenericHeader';
import Colors from '../constants/Colors';
import { useDispatch, useSelector } from "react-redux"
import { addressType, reduxCartItemInnerType, reduxCartItemType } from '../types';
import { RenderCartItems } from '../components/cartpage/cartItems';
import Svg, { G, Path } from 'react-native-svg';
import { SVG_ChevronBackwardSemibold } from '../assets/svgs/chevron_backward_regular';
import shopClient from '../constants/shopify';
import * as WebBrowser from 'expo-web-browser';
import { GenericTextInput, GenericTextInputComponent } from '../components/GenericTextInputComponent';
import { KeyboardAwareFlatList, KeyboardAwareFlatListProps, KeyboardAwareScrollView , listenToKeyboardEvents } from 'react-native-keyboard-aware-scroll-view'
import { PickerModalize } from '../components/PickerModalize';
import { Modalize } from 'react-native-modalize';
import { Portal } from 'react-native-portalize';
import { DropdownPickerComponent } from '../components/productpage/DropdownPicker';
import { visualConfig } from '../constants/visualConfig';
import { PhoneNumberTextInput } from '../components/PhoneNumberTextInput';
import { ADD_ADDRESS_CHECKOUT } from '../redux/asyncStorageRedux';


type defaultScreenType = {
    navigation: NavigationProp<ParamListBase>,
    route: routeType
}

type routeType = {
    params: paramsType
}

type paramsType = {
}

type countryListType = {
    name: String,
    callingCodes: Array<String>
}


export default function ShippingAddressInput({ navigation, route }: defaultScreenType) {
    const colorScheme: NonNullable<ColorSchemeName> = useColorScheme();
    const dispatch = useDispatch();
    const insets: EdgeInsets = useSafeAreaInsets();
    const shippingAddresses: Array<addressType> = useSelector(state => state.storage.shippingAddresses);
    const [firstName, onChangeFirstName] = React.useState("");
    const [lastName, onChangeLastName] = React.useState("");
    const [company, onChangeCompany] = React.useState("");
    const [contactNumber, onChangeContactNumber] = React.useState("");
    const [addressLine1, onChangeAddressLine1] = React.useState("");
    const [addressLine2, onChangeAddressLine2] = React.useState("");
    const [province, onChangeProvince] = React.useState("");
    const [city, onChangeCity] = React.useState("");
    const [zip, onChangeZip] = React.useState("");
    const [showValidationError, setShowValidationError] = React.useState("");
    
    //For country
    const pickerModalizeVariant1Ref = React.useRef<Modalize>();
    const [country, onChangeCountry] = React.useState(239);
    const [ countryList, loadCountryList ] = React.useState<Array<String>>();
    const [ callingCode, onChangeCallingCode ] = React.useState<String>("");
    const [validateForm, onToggleSaveForm] = React.useState(false);


    const [ isFormValid, setIsFormValid ] = React.useState(false)
        
        const flatlistRef = React.createRef<FlatList>();
        
        
        React.useEffect(() =>{
            
            setIsFormValid(
            firstName != "" 
            &&
            lastName != ""
            &&
            addressLine1 != ""
            &&
            addressLine2 != ""
            &&
            province != ""
            &&
            city != ""
            ?
                false
            :
                true

        )

    },[firstName, lastName, addressLine2, addressLine1, province, city]);

    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus',  () => {
            // GET LATEST LIST OF COUNTRIES
            fetch('https://restcountries.eu/rest/v2/all?fields=name;callingCodes', {method: 'GET'})
                .then((response) => response.json())
                .then((json:Array<countryListType>) => {
                    let responseFromAPIRestCountries = json;
                    let newJson:Array<String> = []
                    json.map( item =>{
                        newJson = [...newJson, item.name]
                        newJson.concat(item.name)
                    })
                    loadCountryList(newJson);

                    // GET CURRENT COUNTRY LOCATED IN
                    fetch('https://freegeoip.app/json/', {method: 'GET'})
                    .then((response) => response.json())
                    .then((json) => {
                        newJson.forEach((value, index) =>{
                            if(value == json.country_name){
                                onChangeCallingCode("+" + responseFromAPIRestCountries[index].callingCodes[0])
                                onChangeCountry(index);
                            }
                        });
                    })
                    .catch((error) => {
                        // On error set country as United states of America
                        newJson.forEach((value, index) =>{
                            if(value == "United States of America"){
                                onChangeCountry(index);
                                onChangeCallingCode("+1")
                            }
                        });
                    })
                    
                })
                .catch((error) => {
                    console.log(error)
                    console.error(error);
                });
        });
    
        return unsubscribe;
      }, [navigation]);


    return (
        <>
        <Portal>
            <PickerModalize
                ref={pickerModalizeVariant1Ref}
                colorScheme={colorScheme}
                title={"Select country"}
                data={countryList}
                selectedValue={country}
                setSelectedValue={onChangeCountry}

            />
        </Portal>
        <SafeAreaView
            style={{
                flex: 1,
                marginBottom: -insets.bottom,
                backgroundColor: Colors[colorScheme].background,
                paddingTop: 15,
            }}
        >
            <View style={{ flex: 1 }}>
                <View style={{ flex: 0.9 }}>
                        <KeyboardAwareFlatList
                            ref={flatlistRef}
                            keyboardOpeningTime={0}
                            enableAutomaticScroll={true}
                            getItemLayout={(data, index) => (
                                {length: 80, offset: 80 * index, index}
                              )}
                            extraScrollHeight={140}
                            ListHeaderComponent={
                                <GenericHeader
                                navigation={navigation}
                                colorScheme={colorScheme}
                                showCloseButton={true}
                                title={"Add address"}
                                subtitle={
                                    shippingAddresses.length == 0 ? "Enter your new shipping address" : null
                                }
                                />
                            }
                            contentContainerStyle={
                                {
                                    paddingHorizontal: 20,
                                    flexGrow: 1,
                                    // paddingBottom: 500
                                }
                            }
                            renderItem={({ item, index }) =>
                                    
                                    item.enabled == false?
                                        null
                                    :
                                    item.type == "Modalize"?
                                        <DropdownPickerComponent
                                            style2={true}
                                            style={{
                                                marginBottom: 10
                                            }}
                                            key={"United states"}
                                            title={"Country*"}
                                            selectedValue={countryList? countryList[country] : ""}
                                            setSelectedValue={onChangeCountry}
                                            colorScheme={colorScheme}
                                            pickerModalizeRef={pickerModalizeVariant1Ref}
                                            onPressAdditional={() =>{
                                                Keyboard.dismiss()
                                            }}
                                        />
                                    :
                                    item.textContentType == "telephoneNumber" ?
                                        <PhoneNumberTextInput
                                            colorScheme={colorScheme}
                                            title={item.title}
                                            editable={true}
                                            autoCapitalize={item.autoCapitalize}
                                            textContentType={item.textContentType}
                                            autoCompleteType={item.autoCompleteType}
                                            value={item.value}
                                            callingCodeValue={callingCode}
                                            onChangeCallingCodeText={onChangeCallingCode}
                                            onChangeText={item.onChangeText}
                                            
                                            titleTextCustomStyle={{
                                                marginTop: 0,
                                            }}
                                            validateTextInput={validateForm}
                                            validateType={
                                                item.required? "required" : "off"
                                            }
                                            keyboardType={item.keyboardType || "default"}
                                        />
                                    :
                                    <GenericTextInputComponent
                                        colorScheme={colorScheme}
                                        title={item.title}
                                        editable={true}
                                        autoCapitalize={item.autoCapitalize}
                                        textContentType={item.textContentType}
                                        autoCompleteType={item.autoCompleteType}
                                        value={item.value}
                                        onChangeText={item.onChangeText}
                                        
                                        titleTextCustomStyle={{
                                            marginTop: 0,
                                        }}
                                        validateTextInput={validateForm}
                                        validateType={
                                            item.required? "required" : "off"
                                        }
                                        keyboardType={item.keyboardType || "default"}
                                    />
                                
                            }
                            data={[
                                {
                                    title: "First name" + (visualConfig.shippingAddress.firstNameAndLastName.required? "": " (optional)"),
                                    required: visualConfig.shippingAddress.firstNameAndLastName.required,
                                    autoCapitalize: "sentences",
                                    autoCompleteType: "off",
                                    textContentType: "givenName",
                                    value: firstName,
                                    onChangeText: (text: String) => onChangeFirstName(text),
                                },
                                {
                                    title: "Last name",
                                    required: true,
                                    autoCapitalize: "sentences",
                                    autoCompleteType: "off",
                                    textContentType: "familyName",
                                    value: lastName,
                                    onChangeText: (text: String) => onChangeLastName(text),
                                },
                                  {
                                    enabled: visualConfig.shippingAddress.company.enabled,
                                    title: "Company" + ( visualConfig.shippingAddress.company.required? "" : " (optional)" ),
                                    required: visualConfig.shippingAddress.company.required,
                                    autoCapitalize: "sentences",
                                    autoCompleteType: "off",
                                    textContentType: "company",
                                    value: company,
                                    onChangeText: (text: String) => onChangeCompany(text),
                                },
                                {
                                    enabled: visualConfig.shippingAddress.contactNumber.enabled,
                                    title: "Contact number" + (visualConfig.shippingAddress.contactNumber.required? "" : " (optional)"),
                                    required: visualConfig.shippingAddress.contactNumber.required,
                                    autoCapitalize: null,
                                    autoCompleteType: "tel",
                                    textContentType: "telephoneNumber",
                                    value: contactNumber,
                                    keyboardType: "phone-pad",
                                    onChangeText: (text: String) => onChangeContactNumber(text),
                                },
                                {
                                    title: "Address",
                                    required: true,
                                    autoCapitalize: null,
                                    autoCompleteType: "street-address",
                                    textContentType: "streetAddressLine1",
                                    value: addressLine1,
                                    onChangeText: (text: String) => { 
                                        onChangeAddressLine1(text);
                                    },
                                },
                                {
                                    enabled: visualConfig.shippingAddress.addressLine2.enabled,
                                    title: "Apartment, suite, etc." + (visualConfig.shippingAddress.addressLine2.required? "" : " (optional)"),
                                    required: visualConfig.shippingAddress.addressLine2.required,
                                    autoCapitalize: null,
                                    autoCompleteType: "off",
                                    textContentType: "streetAddressLine2",
                                    value: addressLine2,
                                    onChangeText: (text: String) => onChangeAddressLine2(text),
                                },
                                {
                                    title: "State",
                                    required: true,
                                    autoCapitalize: null,
                                    autoCompleteType: "off",
                                    textContentType: "addressState",
                                    value: province,
                                    onChangeText: (text: String) => onChangeProvince(text),
                                },
                                {
                                    title: "City",
                                    required: true,
                                    autoCapitalize: null,
                                    autoCompleteType: "off",
                                    textContentType: "addressCity",
                                    value: city,
                                    onChangeText: (text: String) => onChangeCity(text),
                                }
                                ,
                                {
                                    title: "ZIP code",
                                    required: true,
                                    autoCapitalize: null,
                                    autoCompleteType: "off",
                                    textContentType: "none",
                                    value: zip,
                                    keyboardType: "numeric",
                                    onChangeText: (text: String) => onChangeZip(text),
                                }
                                ,
                                {
                                    type: "Modalize",
                                    title: "Country",
                                    autoCapitalize: null,
                                    autoCompleteType: "off",
                                    textContentType: "countryName",
                                    value: country,
                                    onChangeText: (text: String) => onChangeCountry(text),
                                }
                            ]}
                            keyExtractor={item => item.title}

                        />
                </View>
                <KeyboardAvoidingView 
                    behavior="position"
                    keyboardVerticalOffset={35}
                    style={{ 
                        flex: 0.13,
                        zIndex: 20
                    }}
                    >
                    <View
                        style={{
                            backgroundColor: Colors[colorScheme].background,
                            // bottom: 0,
                            paddingHorizontal: 20,
                            borderTopColor: Colors[colorScheme].gray02,
                            borderTopWidth: 1,
                            // position: "absolute",
                            width: "100%"
                        }}
                    >
                        <TouchableOpacity
                            onPress={() => {
                                onToggleSaveForm(true);
                                if(
                                (visualConfig.shippingAddress.firstNameAndLastName.required === true? firstName != "" :  true )
                                    &&
                                lastName != ""
                                    &&
                                addressLine1 != ""
                                    &&
                                ( (visualConfig.shippingAddress.addressLine2.enabled && visualConfig.shippingAddress.addressLine2.required) === true ? addressLine2 != "" : true )
                                    &&
                                province != ""
                                    &&
                                city != ""
                                    &&
                                zip != ""
                                    &&
                                ( (visualConfig.shippingAddress.contactNumber.enabled && visualConfig.shippingAddress.contactNumber.required)  === true ? contactNumber != "" : true )
                                ){
                                    let newAddress:addressType = {
                                        firstName: firstName || null,
                                        lastName: lastName || null,
                                        company: company || null,
                                        contactNumber: contactNumber != ""? (callingCode+contactNumber) : null,
                                        address1: addressLine1 || "",
                                        address2: addressLine2 || null,
                                        country: countryList? countryList[country] : "",
                                        province: province,
                                        city: city,
                                        zip: zip
                                    }
                                    dispatch({
                                        type: ADD_ADDRESS_CHECKOUT,
                                        payload: {address: newAddress}
                                    })
                                    navigation.goBack();
                                }else{
                                    console.log("form is not valid")
                                }
                            }}
                            style={{
                                marginTop: 15,
                                marginBottom: 30,
                                padding: 16,
                                backgroundColor: Colors[colorScheme].addToCartButton,
                                borderRadius: 7,
                                // flex: 1 / 1.2,
                                height: 50,
                                justifyContent: "center"
                            }}
                            >
                            <Text
                                style={{
                                    textAlign: "center",
                                    fontSize: 16,
                                    fontWeight: "500",
                                    color: Colors[colorScheme].buyButtonText,
                                }}
                            >Save</Text>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </View>

        </SafeAreaView>
        </>
    )
}
