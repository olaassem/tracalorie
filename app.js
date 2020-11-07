//Storage Controller




//Item Controller
const ItemCtrl = (function(){
  //Item constructor
  const Item = function(id, name, calories){
    this.id = id;
    this.name = name;
    this.calories = calories;
  }

  //Data Structure (State)
  const data = {
    items: [
      // {id: 0, name: 'Steak Dinner', calories:'1200'},
      // {id: 1, name: 'Cookie', calories:'400'},
      // {id: 2, name: 'Eggs', calories:'300'}
    ],
    currentItem: null,
    totalCalories: 0
  }

  //Public methods
  return {
    getItems: function(){
      return data.items;
    },
    addItem: function(name, calories){
      //Create ID
      let ID;
      if (data.items.length > 0) {
        ID = data.items[data.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Parse calories to number
      calories = parseInt(calories);

      //Create new item
      newItem = new Item(ID, name, calories);

      ///Add to items array
      data.items.push(newItem);

      return newItem;
    },

    setCurrentItem: function(item){
      data.currentItem = item;
    },

    getCurrentItem: function(){
      return data.currentItem;
    },

    getTotalCalories: function(){
      let total = 0;

      // loop through items and add cals
      data.items.forEach(item => {
        total += item.calories;
      });

      //Set total calories
      data.totalCalories = total;

      //return total
      return data.totalCalories;
    },

    getItemById: function(id){
      let found = null;

      //loop through items
      data.items.forEach(function(item){
        if (item.id === id) {
          found = item;
        }
      });

      return found;
    },

    updateItem: function(name, calories){
      // Calories to number
      calories = parseInt(calories);

      let found = null;

      data.items.forEach(function(item){
        if(item.id === data.currentItem.id){
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },

    deleteItem: function(id){
      //Get ids
      ids = data.items.map(function(item){
        return item.id;
      });

      //Get index
      const index = ids.indexOf(id);

      //remove item
      data.items.splice(index, 1);
    },

    clearAllItems:function(){
      data.items = [];
    },

    logData: function(){
      return data;
    }
  }
})();



//UI Controller
const UICtrl = (function(){
  const UISelectors = {
    itemList: '#item-list',
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    clearBtn: '.clear-btn',
    listItems: '#item-list li'
  }

  //Public methods
  return {
    populateItemList: function(items){
      let html = '';

      items.forEach(item => {
        html += `<li class="collection-item" id="item-${item.id}">
        <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
        <a href="#" class="secondary-content">
          <i class="edit-item fa fa-pencil"></i>
        </a>
      </li>`;
      });

      //Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function(){
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      }
    },

    addListItem: function(item){
      //Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';
      //Create li element
      const li = document.createElement('li');
      //Add class
      li.className = 'collection-item';
      //Add id
      li.id = `item-${item.id}`;
      //Add html
      li.innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
      <a href="#" class="secondary-content">
        <i class="edit-item fa fa-pencil"></i>
      </a>`;

      //Insert item
      document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
    },

    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      // Turn Node list into array
      listItems = Array.from(listItems);

      listItems.forEach(function(listItem){
        const itemID = listItem.getAttribute('id');

        if(itemID === `item-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
          <a href="#" class="secondary-content">
            <i class="edit-item fa fa-pencil"></i>
          </a>`;
        }
      });
    },

    deleteListItem: function(id){
      const itemID = `#item-${id}`;
      const item = document.querySelector(itemID);
      item.remove();
    },
    
    getSelectors: function(){
      return UISelectors;
    },

    addItemToForm: function(){
      document.querySelector(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },

    removeItems: function(){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //turn node list into array
      listitems = Array.from(listItems);

      listItems.forEach(function(listItem){
        listItem.remove();
      });
    },

    clearInput: function(){
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },

    hideList: function(){
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    
    showTotalCalories: function(totalCalories){
      document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
    },

    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    }
  }

})();



//App Controller (anything we want to run as soon as app loads)
const App = (function(ItemCtrl, UICtrl){
  // Load event listeners
  const LoadEventListners = function(){
    const UISelectors = UICtrl.getSelectors();

    //Add item event
    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    //Disable submit on enter
    document.addEventListener('keypress', function(e){
      
      if(e.key === "Enter"){
        e.preventDefault();
        return false;
      }

    });

    //Edit icon click event
    document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

    //Update item edit event
    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    //Back button event
    document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

    //Delete item event
    document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

    //Clear item event
    document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);

  }

  // Add item submit
  const itemAddSubmit = function(e){
    //Get form input from UICtrl
    const input = UICtrl.getItemInput();

    //Check for name and calorie input
    if (input.name !== '' && input.calories !== '') {
      //Add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      //Add item to UI list
      UICtrl.addListItem(newItem);

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Clear fields
      UICtrl.clearInput();
    }
    e.preventDefault();
  }

  //Click edit item icon
  const itemEditClick = function (e) {
    e.preventDefault();
    
    if (e.target.classList.contains('edit-item')) {
      //Get list item id
      const listId = e.target.parentNode.parentNode.id;

      //break into an array
      const listIdArray = listId.split('-');

      //get actual id from array
      const id = parseInt(listIdArray[1]);

      //get item
      const itemToEdit = ItemCtrl.getItemById(id);

      //set current item
      ItemCtrl.setCurrentItem(itemToEdit);

      //add item to form
      UICtrl.addItemToForm();
    }
  }

  //Delete button event
  const itemDeleteSubmit = function(e){
    e.preventDefault();

    //get current item
    const currentItem = ItemCtrl.getCurrentItem();

    //delete from data structure
    ItemCtrl.deleteItem(currentItem.id);

    //delete from ui
    UICtrl.deleteListItem(currentItem.id);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();
  }

  //Update item submit
  const itemUpdateSubmit = function(e){
    //Get item input 
    const input = UICtrl.getItemInput();

    // Update item
    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    // Update UI
    UICtrl.updateListItem(updatedItem);

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  }

  //clear items event
  const clearAllItemsClick = function(){
    //delete all items from data structure
    ItemCtrl.clearAllItems();

    // Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //Add total calories to UI
    UICtrl.showTotalCalories(totalCalories);

    //remove from ui
    UICtrl.removeItems();

    //hide ul
    UICtrl.hideList();
  }

  //Public methods
  return {
    init: function(){
      //Clear edit state
      UICtrl.clearEditState();

      //Fetch items from data structure
      const items = ItemCtrl.getItems();

      //Check if any items
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        //Populate list with items
        UICtrl.populateItemList(items);
      };

      // Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add total calories to UI
      UICtrl.showTotalCalories(totalCalories);

      //Load event listeners
      LoadEventListners();
    }
  }

})(ItemCtrl, UICtrl);


//Initialize App
App.init();