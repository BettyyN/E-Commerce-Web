import { useState } from "react";
import Header from "../../components/shared/Header";
import RecentItems from "../../components/Customer/RecentItems";
import Footer from "../../components/Customer/Footer";
import HeroSlider from "@/components/Customer/HeroSlider ";

function LandingPage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCategorySelect = (category: string) => {
    // Empty string means "All Products" — clear all category filters
    if (category === "") {
      setSelectedCategories([]);
      return;
    }
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  const handleSearch = (query: string) => setSearchQuery(query);

  const hasActiveFilters =
    selectedCategories.length > 0 || searchQuery.trim() !== "";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header
        onSearch={handleSearch}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategories={selectedCategories}
        onCategorySelect={handleCategorySelect}
        hasActiveFilters={hasActiveFilters}
      />

      <div className="flex-1">
        {/* Full-bleed hero — only for plain browsing, hidden for search & filter results */}
        {!hasActiveFilters && <HeroSlider />}

        <div id="products-section" className="container mx-auto px-4">
          <div className={!hasActiveFilters ? "" : ""}>
            <RecentItems
              overHero={!hasActiveFilters}
              selectedCategories={selectedCategories}
              searchQuery={searchQuery}
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LandingPage;
