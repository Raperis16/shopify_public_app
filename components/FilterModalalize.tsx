import { Ionicons } from '@expo/vector-icons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import { Picker } from '@react-native-picker/picker';
import React, { FunctionComponent } from 'react'; // importing FunctionComponent
import {Text, View, Keyboard, ColorSchemeName, GestureResponderEvent, ActivityIndicator, TouchableOpacity, Platform, StyleSheet, TextInput, Dimensions, ScrollView, Animated } from 'react-native';
import { Modalize } from 'react-native-modalize';
import { SVG_CloseRegular, SVG_CloseMedium } from '../assets/svgs/close';
import Colors from '../constants/Colors';
import { priceRulesEnum, sortByRulesEnum } from '../types';
import { GenericTextInput } from './GenericTextInputComponent';

type FilterModalizeEnum = {
    colorScheme: NonNullable<ColorSchemeName>,
    ref: any,
    sortByRules: sortByRulesEnum,
    setSortByRules: any,
    priceRules: priceRulesEnum,
    priceRulesMinMax: priceRulesEnum,
    setPriceRules: any
}

type renderPriceFilterEnum = {
  colorScheme: NonNullable<ColorSchemeName>,
  setLoading: any,
  priceRules: priceRulesEnum,
  priceRulesMinMax: priceRulesEnum,
  setPriceRules: any,
  setKeybordOpened: any,
  setScrollEnabled: any
}


const RenderTitle = ({text, colorScheme}) =>{
  return(
    <Text
      style={{
        fontSize: 18,
        fontWeight: "600",
        color: Colors[colorScheme].text,
        marginBottom: 20
      }}
    >
      {text}
    </Text>
  )
}

const RenderSortBy = ({ sortItems, sortBySelected, setSortBySelected, colorScheme, setLoading }) =>{



  return(
    <>
      <RenderTitle text={"Sort by"} colorScheme={colorScheme} />
     { sortItems.map( (item, index) =>
      <TouchableOpacity 
        key={item}
        onPress={() =>{
          setLoading(true)
          setSortBySelected(item)
        }}
        style={{
          marginTop: index == 0? 7 : 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: Colors[colorScheme].text,
            fontSize: 16,
            letterSpacing: 0.3
          }}
        >
          { item }
        </Text>
        <View
          style={{
            height: 30,
            width: 30,
            borderRadius: 90,
            borderWidth: item == sortBySelected ? 8.5 : 2,
            borderColor:  item == sortBySelected ?  Colors[colorScheme].text : Colors[colorScheme].gray01,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
        </View>
      </TouchableOpacity>
    ) }
    </>
  )
}

const RenderPriceFilter: FunctionComponent<renderPriceFilterEnum> = ({ colorScheme, priceRules, setPriceRules, setLoading, setKeybordOpened, setScrollEnabled, priceRulesMinMax }) => {
  return(
    <View
      style={{
        borderTopColor: Colors[colorScheme].gray05,
        paddingTop: 25,
        borderTopWidth: 1,
        marginTop: 40
      }}
    >
      <RenderTitle text={"Price"} colorScheme={colorScheme} />
      <View
        style={{
          flex: 1,
          width: "100%",
        }}
      >
      <MultiSlider
      sliderLength={Dimensions.get("screen").width - 40}
        isMarkersSeparated={true}
        min={ parseInt(priceRulesMinMax.min)  }
        max={ parseInt(priceRulesMinMax.max) }
        step={1}
        allowOverlap={false}
        values={[ 
            priceRules.min || priceRulesMinMax.min || 0
          ,
            priceRules.max || priceRulesMinMax.max || 9999
        ]}
        onValuesChange={(values) =>{
          setPriceRules({
            min: parseInt(values[0]),
            max: parseInt(values[1])
          })
        }}
        onValuesChangeStart={() =>{
          setScrollEnabled(false);
        }}
        onValuesChangeFinish={() =>{
          setScrollEnabled(true);
        }}
      />
      </View>
      <View 
        style={{
          paddingVertical: 8,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TextInput
          editable={false}
          value={
              priceRules.min?.toString() || priceRulesMinMax.min?.toString() || "0"
          }
          style={[
            styles.textInputPriceStyle,
            {
              borderColor: Colors[colorScheme].gray05,
              color: Colors[colorScheme].text
            }
          ]}
          placeholder={"Min."}
          placeholderTextColor={Colors[colorScheme].gray02}
        />
        <Text
          style={{
            color: Colors[colorScheme].text,
            fontSize: 16,
            letterSpacing: 0.3,
          }}
        >
          to
        </Text>
        <TextInput
          editable={false}
          onFocus={
            () =>{
              setKeybordOpened(true)
            }
          }
          onBlur={
            () =>{
              setKeybordOpened(false)
            }
          }
          onChangeText={text => {
            setPriceRules({
              ...priceRules,
              max: text,
            })
          }}

          value={
            priceRules.max?.toString() || priceRulesMinMax.max?.toString() || "9999"
          }
          style={[
              styles.textInputPriceStyle,
              {
                borderColor: Colors[colorScheme].gray05,
                color: Colors[colorScheme].text
              }
          ]}
          placeholder={"Max."}
          placeholderTextColor={Colors[colorScheme].gray02}
        />
      </View>
    </View>
  )
}

/**
 * Used for displaying filter modal. Currently only has sortBy and Price filter
 */
export const FilterModalize: FunctionComponent<FilterModalizeEnum> = React.forwardRef( (props, ref) =>{

    const [ scrollEnabled, setScrollEnabled ] = React.useState<boolean>(true);
    const [ sortBySelected, setSortBySelected ] = React.useState(
      props.sortByRules.param == "COLLECTION_DEFAULT"? 
        "Recommended"
      : props.sortByRules.param == "CREATED"? "Most recent" 
      : props.sortByRules.param == "PRICE" && !props.sortByRules.reverse ? "Lowest priced" 
      : props.sortByRules.param == "PRICE" && props.sortByRules.reverse ? "Highest priced" 
      : null
      
    );

    const [ priceRules, setPriceRules ] = React.useState<priceRulesEnum>(props.priceRules);  

    const [ loading, setLoading ] = React.useState(false);

    const [ keybordOpened, setKeybordOpened ] = React.useState(false);
    
    const _keyboardDidHide = () => {
      setKeybordOpened(false);
    };
  
    const saveChanges = () =>{
      switch (sortBySelected) {
        case 'Recommended':
          props.setSortByRules({ 
            param: "COLLECTION_DEFAULT",
            reverse: false
          })
          break;
        case 'Most recent':
          props.setSortByRules({
            param: "CREATED",
            reverse: false
          })
          break;
        case 'Highest priced':
          props.setSortByRules({
            param: "PRICE",
            reverse: true
          })
          break;
        case 'Lowest priced':
          props.setSortByRules({
            param: "PRICE",
            reverse: false
        })
          break;
        default:
          props.setSortByRules({ 
            param: "COLLECTION_DEFAULT",
            reverse: false
          })
      }
      props.setPriceRules({
        min: props.priceRulesMinMax.min == priceRules.min? null : parseInt(priceRules.min),
        max: props.priceRulesMinMax.max == priceRules.max? null : parseInt(priceRules.max)
      })
      ref.current?.close();
    }


    const stopLoading = () =>{
      setTimeout(() => setLoading(false) , 1000)
    }

    React.useEffect( () => {
      if(loading == true){
        stopLoading()
      }
    }, [ loading ]);

    return(
        <Modalize
        panGestureEnabled={scrollEnabled}
        scrollViewProps={{
          scrollEnabled: scrollEnabled
         }}
        handlePosition={"inside"}
        ref={ref}
        overlayStyle={{
          // borderTopLeftRadius: 9,
          // borderTopRightRadius: 9,
        }}
        handleStyle={{
          backgroundColor: Colors[props.colorScheme].gray02
        }}
        HeaderComponent={
          <View style={{
            paddingTop: 22,
            borderBottomWidth: 1,
            paddingBottom: 17,
            marginBottom: 20,
            borderBottomColor: Colors[props.colorScheme].gray05
          }}>
            <View
              style={{
                paddingHorizontal: 20,
                flexDirection: "row"
              }}
            >
              <TouchableOpacity
                onPress={() =>{
                  ref.current?.close();
                }}
                style={{
                  zIndex: 20000,
                  marginTop: 2,
                  paddingHorizontal: 20,
                  position: "absolute"
                }}
              >

                <SVG_CloseMedium
                  width="13"
                  height="13"
                  color={Colors[props.colorScheme].text}
                  />
              </TouchableOpacity>
              <Text
                style={{
                  flex: 1,
                  fontSize: 16,
                  fontWeight: "600",
                  justifyContent: "center",
                  textAlign: "center",
                  color: Colors[props.colorScheme].text
                }}
              >
                Filters
              </Text>
            </View>
          </View>
        }
        FooterComponent={
          keybordOpened?
           <View
            style={{
              height: 62,
              borderTopColor: Colors[props.colorScheme].gray05,
              paddingVertical: 8,
              marginBottom: 6,
              borderTopWidth: 1,
              alignItems: "flex-end"
            }}
           >
             <View
              style={{
                marginHorizontal: 20,
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center"
              }}
            >
               <Text
                style={{
                  color: Colors[props.colorScheme].text,
                  fontSize: 17,
                  fontWeight: "500",

                }}
              >         </Text>
              <TouchableOpacity
                style={{
                    backgroundColor: Colors[props.colorScheme].text,
                    // width: 200,
                    height: 50,
                    flex: 1/1.5,
                    borderRadius: 50,
                    justifyContent: "center"
                }}
              >
                  <Text
                    style={{
                      color: Colors[props.colorScheme].background,
                      fontSize: 17,
                      fontWeight: "500",
                      textAlign: "center"
                    }}
                  >Done</Text>
              </TouchableOpacity>
             </View>
          </View>
          :
          <View
            style={{
              borderTopWidth: 1,
              borderTopColor: Colors[props.colorScheme].gray05,
              paddingTop: 14,
              marginBottom: props.insetBottom? (-props.insetBottom  + 5) : 5  
            }}
          >
            <View
              style={{
                marginHorizontal: 20,
                flexDirection: "row",
                justifyContent: "space-between",
                alignContent: "center",
                alignItems: "center"
              }}
            >
              <Text
                style={{
                  color: Colors[props.colorScheme].text,
                  fontSize: 17,
                  fontWeight: "500",

                }}
              >Clear all</Text>
              <TouchableOpacity
                onPress={saveChanges}
                style={{
                  backgroundColor: Colors[props.colorScheme].text,
                  height: 50,
                  flex: 1/1.5,
                  borderRadius: 50,
                  justifyContent: "center"
                }}
              >
                {
                  loading?
                    <ActivityIndicator  color={Colors[props.colorScheme].background}/>
                  :
                    <Text
                  style={{
                    color: Colors[props.colorScheme].background,
                    fontSize: 17,
                    fontWeight: "500",
                    textAlign: "center"
                  }}
                >Show results</Text>


                }
              </TouchableOpacity>
            </View>
          </View>
        }
        modalStyle={{
          backgroundColor: Colors[props.colorScheme].modalizeBackground
        }}
      >
        <>
        <View
          style={{
            paddingHorizontal: 20
          }}
        >
          <RenderSortBy 
            colorScheme={props.colorScheme}
            sortItems={[
              "Recommended", "Most recent", "Highest priced", "Lowest priced"
            ]}
            setSortBySelected={setSortBySelected}
            sortBySelected={sortBySelected}
            setLoading={setLoading}
          />
          {
            // not needed if same price for all items
            props.priceRulesMinMax.min == props.priceRulesMinMax.max?
              null
            :
              <RenderPriceFilter
                colorScheme={props.colorScheme}
                priceRules={priceRules}
                setPriceRules={setPriceRules}
                setLoading={setLoading}
                setKeybordOpened={setKeybordOpened}
                setScrollEnabled={setScrollEnabled}
                priceRulesMinMax={props.priceRulesMinMax}
              />             
          }
        </View>
       </>
        
      </Modalize>
    )
})


const styles = StyleSheet.create({
  textInputPriceStyle: {
    paddingHorizontal: 13,
    paddingVertical: 13,
    fontSize: 16,
    letterSpacing: 0.3,
    borderRadius: 3,
    borderWidth: 1,
    flex: 1/3,
  },
});