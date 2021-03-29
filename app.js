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
        getItemById: function(id) {
            let found = null;
            // loop through the items
            data.items.forEach(item => {
                if(item.id === id) {
                    found = item;
                }
            });
            return found;
        },
        updateItem: function(name, calories) {
            // Calories to number
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item) {
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            return found; 
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
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
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
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
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);
            
            // turn node list into array
            listItems = Array.from(listItems);
            listItems.forEach(listItem => {
                const itemID = listItem.getAttribute('id');
                if(itemID === `item-${item.id}`) {
                    document.querySelector(`#${itemID}`).innerHTML = `
                        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    `;
                }
            })
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
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
        },
        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        },
        showEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
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

        // Add Items Events
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Disable submit on enter
        document.addEventListener('keypress', function(e) {
            if(e.keyCode === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        })

        // Edit icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update Item event
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    }

    // Add Item submit
    const itemAddSubmit = function(e) {
        e.preventDefault();
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
        } else {
            // Show a toast to tell the user to enter something using Materialise
            M.toast({html: 'Please enter all the fields'});
        }
    }

    // Click Edit Item 
    const itemEditClick = function(e) {
        e.preventDefault();

        if(e.target.classList.contains('edit-item')) {
            // Show edit button
            UICtrl.showEditState();
            // Get the list item id
            const listId = e.target.parentNode.parentNode.id;
            // Break into an array
            const listIdArr = listId.split('-');
            
            // get the actual Id
            const id = parseInt(listIdArr[1]);

            // Get Item
            const itemToEdit = ItemCtrl.getItemById(id);
            // Set Current Item
            ItemCtrl.setCurrentItem(itemToEdit);
            // Add items to form
            UICtrl.addItemToForm();
        }
    }

    // Item Update Submit
    const itemUpdateSubmit = function(e) {
        e.preventDefault();
        // Get Item input
        const input = UICtrl.getItemsInput();

        // Updated item
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);
        
        // Update UI
        UICtrl.updateListItem(updatedItem);

        // Update Calories
        const totalCalories = ItemCtrl.getTotalCalories();
        // Add total calories to UI
        UICtrl.showTotalCalories(totalCalories);
        // clear edit state
        UICtrl.clearEditState();
    }

    // Public methods
    return {
        init: function() {
            console.log("Initializing App...");
            // Clear edit state / Set init state
            UICtrl.clearEditState();
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