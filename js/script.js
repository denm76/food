'use strict';

document.addEventListener('DOMContentLoaded', () => {
    // Tabs
    const   tabs = document.querySelectorAll('.tabheader__item'),
            tabsContent = document.querySelectorAll('.tabcontent',),
            tabsParent = document.querySelector('.tabheader__items');

    function hideTabContent(){
        tabsContent.forEach((item)=>{
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        })

        tabs.forEach((item)=>{
            item.classList.remove('tabheader__item_active');
        })
    }
    
    function showTabContent(index = 0) {
        tabsContent[index].classList.add('show', 'fade');
        tabsContent[index].classList.remove('hide');
        tabs[index].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event)=>{
        const target = event.target;
        if(target && target.classList.contains('tabheader__item')){
            tabs.forEach((tab, index)=>{
                if(target == tab){
                    hideTabContent();
                    showTabContent(index);
                }
            })
        }
    })


    //Timer

    // вид input type='date' - '2021-09-09'
    const deadline = '2021-12-12';

    //Функция, подсчитывающая остаток времени до дедлайна и
    //передающая его в объекте по компонентам времени
    function getTimeRemaining(endtime){
        const now = new Date();
        const t = Date.parse(endtime) - Date.parse(now),
              days = Math.floor(t/(1000*60*60*24)),
              hours = Math.floor((t/(1000*60*60)) % 24),
              minutes = Math.floor((t/1000/60) % 60),
              seconds = Math.floor((t/1000) % 60);

        return{
            'total':t,
            'days':days,
            'hours':hours,
            'minutes':minutes,
            'seconds':seconds
        }
    }

    function getZero(num){
        if(num >= 0 && num < 10){
            return `0${num}`;
        }
        else{
            return num;
        }
    }

    function setClock(selector, endtime){
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);
        //Запускаем функцию обновления до запуска setInterval во избежания мегания таймера на странице
        updateClock();

        function updateClock(){
            const t = getTimeRemaining(endtime);
            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if(t.total <= 0){
                 clearInterval(timeInterval);
            }
        }

    }

    setClock('.timer', deadline);

    //modal window

    const modalBtns = document.querySelectorAll('[data-modal]'),
          modalWindow = document.querySelector('.modal'),
          modalWindowClose = document.querySelector('[data-close]');


    function openModal(){
        modalWindow.classList.add('show', 'fade');
        modalWindow.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId);//Выключение всплытия модального окна через пять секунд
    }

    modalBtns.forEach(element =>{
        element.addEventListener('click',openModal);
    })

    function closeModalWindow(){
        modalWindow.classList.remove('show', 'fade');
        modalWindow.classList.add('hide');
        document.body.style.overflow = 'visible';
    }

    modalWindowClose.addEventListener('click', closeModalWindow)

    //Закрытие модального окна по клику в 'пустоту'
    modalWindow.addEventListener('click',(event)=>{
        const target = event.target;
        if( target && target.matches('div.modal')){
          closeModalWindow();
        }
    })

    //Закрытие модального окна по нажатию Escape
    document.addEventListener('keydown', (event) =>{
        if(event.code === "Escape" && modalWindow.classList.contains('show')){
            closeModalWindow();
        }
    })

    const modalTimerId = setTimeout(openModal, 5000);
    //функция подсчета прокрутки экрана,
    // после срабатывания удаляет слушатель события прокрутки
    function showModalByScroll(){
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight){
            openModal();
            window.removeEventListener('scroll',showModalByScroll);
        }
    }
    //Слушатель события прокрутки экрана, если пользователь долистал до конца,
    //срабатывает открытие модального окна
    window.addEventListener('scroll',showModalByScroll);

    //Используем классы
    class MenuCard{
        constructor(src, alt, title, descr, price, parentSelector, ...classes){
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.transfer = 27;
            this.parent = document.querySelector(parentSelector);
            this.changeToUAH();
        }

        changeToUAH(){
            this.price = this.price*this.transfer;
        }

        render(){
            const element = document.createElement('div');
            if(this.classes.length === 0){
                this.classes = 'menu__item';
                element.classList.add(this.classes);
            }else{
                this.classes.forEach(className => {element.classList.add(className)});
            }

            element.innerHTML = `
                    <img src=${this.src} alt=${this.alt}>
                    <h3 class="menu__item-subtitle">${this.title}</h3>
                    <div class="menu__item-descr">${this.descr}</div>
                    <div class="menu__item-divider"></div>
                    <div class="menu__item-price">
                        <div class="menu__item-cost">Цена:</div>
                        <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                    </div>
            `
            this.parent.append(element);
        }
    }

    new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес"',
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        9,
        ".menu .container",
    ).render();//Одноразовый вызов объекта класса без сохранения

    new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'Меню “Премиум”',
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        20,
        ".menu .container",
        'menu__item'

    ).render();

    new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню "Постное"',
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        15,
        ".menu .container",
        'menu__item'

    ).render();
});