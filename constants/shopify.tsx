import Client from 'shopify-buy';

// Build a client to acces storeFront API
const shopClient = Client.buildClient({
  domain: 'bids-test-store.myshopify.com/',
  storefrontAccessToken: '1fe108274e6a4ef88337482f940c1703'
});

export default shopClient