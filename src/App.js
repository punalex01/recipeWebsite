import React from 'react';
import update from 'immutability-helper';
import './App.css';
import SideBar from './SideBar';
import AddRecipePage from './AddRecipePage';
import DisplayRecipePage from './DisplayRecipePage';
import Axios from 'axios';

function App() {

  const getAsyncRecipes = () => 
    new Promise(resolve => 
      setTimeout(
        () => resolve(    
      Axios({
      method: "GET",
      url: "https://recipe-nodejs.herokuapp.com/getRecipes",
    }).then(res => {
      changeRecipeList(res.data);
    })), 100));

  // sets which page to show
  const [pageType, setMainPage] = React.useState("Home");

  const [recipesList, changeRecipeList] = React.useState([]);

  async function setNewRecipePromise() {
    return new Promise((resolve, reject) => {
      setRecipe({
        name: "",
        preptime: "",
        cooktime: "",
        serves: "",
        ingredients: {"Ingredient 1": ""},
        instructions: ["Instruction 1"],
        id: -1
      });
      resolve(recipeState);
    })
  }

  function copyRecipePromise(recipe) {
    return new Promise((resolve, reject) => {
      copyOriginalRecipe(recipe);
      resolve("yes");
      reject("no");
    });
  }

  // when add recipe button is clicked
  async function clickedAddRecipe() {
    copyRecipePromise({name: "",
                      preptime: "",
                      cooktime: "",
                      serves: "",
                      ingredients: {"Ingredient 1": ""},
                      instructions: ["Instruction 1"],
                      id: -1}).then(setNewRecipePromise());

    setMainPage("EditRecipePage");
  }

  const [recipeState, setRecipe] = React.useReducer(recipeReducer, {name: "",
                                                                    preptime: "",
                                                                    cooktime: "",
                                                                    serves: "",
                                                                    ingredients: {"Ingredient 1": ""},
                                                                    instructions: ["Instruction 1"],
                                                                    id: -1});

  function recipeReducer(recipeState, recipe) {
    // return (update(recipe, {$set: recipe}));
    let newRecipe = {};
    newRecipe.name = recipe.name;
    newRecipe.preptime = recipe.preptime;
    newRecipe.cooktime = recipe.cooktime;
    newRecipe.serves = recipe.serves;
    newRecipe.ingredients = recipe.ingredients;
    newRecipe.instructions = [...recipe.instructions]
    newRecipe.id = recipe.id;
    return newRecipe;
  }

  const [originalRecipe, copyOriginalRecipe] = React.useReducer(copyOriginalRecipeReducer, {name: "",                                                                                            preptime: "",
                                                                                            cooktime: "",
                                                                                            serves: "",
                                                                                            ingredients: {"Ingredient 1": ""},
                                                                                            instructions: ["Instruction 1"],
                                                                                            id: -1});

  function copyOriginalRecipeReducer(originalRecipe, recipe) {
    return (update(recipe, {$set: recipe}));
  }

  // submit recipe to MySql db
  const submitRecipe = (newRecipe) => {
    if (newRecipe.id === -1) {
      document.getElementById("submitButton").setAttribute("disabled", true);
      Axios({
        method: "POST",
        url: "https://recipe-nodejs.herokuapp.com/addRecipe",
        header: {
          "content-type": "multipart/form-data"
        },
        data: newRecipe
      }).then(res => {
        selectRecipe(parseInt(res.data));
      });
      // .catch(alert("Sorry, something went wrong! :("));
    }
    else if (newRecipe.get("img") || (newRecipe.get("recipe") !== JSON.stringify(originalRecipe))) {
      document.getElementById("submitButton").setAttribute("disabled", true);
      Axios({
        method: "POST",
        url: "https://recipe-nodejs.herokuapp.com/addRecipe",
        header: {
          "content-type": "multipart/form-data"
        },
        data: newRecipe
      }).then(res => {
        selectRecipe(parseInt(res.data));
      });
      // .catch(alert("Sorry, something went wrong! :("));
    }
    else {
      selectRecipe(JSON.parse(newRecipe.get("recipe")).id);
    }
  } 

  const deleteRecipe = (recipeId) => {
    if (recipeId > 0) {
      Axios({
        method: "POST",
        url: "https://recipe-nodejs.herokuapp.com/deleteRecipe",
        header: {
          "content-type": "application/x-www-form-urlencoded"
        },
        data: {"recipeId": recipeId}
      }).then(res => {
        setMainPage("Home");
      });
    }
  }

  // selects recipe by filtering
  function selectRecipe(recipeId) {
    Axios({
      method: "GET",
      url: "https://recipe-nodejs.herokuapp.com/selectRecipe?recipeId="+recipeId.toString(),
    }).then(res => {
      setRecipe(res.data);
      setMainPage("DisplayRecipe");
    });
  }
  return (
    <>
      <Header/>
      <div className="container">
        <SideBar clickedAddRecipe={clickedAddRecipe} recipeNameIdList={recipesList} selectRecipe={selectRecipe} getRecipes={getAsyncRecipes}/>
        <MainPage pageType={pageType} submitRecipe={submitRecipe} recipe={recipeState} setMainPage={setMainPage} copyOriginalRecipe={copyOriginalRecipe} deleteRecipe={deleteRecipe}/>
      </div>
    </>
  );
}

// placeholder header for now
function Header() {
  return (
      <div className="header">
        <span>Pungry</span>
      </div>
  )
}

function MainPage({pageType, submitRecipe, recipe, setMainPage, copyOriginalRecipe, deleteRecipe}) {
  // selects which page to render
  
  let component;
  switch (pageType) {
    case "Home":
      component = <HomePage/>
      break;
    case "EditRecipePage": // for both edit and add recipe
      component = <AddRecipePage deleteRecipe={deleteRecipe} submitRecipe={submitRecipe} recipe={recipe}/>
      break;
    case "DisplayRecipe":
      component = <DisplayRecipePage recipe={recipe} setMainPage={setMainPage} copyOriginalRecipe={copyOriginalRecipe}/>
      break;
    default:
      break;
  }
  return (
    <div className="mainPage">
      {component}
    </div>
  )
}

function HomePage() {
  return (
    <span>Home Page</span>
  )
}

export default App;
