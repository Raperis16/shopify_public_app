import { NavigationProp, ParamListBase } from '@react-navigation/core';
import { ColorSchemeName, KeyboardTypeOptions, NativeSyntheticEvent, StyleProp, TextInputFocusEventData, TextStyle } from "react-native";

export type RootStackParamList = {
  Root: undefined;
  ProductImageViewer: undefined;
  NotFound: undefined;
  StartCheckoutProcess: undefined;
  NewShippingAddress: undefined;
};

export type CheckoutStackParamList = {
  ShippingAddressSelection: undefined;
  ShippingSelection: undefined;
}

export type BottomTabParamList = {
  Home: undefined;
  Cart: undefined;
  Categories: undefined;
  Favourites: undefined;
};

export type CategoriesParamList = {
  AllCollections: undefined;
  SingleCollection: undefined;
  Product: undefined;
  ProductImageViewer: undefined;
};

export type ModalParamList = {
  ProductImageViewer: undefined;
};

export type HomeParamList = {
  Home: undefined;
  Product: undefined;
  Search: undefined;
};

export type CartParamList = {
  Cart: undefined;
  Product: undefined
};

export type FavoriteParamList = {
  Favorite: undefined;
  Product: undefined
};


export type collectionByHandleEnum  = {
  collectionByHandle: collectionByHandleInsideEnum
}

type collectionByHandleInsideEnum  = {
  title: string,
  products: productsBlockEnum
}

export type graphqlProductEnum  = {
  products: productsBlockEnum
}

type productsBlockEnum = {
  pageInfo: productsPageInfoEnum
  edges: Array<productsEdgesEnum>
}

export type productsEdgesEnum = {
  cursor: string,
  node: productsEdgesNodeEnum
}

export type productByHandleType = {
  productByHandle: productsEdgesNodeEnum
}

export type productsEdgesNodeEnum = {
  onlineStoreUrl: string,
  title: string,
  handle: string,
  id: string,
  createdAt: string,
  tags: Array<string>,
  vendor: string,
  compareAtPriceRange: priceRangeProductEnum
  priceRange: priceRangeProductEnum,
  availableForSale: boolean,
  images: imagesBlockEnum,
  description: string,
  descriptionHtml: string,
  variants: variantProductEnum
}

type variantProductEnum = {
  pageInfo: productsPageInfoEnum
  edges: Array<variantEdgesEnum>
}

export type variantEdgesEnum = {
  cursor: string,
  node: variantBlock
}

export type variantBlock = {
  id: string,
  quantityAvailable: number,
  availableForSale: boolean,
  compareAtPriceV2: priceRangeVariantBlockenum | null,
  priceV2: priceRangeVariantBlockenum,
  selectedOptions: Array<keyPairsEnum>,
  title: string,
  unitPrice: priceRangeProductEnum,
  weight: string,
  weightUnit: string,
  image: imagesEdgesNodeBlockEnum
}

type keyPairsEnum = {
  name : string,
  value: string
}

export type imagesBlockEnum = {
  edges: Array<imagesEdgesBlockEnum>
}

export type imagesEdgesBlockEnum = {
  node: imagesEdgesNodeBlockEnum
}

type imagesEdgesNodeBlockEnum = {
  id: string,
  height: number,
  width: number,
  src: string,
  transformedSrc: string
}

type priceRangeProductEnum = {
  minVariantPrice: priceRangeVariantBlockenum,
  maxVariantPrice: priceRangeVariantBlockenum
}

type priceRangeVariantBlockenum = {
  amount: string,
  currencyCode: string
}

type productsPageInfoEnum = {
  hasNextPage: boolean,
  lastCursor: string | null
}

export type sortByRulesEnum  = {
  param: string,
  reverse: boolean
}

export type priceRulesEnum = {
  min: number | null,
  max: number | null
}

export type SVGTypes = {
  color: string,
  width: number,
  height: number,
  style?: StyleProp<TextStyle>
}

//name is id of product
export type reduxFavouritesType = {
  [name: string]: productsEdgesEnum
}

//name is variant id
export type reduxCartItemType = {
  [name: string]: reduxCartItemInnerType
}

export type reduxCartItemInnerType ={
  id?: string,
  lineItemId?: string,
  handle?: string,
  quantity?: number,
  oldQuantity?: number,
  maxQuantity?: number,
  title?: string,
  currencyCode?: string,
  amount?: string,
  variantId: string,
  imageSrc?: string
}

export type addressType = {
  /**The first name of the customer. */
  firstName?: String | null,
  /**The last name of the customer. */
  lastName: String | null,
  /**The name of the customer's company or organization. */
  company?: String | null,
  /**A unique phone number for the customer.
   * Formatted using E.164 standard. For example, +16135551111. */
  contactNumber?: String | null,
  /**The first line of the address. Typically the street address or PO Box number. */
  address1: String,
  /**The second line of the address. Typically the number of the apartment, suite, or unit. */
  address2?: String | null,
  /**The name of the country. */
  country: String,
  /**The region of the address, such as the province, state, or district. */
  province: String,
  /** The name of the city, district, village, or town. */
  city: String,
  /**The zip or postal code of the address. */
  zip: String
}


export type GenericTextInputType = {
  colorScheme: NonNullable<ColorSchemeName>;
  ref?: any;
  title: string;
  placeholder?: string | undefined;
  editable?: boolean | undefined;
  value: string;
  onSubmitEditing?: () => any;
  onChangeText?: (text: string) => void;
  textInputCustomStyle?: StyleProp<TextStyle>;
  multiline?: boolean | undefined;
  numberOfLines?: number | undefined;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  secureTextEntry?: boolean | undefined;
  onFocus?: ((e: NativeSyntheticEvent<TextInputFocusEventData>) => void) | undefined,
  validateTextInput?: boolean | undefined,
  validateType?: 
    | "required"
    | "emailAddress"
    | "off",
  autoCompleteType?:
    | "cc-csc"
    | "cc-exp"
    | "cc-exp-month"
    | "cc-exp-year"
    | "cc-number"
    | "email"
    | "name"
    | "password"
    | "postal-code"
    | "street-address"
    | "tel"
    | "username"
    | "off";
  textContentType?:
    | "none"
    | "URL"
    | "addressCity"
    | "addressCityAndState"
    | "addressState"
    | "countryName"
    | "creditCardNumber"
    | "emailAddress"
    | "familyName"
    | "fullStreetAddress"
    | "givenName"
    | "jobTitle"
    | "location"
    | "middleName"
    | "name"
    | "namePrefix"
    | "nameSuffix"
    | "nickname"
    | "organizationName"
    | "postalCode"
    | "streetAddressLine1"
    | "streetAddressLine2"
    | "sublocality"
    | "telephoneNumber"
    | "username"
    | "password"
    | "newPassword"
    | "oneTimeCode",
    keyboardType?: KeyboardTypeOptions
};

export type blogPostByHandleType = {
  blogByHandle: blogPostByHandleInnerType
}

type blogPostByHandleInnerType = {
  id: String,
  articles: blogPostArticlesType
}

type blogPostArticlesType = {
  edges: Array<blogPostArticleEdgeType>
}

export type blogPostArticleEdgeType = {
  node: blogPostArticleEdgeNodeType
}

type blogPostArticleEdgeNodeType  = {
  id: String
  title: String
  publishedAt: String
  image: imagesEdgesNodeBlockEnum
  handle: String
}

export type articleInnerByHandleType = {
  blogs: articleBlogByHandleType
}

type articleBlogByHandleType = {
  edges: Array<articleEdgeByHandletype>
}

type articleEdgeByHandletype = {
  node: articleEdgeNodeByHandletype
}

type articleEdgeNodeByHandletype = {
  articleByHandle: articleEdgeNodeItemByHandletype
}

type articleEdgeNodeItemByHandletype = {
  id: String
  title: String
  publishedAt: String
  image: imagesEdgesNodeBlockEnum
  contentHtml: String
}

type collectionBlockEnum = {
  pageInfo: productsPageInfoEnum
  edges: Array<collectionBlockEdgesEnum>
}

export type collectionBlockEdgesEnum = {
  node: collectionBlockEdgesNodeEnum
}

type collectionBlockEdgesNodeEnum = {
  title: String,
  handle: String,
  id: String
  image: imagesEdgesNodeBlockEnum
}

export type searchGraphQLResponse =  {
  collections: collectionBlockEnum,
  products: productsBlockEnum
}

export type searchConcaticatedEnum = Array<searchConcaticatedBodyEnum>

export type searchConcaticatedBodyEnum = {
  type: "product"|"collection",
  title: String,
  handle: String,
  id: String
} 

export type getAllCollectionsType = {
  collections: collectionBlockEnum
}

export type navigationType = {
  navigation: NavigationProp<ParamListBase>
}

export type colorSchemeType = {
  colorScheme: NonNullable<ColorSchemeName>
}