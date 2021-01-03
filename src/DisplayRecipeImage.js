import React from 'react';


function DisplayRecipeImage({recipeID}) {
    return (
        <div className="recipeImageContainer">
            <img className="recipeImage" src={`https://recipephotostorage.s3-us-west-1.amazonaws.com/recipeImages/${recipeID}`}/>
        </div>
    )
}

export default DisplayRecipeImage;
