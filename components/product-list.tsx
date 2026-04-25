import { Product } from "@/types";
import NoResults from "@/components/ui/no-results";
import ProductCard from "./ui/product-card";

interface ProductListProps {
  title: string;
  items: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ title, items }) => {
  return (
    <div className="space-y-4">
      <h3 className="font-bold text-xl sm:text-3xl">{title}</h3>
      { items.length === 0 && <NoResults /> }
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
            <ProductCard key={item.id} data={item} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
