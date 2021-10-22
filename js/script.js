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
    console.log(modalBtns, modalWindow, modalWindowClose);

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
});