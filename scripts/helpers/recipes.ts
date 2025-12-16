import type { Recipe } from '../../src/types/recipe';

export const fetchRecipes = async () => {
  const recipes: Recipe[] = [];

  // Fetch JSON-LD recipes
  const jsonLdRecipes = fetchJsonLdRecipes();
  recipes.push(...jsonLdRecipes);

  // Fetch Microdata recipes
  const microdataRecipes = fetchMicrodataRecipes();
  recipes.push(...microdataRecipes);

  // Fetch RDFa recipes
  const rdfaRecipes = fetchRdfaRecipes();
  recipes.push(...rdfaRecipes);

 // Store in window for access by content script
  (window as any).__cachedRecipes = recipes;

  return recipes.length > 0 ? recipes : undefined;
}

function fetchJsonLdRecipes(): Recipe[] {
  const recipes: Recipe[] = [];
  const scripts = document.querySelectorAll('script[type="application/ld+json"]');

  for (const script of scripts) {
    try {
      const data = JSON.parse(script.innerHTML);
      const items = Array.isArray(data) ? data : [data];

      for (const item of items) {
        if (item["@type"] === "Recipe" || (Array.isArray(item["@type"]) && item["@type"].includes("Recipe"))) {
          recipes.push(convertJsonLdToRecipe(item));
        }
      }
    } catch (e) {
      console.error("Invalid JSON-LD script:", script);
    }
  }

  return recipes;
}

export function convertJsonLdToRecipe(jsonLd: any): Recipe {
  return {
    "@context": jsonLd["@context"] || "https://schema.org",
    "@type": jsonLd["@type"] || "Recipe",
    name: jsonLd.name || "Untitled Recipe",
    image: jsonLd.image,
    description: jsonLd.description,
    author: jsonLd.author,
    datePublished: jsonLd.datePublished,
    prepTime: jsonLd.prepTime,
    cookTime: jsonLd.cookTime,
    totalTime: jsonLd.totalTime,
    keywords: jsonLd.keywords,
    recipeYield: jsonLd.recipeYield,
    nutrition: jsonLd.nutrition,
    aggregateRating: jsonLd.aggregateRating,
    recipeCategory: jsonLd.recipeCategory,
    recipeCuisine: jsonLd.recipeCuisine,
    suitableForDiet: jsonLd.suitableForDiet,
    recipeIngredient: jsonLd.recipeIngredient || [],
    recipeInstructions: normalizeInstructions(jsonLd.recipeInstructions),
    video: jsonLd.video,
  };
}

function fetchMicrodataRecipes(): Recipe[] {
  const recipes: Recipe[] = [];
  const recipeElements = document.querySelectorAll('[itemtype="https://schema.org/Recipe"]');

  for (const element of recipeElements) {
    try {
      const recipe = extractMicrodataRecipe(element as HTMLElement);
      if (recipe.name) {
        recipes.push(recipe);
      }
    } catch (e) {
      console.error("Error parsing microdata recipe:", e);
    }
  }

  return recipes;
}

function extractMicrodataRecipe(element: HTMLElement): Recipe {
  const getText = (selector: string) => {
    const el = element.querySelector(`[itemprop="${selector}"]`);
    return el?.textContent?.trim() || undefined;
  };

  const getContent = (selector: string) => {
    const el = element.querySelector(`[itemprop="${selector}"]`);
    return (el as HTMLMetaElement)?.content || el?.textContent?.trim() || undefined;
  };

  const getArray = (selector: string) => {
    const elements = element.querySelectorAll(`[itemprop="${selector}"]`);
    return Array.from(elements).map(el => el.textContent?.trim()).filter(Boolean) as string[];
  };

  const instructions = normalizeInstructions(getArray("recipeInstructions"));

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: getText("name") || "Untitled Recipe",
    image: getContent("image"),
    description: getText("description"),
    prepTime: getContent("prepTime"),
    cookTime: getContent("cookTime"),
    totalTime: getContent("totalTime"),
    keywords: getText("keywords"),
    recipeYield: getText("recipeYield"),
    recipeCategory: getText("recipeCategory"),
    recipeCuisine: getText("recipeCuisine"),
    recipeIngredient: getArray("recipeIngredient"),
    recipeInstructions: instructions,
  };
}

function fetchRdfaRecipes(): Recipe[] {
  const recipes: Recipe[] = [];
  const recipeElements = document.querySelectorAll('[typeof="Recipe"]');

  for (const element of recipeElements) {
    try {
      const recipe = extractRdfaRecipe(element as HTMLElement);
      if (recipe.name) {
        recipes.push(recipe);
      }
    } catch (e) {
      console.error("Error parsing RDFa recipe:", e);
    }
  }

  return recipes;
}

function extractRdfaRecipe(element: HTMLElement): Recipe {
  const getText = (property: string) => {
    const el = element.querySelector(`[property="${property}"]`);
    return (el as HTMLMetaElement)?.content || el?.textContent?.trim() || undefined;
  };

  const getArray = (property: string) => {
    const elements = element.querySelectorAll(`[property="${property}"]`);
    return Array.from(elements).map(el => (el as HTMLMetaElement).content || el.textContent?.trim()).filter(Boolean) as string[];
  };

  const instructions = normalizeInstructions(getArray("schema:recipeInstructions"));

  return {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: getText("schema:name") || "Untitled Recipe",
    image: getText("schema:image"),
    description: getText("schema:description"),
    prepTime: getText("schema:prepTime"),
    cookTime: getText("schema:cookTime"),
    totalTime: getText("schema:totalTime"),
    keywords: getText("schema:keywords"),
    recipeYield: getText("schema:recipeYield"),
    recipeCategory: getText("schema:recipeCategory"),
    recipeCuisine: getText("schema:recipeCuisine"),
    recipeIngredient: getArray("schema:recipeIngredient"),
    recipeInstructions: instructions,
  };
}

function normalizeInstructions(instructions: any): Recipe['recipeInstructions'] {
  if (!instructions) return [];
  
  // Handle string instructions
  if (typeof instructions === 'string') {
    return [{ "@type": "HowToStep", text: instructions }];
  }
  
  // Handle array of strings
  if (Array.isArray(instructions) && typeof instructions[0] === 'string') {
    return instructions.map(text => ({ "@type": "HowToStep" as const, text }));
  }
  
  // Handle array of objects
  if (Array.isArray(instructions)) {
    return instructions.map(instruction => ({
      "@type": instruction["@type"] || "HowToStep",
      text: instruction.text || instruction.name || "",
      url: instruction.url,
      image: instruction.image,
      name: instruction.name,
    }));
  }
  
  // Handle single object
  return [{
    "@type": instructions["@type"] || "HowToStep",
    text: instructions.text || instructions.name || "",
    url: instructions.url,
    image: instructions.image,
    name: instructions.name,
  }];
}

// export const fetchRecipes = async () => {

//   // get all JSON-LD scripts
//   const scripts = document.querySelectorAll('script[type="application/ld+json"]');
  
//   const recipeJSONLDs = [];
//   const recipes: Recipe[] = [];
  
//   // loop through all JSON-LD scripts and
//   for (const script of scripts) {
//     try {
//       const data = JSON.parse(script.innerHTML);
//       const items = Array.isArray(data) ? data : [data];
  
//       for (const item of items) {
//         if (item["@type"] === "Recipe" || (Array.isArray(item["@type"]) && item["@type"].includes("Recipe"))) {
//           recipeJSONLDs.push(item as Recipe);
//         }
//       }
//     } catch (e) {
//       console.error("Invalid JSON-LD script:", script);
//     }
//   }
  
//   console.log(recipeJSONLDs);
  
//   if (recipeJSONLDs.length) {
    
//     for (const recipe of recipeJSONLDs) {
//       const recipeData = await convertJsonLdToRecipe(recipe);
//       recipes.push(recipeData);
//     }
  
//     return recipes;
//   }
// }
