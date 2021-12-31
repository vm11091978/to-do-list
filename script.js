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
	li.innerHTML = '<div class="checkmark"></div><span>' + message + '</span><div class="todo__delete">&times;</div><div class="todo__made"><div class="checkmark"></div></div>';
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

// Скрипт ниже для перетаскивания элементов списка задач мышкой

function move2(e, i) { // передаём функции объект события и переменную i
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
	let next = document.querySelectorAll('.todo__items li')[i+1];
	if (next) {
		next.style.marginTop = 70 + 'px';
	} else {
		todo_items.style.marginBottom = 55 + 'px';
	}
	
	element.style = 'background: beige; cursor: move; position: absolute; z-index: 2';
	var elemWidth = todo_items.clientWidth; // Узнаем текущую ширину списка задач
	element.style.width = elemWidth + 'px'; // и присвоим эту ширину нашему элементу

	// Двигая мышью, перемещаем элемент по экрану
	document.onmousemove = function(e) {
		element.style.top = e.pageY - shiftY - 15 + 'px';
		// получим изменение координат элемента по оси Y при его перетаскивании:
		let differenceСoords = pageY - e.pageY;

		let j = i - Math.floor((differenceСoords + 27.5)/55); // в начале перемещения j = i
		if (j < 0) {j = 0}
		if (j > items.length - 1) {j = items.length - 1}

		let ele = document.querySelectorAll('.todo__items li')[j];	
		let eleNext = document.querySelectorAll('.todo__items li')[j+1];
		
		// let elePrev = document.querySelectorAll('.todo__items li')[j-1];
		let elePrev = false;
		if (j > 0) {
			let elePrev = document.querySelectorAll('.todo__items li')[j-1];
		}
		let eleNextNext = document.querySelectorAll('.todo__items li')[j+2];
		if (j > items.length - 2) {
			let eleNextNext = document.querySelectorAll('.todo__items li')[items.length - 1];
		}
		
		// при перемещении элемента вверх относительно исходной позиции
		if (differenceСoords > 27.5 && i != 0) {
			if (elePrev) {
				elePrev.style = "margin-top: 15px; transition: 1s linear";
			}
			ele.style = "margin-top: 70px; transition: 1s linear";
			if (next) {
				next.style = "margin-top: 15px; transition: 1s linear";
			}
			if (eleNext) {
				eleNext.style.marginTop = 15 + 'px';
				eleNext.style.transition = 'margin-top 1s linear';
			}

		// при перемещении элемента вниз относительно исходной позиции	
		} else if (differenceСoords < -27.5) {
			// elePrev.style = "margin-top: 15px; transition: 1s linear";
			ele.style = "margin-top: 15px; transition: 1s linear";
			if (next) {
				next.style = "margin-top: 15px; transition: 1s linear";
			}
			if (eleNext) {
				eleNext.style.marginTop = 70 + 'px';
				eleNext.style.transition = 'margin-top 1s linear';
			}
			if (eleNextNext) {
				eleNextNext.style = "margin-top: 15px; transition: 1s linear";
			}


		// при перемещении элемента близко к исходной позиции
		} else {
			if (elePrev) {
				elePrev.style = "margin-top: 15px; transition: 1s linear";
			}
			if (next) {
				next.style = "margin-top: 70px; transition: 1s linear";
			}
			if (eleNextNext) {
				eleNextNext.style = "margin-top: 15px; transition: 1s linear";
			}
		}
		console.log(i, j);
	}

	
	
	// Отследим окончание переноса
	element.onmouseup = function() {
		document.onmousemove = null;
		element.onmouseup = null;
	}
	
	
	
}

function move() {
	items = document.querySelectorAll( '.todo__item' );
	items.forEach(( item, i ) => { // перебираем все задачи, узнаём её порядковый номер
		item.addEventListener('mousedown', e => move2(e, i) );
		// или так: item.addEventListener('mousedown', function(e) { отследим нажатие });
		
	});
	
}
move();




/*
		// console.log(i, items.length);

alert(b);
*/
// console.log(b);
// document.addEventListener('click', function() {	console.log(button_delets) });