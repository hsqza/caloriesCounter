const StorageCtrl = (function(){
    return {
        storeItem: function(item) {
            let items;

            if ( localStorage.getItem('items') === null ) {
                items = [];
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            } else {
                items = JSON.parse(localStorage.getItem('items'));
                items.push(item);
                localStorage.setItem('items', JSON.stringify(items));
            }
        },

        getItemFromStorage: function() {
            let items;

            if ( localStorage.getItem('items') === null ) {
                items = []
            } else {
                items = JSON.parse(localStorage.getItem('items'));
            }

            return items;
        },

        updateItemStorage: function(updatedItem) {
            let items = JSON.parse(localStorage.getItem('items'));

            items.forEach(function(item, index){
                if ( updatedItem.id === item.id ) {
                    items.splice(index, 1, updatedItem);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },

        deleteItemFromStorage: function(id) {
            let items = JSON.parse(localStorage.getItem('items'));
            
            items.forEach(function(item, index){
                if ( id === item.id ) {
                    items.splice(index, 1);
                }
            });

            localStorage.setItem('items', JSON.stringify(items));
        },

        clearItemsStorage: function() {
            localStorage.removeItem('items');
        }
    } 

})();


const ItemCtrl = (function(){
    
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    }

    const data = {
        items: StorageCtrl.getItemFromStorage(),
        currentItem: null,
        totalCalories: 0
    }

    return {
        getItems: function() {
            return data.items;
        },
        addItem: function(name, calories) {
            let ID;

            if ( data.items.length > 0 ) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }

            calories = parseInt(calories);
            newItem = new Item(ID, name, calories);
            data.items.push(newItem);
            
            return newItem;
        },
        getItemById: function(id) {
            let found = null;

            data.items.forEach(function(item){
                if ( item.id === id ) {
                    found = item;
                }
            });

            return found;
        },
        updateItem: function(name, calories) {
            calories = parseInt(calories);

            let found = null;

            data.items.forEach(function(item){
                if(item.id === data.currentItem.id) {
                    item.name = name;
                    item.calories = calories;
                    found = item;
                }
            });
            
            return found;
        },
        deleteItem: function(id) {

            const ids = data.items.map(function(item){
                return item.id;
            });

            const index = ids.indexOf(id);
         
            data.items.splice(index, 1);
        },
        clearAllItems: function() {
            data.items = [];
        },
        setCurrentItem: function(item) {
            data.currentItem = item;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        logData: function(){
            return data;
        },
        getTotalCalories: function() {
            let total = 0;

            data.items.forEach(function(item){
                total += item.calories;
            });

            data.totalCalories = total;

            return data.totalCalories;
        }
    }

})();

const UICtrl = (function(){

    const UISelectors = {
        itemList: 'item-list',
        listItems: '#item-list li',
        addBtn: '.add-btn',
        clearBtn: '.clear-btn',
        itemNameInput: 'item-name',
        itemCaloriesInput: 'item-calories',
        totalCalories: '.total-calories',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn'
    }

    return {
        populateItemList: function(items) {
            let html = '';

            items.forEach(function(item){
                html += `
                    <li class="collection-item" id="item-${item.id}">
                        <strong>${item.name}: </strong> <em>${item.calories} calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    </li>`
            });

            document.getElementById(UISelectors.itemList).innerHTML = html;
        },
        getItemInput: function(){
            return {
                name: document.getElementById(UISelectors.itemNameInput).value,
                calories: document.getElementById(UISelectors.itemCaloriesInput).value
            }
        },
        getSelectors: function() {
            return UISelectors;
        },
        addListItem: function(item) {
           
            document.getElementById(UISelectors.itemList).style.display = 'block';
            
            const li = document.createElement('li');
            li.className = 'collection-item';
            li.id = `item-${item.id}`

            
            li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} calories</em>
                <a href="#" class="secondary-content">
                    <i class="edit-item fa fa-pencil"></i>
                </a>
            `

            document.getElementById(UISelectors.itemList).insertAdjacentElement('beforeend', li);
            
        },
        updateListItem: function(item) {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
                const itemId = listItem.getAttribute('id');

                if (itemId === `item-${item.id}`) {
                    document.querySelector(`#${itemId}`).innerHTML = `
                        <strong>${item.name}: </strong> <em>${item.calories} calories</em>
                        <a href="#" class="secondary-content">
                            <i class="edit-item fa fa-pencil"></i>
                        </a>
                    `
                }
            });
        },
        deleteListItem: function(id) {
            const itemId = `#item-${id}`;
            const item = document.querySelector(itemId);
            item.remove();
        },
        clearInput: function() {
            document.getElementById(UISelectors.itemNameInput).value = '';
            document.getElementById(UISelectors.itemCaloriesInput).value = '';
        },
        addItemToForm: function() {
            document.getElementById(UISelectors.itemNameInput).value = ItemCtrl.getCurrentItem().name;
            document.getElementById(UISelectors.itemCaloriesInput).value = ItemCtrl.getCurrentItem().calories;
            UICtrl.showEditState();
        },
        showEditState() {
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';
        },
        removeItems: function() {
            let listItems = document.querySelectorAll(UISelectors.listItems);

            listItems = Array.from(listItems);

            listItems.forEach(function(item){
                item.remove();
            });

        },
        hideList: function() {
            document.getElementById(UISelectors.itemList).style.display = 'none';
        },
        showTotalCalories: function(calories) {
            document.querySelector(UISelectors.totalCalories).textContent = calories;
        },
        clearEditState: function() {
            UICtrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';
        }        
    }
    
})();

const App = (function(ItemCtrl, StorageCtrl, UICtrl){

    const loadEventsListeners = function() {
        
        const UISelectors = UICtrl.getSelectors();

        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        document.addEventListener('keypress', function(e){
            if(e.key === 13 || e.which === 13) {
                e.preventDefault();
                return false;
            }
        })

        document.getElementById(UISelectors.itemList).addEventListener('click', itemEditClick);

        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        document.querySelector(UISelectors.backBtn).addEventListener('click', UICtrl.clearEditState);

        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
    }

    const itemAddSubmit = function(e) {
        const input = UICtrl.getItemInput();

        if(input.name !== '' && input.calories !== '') {
            const newItem = ItemCtrl.addItem(input.name, input.calories);

            UICtrl.addListItem(newItem);

            const totalCalories = ItemCtrl.getTotalCalories();
         
            UICtrl.showTotalCalories(totalCalories);

            StorageCtrl.storeItem(newItem);

            UICtrl.clearInput();
        }

        e.preventDefault();
    }


    const itemEditClick = function(e) {

        if(e.target.classList.contains('edit-item')) {
           
            const listId = e.target.parentNode.parentNode.id;
            
            const listIdArr = listId.split('-');

            const id = parseInt(listIdArr[1]);

            const itemToEdit = ItemCtrl.getItemById(id);

            ItemCtrl.setCurrentItem(itemToEdit);

            UICtrl.addItemToForm();
        }

        e.preventDefault();
    }


    const itemUpdateSubmit = function(e) {

        const input = UICtrl.getItemInput();
        
        const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

        UICtrl.updateListItem(updatedItem);

        const totalCalories = ItemCtrl.getTotalCalories();

        UICtrl.showTotalCalories(totalCalories);


        StorageCtrl.updateItemStorage(updatedItem);


        UICtrl.clearEditState();

        e.preventDefault();
    }

    const itemDeleteSubmit = function(e) {

        const currentItem = ItemCtrl.getCurrentItem();

        ItemCtrl.deleteItem(currentItem.id);

        UICtrl.deleteListItem(currentItem.id);

        const totalCalories = ItemCtrl.getTotalCalories();
        
        UICtrl.showTotalCalories(totalCalories);

        StorageCtrl.deleteItemFromStorage(currentItem.id);

        UICtrl.clearEditState();

        e.preventDefault();
    }

    const clearAllItemsClick = function(e) {

        ItemCtrl.clearAllItems();

        const totalCalories = ItemCtrl.getTotalCalories();
        
        UICtrl.showTotalCalories(totalCalories);

        UICtrl.removeItems();

        StorageCtrl.clearItemsStorage();

        UICtrl.hideList();

        e.preventDefault();
    }




    return {
        init: function() {

            UICtrl.clearEditState();

            const items = ItemCtrl.getItems();

            if ( items.length === 0 ) {
                UICtrl.hideList();
            } else {
                UICtrl.populateItemList(items);
            }

            const totalCalories = ItemCtrl.getTotalCalories();
            UICtrl.showTotalCalories(totalCalories);
        

            loadEventsListeners();
        }
    }
    
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();