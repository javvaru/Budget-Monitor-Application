var UIModule = (function () {
    "use strict";
    var DOMStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputAmount: ".add__value",
        addBtn: ".add__btn",
        expenseList: ".expenses__list",
        incomeList: ".income__list",
        totalBudget: ".budget__value",
        incValue: ".budget__income--value",
        expValue: ".budget__expenses--value",
        percentage: ".budget__expenses--percentage",
        container: ".container",
        itemPercentage: ".item__percentage",
        monthLabel: ".budget__title--month",
        incomeLabel: ".income__title",
        expenseLabel: ".expenses__title"
    };
    
    var formatNumber = function (number, type) {
        let sign, numberSplit, decimal;

        numberSplit = Math.abs(number).toFixed(2).split(".");
        number = numberSplit[0];
        decimal = numberSplit[1];
        for(let i = 3; i < number.length; i += 3) {
            number = number.substr(0, number.length - i) + "," + number.substr(number.length - i, number.length);
            i += 1;
        }
        
        return ((type === "inc") ? "+" : "-") + " " + number + "." + decimal;
    }
    
    var addNewItem = function(obj, type) {
        var htmlContent, actualHtml, elementContainer;
        document.querySelector(DOMStrings.incomeLabel).style.display = "block";
        document.querySelector(DOMStrings.expenseLabel).style.display = "block";
        
        if (type === "inc"){
            elementContainer = document.querySelector(DOMStrings.incomeList);
            htmlContent = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }else{
            elementContainer = document.querySelector(DOMStrings.expenseList);
            htmlContent = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">%p%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
        }

        actualHtml = htmlContent.replace("%id%", obj.id);
        actualHtml = actualHtml.replace("%description%", obj.description);
        actualHtml = actualHtml.replace("%value%", formatNumber(obj.amount, type));

        elementContainer.insertAdjacentHTML("beforeend", actualHtml);
    }
    
    var clearDomFields = function () {
        let fields, arrOfFields;
            
        fields = document.querySelectorAll(DOMStrings.inputDescription +", " + DOMStrings.inputAmount);

        arrOfFields = Array.prototype.slice.call(fields);

        arrOfFields.forEach((field) => field.value = "");

        fields[0].focus();
    }
    
    var nodeEleForEach = function (list, callback) {
        for (let i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    }
    
    var displayBudget = function (budget) {
        document.querySelector(DOMStrings.totalBudget).innerHTML = formatNumber(budget.budget, (budget.budget >= 0) ? "inc" : "exp") ;
        document.querySelector(DOMStrings.incValue).innerHTML = formatNumber(budget.inc, "inc");
        document.querySelector(DOMStrings.expValue).innerHTML = formatNumber(budget.exp, "exp");
        if (budget.percentage > 0)
            document.querySelector(DOMStrings.percentage).innerHTML = budget.percentage + "%";
        else
            document.querySelector(DOMStrings.percentage).innerHTML = "--";
    }
    
    var displayPercentages = function (percentageList) {
        let percentageNodeEle = document.querySelectorAll(DOMStrings.itemPercentage);
        
        nodeEleForEach(percentageNodeEle, function(node, index) {
            if (percentageList[index] > 0)
                node.innerHTML = percentageList[index] + "%";
            else
                node.innerHTML = "--";
        });
    }
    
    var displayMonth = function () {
        let date, month, calenderMonths, year;
        
        calenderMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        date = new Date();
        month = date.getMonth();
        year = date.getFullYear();
        
        document.querySelector(DOMStrings.monthLabel).innerHTML = calenderMonths[month] + " " + year;
    }
    
    var changeFieldColorByType = function() {
        let fields = document.querySelectorAll(DOMStrings.inputType + "," +
                                           DOMStrings.inputDescription + "," +
                                           DOMStrings.inputAmount);
        nodeEleForEach(fields, function(field){
            field.classList.toggle("red-focus");
        });
        document.querySelector(DOMStrings.addBtn).classList.toggle("red");
    }
    
    return {
        getInputData: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                amount: parseFloat(document.querySelector(DOMStrings.inputAmount).value)
            }
        },
        getDomStrings: function () {
            return DOMStrings;
        },
        addNewItem: addNewItem,
        clearFields: clearDomFields,
        displayBudget: displayBudget,
        deleteItemFromUI: function (node) {
            document.getElementById(node.id).parentNode.removeChild(node);
        },
        displayPercentages: displayPercentages,
        displayMonth: displayMonth,
        changeFieldColorByType: changeFieldColorByType
    }
})();
