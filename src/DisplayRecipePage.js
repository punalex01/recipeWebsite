import React from 'react';
import DisplayRecipeImage from './DisplayRecipeImage';

function DisplayRecipePage({recipe, setMainPage, copyOriginalRecipe}) {

    const copyRecipe = () => {
        copyOriginalRecipe(recipe);
    }

    return (
        <div className="displayRecipePage">
            <div className="titleImageContainer">
                <DisplayRecipeImage recipeID={recipe.id}/>
                <h1 className="title">{recipe.name}</h1>
            </div>
            <div className="displaySmallContainer">
                <span>Prep Time: {recipe.preptime}</span>
                <span>Cook Time: {recipe.cooktime}</span>
                <span>Serves: {recipe.serves}</span>
            </div>
            <DisplayIngredients ingredients={Object.entries(recipe.ingredients)}/>
            <DisplayInstructions instructions={recipe.instructions}/>
            <EditRecipeButton setMainPage={setMainPage} copyRecipe={copyRecipe}/>
        </div>
    )
}

function DisplayIngredients ({ingredients}) {
    return (
        <div className="displayIngredients">
            <header>Ingredients</header>
            <ul>
                {/* ingredient[0] is name of ingredient - ingredient[1] is amount of ingredient */}
                {ingredients.map(ingredient => <li key={ingredient[0]}>{ingredient[1]} {ingredient[0]}</li>)}
            </ul>
        </div>
    )
}

function DisplayInstructions ({instructions}) {
    return (
        <div className="displayInstructions">
            <header>Instructions</header>
            <ol>
                {instructions.map(instruction => <li key={instructions.indexOf(instruction)}>{instruction}</li>)}
            </ol>
        </div>
    )
}

function EditRecipeButton ({setMainPage, copyRecipe}) {
    const clickEdit = () => {
        setMainPage("EditRecipePage")
        copyRecipe();
    };
    return (
        <button type="button" className="button" id="editRecipeButton" onClick={clickEdit}>Edit Recipe</button>
    )
}


export default DisplayRecipePage;
