import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens'; enableScreens();


import { Provider } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import Store from "./redux/store";

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import Navigation from './navigation';

import { ApolloProvider, ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { relayStylePagination } from "@apollo/client/utilities";


const httpLink = createHttpLink({ uri: "https://bids-test-store.myshopify.com/api/2021-07/graphql.json" })

const middlewareLink = setContext(() => ({
  headers: {
    'X-Shopify-Storefront-Access-Token': '1fe108274e6a4ef88337482f940c1703'
  }
}))

const client = new ApolloClient({
  link: middlewareLink.concat(httpLink),
  cache: new InMemoryCache(

    {
      typePolicies: {
        Query: {
          fields: {
            collectionByHandle: {
              keyArgs: ["handle"],
              merge: false
            },
            productByHandle: {
              keyArgs: ["handle"]
            },
            productRecommendations: {
              merge: false
            },
            searchProducts: {
              keyArgs: ["search"],
              merge: false
            },
            getAllCollections: {
              keyArgs: ["first"]
            },
            products: {
              merge: false
            }
          }
        }
      }
    }

  )
});


export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <Provider store={Store.Store}>
          <PersistGate loading={null} persistor={Store.Persistor}>
            <ApolloProvider client={client}>
              <SafeAreaProvider>
                <Navigation colorScheme={colorScheme} />
                <StatusBar />
              </SafeAreaProvider>
            </ApolloProvider>
          </PersistGate>
        </Provider>
    );
  }
}
