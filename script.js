'use strict';

let input = document.querySelector('.todo__text');
let button_add = document.querySelector('.todo__add'); // кнопка "добавить"
let items = document.querySelectorAll( '.todo__item' ); // весь список задач
let todo_items = document.querySelector('.todo__items'); // отдельная задача
let button_all = document.querySelector( '.all' ); // кнопка "все"
let button_active = document.querySelector( '.actived' ); // кнопка "активные"
let button_completed = document.querySelector( '.completed' ); // кнопка "завершённые"
let button_delets = document.querySelector( '.todo__delete' );
let button_mades = document.querySelector( '.todo__made' );

button_add.addEventListener("click", add);

button_all.addEventListener("click", function() {
	document.querySelectorAll(".active").forEach(elem => elem.style.display = "block");
	document.querySelectorAll(".made").forEach(elem => elem.style.display = "block");
});

button_active.addEventListener("click", function() {
	document.querySelectorAll(".made").forEach(elem => elem.style.display = "none");
	document.querySelectorAll(".active").forEach(elem => elem.style.display = "block");
});

button_completed.addEventListener("click", function() {
	document.querySelectorAll(".active").forEach(elem => 
	{
		elem.style.display = "none";
	});
	document.querySelectorAll(".made").forEach(elem => 
	{
		elem.style.display = "block";
	});
});

// Скрипт для формирования списка задач при загрузке страницы
let database = localStorage.getItem('todo'); // получаем из хранилища данные по ключу
let arr = new Array();
if (database) { // если хранилища не пустое
	arr = JSON.parse(database); // преобразуем данные в массив вида [ 1, 2, "a", "b" ]
	arr.forEach(message => createList(message[0], message[1]));
// экв. такой записи: arr.forEach(function(message) { createList(message[0], message[1]); });
}

function createList(message, clas) {
	let li = document.createElement('li'); // создадим пункт списка задач
	li.className = 'todo__item ' + clas;
	li.innerHTML = '<span>' + message + '</span><div class="todo__delete">&times;</div><div class="todo__made">сделано</div>';
	todo_items.append(li); /* вставим li внутрь ul класса "todo__items" */
}

function add() {
	let message = [input.value, 'active']; // input.value это текст, взятый из инпута
	if (input.value) {
		arr.push(message); // добавляем элемент в конец массива
		updateList();
	}
}

function updateList() {
	// сначала удалим весь существующий список задач:
	let elems = document.querySelectorAll("li");
	for (let li of elems) {
		li.remove();
	}
	// затем из обновлённого массива создадим список заново:
	arr.forEach(message => createList(message[0], message[1]));	
	// сохраним обновлённый массив в хранилище
	let json = JSON.stringify(arr); // преобразуем массив обратно в json-строку
	localStorage.setItem('todo', json); // сохраняем массив с ключом 'todo'

	init();
	update();
}

function del(i) {
	arr.splice(i, 1); // удаляем из массива элемент под номером i
	updateList();
}

function init() {
	button_delets = document.querySelectorAll( '.todo__delete' );
	items = document.querySelectorAll( '.todo__item' );
	for (let button_delet of button_delets) { // перебираем все кнопки "удалить"
		button_delet.addEventListener('click', function() { // по клику по одной из них
			items.forEach(( item, i ) => { // узнаем порядковый номер её родителя
				item.addEventListener('click', e => del(i)); // del(i) выполнится один раз
			});
		});
	}
}
init();

function made(i) {
	if (arr[i][1] == 'active') {
		arr[i][1] = 'made'; // изменяем в элементе под номером i 'active' на 'made'
	} else if (arr[i][1] == 'made') {
		arr[i][1] = 'active'; // или изменяем обратно
	}
	updateList();
}

function update() {
	button_mades = document.querySelectorAll( '.todo__made' );
	items = document.querySelectorAll( '.todo__item' );
	for (let button_made of button_mades) { // перебираем все кнопки "сделано"
		button_made.addEventListener('click', function() { // по клику по одной из них
			items.forEach(( item, i ) => { // узнаем порядковый номер её родителя
				item.addEventListener('click', e => made(i)); // made(i) выполнится один раз
			});
		});
	}
}
update();

// document.addEventListener('click', function() {	console.log(button_delets) });