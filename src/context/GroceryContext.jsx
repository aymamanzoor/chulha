import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const GroceryContext = createContext();

export function GroceryProvider({ children }) {
  const [list, setList] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Load on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("chulha_grocery_list");
      if (stored) {
        setList(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to parse grocery list", e);
    }
    setLoaded(true);
  }, []);

  // Save on change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem("chulha_grocery_list", JSON.stringify(list));
    }
  }, [list, loaded]);

  const addIngredients = (ingredients) => {
    if (!ingredients || ingredients.length === 0) return;
    
    setList((prev) => {
      // Add only unique ingredients to avoid exact duplicates
      const newItems = ingredients.filter(ing => !prev.includes(ing));
      if (newItems.length === 0) {
        toast("These ingredients are already in your list!");
        return prev;
      }
      toast.success(`Added ${newItems.length} items to Grocery List!`);
      return [...prev, ...newItems];
    });
  };

  const removeIngredient = (ingredientToRemove) => {
    setList((prev) => prev.filter((item) => item !== ingredientToRemove));
  };

  const clearList = () => {
    setList([]);
    toast.success("Grocery list cleared.");
  };

  return (
    <GroceryContext.Provider value={{ list, addIngredients, removeIngredient, clearList }}>
      {children}
    </GroceryContext.Provider>
  );
}

export function useGrocery() {
  return useContext(GroceryContext);
}
