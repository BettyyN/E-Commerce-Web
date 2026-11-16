import { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  Check,
  LayoutGrid,
} from "lucide-react";
import { Button } from "./ui/button";
import { useCatFilterNames } from "@/service/nameList/nameList.queries";
import { Skeleton } from "./ui/skeleton";
import { getCategoryIcon } from "./ui/icon-picker";

interface CategoryMenuProps {
  onCategorySelect: (category: string) => void;
  selectedCategories: string[];
}


const CategoryMenu = ({
  onCategorySelect,
  selectedCategories,
}: CategoryMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  // Storefront filter list from NameList/CatFilter — only what customers can filter by
  const { data: activeCategories = [], isLoading } = useCatFilterNames();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleCategoryClick = (categoryName: string) => {
    onCategorySelect(categoryName);
  };

  const handleClearAll = () => {
    // Empty string signals "clear all" to the parent
    onCategorySelect("");
  };

  const isAllSelected = selectedCategories.length === 0;

  return (
    <div className="relative" ref={menuRef}>
      {/* Browse Categories Button */}
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 border-brown-300 text-brown-700 hover:bg-brown-50 hover:text-brown-900 hover:border-brown-400 rounded-lg px-4 sm:px-5 py-5 sm:py-6"
      >
        {isOpen ? (
          <X className="h-5 w-5 shrink-0" />
        ) : (
          <Menu className="h-5 w-5 shrink-0" />
        )}
        <span className="font-medium whitespace-nowrap hidden md:inline">
          Browse Categories
        </span>
        <span className="font-medium whitespace-nowrap md:hidden">Categories</span>
        {selectedCategories.length > 0 && (
          <div className="h-5 min-w-5 px-1 rounded-full bg-yellow-500 text-brown-900 text-xs flex items-center justify-center font-semibold">
            {selectedCategories.length}
          </div>
        )}
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-12 left-0 w-76 sm:w-96 max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-brown-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 bg-linear-to-r from-yellow-50 to-brown-50 border-b border-brown-100">
            <div className="h-9 w-9 rounded-lg bg-yellow-100 flex items-center justify-center text-brown-700 shrink-0">
              <LayoutGrid className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-brown-900 leading-tight">
                Shop by Category
              </h3>
              <p className="text-xs text-brown-600">
                {selectedCategories.length > 0
                  ? `${selectedCategories.length} selected`
                  : "Select one or more categories"}
              </p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-auto h-8 w-8 rounded-full flex items-center justify-center text-brown-500 hover:text-brown-900 hover:bg-brown-100 transition-colors shrink-0"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* "All" option to clear filters */}
          <button
            onClick={() => onCategorySelect("")}
            className={`w-full flex items-center gap-3 px-4 py-3 transition-colors border-b border-brown-100 hover:bg-brown-50 ${
              isAllSelected ? "bg-yellow-50" : ""
            }`}
          >
            <div
              className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                isAllSelected
                  ? "bg-yellow-500 text-brown-900"
                  : "bg-brown-100 text-brown-700"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </div>
            <span className="font-semibold text-brown-900 text-left flex-1 text-sm">
              All Products
            </span>
            {isAllSelected && (
              <Check className="h-4 w-4 text-yellow-600 shrink-0" />
            )}
          </button>

          {/* Categories Grid — 2 columns */}
          <div className="max-h-80 overflow-y-auto p-2">
            {isLoading ? (
              <div className="grid grid-cols-2 gap-1">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 rounded-lg" />
                ))}
              </div>
            ) : activeCategories.length === 0 ? (
              <p className="text-center text-xs text-brown-400 py-6">
                No categories available
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-1">
                {activeCategories.map((category) => {
                  const isSelected = selectedCategories.includes(category.name);
                  const Icon = getCategoryIcon(category.icon);
                  return (
                    <button
                      key={category.name}
                      onClick={() => handleCategoryClick(category.name)}
                      className={`flex items-center gap-2 p-2.5 rounded-lg transition-colors text-left ${
                        isSelected
                          ? "bg-yellow-100 border border-yellow-300"
                          : "border border-transparent hover:bg-brown-50"
                      }`}
                    >
                      <div
                        className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "bg-yellow-500 text-brown-900"
                            : "bg-yellow-100 text-brown-700"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span
                        className="font-medium text-brown-900 text-xs leading-tight flex-1 line-clamp-2"
                        title={category.name}
                      >
                        {category.name}
                      </span>
                      {isSelected && (
                        <Check className="h-3.5 w-3.5 text-yellow-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 p-3 bg-brown-50 border-t border-brown-100">
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              disabled={isAllSelected}
              className="flex-1 border-brown-300 text-brown-700 hover:bg-brown-100 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear All
            </Button>
            <Button
              size="sm"
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-brown-900 rounded-full"
            >
              Done
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryMenu;
