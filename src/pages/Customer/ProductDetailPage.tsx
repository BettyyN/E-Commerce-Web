import { LazyMotion, domAnimation, m} from "framer-motion";
import Header from "../../components/shared/Header";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useProViewDetail } from "@/service/proView/proView.queries";
import { ProductDetailPageSkeleton } from "@/components/shared/PageSkeleton";
import { PageError } from "@/components/shared/PageError";
import { CustomerProductHero } from "@/components/Customer/product/CustomerProductHero";
import { CustomerProductInfo } from "@/components/Customer/product/CustomerProductInfo";

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.15 },
  },
};

const sectionVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: "easeOut" as const },
  },
};

function ProductDetailPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const { id: productId } = useParams<{ id: string }>();

  const { data: product, isLoading, error } = useProViewDetail(productId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-stone-50 via-white to-amber-50/30">
        <Header onSearch={() => {}} searchQuery="" onSearchChange={() => {}} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <ProductDetailPageSkeleton />
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-linear-to-b from-stone-50 via-white to-amber-50/30">
        <Header onSearch={() => {}} searchQuery="" onSearchChange={() => {}} />
        <PageError
          message={error?.message ?? "Product not found."}
          onBack={() => navigate("/")}
          backLabel="Back to Shop"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-stone-50 via-white to-amber-50/30">
      <Header
        onSearch={(q) => setSearchQuery(q)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <LazyMotion features={domAnimation}>
        <m.main
          className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:pb-16"
          initial="hidden"
          animate="visible"
          variants={pageVariants}
        >
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Home
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mb-16 lg:mb-20 lg:items-start">
            <m.div
              variants={sectionVariants}
              className="lg:sticky lg:top-8"
            >
              <CustomerProductHero images={product.images ?? []} />
            </m.div>

            <m.div
              variants={sectionVariants}
              className="lg:max-h-[calc(100vh-8rem)] lg:overflow-y-auto lg:pr-2 scrollbar-thin"
            >
              <CustomerProductInfo
                productName={product.product ?? ""}
                shortDesc={product.shortDesc}
                variants={product.variants ?? []}
              />
            </m.div>
          </div>

          {/* Product details section */}
          {(product.desc ||
            product.brand ||
            product.originCountry ||
            product.ingredients ||
            product.storageInst) && (
            <m.div variants={sectionVariants} className="mb-16 lg:mb-20">
              <div className="p-0">
                <div className="flex gap-1 border-b border-slate-200 mb-6">
                  <button className="px-5 py-2.5 text-sm font-semibold rounded-t-lg text-yellow-700 border-b-2 border-yellow-500 bg-yellow-50/50">
                    Details
                  </button>
                </div>
                <div className="space-y-4">
                  {product.desc && (
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {product.desc}
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { label: "Brand", value: product.brand },
                      { label: "Origin", value: product.originCountry },
                      { label: "Ingredients", value: product.ingredients },
                      { label: "Storage", value: product.storageInst },
                    ]
                      .filter(({ value }) => !!value)
                      .map(({ label, value }) => (
                        <div
                          key={label}
                          className="flex gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100"
                        >
                          <span className="text-slate-400 text-sm w-24 shrink-0">
                            {label}
                          </span>
                          <span className="text-slate-800 font-medium text-sm">
                            {value}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </m.div>
          )}
        </m.main>
      </LazyMotion>
    </div>
  );
}

export default ProductDetailPage;
