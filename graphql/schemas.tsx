
import { gql } from '@apollo/client';




export const GET_SINGLE_COLLECTION = gql`

        fragment ProductsFragment on Collection {
            products(first: $first, after: $cursor, sortKey: $sortBy, reverse: $reverse) {
                edges {
                    cursor
                    node {
                    title
                    handle
                    id
                    createdAt
                    tags
                    vendor
                    compareAtPriceRange {
                        minVariantPrice {
                            amount
                            currencyCode
                        }
                        maxVariantPrice {
                            amount
                            currencyCode
                        }
                    }
                    priceRange {
                        maxVariantPrice {
                        amount
                        currencyCode
                        }
                        minVariantPrice {
                        amount
                        currencyCode
                        }
                    }
                    availableForSale
                    images(first: 1) {
                        edges {
                            node {
                                id
                                height
                                width
                                transformedSrc(
                                    scale: 1
                                    preferredContentType: WEBP
                                    maxHeight: 300
                                    crop: CENTER
                                    maxWidth: 300
                                )
                            }
                        }
                    }
                    }
                }
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                }
                }
        }

        query collectionByHandle($handle: String!, $cursor: String, $first: Int!, $sortBy: String, $reverse: Boolean ) {
            
            


            collectionByHandle(handle: $handle) {
                ...ProductsFragment
                title
            }
        }
`;


export const GET_SINGLE_COLLECTION_FILTERS = gql`

        fragment ProductsFragmentMinimal on Collection {
            products(first: $first, after: $cursor, sortKey: $sortBy, reverse: $reverse) {
                edges {
                    cursor
                    node {
                        priceRange {
                            maxVariantPrice {
                                amount
                                currencyCode
                            }
                            minVariantPrice {
                                amount
                                currencyCode
                            }
                        }
                        availableForSale
                    }
                }
                pageInfo {
                    hasNextPage
                    hasPreviousPage
                }
                }
        }

        query collectionByHandle($handle: String!, $cursor: String, $first: Int!, $sortBy: String, $reverse: Boolean ) {
            
            


            collectionByHandle(handle: $handle) {
                ...ProductsFragmentMinimal
                title
            }
        }
`;


export const GET_PRODUCT_BY_HANDLE = gql`
    
    query productByHandle($handle: String!) {
          productByHandle(handle: $handle) {
            availableForSale
            onlineStoreUrl
            title
            images(first: 10) {
                edges {
                    node {
                        id
                        transformedSrc
                    }
                }
            }
            id
            handle
            description
            descriptionHtml
            compareAtPriceRange {
                maxVariantPrice {
                    amount
                    currencyCode
                }
                minVariantPrice {
                    amount
                    currencyCode
                }
            }
            priceRange {
                maxVariantPrice {
                    amount
                    currencyCode
                }
                minVariantPrice {
                    amount
                    currencyCode
                }
            }
            productType
            vendor
            variants(first: 10) {
                edges {
                        node {
                            id
                            quantityAvailable
                            availableForSale
                            compareAtPriceV2 {
                                amount
                                currencyCode
                            }
                            currentlyNotInStock
                            priceV2 {
                                amount
                                currencyCode
                            }
                            selectedOptions {
                                name
                                value
                            }
                            title
                            unitPrice {
                                amount
                                currencyCode
                            }
                            weight
                            weightUnit
                            image {
                                    transformedSrc
                            }
                        }
                    }
                }
            }
        
    }
`;

export const GET_PRODUCT_RECOMMENDATIONS = gql`
    
    query productRecommendations($productId: String!) {
        productRecommendations(productId: $productId) {
                title
                handle
                id
                createdAt
                tags
                vendor
                compareAtPriceRange {
                    minVariantPrice {
                        amount
                        currencyCode
                    }
                    maxVariantPrice {
                        amount
                        currencyCode
                    }
                }
                priceRange {
                    maxVariantPrice {
                    amount
                    currencyCode
                    }
                    minVariantPrice {
                    amount
                    currencyCode
                    }
                }
                availableForSale
                images(first: 1) {
                    edges {
                        node {
                            id
                            height
                            width
                            src
                        }
                    }
                }
          }
        
    }
`;

export const GET_BLOG_BY_HANDLE = gql`
    
    query blogByHandle($handle: String!) {
        blogByHandle(handle: $handle) {
            id
            articles(first: 2) {
              edges {
                node {
                  id
                  handle
                  title
                  publishedAt
                  image {
                    transformedSrc
                  }
                }
              }
            }
          }
    }    
  `;

  export const GET_ARTICLE_BY_HANDLE = gql`
    
    query articleByHandle($handle: String!) {
        blogs(first: 1) {
            edges {
              node {
                articleByHandle(handle: $handle) {
                  title
                  publishedAt
                  image {
                    transformedSrc
                  }
                  contentHtml
                }
              }
            }
          }
    }    
  `;

  export const SEARCH_PRODUCTS = gql`
    
    query searchProducts($search: String!) {
        
        products(query: $search, first: 10) {
            edges {
                node {
                    title
                    handle
                    id
                }
            }
        }
        collections(query: $search, first: 10) {
            edges {
            node {
                id
                handle
                title
            }
            }
        }
        
    }
`;

export const GET_ALL_COLLECTIONS = gql`
    
    query getAllCollections($first: Int!, $query: String!) {
        
        collections(first: $first, query: $query) {
            edges {
            node {
                handle
                id
                image {
                    transformedSrc(
                        scale: 1
                        preferredContentType: WEBP
                        maxHeight: 300
                        crop: CENTER
                        maxWidth: 300
                    )
                }
                title
            }
            }
        }
        
    }
`;

export const GET_PRODUCTS = gql`
    
    query products($first: Int!, $query: String!) {
        
        products(first: $first, query: $query) {
            edges {
            node {
                availableForSale
            onlineStoreUrl
            title
            images(first: 10) {
                edges {
                    node {
                        id
                        transformedSrc
                    }
                }
            }
            id
            handle
            description
            descriptionHtml
            compareAtPriceRange {
                maxVariantPrice {
                    amount
                    currencyCode
                }
                minVariantPrice {
                    amount
                    currencyCode
                }
            }
            priceRange {
                maxVariantPrice {
                    amount
                    currencyCode
                }
                minVariantPrice {
                    amount
                    currencyCode
                }
            }
            productType
            vendor
            variants(first: 10) {
                edges {
                        node {
                            id
                            quantityAvailable
                            availableForSale
                            compareAtPriceV2 {
                                amount
                                currencyCode
                            }
                            currentlyNotInStock
                            priceV2 {
                                amount
                                currencyCode
                            }
                            selectedOptions {
                                name
                                value
                            }
                            title
                            unitPrice {
                                amount
                                currencyCode
                            }
                            weight
                            weightUnit
                            image {
                                    transformedSrc
                            }
                        }
                    }
                }
                
            }
            }
        }
        
    }
`;