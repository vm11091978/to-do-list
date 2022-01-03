'use strict';

let input = document.querySelector('.todo__text');
let button_add = document.querySelector('.todo__add'); // кнопка "добавить"
let items = document.querySelectorAll( '.todo__item' ); // весь список задач
let todo_items = document.querySelector('.todo__items'); // отдельная задача
let button_all = document.querySelector( '.all' ); // кнопка "все"
let button_active = document.querySelector( '.actived' ); // кнопка "активные"
let button_completed = document.querySelector( '.completed' ); // кнопка "завершённые"
let button_delets = document.querySelector( '.todo__delete' ); // кнопки удалить
let button_mades = document.querySelector( '.todo__made' ); // кнопки галочка

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
}

function createList(message, clas) {
	let li = document.createElement('li'); // создадим пункт списка задач
	li.className = 'todo__item ' + clas;
	li.innerHTML = '<div class="check"></div><span>' + message + '</span><div class="todo__delete">&#10006;</div><div class="todo__made"><div class="checkmark"></div></div>';
	todo_items.append(li); /* вставим li внутрь ul класса "todo__items" */
}

function add() {
	let message = [input.value, 'active']; // input.value это текст, взятый из инпута
	if (input.value) {
		arr.push(message); // добавляем элемент в конец массива
		updateList();
	}
	input.value = '';
}

function updateList() {
	// сначала удалим весь существующий список задач:
	let elems = document.querySelectorAll("li");
	for (let li of elems) {
		li.remove();
	}
	// затем из обновлённого массива создадим список заново:
	arr.forEach(message => createList(message[0], message[1]));	
	// сохраним обновлённый массив в хранилище:
	let json = JSON.stringify(arr); // преобразуем массив обратно в json-строку
	localStorage.setItem('todo', json); // сохраняем массив с ключом 'todo'

	init();
	update();
	moving();
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
	// console.log(e);
	updateList();
}

function update() {
	button_mades = document.querySelectorAll( '.todo__made' );
	items = document.querySelectorAll( '.todo__item' );
	for (let button_made of button_mades) { // перебираем все кнопки "сделано"
		button_made.addEventListener('click', function() { // по клику по одной из них
			// event.stopPropagation();
			items.forEach(( item, i ) => { // узнаем порядковый номер её родителя
				item.addEventListener('click', e => made(i)); // made(i) выполнится один раз
			});
		});
	}
}
update();

// Скрипт ниже для перетаскивания элементов списка задач мышкой

function move(e, i) { // передаём функции объект события и переменную i
	let pageY = e.pageY;
	let element = document.querySelectorAll('.todo__items li')[i];

	// Получим данные об элементе (координаты, размеры) в виде массива:
	var coords = element.getBoundingClientRect(); // кроме IE8-
	// получим координаты курсора относительно верха элемента:
	var shiftY = e.pageY - coords.top - pageYOffset;
	// e.pageY - это координаты курсора по оси Y относительно верха document
	// coords.top - текущие координаты верха элемента относительно окна
	// pageYOffset - количество пикселей, на которое документ прокручен по вертикали

	// Зададим нижнему элементу бОльший отступ, чтобы он не сместился вверх
	let next = document.querySelectorAll('.todo__items li')[i + 1];

	if (next) {
		next.style.marginTop = 80 + 'px';
	} else {
		todo_items.style.marginBottom = 60 + 'px';
	}

	element.style = 'background: beige; cursor: move; position: absolute; z-index: 2';
	var elemWidth = todo_items.clientWidth; // Узнаем текущую ширину списка задач
	element.style.width = elemWidth + 'px'; // и присвоим эту ширину нашему элементу

	// Двигая мышью, перемещаем элемент по экрану
	document.onpointermove = function(e) {
		element.style.top = e.pageY - shiftY - 20 + 'px';
		// получим изменение координат элемента по оси Y при его перетаскивании:
		let differenceСoords = pageY - e.pageY;

		let count = i - Math.floor((differenceСoords + 30)/60); // в начале перемещения count = i
		let countPrev = count - 1;
		if (count > i) {countPrev = count}

		let countNext = count;
		if (count + 1 > i) {countNext = count + 1}

		let countNextNext = count + 1;
		if (count + 2 > i) {countNextNext = count + 2}
		
		let currentPrev = document.querySelectorAll('.todo__items li')[countPrev];
		let currentNext = document.querySelectorAll('.todo__items li')[countNext];
		let currentNextNext = document.querySelectorAll('.todo__items li')[countNextNext];

		if (currentPrev) {
			currentPrev.style = "margin-top: 20px; transition: 0.2s linear";
		}
		if (currentNext) {
			currentNext.style = "margin-top: 80px; transition: 0.2s linear";
		}
		if (currentNextNext) {
			currentNextNext.style = "margin-top: 20px; transition: 0.2s linear";
		}
		console.log(i, count, countPrev, countNext, countNextNext);

		// Отследим окончание переноса
		element.onpointerup = function() {
			document.onpointermove = null;
			element.onpointerup = null;

			// i это позиция начала переноса элемента, count это позиция окончания переноса:
			let source = arr[i];
			arr.splice(i, 1); // удаляем из массива элемент под номером i
			if (count < 0) {
				arr.push(source); // добавляем source в конец массива
			} else {
				arr.splice(count, 0, source); // вставляем в массив source перед count
			}

			updateList();
		}
	}

	// Пользователь отпустил клавишу мыши, не сдвинув элемент (не было события onmousemove):
	element.onpointerup = function() {
		document.onpointermove = null;
		element.onpointerup = null;

		updateList();
	}
}
/*
function moving() {
	items = document.querySelectorAll( '.todo__item' );
	items.forEach(( item, i ) => { // перебираем все задачи, узнаём её порядковый номер
		item.addEventListener('mousedown', e => move(e, i) );
		// или так: item.addEventListener('mousedown', function(e) { отследим нажатие });
	});
}
*/
function moving() {
	items = document.querySelectorAll( '.todo__item' );
	items.forEach(( item, i ) => { // перебираем все задачи, узнаём её порядковый номер
		item.addEventListener('pointerdown', function(e) {
			e.preventDefault(); // нужно для корректной работы некоторых браузеров
			if (event.target.className != 'todo__made' && event.target.className != 'checkmark' && event.target.className != 'todo__delete') {
				move(e, i);
			}
		});
	});
}
moving();
