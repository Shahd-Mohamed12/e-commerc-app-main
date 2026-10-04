export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/products/${id}`, {
      next: { revalidate: 300 }
    });
    const payload = await response.json();
    const product = payload?.data;
    if (!product) return { title: 'Product Not Found' };
    return {
      title: product.title,
      description: product.description?.slice(0, 160),
      openGraph: {
        title: product.title,
        images: [{ url: product.imageCover }]
      }
    };
  } catch {
    return { title: 'Product' };
  }
}

export default function ProductLayout({ children }) {
  return children;
}
