import React, { MutableRefObject } from 'react';
import { Text} from 'react-native';
import { colorSchemeType, navigationType } from '../../types';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import Colors from '../../constants/Colors';
import { SVG_MagnifyingGlassRegular } from '../../assets/svgs/magnifyingGlass';


type saerchBarType ={
} & navigationType & colorSchemeType
export const SearchBar = ({navigation, colorScheme}:saerchBarType) => {

  return(
    <TouchableWithoutFeedback
      onPress={()=>{
        navigation.navigate("Search")
      }}
      style={{
          marginBottom: 9,
          backgroundColor: Colors[colorScheme].searchBarBackground,
          borderRadius: 20,
          height: 45,
          flex: 1,
          paddingHorizontal: 20,
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
          flexDirection: "row"
      }}
    
    >
      <SVG_MagnifyingGlassRegular
          color={Colors[colorScheme].text}
          width={13}
          height={13}
          style={{
            marginRight: 5
          }}
      />
      <Text
        style={{
          fontSize: 16,
          color: Colors[colorScheme].text
        }}
      >
          {"Search Anything"}
      </Text>
    </TouchableWithoutFeedback>

  )
}