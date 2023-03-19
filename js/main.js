window.addEventListener('DOMContentLoaded', () => {
  //Tabs
  const tabs = document.querySelectorAll('.tabheader__item'),
    tabsContainer = document.querySelector('.tabheader__items'),
    tabContent = document.querySelectorAll('.tabcontent');

  function hideTabContent() {
    tabs.forEach((tab) => {
      tab.classList.remove('tabheader__item_active');
    });

    tabContent.forEach((content) => {
      content.classList.add('sidepanel__hide');
      content.classList.remove('sidepanel__show');
    });
  }

  function showTabContent(i = 0) {
    tabs[i].classList.add('tabheader__item_active');

    tabContent[i].classList.remove('sidepanel__hide');
    tabContent[i].classList.add('sidepanel__show');
  }

  hideTabContent();
  showTabContent();

  tabsContainer.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.classList.contains('tabheader__item')) {
      tabs.forEach((tab, i) => {
        if (target == tab) {
          hideTabContent();
          showTabContent(i);
        }
      });
    }
  });

  //Timer
  const deadline = '2023-03-12';

  function getTimeRemaining(endtime) {
    const total = Date.parse(endtime) - Date.parse(new Date()),
      days = Math.floor(total / (1000 * 60 * 60 * 24)),
      hours = Math.floor((total / (1000 * 60 * 60)) % 24),
      minutes = Math.floor((total / 1000 / 60) % 60),
      seconds = Math.floor((total / 1000) % 60);

    return {
      total: total,
      days: days,
      hours: hours,
      minutes: minutes,
      seconds: seconds,
    };
  }

  function getZero(num) {
    if (num >= 0 && num < 10) {
      return `0${num}`;
    } else {
      return num;
    }
  }

  function setClock(selector, endtime) {
    const timer = document.querySelector(selector),
      days = timer.querySelector('#days'),
      hours = timer.querySelector('#hours'),
      minutes = timer.querySelector('#minutes'),
      seconds = timer.querySelector('#seconds'),
      timeInterval = setInterval(updateClock, 1000);

    updateClock();

    function updateClock() {
      const t = getTimeRemaining(endtime);

      days.innerHTML = t.days;
      hours.innerHTML = t.hours;
      minutes.innerHTML = t.minutes;
      seconds.innerHTML = t.seconds;

      if (t.total <= 0) {
        clearInterval(timeInterval);
      }
    }
  }
  setClock('.timer', deadline);

  //Modal
  const modalTrigger = document.querySelectorAll('[data-modal]'),
    modal = document.querySelector('.modal');

  modalTrigger.forEach((btn) => {
    btn.addEventListener('click', openModal);
  });

  function closeModal() {
    modal.classList.add('sidepanel__hide');
    modal.classList.remove('sidepanel__show');
    document.body.style.overflow = '';
  }
  function openModal() {
    modal.classList.add('sidepanel__show');
    modal.classList.remove('sidepanel__hide');
    document.body.style.overflow = 'hidden';
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal || e.target.getAttribute('data-close') == '') {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.code === 'Escape' && modal.classList.contains('show')) {
      closeModal();
    }
  });

  //Class for Cards

  /* -> #1*/
  class ItemCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src;
      this.alt = alt;
      this.title = title;
      this.descr = descr;
      this.classes = classes;
      this.price = price;
      this.parent = document.querySelector(parentSelector);
      this.course = 27;
      //this points to current object
      //call method convertUSDUAH to trigger convertion
      this.convertUSDUAH();
    }

    convertUSDUAH() {
      this.price = this.price * this.course;
    }

    render() {
      const div = document.createElement('div');
      if (this.classes.length === 0) {
        this.div = 'menu__item';
        div.classList.add(this.div);
      } else {
        this.classes.forEach((className) => div.classList.add(className));
      }
      div.innerHTML = `
        <img src="${this.src}" alt="${this.alt}">
        <h3 class="menu__item-subtitle">${this.title}</h3>
        <div class="menu__item-descr">${this.descr}</div>
        <div class="menu__item-divider"></div>
        <div class="menu__item-price">
            <div class="menu__item-cost">Цена:</div>
            <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
        </div>
      `;
      this.parent.append(div);
    }
  }

  //AsyncAwait
  // 1.postData = async(url,data)=> await res.json()
  // 2.call postData(url, json).then().catch().fianlly()
  // 3.json = JSON.stringify(Object.fromEntries(formData.entries()))
  // 4.getResource = async(url) => if(!res.ok) throw new Error('') else return await res.json()
  // 5.call getResource('url').then(data=>{data.forEach(({destruct})=>{new ItemCard(redestruct).render()})})

  const getResource = async (url) => {
    const res = await fetch(url);
    //fetch only OK when status 200-299
    if (!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`);
    }
    return await res.json();
  };

  getResource('http://localhost:3000/menu').then((data) => {
    //why response Array -> look at db.json -> menu
    //destructuring -> const img = obj.img, altimg = obj.altimg
    data.forEach(({ img, altimg, title, descr, price }) => {
      //new ItemCard points to -> #1
      //why new -> prototype of ItemCard. prototype inherits props & methods of Class ItemCard
      new ItemCard(
        img,
        altimg,
        title,
        descr,
        price,
        '.menu .container'
      ).render();
    });
  });

  // Forms
  const forms = document.querySelectorAll('form');

  const message = {
    loading: 'icons/spinner.svg',
    success: 'Thanks! We will call you soon!',
    failure: 'Error happened. Try once again!',
    remove: function () {
      console.log('a');
    },
  };

  forms.forEach((item) => {
    bindPostData(item);
  });

  //arrow function when context does not matter
  const postData = async (url, data) => {
    //fetch returns object -> fetch(url).then(succCallBackFn, failureCallBackFn);
    //await waits for result returned
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: data,
    });
    //If no awaits -> go further without waiting result
    //await bcs could be huge response body and it`ll take time to handel it
    return await res.json();
  };

  function bindPostData(form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const statusMessage = document.createElement('div');
      statusMessage.src = message.loading;
      statusMessage.style.cssText = `
        display: block;
        margin: 0 auto;
      `;
      // form.insert(statusMessage);
      form.insertAdjacentElement('afterend', statusMessage);

      const formData = new FormData(form); //form must have attr name

      //  Arrays                Object                              JSON
      //.entries [[], []] |  .fromEntries {key:val, key:val}  |  .stringify {'key': val, 'key': val}
      const json = JSON.stringify(Object.fromEntries(formData.entries()));

      const object = {};
      formData.forEach(function (value, key) {
        object[key] = value;
      });

      postData('http://localhost:3000/requests', json)
        .then((data) => {
          console.log(data);
          showThanksModal(message.success);
          message.remove();
        })
        .catch(() => {
          showThanksModal(message.failure);
        })
        .finally(() => {
          form.reset();
        });
    });
  }

  //SHOW THANKS

  function showThanksModal(msg) {
    const prevModalDialog = document.querySelector('.modal__dialog');

    prevModalDialog.classList.add('sidepanel__hide');
    openModal();

    const thankModal = document.createElement('div');
    thankModal.classList.add('modal__dialog');
    thankModal.innerHTML = `
    <div class="modal__content">
      <div class="modal__close" data-close>x</div>
      <div class="modal__title">${msg}</div>
    </div>
    `;

    document.querySelector('.modal').append(thankModal);

    setTimeout(() => {
      thankModal.remove();
      prevModalDialog.classList.add('sidepanel__show');
      prevModalDialog.classList.remove('sidepanel__hide');
      closeModal();
    }, 4000);
  }

  //JSON DB   npx json-server db.json
  fetch('http://localhost:3000/menu')
    .then((data) => data.json())
    .then((res) => console.log(res));
});
