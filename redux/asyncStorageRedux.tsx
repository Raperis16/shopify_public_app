import CartScreen from "../screens/CartScreen";
import { addressType, productsEdgesEnum, reduxCartItemInnerType, reduxCartItemType, reduxFavouritesType } from "../types";
import { configureStore } from '@reduxjs/toolkit'

export const SET_CHECKOUT_ID = "checkout/id";
export const SET_CHECKOUT_URL = "checkout/url";
export const SET_CART_ITEMS = "cart/items";

/**
 * Adds item to the cart. To add compleatly new object, send in all params
 * To increase quantity, send only variantId, maxQuantity and quantity
 * @param {String} id - Product id
 * @param {String} handle - Product handle
 * @param {number} quantity - Quantity what is added by customer
 * @param {number} maxQuantity - Max qunatity returned by API
 * @param {String} title - Title of product
 * @param {String} currencyCode - Currency
 * @param {String} amount - Amount of one item
 * @param {String} variantId - Id of added varriant
 * @param {String} imageSrc - src of image
 * @param {String} lineItemId - line item id of checkout. Used for deleting 
 * @param {number} oldQuantity - used if item was set as out of stock, and when in stock it will put back to old quantity

 */
export const ADD_ITEM_TO_CART = "cart/add_item";

/**
 * Updates existing item
 * @param {String} id - Product id
 * @param {String} handle - Product handle
 * @param {number} quantity - Quantity what is added by customer
 * @param {number} maxQuantity - Max qunatity returned by API
 * @param {String} title - Title of product
 * @param {String} currencyCode - Currency
 * @param {String} amount - Amount of one item
 * @param {String} variantId - Id of added varriant
 * @param {String} imageSrc - src of image
 * @param {String} lineItemId - line item id of checkout. Used for deleting 
 * @param {number} oldQuantity - used if item was set as out of stock, and when in stock it will put back to old quantity

 */
export const UPDATE_ITEM_IN_CART = "cart/update_item";

/**
 * Deletes item from cart by variant id
 * @param {String} variantId - Id of varriant, object locator
 */
export const DELETE_ITEM_FROM_CART = "cart/delete_item";

/**
 * Decreases quantity of object in cart
 * @param {String} variantId - Id of varriant, object locator
 * @param {String} [quantity=1] - default 1, otherwise if more needed to be deleted, send in this param
 */
export const DECREASE_QUANTITY_ITEM_CART = "cart/decrease_quantity_item";

/**
 * Adds address
 * uses addressType
 */
export const ADD_ADDRESS_CHECKOUT = "checkout/add_address";

/**
 * Removes address at index with splice
 * @param {number} index - Index of address
 */
export const REMOVE_ADDRESS_CHECKOUT = "checkout/remove_address"

/**
 * Adds favourite by it's id
 * @param {String} id - id of product
 */
export const ADD_FAVOURITE = "favourite/add";

/**
 * Updates favourite by it's id
 * @param {String} id - id of product
 */
 export const UPDATE_FAVOURITE = "favourite/update";


/**
 * Removes favurite by it's id
 * @param {String} id - id of product
 */
export const REMOVE_FAVOURITE = "favourite/remove"

/**
 * only for test env. Cleans all favourites
 */
 export const CLEAN_FAVOURITE = "favourite/clean"


type stateType = {
    checkoutID: null|string,
    checkoutURL: null|string,
    cartItems: reduxCartItemType,
    shippingAddresses: Array<addressType>,
    favouriteItems: reduxFavouritesType
}

type payloadType = {
    type: any,
    payload: allPayloadItems,
}

type allPayloadItems = {
    cartItems?: reduxCartItemInnerType,
    address?: addressType,
    favouriteItems?: productsEdgesEnum,
    index?: number
}

const initialState: stateType = {
    checkoutID: null,
    checkoutURL: null,
    shippingAddresses: [],
    cartItems: { },
    favouriteItems: {}
};


  
//RESOLVER
export default (state = initialState, action:payloadType) => {
    switch (action.type) {


        case ADD_FAVOURITE: {
            // IF OBJECT ALREADY EXISTS, DON'T DO ANYTHING
            // SHOULD NOT BE CASE BUT TO BE SURE
            if(state.favouriteItems[action.payload.favouriteItems?.node.id || ""]){
                return{
                    ...state,
                }
            }else{
                console.log(action.payload, "PAYLOAD REDUX")
                // NEW OBJECT
                const newProductObject:reduxFavouritesType = {
                    [action.payload.favouriteItems?.node.id || ""] : action.payload.favouriteItems? action.payload.favouriteItems : {}
                }

                const newProductStateObject = Object.assign(newProductObject, state.favouriteItems);
                console.log(newProductStateObject, "TO BE ADDED IN REDUX")
                // https://stackoverflow.com/questions/58850699/useselector-not-updating-when-store-has-changed-in-reducer-reactjs-redux
                return{
                    ...state,
                    favouriteItems: { ...newProductStateObject, ...state.favouriteItems }
                }
            }
        }

        case UPDATE_FAVOURITE: {
            // IF OBJECT ALREADY EXISTS, UPDATE IT'S ALL ITEMS WITH GIVEN FROM ACTION
            if(state.favouriteItems[action.payload.favouriteItems?.node.id || ""]){
                let productUpdateItem = action.payload.favouriteItems

               
                const newProductState= Object.assign(state.favouriteItems[action.payload.favouriteItems?.node.id || ""], productUpdateItem);

                const newProductObjectUpdate:reduxFavouritesType = {
                    [action.payload.favouriteItems?.node.id || ""] : newProductState
                }


                // https://stackoverflow.com/questions/58850699/useselector-not-updating-when-store-has-changed-in-reducer-reactjs-redux
                return{
                    ...state,
                    favouriteItems: { ...state.favouriteItems, ...newProductObjectUpdate }
                }
            }else{
                return{
                    ...state,
                }
            }
        }

        case REMOVE_FAVOURITE:{

            let favouriteItems = state.favouriteItems;
            delete favouriteItems[action.payload.favouriteItems?.node.id || ""]
            return{
                ...state,
                favouriteItems: {...favouriteItems}
            }
        }

        case CLEAN_FAVOURITE: {
            return{
                ...state,
                favouriteItems: {}
            }
        }

        case REMOVE_ADDRESS_CHECKOUT: {
            let newShippingAddress = state.shippingAddresses;

            // Without this duplicate code , method does not work properly :(
            newShippingAddress.splice(action.payload.index? action.payload.index : 0,1);
            return{
                ...state,
                shippingAddresses: newShippingAddress.splice(action.payload.index? action.payload.index : 0,1)
            }
        };

        case ADD_ADDRESS_CHECKOUT: {

            let newAddressToAdd:addressType = {
                firstName: action.payload.address?.firstName || null,
                lastName: action.payload.address?.lastName || null,
                company: action.payload.address?.company || null,
                contactNumber: action.payload.address?.contactNumber || null,
                address1: action.payload.address?.address1 || "",
                address2: action.payload.address?.address2 || null,
                country: action.payload.address?.country || "",
                province: action.payload.address?.province || "",
                city: action.payload.address?.city || "",
                zip: action.payload.address?.zip || ""
            }

            return{
                ...state,
                shippingAddresses: [...state.shippingAddresses, newAddressToAdd]
            }
        };

        case SET_CHECKOUT_ID:{
            return {
                ...state,
                checkoutID: action.payload
            }
        }

        case SET_CHECKOUT_URL:{
            return {
                ...state,
                checkoutURL: action.payload
            }
        }

        case SET_CART_ITEMS:{
            return {
                ...state,
                cartItems: action.payload
            }
        }

        case DECREASE_QUANTITY_ITEM_CART: {

            // Before doing operation check if this object exsists
            if(state.cartItems[action.payload.cartItems?.variantId || ""]){
                
                // Decreases quantity
                let cartItemNew  ={
                    quantity: state.cartItems[action.payload.cartItems?.variantId || ""].quantity - ( action.payload.cartItems?.quantity || 1 )
                }

               
                // Assigns new object to previous one and overwrites values
                const newProductState= Object.assign(state.cartItems[action.payload.cartItems?.variantId || ""], cartItemNew);

                // Is assigned to Object
                const newProductObject:reduxCartItemType = {
                    [action.payload.cartItems?.variantId || ""] : newProductState
                }


                // https://stackoverflow.com/questions/58850699/useselector-not-updating-when-store-has-changed-in-reducer-reactjs-redux
                return{
                    ...state,
                    cartItems: { ...state.cartItems, ...newProductObject }
                }


            }
            return{
                ...state
            }
        }

        case DELETE_ITEM_FROM_CART:{

            let cartItems = state.cartItems;
            delete cartItems[action.payload.cartItems?.variantId || ""]
            return{
                ...state,
                cartItems: {...cartItems}
            }
        }

        case UPDATE_ITEM_IN_CART:{

            // IF OBJECT ALREADY EXISTS, JUST UPDATE IT
            if(state.cartItems[action.payload.cartItems?.variantId || ""]){
                let cartItemNew  ={
                    maxQuantity: state.cartItems[action.payload.cartItems?.variantId || ""].maxQuantity,
                    quantity: state.cartItems[action.payload.cartItems?.variantId || ""].quantity,
                    amount: action.payload.cartItems?.amount,
                    title: action.payload.cartItems?.title,
                    imageSrc: action.payload.cartItems?.imageSrc  
                }

               
                const newProductState= Object.assign(state.cartItems[action.payload.cartItems?.variantId || ""], cartItemNew);

                const newProductObject:reduxCartItemType = {
                    [action.payload.cartItems?.variantId || ""] : newProductState
                }


                // https://stackoverflow.com/questions/58850699/useselector-not-updating-when-store-has-changed-in-reducer-reactjs-redux
                return{
                    ...state,
                    cartItems: { ...state.cartItems, ...newProductObject, }
                }


            }
        }

        case ADD_ITEM_TO_CART:{

            // IF OBJECT ALREADY EXISTS, JUST UPDATE IT
            if(state.cartItems[action.payload.cartItems?.variantId || ""]){
                let cartItemNew  ={
                    maxQuantity: action.payload.cartItems?.maxQuantity || 0,
                    quantity: 
                        (state.cartItems[action.payload.cartItems?.variantId || ""].quantity + (action.payload.cartItems?.quantity || 0)) > ( action.payload.cartItems?.maxQuantity || 0 )?
                            action.payload.cartItems?.maxQuantity || 0
                        : (state.cartItems[action.payload.cartItems?.variantId || ""].quantity + (action.payload.cartItems?.quantity || 0))
                }

               
                const newProductState= Object.assign(state.cartItems[action.payload.cartItems?.variantId || ""], cartItemNew);

                const newProductObject:reduxCartItemType = {
                    [action.payload.cartItems?.variantId || ""] : newProductState
                }


                // https://stackoverflow.com/questions/58850699/useselector-not-updating-when-store-has-changed-in-reducer-reactjs-redux
                return{
                    ...state,
                    cartItems: { ...state.cartItems, ...newProductObject, }
                }


            }else{

                // NEW OBJECT
                const newProductObject:reduxCartItemType = {
                    [action.payload.cartItems?.variantId || ""] : action.payload.cartItems? action.payload.cartItems : {}
                }

                const newCartStateObject = Object.assign(state.cartItems, newProductObject);

                // https://stackoverflow.com/questions/58850699/useselector-not-updating-when-store-has-changed-in-reducer-reactjs-redux
                return{
                    ...state,
                    cartItems: { ...state.cartItems, ...newCartStateObject }
                }
            }
        }

        default: {
            return { ...state };
        }
    }
};