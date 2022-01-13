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

const height = 60; // высота задачи с отступом или шаг списка задач
const indent = 20; // отступ между задачами

button_add.addEventListener("click", add);

input.addEventListener('keydown', function(e) {
	if (e.keyCode == 13) add()
});

button_all.addEventListener("click", function() {
	localStorage.setItem('button_current', "all");
	updateList();
});

button_active.addEventListener("click", function() {
	localStorage.setItem('button_current', "active");
	updateList();
});

button_completed.addEventListener("click", function() {
	localStorage.setItem('button_current', "made");
	updateList();
});

// Скрипт для формирования списка задач при загрузке страницы
let database = localStorage.getItem('todo'); // получаем из хранилища данные по ключу
let arr = new Array();
if (database) { // если хранилищe не пустое
	arr = JSON.parse(database); // преобразуем данные в массив вида [ 1, 2, "a", "b" ]
	arr.forEach(message => createList(message[0], message[1]));
}

// а так же узнаем, на какой вкладке находился клиент, и воссоздадим её
let button_current = localStorage.getItem('button_current');
if (!button_current) {
	button_current = "all";
}

function tab() {
	if (button_current == "all") {
		document.querySelectorAll(".active").forEach(elem => elem.style.display = "block");
		document.querySelectorAll(".made").forEach(elem => elem.style.display = "block");
		button_all.style.background = '#689f38';
	} else {
		button_all.style.background = '';
	}
	if (button_current == "active") {
		document.querySelectorAll(".made").forEach(elem => elem.style.display = "none");
		document.querySelectorAll(".active").forEach(elem => elem.style.display = "block");
		button_active.style.background = '#689f38';
	} else {
		button_active.style.background = '';
	}
	if (button_current == "made") {
		document.querySelectorAll(".active").forEach(elem => elem.style.display = "none");
		document.querySelectorAll(".made").forEach(elem => elem.style.display = "block");
		button_completed.style.background = '#689f38';
	} else {
		button_completed.style.background = '';
	}
}
tab();

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

	// а так же узнаем, на какой вкладке находился клиент, и воссоздадим её
	button_current = localStorage.getItem('button_current');
	tab();

	init();
	update();
	moving();
	status();
}

function del(i) {
	arr.splice(i, 1); // удаляем из массива элемент под номером i
	updateList();
	
	// Зададим нижнему элементу бОльший отступ, чтобы он резко не сместился вверх
	let next2 = document.querySelectorAll('.todo__items li')[i];
	if (next2) {
		next2.style = "animation-name: smooth; animation-duration: 0.3s; animation-timing-function: linear; animation-fill-mode: both";
	}
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
	
	let i_current_a = arr_active.indexOf(i); // это номер элемента в локальном списке "активные"
	let i_current_m = arr_made.indexOf(i); // это номер элемента в локальном списке "завершенные"
	
	updateList();

	// Зададим нижнему элементу бОльший отступ, чтобы он резко не сместился вверх
	let i_current_all;
	if (button_current == "active") {
		i_current_all = arr_active[i_current_a]; // это номер элемента в общем списке
	}
	if (button_current == "made") {
		i_current_all = arr_made[i_current_m]; // это номер элемента в общем списке
	}
	let next3 = document.querySelectorAll('.todo__items li')[i_current_all];
	if (next3) {
		next3.style = "animation-name: smooth; animation-duration: 0.3s; animation-timing-function: linear; animation-fill-mode: both";
	}
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

// Получим массивы порядковых номеров задач со статусом 'active' и со статусом 'made' соответственно
let arr_active = new Array();
let arr_made = new Array();
function status() {
	arr_active = [];
	arr_made = [];
	for (let i = 0; i < arr.length; i++) {
		if (arr[i][1] == 'active') {
			arr_active.push(i); // записываем порядковый номер задачи со статусом 'active' в arr_active
		}
		if (arr[i][1] == 'made') {
			arr_made.push(i); // записываем порядковый номер задачи со статусом 'made' в arr_made
		}
	}
}
status();

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
	if (button_current == "active") {
		let i_current = arr_active[arr_active.indexOf(i) + 1];
		next = document.querySelectorAll('.todo__items li')[i_current];
	}
	if (button_current == "made") {
		let i_current = arr_made[arr_made.indexOf(i) + 1];
		next = document.querySelectorAll('.todo__items li')[i_current];
	}
	if (next) {
		next.style.marginTop = height + indent + 'px';
	} else {
		todo_items.style.marginBottom = height + 'px';
	}
	
	element.style = 'background: beige; cursor: move; position: absolute; z-index: 2';
	var elemWidth = todo_items.clientWidth; // Узнаем текущую ширину списка задач
	element.style.width = elemWidth + 'px'; // и присвоим эту ширину нашему элементу

	// Двигая мышью, перемещаем элемент по экрану
	document.onpointermove = function(e) {
		element.style.top = e.pageY - shiftY - indent + 'px';
		// получим изменение координат элемента по оси Y при его перетаскивании:
		let differenceСoords = pageY - e.pageY;

		// если клиент находится на вкладке "активные":
		if (button_current == "active") {
			var count = arr_active.indexOf(i) - Math.floor((differenceСoords + 0.5*height)/height);

			let countPrev = count - 1;
			if (count > arr_active.indexOf(i)) {countPrev = count}

			let countNext = count;
			if (count + 1 > arr_active.indexOf(i)) {countNext = count + 1}

			let countNextNext = count + 1;
			if (count + 2 > arr_active.indexOf(i)) {countNextNext = count + 2}

			var currentPrev = arr_active[countPrev];
			var currentNext = arr_active[countNext];
			var currentNextNext = arr_active[countNextNext];
		} // если клиент находится на вкладке "сделанные":
		else if (button_current == "made") {
			var count = arr_made.indexOf(i) - Math.floor((differenceСoords + 0.5*height)/height);

			let countPrev = count - 1;
			if (count > arr_made.indexOf(i)) {countPrev = count}

			let countNext = count;
			if (count + 1 > arr_made.indexOf(i)) {countNext = count + 1}

			let countNextNext = count + 1;
			if (count + 2 > arr_made.indexOf(i)) {countNextNext = count + 2}

			var currentPrev = arr_made[countPrev];
			var currentNext = arr_made[countNext];
			var currentNextNext = arr_made[countNextNext];
		} // это самый простой случай, когда клиент находится на вкладке "все":
		else {
			var count = i - Math.floor((differenceСoords + 0.5*height)/height); // в начале перемещения count = i
			var currentPrev = count - 1;
			if (count > i) {currentPrev = count}

			var currentNext = count;
			if (count + 1 > i) {currentNext = count + 1}

			var currentNextNext = count + 1;
			if (count + 2 > i) {currentNextNext = count + 2}
		}

		// это элементы в основном списке (вкладке "все"):
		let currentAllPrev = document.querySelectorAll('.todo__items li')[currentPrev];
		let currentAllNext = document.querySelectorAll('.todo__items li')[currentNext];
		let currentAllNextNext = document.querySelectorAll('.todo__items li')[currentNextNext];

		if (currentAllPrev) {
			currentAllPrev.style = "margin-top: 20px; transition: 0.2s linear";
		}
		if (currentAllNext) {
			currentAllNext.style = "margin-top: 80px; transition: 0.2s linear";
		}
		if (currentAllNextNext) {
			currentAllNextNext.style = "margin-top: 20px; transition: 0.2s linear";
		}
		
		// Отследим окончание переноса
		element.onpointerup = function() {
			document.onpointermove = null;
			element.onpointerup = null;

			// i это позиция начала переноса элемента, count это позиция окончания переноса:
			let source = arr[i];
			arr.splice(i, 1); // удаляем из массива элемент под номером i
			if (count < 0) {
				arr.push(source); // добавляем source в конец массива
			} else { // вставляем в массив source перед count
				if (button_current == "active") {
					arr.splice(arr_active[count], 0, source);
				} else if (button_current == "made") {
					arr.splice(arr_made[count], 0, source);
				} else {
					arr.splice(count, 0, source);
				}
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