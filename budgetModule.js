var budgetModule = (function () {
    "use strict";
    
    var Expense = function(id, amount, description) {
        this.id = id;
        this.amount = amount;
        this.description = description;
        this.percentage = -1;
    }
    
    Expense.prototype.calcPercentage = function (totIncome) {
        if (totIncome > 0)
            this.percentage = Math.round(this.amount * 100 / totIncome);
        else
            this.percentage = -1;
    }
    
    Expense.prototype.getPercentage = function () {
        return this.percentage;
    }
    
    var Income = function(id, amount, description) {
        this.id = id;
        this.amount = amount;
        this.description = description
    }
    
    var data = {
        items: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1
    }
    
    var addItem = function(type, amount, desc) {
        let newItem, itemListType, id;
        itemListType = data.items[type]
        id = itemListType.length ? itemListType[itemListType.length - 1].id + 1 : 0;
        
        if (type === "inc") {
            newItem = new Income(id, amount, desc);
        } else {
            newItem = new Expense(id, amount, desc);
        }
        
        itemListType.push(newItem);
        return newItem;
    }
    
    var calculateBudget = (type, amount) => {
        //update respective totals
        data.totals[type] += amount;

        //update the total budget
        data.budget = data.totals.inc - data.totals.exp;

        //calculate percentage
        data.percentage = -1;
        if (data.totals.inc > 0)
            data.percentage = Math.round(data.totals.exp * 100 / data.totals.inc);
    }
    
    var deleteItem = (type, id) => {
        let deletedItem;
        data.items[type] = data.items[type].filter((item) => {
            if (item.id !== parseInt(id)) {
                return item;
            } else {
                deletedItem = item;
            }
        });
        return deletedItem;
    }
    
    return {
        addItem: addItem,
        calculateBudget: calculateBudget,
        getBudget: function () {
            return {
                budget: data.budget,
                inc: data.totals.inc,
                exp: data.totals.exp,
                percentage: data.percentage
            }
        },
        deleteItemFromDS: deleteItem,
        calculatePercentages: function () {
            data.items.exp.forEach((cur) => {
                cur.calcPercentage(data.totals.inc);
            });
        },
        getPercentages: function () {
            let percentageList = [];
            data.items.exp.forEach((obj) => {
                percentageList.push(obj.getPercentage());
            });
            return percentageList;
        }
    }
})();