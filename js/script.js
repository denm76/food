'use strict';

document.addEventListener('DOMContentLoaded', () => {

    //tabs 

    const tabs = document.querySelectorAll('.tabheader__item'),
          tabsContent = document.querySelectorAll('.tabcontent'),
          tabsParent = document.querySelector('.tabheader__items');

          function hideTabContent(){
              tabsContent.forEach(item => {
                  item.classList.add('hide');
                  item.classList.remove('show','fade');
              });

              tabs.forEach(item => {
                  item.classList.remove('tabheader__item_active');
              });
          }

          function showTabContent(i = 0){
            tabsContent[i].classList.add('show','fade');
            tabsContent[i].classList.remove('hide');
            tabs[i].classList.add('tabheader__item_active');
          }

          hideTabContent();
          showTabContent();

          tabsParent.addEventListener('click', (event) =>{
            const target=event.target;

            if(target && target.classList.contains('tabheader__item')){

                

                tabs.forEach((item,i) => {

                    if(target == item){
                        hideTabContent();
                        showTabContent(i);
                    }

                });

            }
      });

      // Timer

      const deadline = '2021-05-01';

       function getTimeRemaining(endtime){//Определяем остаток дней, часов, минут и секунд до дедлайна
          const t = Date.parse(endtime) - Date.parse(new Date()),
                days = Math.floor(t/(1000*60*60*24)),
                hours = Math.floor(t/(1000*60*60) % 24),
                minutes = Math.floor(t/(1000*60) % 60),
                seconds = Math.floor((t/1000) % 60);
      

      return {
          'total': t,
          'days': days,
          'hours': hours,
          'minutes': minutes,
          'seconds': seconds
      };

      }

      function getZero(number){//подставляем в счетчик ноль, если количество минут,секунд, и тд меньше 10
          if (number >= 0 && number < 10){
              return `0${number}`;
          }
          else{
              return number;
          }
      }

      function setClock(selector,endtime){//установка и запуск таймера
          
          const timer = document.querySelector(selector),
                days = document.querySelector('#days'),
                hours = document.querySelector('#hours'),
                minutes = document.querySelector('#minutes'),
                seconds = document.querySelector('#seconds'),
                timeInterval = setInterval(updateClock, 1000);//обновление таймера каждую секунду

          updateClock();
                
                function updateClock(){//функция обновления таймера

                    const t = getTimeRemaining(endtime);
                    
                
                    days.textContent = getZero(t.days);
                    hours.textContent = getZero(t.hours);
                    minutes.textContent = getZero(t.minutes);
                    seconds.textContent = getZero(t.seconds);
                    
                    if (t.total <= 0){//если разница между дедлайном и текущим временем равна или меньше нуля убиваем интервальное повторение
                        clearInterval(timeInterval);
                    }
                }
      }

      setClock('.timer', deadline);//запуск основной функции таймера

    //   const menuItem = document.querySelector('.menu__item');
    //         menuStyles = window.getComputedStyle(menuItem);
    //   console.log(menuItem.getBoundingClientRect());
    //   console.log(menuStyles.display);

      //Modal window

      const modalTrigger = document.querySelectorAll('[data-modal]'),
            modal = document.querySelector('.modal'),
            modalCloseBtn = document.querySelector('[data-close]');

      function openModal(){  //Функция показа модального окна
            modal.classList.add('show');
            modal.classList.remove('hide');
            // modal.classList.toggle('show');
            document.body.style.overflow = 'hidden';
            clearInterval(modalTimerId);//Отмена появления модального окна через пять секунд
        }

      modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
      });


      function closeModal(){
        modal.classList.add('hide');
        modal.classList.remove('show');  
        // modal.classList.toggle('show');
        document.body.style.overflow = ''; 
      }
      

      modalCloseBtn.addEventListener('click', closeModal);

      modal.addEventListener('click', (e) => {
        if(e.target === modal){
            closeModal();
        }
    });

      document.addEventListener('keydown', (e) => {//event.code нажатие клавиши эскейп
          if(e.code === "Escape" && modal.classList.contains('show')){
              closeModal();
          }       
      });

    const modalTimerId = setTimeout(openModal, 5000);//Запуск модального окна через 5 секунд после входа на сайт

      function showModalByScroll(){
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight)//прокрученная часть сайта + видимая часть сайта = полной высоте монитора с прокруткой(пользователь прокрутил до низа сайта)
        {
            openModal();
            window.removeEventListener('scroll', showModalByScroll);//удаление обработчика события scroll после выполнения действия для избегания повторов при следующем скроллинге
        }
      }

     window.addEventListener('scroll', showModalByScroll);//Вызов функции появления модального окна при скроллинге страницы до конца

    
//Использование классов для карточек
      class MenuCard {
          constructor(src, alt , descr, title, price, parentSelector, ...classes){//конструктор карточки
                this.src = src;
                this.alt = alt;
                this.descr = descr;
                this.title = title;
                this.price = price;
                this.parent = document.querySelector(parentSelector);//Добавление в конструктор родительского элемента карточки
                this.transfer = 27;
                this.classes = classes;//добавление дополнительных классов в карточку
                this.changeToUAH();
                
          }

          changeToUAH(){//перевод из долларов в гривну
                this.price = this.price*this.transfer;
                
          }

          render(){//функция создания представления (карточки)
                const element = document.createElement('div');
                if(this.classes.length === 0){
                    this.element = "menu__item";
                    element.classList.add(this.element);
                }
                else{
                this.classes.forEach(className => element.classList.add(className));//Добавляем классы из массива classes в список классов карточки
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
                `;//добавление верстки в элемент

                this.parent.append(element);//добавление верстки карточки в родительский элемент
                
          }

         
      }

      new MenuCard(
        "img/tabs/vegy.jpg",
        "vegy",
        'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
        'Меню "Фитнес"',
        9,
        '.menu .container'
      ).render();

      new MenuCard(
        "img/tabs/elite.jpg",
        "elite",
        'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
        'Меню “Премиум”',
        20,
        '.menu .container',
        "menu__item",
        "big"
      ).render();

      new MenuCard(
        "img/tabs/post.jpg",
        "post",
        'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
        'Меню "Постное"',
        15,
        '.menu .container',
        "menu__item",
        "big"
      ).render();

      
});