import React, { useState } from 'react';
import { Recipe, Product } from '../types';
import { Clock, ChefHat, Check, ShoppingBag, ArrowRight, BookOpen, Utensils, Search } from 'lucide-react';
import { motion } from 'motion/react';

interface RecipeSectionProps {
  recipes: Recipe[];
  products: Product[];
  onAddToCart: (product: Product) => void;
  onNavigateToShop: (categoryId: string, productId?: string) => void;
  searchQuery: string;
}

export default function RecipeSection({
  recipes,
  products,
  onAddToCart,
  onNavigateToShop,
  searchQuery
}: RecipeSectionProps) {
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  // Aggregate all tags from recipes
  const allTags = ['All', ...Array.from(new Set(recipes.flatMap((r) => r.tags)))];

  // Filter recipes based on Tag and Search Query
  const filteredRecipes = recipes.filter((recipe) => {
    const matchesTag = selectedTag === 'All' || recipe.tags.includes(selectedTag);
    const matchesSearch =
      searchQuery === '' ||
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (recipe.subtitle && recipe.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
      recipe.ingredients.some((ing) => ing.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesTag && matchesSearch;
  });

  // Toggle checklist step
  const toggleStep = (index: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleOpenRecipeDetail = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setCompletedSteps({});
  };

  return (
    <section className="space-y-8" id="recipe-blog-section">
      
      {/* Blog Intro banner */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 bg-brand-green-50 text-brand-green-700 font-display text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          Wellness Recipe Kitchen
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
          Cook Healthy With Fresh Organics
        </h2>
        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">
          Unlock nutritious traditional tastes at home! Discover quick steps to turn raw grains, flakes, ravas, and millet noodles into delightful family delicacies.
        </p>
      </div>

      {/* Tags Filter line */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {allTags.map((tag) => (
          <button
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={`font-display text-xs font-semibold px-4 py-2 rounded-full border cursor-pointer transition-all whitespace-nowrap ${
              selectedTag === tag
                ? 'bg-brand-green-700 text-white border-brand-green-700 font-bold shadow-xs'
                : 'bg-white text-gray-500 border-gray-150 hover:bg-gray-50 hover:text-brand-green-700'
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-200 max-w-lg mx-auto">
          <Utensils className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h3 className="font-serif text-base font-bold text-gray-700">No matching culinary recipes found</h3>
          <p className="text-gray-400 text-xs mt-1">Try refining your search keyword or selecting a different filter.</p>
        </div>
      ) : (
        /* Recipes Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredRecipes.map((recipe) => {
            // Find linked product if any
            const linkedProduct = products.find((p) => p.id === recipe.relatedProductId);

            return (
              <div
                key={recipe.id}
                className="bg-white border border-gray-150/40 rounded-3xl overflow-hidden shadow-2xs hover:shadow-lg transition-all duration-300 group flex flex-col md:flex-row"
              >
                {/* Image panel */}
                <div className="md:w-2/5 relative pt-[56%] md:pt-0 bg-gray-100 overflow-hidden shrink-0">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r md:from-black/10"></div>
                  
                  {/* Difficulty level */}
                  <span className={`absolute top-4 left-4 font-display text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider text-white shadow-xs ${
                    recipe.difficulty === 'Easy' ? 'bg-emerald-600' : recipe.difficulty === 'Medium' ? 'bg-amber-600' : 'bg-red-600'
                  }`}>
                    {recipe.difficulty}
                  </span>
                </div>

                {/* Content block */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 font-mono text-[11px] text-gray-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-brand-green-600" />
                        {recipe.prepTime}
                      </span>
                      <span>•</span>
                      <span>{recipe.servings}</span>
                    </div>

                    <div>
                      <h3 className="font-serif text-lg font-bold text-gray-900 leading-tight group-hover:text-brand-green-700 transition-colors">
                        {recipe.title}
                      </h3>
                      {recipe.subtitle && (
                        <p className="font-sans text-xs font-semibold text-brand-green-600">
                          {recipe.subtitle}
                        </p>
                      )}
                    </div>

                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                      {recipe.description}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
                    {/* Linked product link */}
                    {linkedProduct ? (
                      <button
                        onClick={() => onNavigateToShop('All', linkedProduct.id)}
                        className="inline-flex items-center gap-1 font-display text-[11px] font-bold text-brand-green-700 hover:text-brand-amber-600 transition-colors cursor-pointer text-left"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Buy Ingredient Grains</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <div />
                    )}

                    <button
                      onClick={() => handleOpenRecipeDetail(recipe)}
                      className="bg-brand-green-50 hover:bg-brand-green-150/70 text-brand-green-800 font-display text-xs font-bold px-4 py-2 rounded-full transition-all cursor-pointer text-center"
                    >
                      View Recipe Steps
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setSelectedRecipe(null)}
          />

          {/* Dialog Frame */}
          <div className="relative bg-white rounded-3xl overflow-hidden max-w-2xl w-full max-h-[90vh] shadow-2xl flex flex-col z-10 animate-scaleUp">
            
            {/* Header Image cover */}
            <div className="relative h-48 bg-gray-100 shrink-0">
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
              
              <button
                onClick={() => setSelectedRecipe(null)}
                className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60 text-white rounded-full transition-all cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>

              <div className="absolute bottom-4 left-6 text-white text-left">
                <span className="font-display text-[10px] uppercase tracking-widest font-extrabold bg-brand-amber-600 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                  {selectedRecipe.difficulty} Recipe
                </span>
                <h3 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                  {selectedRecipe.title}
                </h3>
                {selectedRecipe.subtitle && (
                  <p className="font-sans text-xs text-brand-green-100 font-medium">{selectedRecipe.subtitle}</p>
                )}
              </div>
            </div>

            {/* Scrollable Recipe details */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Stat specs */}
              <div className="grid grid-cols-3 gap-2 border-b border-gray-100 pb-4 text-center">
                <div className="bg-gray-50 rounded-xl p-2.5">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Prep Time</span>
                  <span className="font-display text-sm font-extrabold text-brand-green-800">{selectedRecipe.prepTime}</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Servings</span>
                  <span className="font-display text-sm font-extrabold text-brand-green-800">{selectedRecipe.servings}</span>
                </div>
                <div className="bg-gray-50 rounded-xl p-2.5">
                  <span className="text-[10px] text-gray-400 block uppercase font-bold">Method</span>
                  <span className="font-display text-sm font-extrabold text-brand-green-800 flex items-center justify-center gap-1">
                    <ChefHat className="w-3.5 h-3.5 text-brand-green-600" />
                    Traditional
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-500 text-xs sm:text-sm leading-relaxed italic text-left">
                " {selectedRecipe.description} "
              </p>

              {/* Ingredients Lists Grid */}
              <div className="space-y-3 text-left">
                <h4 className="font-serif text-base font-bold text-gray-900 border-l-4 border-brand-green-600 pl-2.5">
                  Ingredients Needed
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedRecipe.ingredients.map((ing, idx) => {
                    const matchedProd = products.find((p) => p.id === ing.productId);

                    return (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2.5 bg-gray-50 border border-gray-100/60 rounded-xl hover:border-brand-green-200 transition-all"
                      >
                        <div className="flex flex-col">
                          <span className="text-xs font-semibold text-gray-800">{ing.name}</span>
                          {matchedProd && (
                            <span className="text-[9px] text-brand-green-600 font-bold uppercase tracking-wider">
                              🌾 Certified Organic
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-gray-500">{ing.amount}</span>
                          {matchedProd && (
                            <button
                              onClick={() => {
                                onAddToCart(matchedProd);
                                // Optional animation support or visual confirmation
                              }}
                              className="p-1.5 bg-brand-green-600 hover:bg-brand-green-700 text-white rounded-lg shadow-2xs cursor-pointer transition-transform active:scale-90"
                              title="Add grain pack to order basket"
                            >
                              <ShoppingBag className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step by Step list */}
              <div className="space-y-4 text-left">
                <h4 className="font-serif text-base font-bold text-gray-900 border-l-4 border-brand-green-600 pl-2.5">
                  Step-by-Step Directions
                </h4>
                <div className="space-y-3">
                  {selectedRecipe.steps.map((step, idx) => {
                    const isDone = completedSteps[idx];

                    return (
                      <div
                        key={idx}
                        onClick={() => toggleStep(idx)}
                        className={`flex gap-3.5 p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                          isDone
                            ? 'bg-brand-green-50/30 border-brand-green-200 opacity-60'
                            : 'bg-white border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        {/* Circle Indicator */}
                        <div className={`w-5.5 h-5.5 rounded-full flex items-center justify-center shrink-0 border mt-0.5 transition-colors ${
                          isDone ? 'bg-brand-green-600 border-brand-green-600 text-white' : 'border-gray-300 text-gray-400 font-mono text-xs font-bold'
                        }`}>
                          {isDone ? <Check className="w-3 h-3 stroke-[3]" /> : idx + 1}
                        </div>

                        {/* Instruction text */}
                        <p className={`text-xs sm:text-sm leading-relaxed ${isDone ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                          {step}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Footer linked product banner */}
            {selectedRecipe.relatedProductId && (
              (() => {
                const lp = products.find((p) => p.id === selectedRecipe.relatedProductId);
                if (!lp) return null;
                return (
                  <div className="p-4 bg-brand-green-50 border-t border-brand-green-100 shrink-0 flex items-center justify-between gap-3 flex-col sm:flex-row">
                    <div className="flex items-center gap-3 text-left">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-white shrink-0">
                        <img src={lp.image} alt={lp.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <span className="text-[10px] text-brand-green-700 font-bold uppercase tracking-wide">Cooking with</span>
                        <h5 className="font-serif text-xs font-bold text-gray-800 leading-tight">{lp.name}</h5>
                      </div>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                      <button
                        onClick={() => {
                          setSelectedRecipe(null);
                          onNavigateToShop('All', lp.id);
                        }}
                        className="flex-1 sm:flex-initial text-[11px] font-bold text-gray-650 px-4 py-2 rounded-full border border-gray-250 bg-white hover:bg-gray-50 tracking-wide transition-all cursor-pointer"
                      >
                        Item Details
                      </button>
                      <button
                        onClick={() => onAddToCart(lp)}
                        className="flex-1 sm:flex-initial bg-brand-green-600 hover:bg-brand-green-700 text-white text-[11px] font-bold px-4 py-2 rounded-full tracking-wide transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Add Ingredient Grains</span>
                      </button>
                    </div>
                  </div>
                );
              })()
            )}

          </div>
        </div>
      )}

    </section>
  );
}
