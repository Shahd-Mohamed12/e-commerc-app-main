export async function generateMetadata({ params }) {
  const { categoryId } = await params;
  try {
    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/categories/${categoryId}`, {
      next: { revalidate: 300 }
    });
    const payload = await response.json();
    const category = payload?.data;
    if (!category) return { title: 'Category Not Found' };
    return {
      title: category.name,
      description: `Shop the latest ${category.name} at FreshCart.`
    };
  } catch {
    return { title: 'Category' };
  }
}

export default function CategoryLayout({ children }) {
  return children;
}
