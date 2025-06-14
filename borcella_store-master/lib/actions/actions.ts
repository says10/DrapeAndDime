export const getCollections = async () => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch collections");
    }

    return res.json();
  } catch (err) {
    console.log("[collections_GET]", err);
    throw err;
  }
};

export const getCollectionDetails = async (collectionId: string) => {
  const collection = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/collections/${collectionId}`, {
    cache: "no-store",
  });
  return collection.json();
};

export const getProducts = async () => {
  const products = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    cache: "no-store",
  });
  return products.json();
};

export const getProductDetails = async (productId: string) => {
  const product = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
    cache: "no-store",
  });
  return product.json();
};

export const getSearchedProducts = async (query: string) => {
  const searchedProducts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/search/${query}`, {
    cache: "no-store",
  });
  return searchedProducts.json();
};

export const getOrders = async (customerId: string) => {
  const orders = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/customers/${customerId}`, {
    cache: "no-store",
  });
  return orders.json();
};

export const getRelatedProducts = async (productId: string) => {
  const relatedProducts = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/related`, {
    cache: "no-store",
  });
  return relatedProducts.json();
};
