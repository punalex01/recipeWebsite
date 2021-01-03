import React from 'react';

function AddRecipePage({deleteRecipe, submitRecipe, recipe}) {
    // pass in empty object if add new recipe with ID = -1
    // pass in existing object if editing existing recipe

    const [recipeImg, changeImg] = React.useState();

    // get recipe from form
    const getNewRecipe = () => {
        let recipeFormData = new FormData();
        let newRecipe = {};
        newRecipe.name = document.getElementById("nameInput").value;
        newRecipe.preptime = document.getElementById("prepTime").value;
        newRecipe.cooktime = document.getElementById("cookTime").value;
        newRecipe.serves = document.getElementById("serves").value;

        // get ingredients
        let newIngredients = {}
        Array.from(document.getElementsByClassName("ingredientPairInput")).forEach((element) => {
            newIngredients[element.getElementsByClassName("ingredientInput")[0].value] = element.getElementsByClassName("ingredientAmountInput")[0].value;
        })
        newRecipe.ingredients = newIngredients;

        newRecipe.instructions = [];
        Array.from(document.getElementsByClassName("instructionItem")).forEach((element) => {
            newRecipe.instructions.push(element.getElementsByClassName("instructionInput")[0].value);
        })

        newRecipe.id = recipe.id;
        // recipeFormData.append("id", recipe.id);
        recipeFormData.append("recipe", JSON.stringify(newRecipe));
        recipeFormData.append("img", recipeImg);

        for (let i of recipeFormData.entries()) {
            console.log(i);
        }
        submitRecipe(recipeFormData);
    }

    const submitForm = (event) => {
        event.preventDefault();
        getNewRecipe();
    }

    let deleteButton;
    // need this function to prevent firing function on render
    const deleteExistingRecipe = () => {
        deleteRecipe(recipe.id);
    }
    if (recipe.id !== -1) {
        deleteButton = <button type="button" className="button" id="deleteButton" onClick={deleteExistingRecipe}>Delete Recipe</button>
    }

    return (
      <div className="addRecipePage">
        <span className="title">New Recipe</span>
        {deleteButton}

        <form className="addRecipeForm" id = "editRecipeForm" onSubmit={submitForm}>
            
            <AddName name={recipe.name}/>
            <AddPicture changeImg={changeImg}/>
            <AddTimeServings preptime={recipe.preptime} cooktime={recipe.cooktime} serves={recipe.serves}/>
    
            <AddIngredients ingredientList={Object.entries(recipe.ingredients)}/>
    
            <AddInstructions instructionList={recipe.instructions}/>

            <br></br>
            <button type="submit" className="submitButton button" id="submitButton">Submit Recipe</button>
        </form>
      </div>
    )
}

function AddName ({name}) {
    React.useEffect(() => {
        changeName(name);
    }, [name])

    // control state of name input
    const [nameState, changeName] = React.useState(name);

    const handleChange = event => {
        changeName(event.target.value);
    }

    return (
        <div>
            <label>Name</label>
            <input type="text" className="newRecipeInput" id="nameInput" value={nameState} onChange={handleChange} required/>
        </div>

    )
}

function AddPicture({changeImg}) {
    const setImg = e => {
        let imageFile = new File([e.target.files[0]], "img");
        changeImg(imageFile);
    }

    return (
        <div>
            <label for="img">Picture:</label>
            <input type="file" id="img" name="recipeImg" accept="image/*" onChange={setImg}/>
        </div>

    )
}

function AddTimeServings ({preptime, cooktime, serves}) {
    React.useEffect(() => {
        changePreptime(preptime);
        changeCooktime(cooktime);
        changeServings(serves);
    }, [preptime, cooktime, serves]);

    // control state of inputs
    const [preptimeInputState, changePreptime] = React.useState(preptime);

    const inputPreptime = (event) => {
        changePreptime(event.target.value);
    }

    const [cooktimeInputState, changeCooktime] = React.useState(cooktime);

    const inputCooktime = (event) => {
        changeCooktime(event.target.value);
    }

    const [servingsInputState, changeServings] = React.useState(serves);

    const inputServings = (event) => {
        changeServings(event.target.value);
    }

    return (
        <div className="smallInputs">
            <label>Prep Time:</label>
            <input type = "text" className = "newRecipeInput" value={preptimeInputState} onChange={inputPreptime} id ="prepTime" required/>
  
            <label>Cook Time:</label>
            <input type = "text" className = "newRecipeInput" value={cooktimeInputState} onChange={inputCooktime} id ="cookTime" required/>
  
            <label>Serves:</label>
            <input type = "text" className = "newRecipeInput" value={servingsInputState} onChange={inputServings} id ="serves" required/>
        </div>
    )
}
  
function AddIngredients ({ingredientList}) {
    React.useEffect(() => {
        changeIngredientList(ingredientList);
    }, []);

    // control number of ingredient inputs
    const [ingredientListState, changeIngredientList] = React.useState(ingredientList);

    const addNewIngredient = () => {
        changeIngredientList([...ingredientListState, ["Ingredient " + (ingredientListState.length+1).toString(), ""]]);
    }

    const removeIngredientPair = (event) => {
        if (ingredientListState.length > 1)
        {
            let tempList = [...ingredientListState];
            tempList.splice(event.target.getAttribute('keyvalue'), 1);
            changeIngredientList(tempList);
        }
        else
            return;
    }

    const ingredientNameInput = (ingredientName, ingredientNum) => {
        let tempList = [...ingredientListState];
        tempList[ingredientNum][0] = ingredientName;
    }

    const ingredientAmountInput = (ingredientAmount, ingredientNum) => {
        let tempList = [...ingredientListState];
        tempList[ingredientNum][1] = ingredientAmount;
    }

    return (
        <div className="ingredientsContainer">
            <span>Ingredient</span>
            <span>Amount</span>
            <IngredientInputList ingredientList={ingredientListState} removeIngredientPair={removeIngredientPair} 
                                 ingredientNameInput={ingredientNameInput} ingredientAmountInput={ingredientAmountInput}/>
            <br></br>
            <button type="button" onClick={addNewIngredient}>New Ingredient</button>
        </div>
    )
}

function IngredientInputList ({ingredientList, removeIngredientPair, ingredientNameInput, ingredientAmountInput}) {
    return (
        ingredientList.map((item) => {
            const keyValue = ingredientList.indexOf(item);
            return <IngredientPairInput key={keyValue} keyValue={keyValue} ingredientName={item[0]} 
                                        ingredientAmount={item[1]} removeIngredientPair={removeIngredientPair} 
                                        ingredientNameInput={ingredientNameInput} ingredientAmountInput={ingredientAmountInput}/>
        })
    )
}

function IngredientPairInput ({keyValue, ingredientName, ingredientAmount, removeIngredientPair, ingredientNameInput, ingredientAmountInput}) {
    React.useEffect(() => {
        changeIngredientName(ingredientName);
        changeIngredientAmount(ingredientAmount);
    }, [ingredientName, ingredientAmount]);

    const [ingredientNameInputState, changeIngredientName] = React.useState(ingredientName || "");

    const inputIngredientName = (event) => {
        changeIngredientName(event.target.this);
        ingredientNameInput(event.target.value, keyValue);
    }

    const [ingredientAmountInputState, changeIngredientAmount] = React.useState(ingredientAmount || "");

    const inputIngredientAmount = (event) => {
        changeIngredientAmount(event.target.this);
        ingredientAmountInput(event.target.value, keyValue);
    }

    return (
        <div className="ingredientPairInput">
            <input type = "text" className = "newRecipeInput ingredientInput" value={ingredientNameInputState} onChange={inputIngredientName} required/>
            <input type = "text" className = "newRecipeInput ingredientAmountInput" value={ingredientAmountInputState} onChange={inputIngredientAmount}required/>
            <button type="button" className="removeButton" keyvalue={keyValue} onClick={removeIngredientPair}>X Remove Ingredient</button>
        </div>
        )
}

function AddInstructions ({instructionList}) {
    // set to array of arrays to track each item by reference
    React.useEffect(() => {
        let tempList = [];
        instructionList.forEach((item) => {
            tempList.push([item]);
        });
        changeInstructionList(tempList);
    }, [instructionList]);

    const [instructionListState, changeInstructionList] = React.useState(instructionList);

    const addNewInstruction = () => {
        changeInstructionList([...instructionListState, ["Instruction " + (instructionListState.length+1).toString()]]);
        console.log(instructionListState);
    }

    const editInstructionInput = (instruction, instructionNum) => {
        let tempList = [...instructionListState];
        tempList[instructionNum][0] = instruction;
        console.log(tempList);
        changeInstructionList(tempList);
    }

    const removeInstruction = (event) => {
        if (instructionListState.length > 1)
        {
            let tempList = [...instructionListState];
            tempList.splice(event.target.getAttribute('keyvalue'), 1);
            changeInstructionList(tempList);
        }
        else
            return;
    }

    return (
        <div className="instructionsContainer">
            <span id="instructionHeader">Instructions:</span>
            <InstructionInputList instructionList={instructionListState} removeInstruction={removeInstruction} 
                                  editInstructionInput={editInstructionInput}/>
            <button type="button" onClick={addNewInstruction}>New Instruction</button>
        </div>
    )
}

function InstructionInputList ({instructionList, inputInstruction, removeInstruction, editInstructionInput}) {
    return (
        instructionList.map(instruction => <InstructionItem key={instructionList.indexOf(instruction)} 
                                                    instructNum={instructionList.indexOf(instruction)}
                                                    instruction={instruction} instructionList={instructionList} 
                                                    changeInput={inputInstruction} removeInstruction={removeInstruction}
                                                    editInstructionInput={editInstructionInput}/>)
        )
}

function InstructionItem ({instructNum, instruction, removeInstruction, editInstructionInput}) {
    React.useEffect(() => {
        changeInstructionValue(instruction);
    }, [instruction]);

    const [instructionValueState, changeInstructionValue] = React.useState(instruction);

    const inputInstruction = (event) => {
        changeInstructionValue(event.target.value);
        editInstructionInput(event.target.value, instructNum);
    }

    return (
    <div className="instructionItem">
        <span>{instructNum+1}.</span>
        <br></br>
        <textarea className="instructionInput" value={instructionValueState} onChange={inputInstruction} required></textarea>
        <br></br>
        <button type="button" className="removeButton" keyvalue={instructNum} onClick={removeInstruction}>X Remove Instruction</button>
    </div>
    )
}

export default AddRecipePage;
