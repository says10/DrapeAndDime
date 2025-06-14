// This is your extract logic (this can be kept within your component or as a separate file)
const extractProductData = (products: ProductType[]) => {
    return products.map((product) => ({
      productId: product._id,
      images: product.media,  // Assuming `media` holds image URLs
    }));
  };
  