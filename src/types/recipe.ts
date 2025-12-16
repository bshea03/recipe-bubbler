export interface Recipe {
  // Required properties for basic use
  "@context"?: "https://schema.org";
  "@type"?: "Recipe";
  name: string; // The name of the recipe
  image?: string | string[]; // URL of an image or images
  description?: string; // A short description
  author?: {
    "@type": "Person" | "Organization";
    name: string;
  };
  datePublished?: string; // Date when the recipe was published (ISO 8601 format)
  prepTime?: string; // Preparation time (ISO 8601 Duration format, e.g., "PT20M")
  cookTime?: string; // Cooking time (ISO 8601 Duration format, e.g., "PT30M")
  totalTime?: string; // Total time (ISO 8601 Duration format)
  keywords?: string; // Comma-separated keywords
  recipeYield?: string; // The quantity produced by the recipe (e.g., "4 servings")
  nutrition?: {
    "@type": "NutritionInformation";
    calories?: string; // e.g., "270 calories"
    fatContent?: string;
    carbohydrateContent?: string;
    proteinContent?: string;
    cholesterolContent?: string;
    sodiumContent?: string;
    sugarContent?: string;
    fiberContent?: string;
  };
  aggregateRating?: {
    "@type": "AggregateRating";
    ratingValue: string; // e.g., "4.5"
    reviewCount: string; // e.g., "12"
  };
  recipeCategory?: string; // e.g., "Dessert"
  recipeCuisine?: string; // e.g., "French"
  suitableForDiet?: string; // e.g., "schema.org"

  // Ingredients and Instructions
  recipeIngredient: string[]; // List of ingredients (free text, e.g., "1 cup flour")
  recipeInstructions: {
    "@type": "HowToStep" | "HowToSection";
    text: string;
    url?: string;
    image?: string;
    name?: string;
  }[]; // Structured instructions

  // Optional: Videos
  video?: {
    "@type": "VideoObject";
    name: string;
    description: string;
    contentUrl: string; // A link to the video file
    embedUrl?: string; // A link to the embeddable video player
    thumbnailUrl?: string;
    uploadDate?: string; // ISO 8601 format
    duration?: string; // ISO 8601 Duration format
  };
}