import { useEffect, useState, type ComponentType } from 'react';
import { productsCmsApi } from '../../services/api';
import ProductPageView, { isPopulatedProduct, type ProductPageData } from './ProductPageView';

export default function withProductCms(slug: string, Hardcoded: ComponentType) {
  return function ProductCmsPage() {
    const [data, setData] = useState<ProductPageData | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      window.scrollTo(0, 0);
      productsCmsApi
        .getPage(slug)
        .then((page) => setData(page))
        .catch(() => setData(null))
        .finally(() => setLoaded(true));
    }, []);

    if (!loaded) {
      return <div className="flex min-h-screen items-center justify-center text-gray-500">Loading…</div>;
    }

    if (isPopulatedProduct(data)) {
      return <ProductPageView data={data!} />;
    }

    return <Hardcoded />;
  };
}
