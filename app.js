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
            {id:0, name: 'Steak Dinner', calories: 1200},
            {id:1, name: 'Cookies', calories: 400},
            {id:2, name: 'Ice Cream', calories: 500},
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
        }
    }

})();

// UI Controller (Modules)
const UICtrl = (function() {
    // Reusable UI Selector List
    const UISelectors = {
        itemList: '#item-list'
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
        }
    }
})();

// App Controller
const App = (function(ItemCtrl, UICtrl) {
    //    console.log(ItemCtrl.logData());

    // Public methods
    return {
        init: function() {
            console.log("Initializing App...");
            // Fetch Items from Data structure
            const items = ItemCtrl.getItems();
            // Populate list with items
            UICtrl.populateItemList(items);
        }
    }
})(ItemCtrl, UICtrl);

// Initialise app
App.init();