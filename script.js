// Зміні для доступу до елементів
const itemForm = document.getElementById('item-form');
const itemInput = document.getElementById('item-input');
const itemList = document.getElementById('item-list');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

// Функція додавання елементів з локального сховища в список
function displayItems() {
    const itemsFromStorage = getItemsFromStorage();
    itemsFromStorage.forEach(item => addItemToDOM(item));

    checkUI();
}

// Функція додавання товару
function onAddItemSubmit(e){
    e.preventDefault();

    const newItem = itemInput.value;
    // Перевірк введення
    if (newItem === ''){
        alert('Будь ласка введіть назву товару');
        return;
        // Перевірка на число через isNaN() (is Not a Number)
    } else if(!isNaN(newItem)){
        alert('Це число.Будь ласка введіть назву товару');
        itemInput.value = '';
        return;
    } 
    // Перевірка на edit mode
    if(isEditMode) {
        const itemToEdit = itemList.querySelector('.edit-mode');

        removeItemFromStorage(itemToEdit.textContent);
        itemToEdit.classList.remove('edit-mode');
        itemToEdit.remove();
        isEditMode = false;
    } else{
        if(checkIfItemExists(newItem)) {
            alert('Цей предмет вже існує!');
            return;
        }
    }

    // Створити елелемент в DOM
    addItemToDOM(newItem);

    // Додавання елемента до локального сховища
    addItemToStorage(newItem);

    checkUI();
    // Очищення поля введення
    itemInput.value = '';

} 

// Функція створення елемента в DOM
function addItemToDOM(item) {
    // Створення елемента списку
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item));
    // Створення кнопки(крестика)
    const button = createButton('remove-item btn-link text-red');
    li.appendChild(button);
    // Додавання елемента списку до самого списку
    // Додавання li до DOM
    itemList.appendChild(li);
}
// Функція додавання елемента до локального сховище
function addItemToStorage(item) {
    const itemsFromStorage = getItemsFromStorage();

    // Додавання нового елементу до масиву
    itemsFromStorage.push(item);

    // Конвертування до JSON стрінг а відправлення до локального сховища
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}
// Функція отримання елементів з локального сховища
function getItemsFromStorage() {
    let itemsFromStorage;

    // Перевірка
    if(localStorage.getItem('items') === null) {
        itemsFromStorage = [];
    } else {
        itemsFromStorage = JSON.parse(localStorage.getItem('items'));
    }

    return itemsFromStorage;
}
// Функція по створенню та додавання класу до кнопки(а також додавання іконки в кнопку)
function createButton(classes) {
    // Створення кнопки та призначення класу
    const button = document.createElement('button');
    button.className = classes;
    // Створення іконки, призначення класу та додавання її до кнопки
    const icon = createIcon('fa-solid fa-xmark');
    button.appendChild(icon);
    return button;
}
// Функція по створенню елемента і та додавання класу до нього
function createIcon(classes) {
    // Створення іконки та призначення класу
    const icon = document.createElement('i');
    icon.className = classes;
    return icon;
}

// Функція націлення
function onClickItem(e) {
     // Перевірка, щоб націлитись на кнопку, чи має цей елемент клас remove-item
     if (e.target.parentElement.classList.contains('remove-item')) {
         // Видалення всього елементу, за допомогою націлення через батьківські елементи
        removeItem( e.target.parentElement.parentElement);
     } else {
        setItemToEdit(e.target);
     }
}

// Функція перевірки на схожість елементів при додавані
function checkIfItemExists(item) {
    const itemsFromStorage = getItemsFromStorage();
    return itemsFromStorage.includes(item);
}
// Функція редагування
function setItemToEdit(item) {
    isEditMode = true;

    itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));

    item.classList.add('edit-mode');
    formBtn.innerHTML = '<i class="fa-solid fa-pen"></i> Update Item';
    formBtn.style.backgroundColor = 'cornflowerblue';
    itemInput.value = item.textContent;
}
// Функція видалення елементів по кнопочці хрестика
function removeItem(item){
    // Перепитування, чи впевненний користувач про видалення
    if (confirm("Ви впевненні?")) {
        // Видалення елемента з DOM
        item.remove();

        // Видалення елемент з локального сховища
        removeItemFromStorage(item.textContent);

        checkUI();
    }
}
// Видалення елемента з локального сховища
function removeItemFromStorage(item){
    let itemsFromStorage = getItemsFromStorage();

    // Відфільтрувати елемент, який потрібно видалити
    itemsFromStorage = itemsFromStorage.filter((i) => i !== item);

    // Очищення локального сховища
    localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

// Функція очищення всього по кнопці
function clearItems(){
    // Перевірка чи має елемент списку перший елемент(тобто любий елемент)
    while(itemList.firstChild) {
        itemList.removeChild(itemList.firstChild);
    } 

    // Очищення з локального сховища
    localStorage.removeItem('items');

    checkUI();
}
// Функція фільтрування
function filterItems(e) {
    const items = itemList.querySelectorAll('li');
    const text = e.target.value.toLowerCase();

    items.forEach(item => {
        // Націлення на текст списку
        const itemName = item.firstChild.textContent.toLowerCase();

        if(itemName.indexOf(text) != -1) {
            item.style.display = 'flex'
        } else {
            item.style.display = 'none';
        }
    })


}
// Функція перевірки чи є у нас список, щоб розуміти чи відображати фільтр та очищення
function checkUI(){
    itemInput.value = '';


    const items = itemList.querySelectorAll('li');
    // Перевірка, якщо довжина NodeList, тобто списку = 0
    if(items.length === 0) {
        // То забрати кнопку очищення та фільтр
        clearBtn.style.display = 'none';
        itemFilter.style.display = 'none';
    } else{
        clearBtn.style.display = 'block';
        itemFilter.style.display = 'block';
    }

    formBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Add Item';
    formBtn.style.backgroundColor = '#333';

    isEditMode = false;
}

// Initialize app
function init() {
    // Слухачі подій
    itemForm.addEventListener('submit', onAddItemSubmit);
    itemList.addEventListener('click', onClickItem);
    clearBtn.addEventListener('click', clearItems);
    itemFilter.addEventListener('input', filterItems);
    document.addEventListener('DOMContentLoaded', displayItems);

    checkUI();
}

init();
