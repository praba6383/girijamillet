/**
 * Types for the Girija Millets organic store application
 */

export interface Product {
  id: string;
  name: string;
  tamilName?: string;
  price: number;
  weight: string;
  category: string;
  description: string;
  image: string;
  colorTheme: string; // Tailwind bg color class for accents
  ingredients: string[];
  benefits: string[];
  howToUse: string[];
  isNew?: boolean;
  isPopular?: boolean;
  fssai?: string;
}

export interface RecipeIngredient {
  name: string;
  amount: string;
  productId?: string; // Optional link to specific product
}

export interface Recipe {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: string;
  ingredients: RecipeIngredient[];
  steps: string[];
  tags: string[];
  relatedProductId?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
}
