// Storage Controller

// Item Controller
const ItemCtrl = (function() {
    // Item Constructor
    const Item = function(id, name, calories) {
        this.id = id;
        this.name = name;
        this.calories = calories;
    }
    // Data Structure / State in React
    const data = {
        items: [
            // {id:0, name: 'Steak Dinner', calories: 1200},
            // {id:1, name: 'Cookies', calories: 400},
            // {id:2, name: 'Ice Cream', calories: 500},
        ],
        currentItem: null,
        totalCalories: 0
    }

    // Public methods
    return {
        getItems: function() {
            return data.items;
        },
        logData: function() {
            return data;
        },
        addItem: function(name, calories) {
            let ID;
            // Create ID
            if(data.items.length > 0) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            // Calories to number
            calories = parseInt(calories);
            // Create new Item
            newItem = new Item(ID, name, calories);
            // Add to item array
            data.items.push(newItem);
            return newItem;
        },
        getTotalCalories: function() {
            let total = 0;
            data.items.forEach(function(item) {
                total += item.calories;
            })
            //  Set Total cal in data structure
            data.totalCalories = total;
            // return total
            return data.totalCalories;
        }
    }

})();

// UI Controller (Modules)
const UICtrl = (function() {
    // Reusable UI Selector List
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
    }
    // Public method
    return {
        populateItemList: function(items) {
            let html = ``;
            items.forEach((item) => {
                html += `      
                <li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                    </a>
                </li>
              `;
            });
            // Insert List Items
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        addListItem: function(item) {
            // Show the list 
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // Create li element
            const li = document.createElement('li');
            // Add class
            li.className= 'collection-item';
            // Add ID
            li.id = `item-${item.id}`;

            // Add HTML
            li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `
            // Insert Item
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        getItemsInput: function() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        getSelectors: function() {
            return UISelectors;
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        hideList: function() {
            document.querySelector(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(totalCalories) {
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        }
    }
})();

// App Controller
const App = (function(ItemCtrl, UICtrl) {
    // Load event listener
    const loadEventListeners = function() {
        // Get UI selectors
        const UISelectors = UICtrl.getSelectors();

        // Add Items
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    }

    // Add Item submit
    const itemAddSubmit = function(e) {
        // Get Item from UI controller
        const input = UICtrl.getItemsInput();

        // Check for name and calorie input
        if(input.name !== '' && input.calories !== '') {
            // Add item
            const newItem = ItemCtrl.addItem(input.name, input.calories);
            // Add Itemt to UI list
            UICtrl.addListItem(newItem);
            
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);

            // clear field
            UICtrl.clearInput();
        }

        e.preventDefault();
    }

    // Public methods
    return {
        init: function() {
            console.log("Initializing App...");
            // Fetch Items from Data structure
            const items = ItemCtrl.getItems();

            // Check if any items 
            if(items.length === 0) {
                UICtrl.hideList();
            } else {
                // Populate list with items
                UICtrl.populateItemList(items);
            }
            // Get total calories
            const totalCalories = ItemCtrl.getTotalCalories();
            // Add total calories to UI
            UICtrl.showTotalCalories(totalCalories);
            // Load Event Listener
            loadEventListeners();
        }
    }
})(ItemCtrl, UICtrl);

// Initialise app
App.init();