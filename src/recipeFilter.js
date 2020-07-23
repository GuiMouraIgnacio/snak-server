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
        ingSynon.forEach((ingName) => {
          if (recipeIng.toLowerCase().includes(ingName)) thisIng = true;
        });
      });
      if (!thisIng) outIngs++;
      if(outIngs > 3) {
          valid = false;
          break;
      }
    }
    if(valid)
      validRecipes.push({...recipe, outIngs})
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
  return ing && ing.synonyms ? ing.synonyms : [];
};

function between(min, max) {
  if (max === 1) return 0;
  return Math.floor(
    Math.random() * (max - min) + min
  )
}

const findBestRecipe = (recipeList) => {
  const cleanRecipeList = recipeList.filter(
    (rec) => rec.ingredients.length <= 1 ? false : true
  );
  cleanRecipeList.sort((a, b) => a.outIngs - b.outIngs);
  const maxIngredients = cleanRecipeList[0].outIngs;
  const newRecipeList = cleanRecipeList.filter(
    (rec) => rec.outIngs <= maxIngredients
  );
  newRecipeList.sort(
    (a, b) =>
      Number(b.likes.replace(".", "")) - Number(a.likes.replace(".", ""))
  );
  const min = 0;
  const max = newRecipeList.length >= 10 ? 9 : newRecipeList.length;
  return newRecipeList[between(min, max)];
};

module.exports = filterRecipe;