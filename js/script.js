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

    //Modal window

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

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


    //modalCloseBtn.addEventListener('click', closeModal);Убираем назначение обработчика при клике на крестик,т.к. прописываем данное условие в другом обработчике ниже> e.target.getAttribute('data-close') == ''

    modal.addEventListener('click', (e) => {
        if(e.target === modal || e.target.getAttribute('data-close') === ''){
            closeModal();
        }
    });

    document.addEventListener('keydown', (e) => {//event.code нажатие клавиши эскейп
        if(e.code === "Escape" && modal.classList.contains('show')){
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);//Запуск модального окна через 5 секунд после входа на сайт
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

    //forms

    const forms = document.querySelectorAll('form');
    const message = {//Объект с сообщениями о статусе отправки данных из формы
        loading:"img/form/spinner.svg",
        success:"Спасибо, мы с вами скоро свяжемся",
        failure:"Что-то пошло не так..."
    };

    forms.forEach(item=>{
        postData(item);
    })

    function postData(form) {
       form.addEventListener('submit',(e)=>{
            e.preventDefault();//Отмена стандартного поведения браузера(Отменяем перезагрузку страницы после отправки формы)

            const statusMessage = document.createElement('img');
            statusMessage.src = message.loading;
            statusMessage.style.cssText = `
                display:block;
                margin:0 auto;
            `;

            form.insertAdjacentElement("afterend", statusMessage);




            const formData = new FormData(form);

            const object = {};//Если сервер работает с JSON а не FormData
            formData.forEach((value,key)=>{
                object[key] = value;
            })


            //request.send(formData);
            fetch('server1.php',{
               method:'POST',
               // headers:{'Content-type':'application/json'},
               body:JSON.stringify(object)
            }).then(data => data.text()
            ).then(data => {
                console.log(data);
                showThanksModal(message.success);//Показываем окно сообщением о успехе и благодарности
                form.reset();//Очищаем форму после отправки сообщения
                statusMessage.remove();
            }).catch(()=>{
                showThanksModal(message.failure);//Показываем окно с сообщением о неудаче
            }).finally(()=>{
                form.reset();//Очищаем форму после отправки сообщения
            })


        });
    }

    function showThanksModal(message){//Функция показа благодарности за отправку данных через форму
        const previousModalDialog = document.querySelector('.modal__dialog');//Определяем блок модального окна

        previousModalDialog.classList.add('hide');//Скрываем модальное окно добавлением класса hide
        openModal();//Modal window is opened

        const thanksModal = document.createElement('div');//Создаем элемент модального окна с сообщением
        thanksModal.classList.add('modal__dialog');//Добавляем класс модального окна созданному элементу
        //Формируем HTML разметку элемента
        thanksModal.innerHTML = `
            <div class="modal__content">
                    <div  data-close class="modal__close" >×</div>
                    <div class="modal__title">${message}</div>
            </div>
            
        `;
        document.querySelector('.modal').append(thanksModal);//Добавляем блок с сообщением в блок modal
        //Убираем блок thanksModal через 4 секунды и возвращаем предыдущую разметку
        setTimeout(()=>{
            thanksModal.remove();
            previousModalDialog.classList.add('show');
            previousModalDialog.classList.remove('hide');
            closeModal();//закрываем модальное окно
        },3000);
    }

    fetch(' http://localhost:3000/menu')
        .then(data => data.json())
        .then(result => console.log(result));
});