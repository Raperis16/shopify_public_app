import shopClient from './shopify'
  
const CreateCheckout = (SetCheckoutID) => {
  shopClient.checkout.create().then((checkout) => {
    SetCheckoutID(checkout.id)
    // console.log(checkout.id)
  });
}

export default CreateCheckout