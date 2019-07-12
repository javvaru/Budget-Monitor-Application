var controllerModule = (function (budgetModule, UIModule) {
    "use strict";
    var DOMStrings = UIModule.getDomStrings();
    
    var init = function () {
        document.querySelector(DOMStrings.incomeLabel).style.display = "none";
        document.querySelector(DOMStrings.expenseLabel).style.display = "none";
        setUpEventListeners();
        UIModule.displayMonth();
        UIModule.displayBudget({
            budget: 0,
            inc: 0,
            exp: 0,
            percentage: -1
        });
    };
    
    var setUpEventListeners = function() {
        document.querySelector(DOMStrings.addBtn).addEventListener("click", addItemToBudget);
    
        document.addEventListener("keypress", (event) => {
            if (event.keyCode === 13 || event.which === 13)
                addItemToBudget();
        });
        
        document.querySelector(DOMStrings.container).addEventListener("click", deleteItem);
        
        document.querySelector(DOMStrings.inputType).addEventListener("change", UIModule.changeFieldColorByType);
    }
    
    var updateBudget = function (type, amount) {
        let budget;
        //calculate budget
        budgetModule.calculateBudget(type, amount);

        //return budget
        budget = budgetModule.getBudget();

        //update budget in UI
        UIModule.displayBudget(budget);
    }
    
    var addItemToBudget = function () {
        let input, newItem, budget;
        
        //Get the input data
        input = UIModule.getInputData();
        
        if (input.description != "" && !isNaN(input.amount) && input.amount > 0) {
            //Add the item to budgetModule
            newItem = budgetModule.addItem(input.type, input.amount, input.description);

            //Add the item to UI
            UIModule.addNewItem(newItem, input.type)

            //Clear the fields
            UIModule.clearFields();

            //Calculate the budget
            updateBudget(input.type, input.amount);

            //Calculate and update percentages
            updatePercentages();
        }
        
    }
    
    var deleteItem = (event) => {
        if (event.target.classList[0] === "ion-ios-close-outline"){
            let itemNode, id, type, split, deletedItem;
            itemNode = event.target.parentNode.parentNode.parentNode.parentNode;
            split = itemNode.id.split("-");
            type = split[0].substr(0, 3);
            id = split[1];
            
            //delete item from data structure
            deletedItem = budgetModule.deleteItemFromDS(type, id);
            
            //delete the item from UI
            UIModule.deleteItemFromUI(itemNode);
            
            //update budget
            updateBudget(type, -deletedItem.amount);
            
            //calculate and update percentages
            updatePercentages();
        }
    }
    
    var  updatePercentages = () => {
        let perList;
        //calculate percentages
        budgetModule.calculatePercentages();
        
        //Return percentages
        perList = budgetModule.getPercentages();
        
        //Update them in the UI
        UIModule.displayPercentages(perList);
        
    }
    
    return {
        init: init
    }
})(budgetModule, UIModule);

controllerModule.init();
