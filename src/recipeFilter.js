const recipes = require("./recipes.json");
const originIngredients = require("./ingredients.json");

const filterRecipe = (ingredients) => {
  const allSynonims = [];
  ingredients.forEach((ing) => allSynonims.push(findIngredientSynonims(ing)));
  const validRecipes = [];
  recipes.forEach((recipe) => {
    let valid = true;
    let outIngs = 0;
    for (let recipeIng of recipe.ingredients) {
      let thisIng = false;
      allSynonims.forEach((ingSynon) => {
        ingSynon.synonyms.forEach((ingName) => {
          if (recipeIng.toLowerCase().includes(ingName)) thisIng = true;
        });
        if (thisIng) {
          ingSynon.antisynonyms.forEach((ingName) => {
            if (recipeIng.toLowerCase().includes(ingName)) thisIng = false;
          });
        }
      });
      if (!thisIng) outIngs++;
      if (outIngs > 3) {
        valid = false;
        break;
      }
    }
    if (valid) validRecipes.push({ ...recipe, outIngs });
  });
  return findBestRecipe(validRecipes);
};

const findIngredientSynonims = (name) => {
  let ing;
  originIngredients.forEach((category) => {
    category.options.forEach((item) => {
      if (name === item.name) {
        ing = item;
      }
    });
  });
  const responde = {
    synonyms: ing && ing.synonyms ? ing.synonyms : [],
    antisynonyms: ing && ing.antisynonyms ? ing.antisynonyms : [],
  };
  return responde;
};

const findBestRecipe = (recipeList) => {
  const cleanRecipeList = recipeList.filter((rec) =>
    rec.ingredients.length <= 1 ? false : true
  );
  cleanRecipeList.sort((a, b) => a.outIngs - b.outIngs);
  const maxIngredients = cleanRecipeList[0].outIngs;
  const newRecipeList = cleanRecipeList.filter(
    (rec) => rec.outIngs <= maxIngredients
  );
  newRecipeList.sort((a, b) => (a.image ? -1 : 1));
  newRecipeList.sort((a, b) => {
    return a.image && b.image
      ? a.likes === "Conteúdo selecionado."
        ? -1
        : Number(b.likes.replace(".", "")) - Number(a.likes.replace(".", ""))
      : a.image
      ? -1
      : b.image
      ? 1
      : 0;
  });
  const min = 0;
  const max = newRecipeList.length >= 6 ? 6 : newRecipeList.length;
  return newRecipeList.slice(min, max);
};

module.exports = filterRecipe;
