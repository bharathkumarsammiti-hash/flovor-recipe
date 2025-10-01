import React, { useState, useCallback, useMemo } from 'react';
import { Suggestion, Insights, AlgorithmMode, Ingredient } from './types';
import { fetchSuggestions } from './services/suggestionService';
import { AVAILABLE_INGREDIENTS, ALGORITHM_MODES } from './constants';
import IngredientSelector from './components/IngredientSelector';
import RecipeCard from './components/RecipeCard';
import AlgorithmModeSelector from './components/AlgorithmModeSelector';
import LoadingSpinner from './components/LoadingSpinner';
import InsightsPanel from './components/InsightsPanel';

const App: React.FC = () => {
  const [availableIngredients, setAvailableIngredients] = useState<Ingredient[]>(AVAILABLE_INGREDIENTS);
  const [newIngredientName, setNewIngredientName] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState<number[]>([]);
  const [selectedMode, setSelectedMode] = useState<AlgorithmMode>('backtracking');
  const [suggestions, setSuggestions] = useState<Suggestion[] | null>(null);
  const [insights, setInsights] = useState<Insights | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleIngredientToggle = (id: number) => {
    setSelectedIngredients(prev =>
      prev.includes(id) ? prev.filter(ingId => ingId !== id) : [...prev, id]
    );
  };

  const handleAddNewIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = newIngredientName.trim();
    if (trimmedName) {
      const existingIngredient = availableIngredients.find(
        (ing) => ing.name.toLowerCase() === trimmedName.toLowerCase()
      );

      if (existingIngredient) {
        // If it exists and isn't selected, select it
        if (!selectedIngredients.includes(existingIngredient.id)) {
          setSelectedIngredients((prev) => [...prev, existingIngredient.id]);
        }
      } else {
        // If it's a new ingredient, add and select it
        const newIngredient = {
          id: Date.now(), // Simple unique ID for client-side state
          name: trimmedName,
        };
        setAvailableIngredients((prev) => [...prev, newIngredient]);
        setSelectedIngredients((prev) => [...prev, newIngredient.id]);
      }
      setNewIngredientName(''); // Clear input after adding/selecting
    }
  };


  const handleGetSuggestions = useCallback(async () => {
    if (selectedIngredients.length === 0) {
      setError('Please select at least one ingredient.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuggestions(null);
    setInsights(null);
    setSearchQuery(''); // Reset search on new request

    try {
      const response = await fetchSuggestions(selectedIngredients, selectedMode, availableIngredients);
      setSuggestions(response.suggestions);
      setInsights(response.insights);
    } catch (err) {
      setError('Failed to fetch recipe suggestions. Please try again later.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [selectedIngredients, selectedMode, availableIngredients]);

  const filteredSuggestions = useMemo(() => {
    if (!suggestions) {
      return null;
    }
    if (!searchQuery) {
      return suggestions;
    }
    return suggestions.filter(suggestion =>
      suggestion.recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [suggestions, searchQuery]);


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-brand-dark" style={{ fontFamily: "'Playfair Display', serif" }}>
            FlavorGraph 🌿
          </h1>
          <p className="text-gray-500 hidden md:block">Your Intelligent Recipe Navigator</p>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Column */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">1. Select Your Ingredients</h2>
              <form onSubmit={handleAddNewIngredient} className="flex items-center gap-2 mb-4">
                  <input
                    type="text"
                    value={newIngredientName}
                    onChange={(e) => setNewIngredientName(e.target.value)}
                    placeholder="Type to add ingredients..."
                    className="flex-grow w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary transition-colors"
                    aria-label="Add new ingredient"
                  />
                  <button
                    type="submit"
                    className="flex-shrink-0 bg-brand-secondary hover:bg-brand-dark text-white font-bold p-2 rounded-lg shadow transform transition-transform duration-150 ease-in-out hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={!newIngredientName.trim()}
                    aria-label="Add Ingredient"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  </button>
              </form>
              <IngredientSelector
                availableIngredients={availableIngredients}
                selectedIngredients={selectedIngredients}
                onIngredientToggle={handleIngredientToggle}
              />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-4 border-b pb-2 text-gray-700">2. Choose Algorithm</h2>
              <AlgorithmModeSelector
                modes={ALGORITHM_MODES}
                selectedMode={selectedMode}
                onModeChange={setSelectedMode}
              />
            </div>
            
            <button
              onClick={handleGetSuggestions}
              disabled={isLoading || selectedIngredients.length === 0}
              className="w-full bg-brand-primary hover:bg-brand-dark text-white font-bold py-3 px-4 rounded-lg shadow-lg transform transition-transform duration-150 ease-in-out hover:scale-105 disabled:bg-gray-300 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Finding Recipes...</span>
                </>
              ) : (
                'Suggest Recipes'
              )}
            </button>
             {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          {/* Results Column */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-md min-h-[600px] flex flex-col">
               <div className="flex-shrink-0">
                  <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b pb-2">Suggestions</h2>
                  {insights && <InsightsPanel insights={insights} />}
                  {suggestions && suggestions.length > 0 && (
                     <div className="relative my-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute text-gray-400 left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                           type="search"
                           placeholder="Filter recipes by name..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-brand-primary focus:border-brand-primary transition-colors"
                           aria-label="Filter recipes"
                        />
                     </div>
                  )}
               </div>

              <div className="flex-grow">
                {isLoading && (
                  <div className="flex flex-col items-center justify-center h-full pt-20">
                      <LoadingSpinner size="lg"/>
                      <p className="text-gray-500 mt-4 text-lg">Analyzing flavors and finding the perfect match...</p>
                  </div>
                )}
                {!isLoading && !suggestions && (
                  <div className="flex flex-col items-center justify-center h-full pt-20 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="mt-4 text-lg text-gray-500">Your recipe suggestions will appear here.</p>
                    <p className="text-sm text-gray-400">Select ingredients and an algorithm to get started.</p>
                  </div>
                )}
                
                {suggestions && suggestions.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full pt-20 text-center">
                    <p className="text-lg text-gray-500">No recipes found for the selected ingredients.</p>
                  </div>
                )}

                {filteredSuggestions && filteredSuggestions.length > 0 && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredSuggestions.map(suggestion => (
                        <RecipeCard key={suggestion.recipe.id} suggestion={suggestion} />
                      ))}
                   </div>
                )}
                
                {suggestions && suggestions.length > 0 && filteredSuggestions?.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full pt-20 text-center">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                     <p className="mt-4 text-lg text-gray-500">No recipes match your search.</p>
                     <p className="text-sm text-gray-400">Try a different search term.</p>
                 </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;