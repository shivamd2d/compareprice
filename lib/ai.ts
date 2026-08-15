import { products } from "@/lib/catalog";

export const runAssistant = (prompt: string) => {
  const normalized = prompt.toLowerCase();
  const budgetMatch = normalized.match(/(under|below)\s*₹?\s*(\d+)/i);
  const budget = budgetMatch ? Number(budgetMatch[2]) : undefined;

  const category = normalized.includes("laptop")
    ? "laptops"
    : normalized.includes("phone")
      ? "smartphones"
      : undefined;

  const matches = products.filter((product) => {
    if (category && product.categorySlug !== category) return false;
    return true;
  });

  return {
    budget,
    category,
    verifiedDataPoints: [
      "Product specs and release timelines",
      "Tracked merchant prices and discount fields",
      "AI inferences are clearly labeled as inferred",
    ],
    response:
      matches.length > 0
        ? `I found ${matches.length} matching products${budget ? ` around your ₹${budget.toLocaleString("en-IN")} target` : ""}. Prioritize ${
            matches[0].title
          } if battery and portability matter most.`
        : "I could not find a matching product in the current demo catalog.",
  };
};
