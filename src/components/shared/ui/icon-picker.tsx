import { useState } from "react";
import { Button } from "@/components/shared/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/shared/ui/popover";
import { Input } from "@/components/shared/ui/input";
import type { LucideIcon } from "lucide-react";
import {
  X,
  // Beverages
  Coffee,
  Wine,
  Beer,
  Martini,
  GlassWater,
  CupSoda,
  Milk,
  FlaskConical,
  // Baked & Sweets
  Croissant,
  Cake,
  Cookie,
  IceCream,
  Candy,
  Donut,
  Dessert,
  Lollipop,
  IceCreamCone,
  // Meals & Mains
  Pizza,
  Sandwich,
  Soup,
  Beef,
  Fish,
  Egg,
  Hamburger,
  Shrimp,
  Salad,
  Drumstick,
  Ham,
  // Fruits & Veg
  Apple,
  Banana,
  Cherry,
  Grape,
  Citrus,
  Carrot,
  Leaf,
  Sprout,
  Nut,
  Wheat,
  // Snacks
  Popcorn,
  // Oils, Honey & Liquids
  Droplet,
  Droplets,
  Pipette,
  TestTube,
  Beaker,
  FlaskRound,
  Funnel,
  // Dairy & Pantry
  Shell,
  Layers,
  Archive,
  Box,
  Container,
  // Frozen & Cold
  Snowflake,
  // Dry Goods & Grains
  Blend,
  Slice,
  // Kitchen
  Utensils,
  UtensilsCrossed,
  ChefHat,
  Flame,
  Scale,
  Weight,
  Timer,
  Thermometer,
  // Fallback
  Package,
} from "lucide-react";

const foodIcons = [
  // Beverages
  { name: "Coffee", icon: Coffee, group: "Beverages" },
  { name: "Wine", icon: Wine, group: "Beverages" },
  { name: "Beer", icon: Beer, group: "Beverages" },
  { name: "Martini", icon: Martini, group: "Beverages" },
  { name: "GlassWater", icon: GlassWater, group: "Beverages" },
  { name: "CupSoda", icon: CupSoda, group: "Beverages" },
  { name: "Milk", icon: Milk, group: "Beverages" },
  { name: "FlaskConical", icon: FlaskConical, group: "Beverages" },

  // Meals & Mains
  { name: "Pizza", icon: Pizza, group: "Meals" },
  { name: "Sandwich", icon: Sandwich, group: "Meals" },
  { name: "Hamburger", icon: Hamburger, group: "Meals" },
  { name: "Soup", icon: Soup, group: "Meals" },
  { name: "Salad", icon: Salad, group: "Meals" },
  { name: "Beef", icon: Beef, group: "Meals" },
  { name: "Fish", icon: Fish, group: "Meals" },
  { name: "Shrimp", icon: Shrimp, group: "Meals" },
  { name: "Egg", icon: Egg, group: "Meals" },
  { name: "Drumstick", icon: Drumstick, group: "Meals" },
  { name: "Ham", icon: Ham, group: "Meals" },

  // Sweets & Desserts
  { name: "Croissant", icon: Croissant, group: "Sweets" },
  { name: "Cake", icon: Cake, group: "Sweets" },
  { name: "Cookie", icon: Cookie, group: "Sweets" },
  { name: "IceCream", icon: IceCream, group: "Sweets" },
  { name: "IceCreamCone", icon: IceCreamCone, group: "Sweets" },
  { name: "Dessert", icon: Dessert, group: "Sweets" },
  { name: "Candy", icon: Candy, group: "Sweets" },
  { name: "Lollipop", icon: Lollipop, group: "Sweets" },
  { name: "Donut", icon: Donut, group: "Sweets" },

  // Fruits & Produce
  { name: "Apple", icon: Apple, group: "Produce" },
  { name: "Banana", icon: Banana, group: "Produce" },
  { name: "Cherry", icon: Cherry, group: "Produce" },
  { name: "Grape", icon: Grape, group: "Produce" },
  { name: "Citrus", icon: Citrus, group: "Produce" },
  { name: "Carrot", icon: Carrot, group: "Produce" },
  { name: "Leaf", icon: Leaf, group: "Produce" },
  { name: "Sprout", icon: Sprout, group: "Produce" },
  { name: "Nut", icon: Nut, group: "Produce" },
  { name: "Wheat", icon: Wheat, group: "Produce" },

  // Oils, Honey & Liquids
  { name: "Droplet", icon: Droplet, group: "Oils & Liquids" },
  { name: "Droplets", icon: Droplets, group: "Oils & Liquids" },
  { name: "Pipette", icon: Pipette, group: "Oils & Liquids" },
  { name: "TestTube", icon: TestTube, group: "Oils & Liquids" },
  { name: "Beaker", icon: Beaker, group: "Oils & Liquids" },
  { name: "FlaskRound", icon: FlaskRound, group: "Oils & Liquids" },
  { name: "Funnel", icon: Funnel, group: "Oils & Liquids" },

  // Dairy & Pantry
  { name: "Shell", icon: Shell, group: "Dairy & Pantry" },
  { name: "Layers", icon: Layers, group: "Dairy & Pantry" },
  { name: "Archive", icon: Archive, group: "Dairy & Pantry" },
  { name: "Box", icon: Box, group: "Dairy & Pantry" },
  { name: "Container", icon: Container, group: "Dairy & Pantry" },

  // Frozen & Cold
  { name: "Snowflake", icon: Snowflake, group: "Frozen" },

  // Snacks & Dry Goods
  { name: "Popcorn", icon: Popcorn, group: "Snacks & Dry" },
  { name: "Blend", icon: Blend, group: "Snacks & Dry" },
  { name: "Slice", icon: Slice, group: "Snacks & Dry" },

  // Kitchen & Tools
  { name: "Utensils", icon: Utensils, group: "Kitchen" },
  { name: "UtensilsCrossed", icon: UtensilsCrossed, group: "Kitchen" },
  { name: "ChefHat", icon: ChefHat, group: "Kitchen" },
  { name: "Flame", icon: Flame, group: "Kitchen" },
  { name: "Scale", icon: Scale, group: "Kitchen" },
  { name: "Weight", icon: Weight, group: "Kitchen" },
  { name: "Timer", icon: Timer, group: "Kitchen" },
  { name: "Thermometer", icon: Thermometer, group: "Kitchen" },
];

// Module level, outside the component
const iconMap: Record<string, LucideIcon> = Object.fromEntries(
  foodIcons.map((i) => [i.name, i.icon]),
);

export function getCategoryIcon(name: string): LucideIcon {
  return iconMap[name] ?? Package;
}


interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredIcons = foodIcons.filter((icon) =>
    icon.name.toLowerCase().includes(search.toLowerCase()),
  );

  const SelectedIcon = foodIcons.find((i) => i.name === value)?.icon || Package;

  // Group icons for display when not searching
  const groups = search
    ? null
    : Array.from(new Set(foodIcons.map((i) => i.group)));

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-12 h-12 p-0 border-brown-300 hover:bg-yellow-50 relative group"
        >
          <SelectedIcon
            className={`h-5 w-5 text-brown-700 ${value ? "group-hover:opacity-0 transition-opacity" : ""}`}
          />
          {value && (
            <span
              role="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange("");
              }}
              className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4 text-red-500" />
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-3" align="start">
        <div className="space-y-3">
          <Input
            placeholder="Search icons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9"
          />

          <div className="max-h-72 overflow-y-auto space-y-3 pr-1">
            {search ? (
              <div className="grid grid-cols-6 gap-1.5">
                {filteredIcons.map(({ name, icon: Icon }) => (
                  <Button
                    key={name}
                    variant="ghost"
                    title={name}
                    className={`h-10 w-10 p-0 hover:bg-yellow-50 ${value === name ? "bg-yellow-100 border-2 border-yellow-500" : ""}`}
                    onClick={() => {
                      onChange(name);
                      setOpen(false);
                    }}
                  >
                    <Icon className="h-5 w-5 text-brown-700" />
                  </Button>
                ))}
              </div>
            ) : (
              groups!.map((group) => (
                <div key={group}>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">
                    {group}
                  </p>
                  <div className="grid grid-cols-6 gap-1.5">
                    {foodIcons
                      .filter((i) => i.group === group)
                      .map(({ name, icon: Icon }) => (
                        <Button
                          key={name}
                          variant="ghost"
                          title={name}
                          className={`h-10 w-10 p-0 hover:bg-yellow-50 ${value === name ? "bg-yellow-100 border-2 border-yellow-500" : ""}`}
                          onClick={() => {
                            onChange(name);
                            setOpen(false);
                          }}
                        >
                          <Icon className="h-5 w-5 text-brown-700" />
                        </Button>
                      ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
