class CartNotification extends HTMLElement {
  constructor() {
    super();

    this.notification = document.getElementById('cart-notification');
    this.header = document.querySelector('sticky-header');
    this.onBodyClick = this.handleBodyClick.bind(this);
    
    this.notification.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelectorAll('button[type="button"]').forEach((closeButton) =>
      closeButton.addEventListener('click', this.close.bind(this))
    );
    window.addEventListener('scroll', this.close.bind(this));
  }

  open() {
   var url = "/products";
  fetch(url, {
    credentials: 'same-origin',
    method: 'GET',
    headers: {
        'Cache-Control': 'no-cache'
    }
    }).then(function (content) {
      return content.text()
  })
  .then( (state)=> {
    document.querySelector('.shipping').innerHTML=this.getSectionInnerHTML(state,'.shipping')

  })

    document.body.classList.add('overflow-hidden');
    this.notification.classList.add('animate', 'active');
    document.querySelector(".body_mask").classList.add('active');
    this.notification.addEventListener('transitionend', () => {
      this.notification.focus();
      trapFocus(this.notification);
    }, { once: true });
    document.body.addEventListener('click', this.onBodyClick);
  }

  close() {
    document.body.classList.remove('overflow-hidden');
    this.notification.classList.remove('active');
    document.querySelector(".body_mask").classList.remove('active');
    document.body.removeEventListener('click', this.onBodyClick);
    removeTrapFocus(this.activeElement);
  }

  renderContents(parsedState) {
      this.productId = parsedState.id;
      this.getSectionsToRender().forEach((section => {
        if(section.id==="cart-icon-bubble"){
          document.getElementById(section.id).style.display="block"
        }
        document.getElementById(section.id).innerHTML =
          this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
      }));
      if (this.header) this.header.reveal();
      this.open();
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-notification-product',
        selector: `#cart-notification-product-${this.productId}`,
      },
      {
        id: 'cart-notification-button'
      },
      {
        id: 'cart-icon-bubble'
      }
    ];
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser()
      .parseFromString(html, 'text/html')
      .querySelector(selector).innerHTML;
  }

  handleBodyClick(evt) {
    const target = evt.target;
    if (target !== this.notification && !target.closest('cart-notification')) {
      const disclosure = target.closest('details-disclosure');
      this.activeElement = disclosure ? disclosure.querySelector('summary') : null;
      this.close();
    }
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-notification', CartNotification);
