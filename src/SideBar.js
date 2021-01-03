import React from 'react';

// controls search and listing recipes
function SideBar({clickedAddRecipe, recipeNameIdList, selectRecipe, getRecipes}) {

  React.useEffect(() => {
    getRecipes();
  }, [recipeNameIdList]);

    const [searchTerm, setSearchterm] = React.useState('');
  
    const handleChange = event => {
      setSearchterm(event.target.value);
    }
  
    // React.useEffect(() => console.log(searchTerm), [searchTerm]);
  
    // get array of all recipes and filter them
    const filteredRecipes = recipeNameIdList.filter(recipe => recipe.recipeName.toLowerCase().includes(searchTerm.toLowerCase()));
    // const filteredRecipes = recipeNameIdList();

    return (
      <div className="sideBar">
        <NewRecipeButton clickedAddRecipe={clickedAddRecipe}/>
        <Search changeSearch={handleChange}/>
        <ListRecipes recipeList={filteredRecipes} selectRecipe={selectRecipe}/>
      </div>
    );
}
  
  // Search Bar
function Search({changeSearch}) {
    return (
      <input type="text" id="searchRecipes" onChange={changeSearch} className="searchBar"/>
    );
}
  
function ListRecipes({recipeList, selectRecipe}) {
    function clickRecipe (event) {
        return selectRecipe(event.target.getAttribute("recipeid"));
    };

    // display filtered list of recipes
    return (
        recipeList.map(function(recipe) {
        return <li className="listItem" key = {recipe.recipeID} recipeid={recipe.recipeID} onClick={clickRecipe}>{recipe.recipeName}</li>
      })
    );
}
  
function NewRecipeButton({clickedAddRecipe}) {  
    return (
      <button type="button" className="button" id="newRecipeButton" onClick={clickedAddRecipe}>New+</button>
    )
}

export default SideBar;
  