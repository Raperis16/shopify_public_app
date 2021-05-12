import Client from 'shopify-buy/index.unoptimized.umd';

// Build a client to acces storeFront API
const shopClientUnOptimized = Client.buildClient({
  domain: 'bids-test-store.myshopify.com/',
  storefrontAccessToken: '1fe108274e6a4ef88337482f940c1703'
});

export default shopClientUnOptimized