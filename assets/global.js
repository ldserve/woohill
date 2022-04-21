function getFocusableElements(container) {
  return Array.from(
    container.querySelectorAll(
      "summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), [draggable], area, input:not([type=hidden]):enabled, select:enabled, textarea:enabled, object, iframe"
    )
  );
}
document.querySelectorAll('[id^="Details-"] summary').forEach((summary) => {
  summary.setAttribute('role', 'button');
  summary.setAttribute('aria-expanded', 'false');

  if (summary.nextElementSibling.getAttribute('id')) {
    summary.setAttribute('aria-controls', summary.nextElementSibling.id);
  }

  summary.addEventListener('click', (event) => {
    event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
  });

  if (summary.closest('header-drawer')) return;
  summary.parentElement.addEventListener('keyup', onKeyUpEscape);
});
document.querySelectorAll('nav [id^="Details-"] summary').forEach((summary) => {
  summary.setAttribute('role', 'button');
  summary.setAttribute('aria-expanded', 'false');

  if (summary.nextElementSibling.getAttribute('id')) {
    summary.setAttribute('aria-controls', summary.nextElementSibling.id);
  }

  summary.addEventListener('mouseenter', (event) => {
    document.querySelectorAll('nav [id^="Details-"] summary').forEach((ele) => {
      ele.setAttribute('aria-expanded', 'false');
      ele.parentElement.closest('details').removeAttribute('open');
    })
    event.currentTarget.setAttribute('aria-expanded', true);
    event.currentTarget.closest('details').setAttribute('open', true);
  })
  if (summary.closest('header-drawer')) return;
  summary.parentElement.addEventListener('keyup', onKeyUpEscape);
});
document.querySelectorAll('li>a.header__menu-item').forEach((ele) => {
  ele.addEventListener('mouseenter', (event) => {
    document.querySelectorAll('nav [id^="Details-"] summary').forEach((summary) => {
      summary.setAttribute('aria-expanded', 'false');
      summary.parentElement.closest('details').removeAttribute('open');
    })
  })
})
const trapFocusHandlers = {};

function trapFocus(container, elementToFocus = container) {
  var elements = getFocusableElements(container);
  var first = elements[0];
  var last = elements[elements.length - 1];

  removeTrapFocus();

  trapFocusHandlers.focusin = (event) => {
    if (
      event.target !== container &&
      event.target !== last &&
      event.target !== first
    )
      return;

    document.addEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.focusout = function () {
    document.removeEventListener('keydown', trapFocusHandlers.keydown);
  };

  trapFocusHandlers.keydown = function (event) {
    if (event.code.toUpperCase() !== 'TAB') return; // If not TAB key
    // On the last focusable element and tab forward, focus the first element.
    if (event.target === last && !event.shiftKey) {
      event.preventDefault();
      first.focus();
    }

    //  On the first focusable element and tab backward, focus the last element.
    if (
      (event.target === container || event.target === first) &&
      event.shiftKey
    ) {
      event.preventDefault();
      last.focus();
    }
  };

  document.addEventListener('focusout', trapFocusHandlers.focusout);
  document.addEventListener('focusin', trapFocusHandlers.focusin);

  elementToFocus.focus();
}

// Here run the querySelector to figure out if the browser supports :focus-visible or not and run code based on it.
try {
  document.querySelector(":focus-visible");
} catch {
  focusVisiblePolyfill();
}

function focusVisiblePolyfill() {
  const navKeys = ['ARROWUP', 'ARROWDOWN', 'ARROWLEFT', 'ARROWRIGHT', 'TAB', 'ENTER', 'SPACE', 'ESCAPE', 'HOME', 'END', 'PAGEUP', 'PAGEDOWN']
  let currentFocusedElement = null;
  let mouseClick = null;

  window.addEventListener('keydown', (event) => {
    if (navKeys.includes(event.code.toUpperCase())) {
      mouseClick = false;
    }
  });

  window.addEventListener('mousedown', (event) => {
    mouseClick = true;
  });

  window.addEventListener('focus', () => {
    if (currentFocusedElement) currentFocusedElement.classList.remove('focused');

    if (mouseClick) return;

    currentFocusedElement = document.activeElement;
    currentFocusedElement.classList.add('focused');

  }, true);
}

function pauseAllMedia() {
  document.querySelectorAll('.js-youtube').forEach((video) => {
    video.contentWindow.postMessage('{"event":"command","func":"' + 'pauseVideo' + '","args":""}', '*');
  });
  document.querySelectorAll('.js-vimeo').forEach((video) => {
    video.contentWindow.postMessage('{"method":"pause"}', '*');
  });
  document.querySelectorAll('video').forEach((video) => video.pause());
  document.querySelectorAll('product-model').forEach((model) => {
    if (model.modelViewerUI) model.modelViewerUI.pause();
  });
}

function removeTrapFocus(elementToFocus = null) {
  document.removeEventListener('focusin', trapFocusHandlers.focusin);
  document.removeEventListener('focusout', trapFocusHandlers.focusout);
  document.removeEventListener('keydown', trapFocusHandlers.keydown);

  if (elementToFocus) elementToFocus.focus();
}

document.querySelector(".openQuickView").addEventListener("click", (e) => {
  e = e || window.event;
  var target = e.target;
  if (target.className === "quickView" || target.className === "openQuickView" || target.className.animVal === "closeQuickView") {
    document.querySelector('.view-inner').style.animation = "myOpacity1 .3s"
    setTimeout(() => {
      document.querySelector(".openQuickView").style.display = "none"
      document.querySelector('.view-inner').innerHTML = ""
      bodyScroll()
    }, 300)
  }
})

document.querySelector(".mask").addEventListener("click", (e) => {
  e = e || window.event;
  var target = e.target;
  if (target.className === "mask" || target.className === "mask-inner" || target.className.animVal === "closeQuickView") {
    document.querySelector('.ld-dialog').style.animation = "myOpacity1 .3s"
    setTimeout(() => {
      document.querySelector(".mask").style.display = "none"
      bodyScroll()
    }, 300)
  }
})

function bodyScroll() {
  const nodeStyle = document.querySelector("body").style.overflow
  if (nodeStyle == "hidden") {
    document.querySelector("body").style.overflow = "auto"
  } else {
    document.querySelector("body").style.overflow = "hidden"
  }
}
function onKeyUpEscape(event) {
  if (event.code.toUpperCase() !== 'ESCAPE') return;

  const openDetailsElement = event.target.closest('details[open]');
  if (!openDetailsElement) return;

  const summaryElement = openDetailsElement.querySelector('summary');
  openDetailsElement.removeAttribute('open');
  summaryElement.setAttribute('aria-expanded', false);
  summaryElement.focus();
}

class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input');
    this.changeEvent = new Event('change', { bubbles: true })

    this.querySelectorAll('button').forEach(
      (button) => button.addEventListener('click', this.onButtonClick.bind(this))
    );
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    event.target.name === 'plus' ? this.input.stepUp() : this.input.stepDown();
    if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
  }
}

customElements.define('quantity-input', QuantityInput);

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

function fetchConfig(type = 'json') {
  return {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
  };
}

/*
 * Shopify Common JS
 *
 */
if ((typeof window.Shopify) == 'undefined') {
  window.Shopify = {};
}

Shopify.bind = function (fn, scope) {
  return function () {
    return fn.apply(scope, arguments);
  }
};

Shopify.setSelectorByValue = function (selector, value) {
  for (var i = 0, count = selector.options.length; i < count; i++) {
    var option = selector.options[i];
    if (value == option.value || value == option.innerHTML) {
      selector.selectedIndex = i;
      return i;
    }
  }
};

Shopify.addListener = function (target, eventName, callback) {
  target.addEventListener ? target.addEventListener(eventName, callback, false) : target.attachEvent('on' + eventName, callback);
};

Shopify.postLink = function (path, options) {
  options = options || {};
  var method = options['method'] || 'post';
  var params = options['parameters'] || {};

  var form = document.createElement("form");
  form.setAttribute("method", method);
  form.setAttribute("action", path);

  for (var key in params) {
    var hiddenField = document.createElement("input");
    hiddenField.setAttribute("type", "hidden");
    hiddenField.setAttribute("name", key);
    hiddenField.setAttribute("value", params[key]);
    form.appendChild(hiddenField);
  }
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
};

Shopify.CountryProvinceSelector = function (country_domid, province_domid, options) {
  this.countryEl = document.getElementById(country_domid);
  this.provinceEl = document.getElementById(province_domid);
  this.provinceContainer = document.getElementById(options['hideElement'] || province_domid);

  Shopify.addListener(this.countryEl, 'change', Shopify.bind(this.countryHandler, this));

  this.initCountry();
  this.initProvince();
};

Shopify.CountryProvinceSelector.prototype = {
  initCountry: function () {
    var value = this.countryEl.getAttribute('data-default');
    Shopify.setSelectorByValue(this.countryEl, value);
    this.countryHandler();
  },

  initProvince: function () {
    var value = this.provinceEl.getAttribute('data-default');
    if (value && this.provinceEl.options.length > 0) {
      Shopify.setSelectorByValue(this.provinceEl, value);
    }
  },

  countryHandler: function (e) {
    var opt = this.countryEl.options[this.countryEl.selectedIndex];
    var raw = opt.getAttribute('data-provinces');
    var provinces = JSON.parse(raw);

    this.clearOptions(this.provinceEl);
    if (provinces && provinces.length == 0) {
      this.provinceContainer.style.display = 'none';
    } else {
      for (var i = 0; i < provinces.length; i++) {
        var opt = document.createElement('option');
        opt.value = provinces[i][0];
        opt.innerHTML = provinces[i][1];
        this.provinceEl.appendChild(opt);
      }

      this.provinceContainer.style.display = "";
    }
  },

  clearOptions: function (selector) {
    while (selector.firstChild) {
      selector.removeChild(selector.firstChild);
    }
  },

  setOptions: function (selector, values) {
    for (var i = 0, count = values.length; i < values.length; i++) {
      var opt = document.createElement('option');
      opt.value = values[i];
      opt.innerHTML = values[i];
      selector.appendChild(opt);
    }
  }
};

class MenuDrawer extends HTMLElement {
  constructor() {
    super();

    this.mainDetailsToggle = this.querySelector('details');

    if (navigator.platform === 'iPhone') document.documentElement.style.setProperty('--viewport-height', `${window.innerHeight}px`);

    this.addEventListener('keyup', this.onKeyUp.bind(this));
    this.addEventListener('focusout', this.onFocusOut.bind(this));
    this.bindEvents();
  }

  bindEvents() {
    this.querySelectorAll('summary').forEach(summary => summary.addEventListener('click', this.onSummaryClick.bind(this)));
    this.querySelectorAll('button').forEach(button => button.addEventListener('click', this.onCloseButtonClick.bind(this)));
  }

  onKeyUp(event) {
    if (event.code.toUpperCase() !== 'ESCAPE') return;

    const openDetailsElement = event.target.closest('details[open]');
    if (!openDetailsElement) return;

    openDetailsElement === this.mainDetailsToggle ? this.closeMenuDrawer(event, this.mainDetailsToggle.querySelector('summary')) : this.closeSubmenu(openDetailsElement);
  }

  onSummaryClick(event) {
    const summaryElement = event.currentTarget;
    const detailsElement = summaryElement.parentNode;
    const isOpen = detailsElement.hasAttribute('open');
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    function addTrapFocus() {
      trapFocus(summaryElement.nextElementSibling, detailsElement.querySelector('button'));
      summaryElement.nextElementSibling.removeEventListener('transitionend', addTrapFocus);
    }

    if (detailsElement === this.mainDetailsToggle) {
      if (isOpen) event.preventDefault();
      isOpen ? this.closeMenuDrawer(event, summaryElement) : this.openMenuDrawer(summaryElement);
    } else {
      setTimeout(() => {
        detailsElement.classList.add('menu-opening');
        summaryElement.setAttribute('aria-expanded', true);
        !reducedMotion || reducedMotion.matches ? addTrapFocus() : summaryElement.nextElementSibling.addEventListener('transitionend', addTrapFocus);
      }, 100);
    }
  }

  openMenuDrawer(summaryElement) {
    setTimeout(() => {
      this.mainDetailsToggle.classList.add('menu-opening');
    });
    summaryElement.setAttribute('aria-expanded', true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }

  closeMenuDrawer(event, elementToFocus = false) {
    if (event !== undefined) {
      this.mainDetailsToggle.classList.remove('menu-opening');
      this.mainDetailsToggle.querySelectorAll('details').forEach(details => {
        details.removeAttribute('open');
        details.classList.remove('menu-opening');
      });
      document.body.classList.remove(`overflow-hidden-${this.dataset.breakpoint}`);
      removeTrapFocus(elementToFocus);
      this.closeAnimation(this.mainDetailsToggle);
    }
  }

  onFocusOut(event) {
    setTimeout(() => {
      if (this.mainDetailsToggle.hasAttribute('open') && !this.mainDetailsToggle.contains(document.activeElement)) this.closeMenuDrawer();
    });
  }

  onCloseButtonClick(event) {
    const detailsElement = event.currentTarget.closest('details');
    this.closeSubmenu(detailsElement);
  }

  closeSubmenu(detailsElement) {
    detailsElement.classList.remove('menu-opening');
    detailsElement.querySelector('summary').setAttribute('aria-expanded', false);
    removeTrapFocus();
    this.closeAnimation(detailsElement);
  }

  closeAnimation(detailsElement) {
    let animationStart;

    const handleAnimation = (time) => {
      if (animationStart === undefined) {
        animationStart = time;
      }

      const elapsedTime = time - animationStart;

      if (elapsedTime < 400) {
        window.requestAnimationFrame(handleAnimation);
      } else {
        detailsElement.removeAttribute('open');
        if (detailsElement.closest('details[open]')) {
          trapFocus(detailsElement.closest('details[open]'), detailsElement.querySelector('summary'));
        }
      }
    }

    window.requestAnimationFrame(handleAnimation);
  }
}

customElements.define('menu-drawer', MenuDrawer);

class HeaderDrawer extends MenuDrawer {
  constructor() {
    super();
  }

  openMenuDrawer(summaryElement) {
    this.header = this.header || document.getElementById('shopify-section-header');
    this.borderOffset = this.borderOffset || this.closest('.header-wrapper').classList.contains('header-wrapper--border-bottom') ? 1 : 0;
    document.documentElement.style.setProperty('--header-bottom-position', `${parseInt(this.header.getBoundingClientRect().bottom - this.borderOffset)}px`);

    setTimeout(() => {
      this.mainDetailsToggle.classList.add('menu-opening');
    });

    summaryElement.setAttribute('aria-expanded', true);
    trapFocus(this.mainDetailsToggle, summaryElement);
    document.body.classList.add(`overflow-hidden-${this.dataset.breakpoint}`);
  }
}

customElements.define('header-drawer', HeaderDrawer);

class ModalDialog extends HTMLElement {
  constructor() {
    super();
    this.querySelector('[id^="ModalClose-"]').addEventListener(
      'click',
      this.hide.bind(this)
    );
    this.addEventListener('keyup', (event) => {
      if (event.code.toUpperCase() === 'ESCAPE') this.hide();
    });
    if (this.classList.contains('media-modal')) {
      this.addEventListener('pointerup', (event) => {
        if (event.pointerType === 'mouse' && !event.target.closest('deferred-media, product-model')) this.hide();
      });
    } else {
      this.addEventListener('click', (event) => {
        if (event.target.nodeName === 'MODAL-DIALOG') this.hide();
      });
    }
  }

  show(opener) {
    this.openedBy = opener;
    const popup = this.querySelector('.template-popup');
    document.body.classList.add('overflow-hidden');
    this.setAttribute('open', '');
    if (popup) popup.loadContent();
    trapFocus(this, this.querySelector('[role="dialog"]'));
    window.pauseAllMedia();
  }

  hide() {
    document.body.classList.remove('overflow-hidden');
    this.removeAttribute('open');
    removeTrapFocus(this.openedBy);
    window.pauseAllMedia();
  }
}
customElements.define('modal-dialog', ModalDialog);

class ModalOpener extends HTMLElement {
  constructor() {
    super();

    const button = this.querySelector('button');

    if (!button) return;
    button.addEventListener('click', () => {
      const modal = document.querySelector(this.getAttribute('data-modal'));
      if (modal) modal.show(button);
    });
  }
}
customElements.define('modal-opener', ModalOpener);

class DeferredMedia extends HTMLElement {
  constructor() {
    super();
    const poster = this.querySelector('[id^="Deferred-Poster-"]');
    if (!poster) return;
    poster.addEventListener('click', this.loadContent.bind(this));
  }

  loadContent(focus = true) {
    window.pauseAllMedia();
    if (!this.getAttribute('loaded')) {
      const content = document.createElement('div');
      content.appendChild(this.querySelector('template').content.firstElementChild.cloneNode(true));

      this.setAttribute('loaded', true);
      const deferredElement = this.appendChild(content.querySelector('video, model-viewer, iframe'));
      if (focus) deferredElement.focus();
    }
  }
}

customElements.define('deferred-media', DeferredMedia);

class SliderComponent extends HTMLElement {
  constructor() {
    super();
    this.slider = this.querySelector('[id^="Slider-"]');
    this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
    this.enableSliderLooping = false;
    this.currentPageElement = this.querySelector('.slider-counter--current');
    this.pageTotalElement = this.querySelector('.slider-counter--total');
    this.prevButton = this.querySelector('button[name="previous"]');
    this.nextButton = this.querySelector('button[name="next"]');

    if (!this.slider || !this.nextButton) return;

    this.initPages();
    const resizeObserver = new ResizeObserver(entries => this.initPages());
    resizeObserver.observe(this.slider);

    this.slider.addEventListener('scroll', () => { this.initPages() });
    this.prevButton.addEventListener('click', this.onButtonClick.bind(this));
    this.nextButton.addEventListener('click', this.onButtonClick.bind(this));
  }

  initPages() {
    this.sliderItemsToShow = Array.from(this.sliderItems).filter(element => element.clientWidth > 0);
    this.sliderLastItem = this.sliderItemsToShow[this.sliderItemsToShow.length - 1];
    if (this.sliderItemsToShow.length === 0) return;
    this.slidesPerPage = Math.floor(this.slider.clientWidth / this.sliderItemsToShow[0].clientWidth);
    this.totalPages = this.sliderItemsToShow.length - this.slidesPerPage + 1;
    this.update();
  }

  resetPages() {
    this.sliderItems = this.querySelectorAll('[id^="Slide-"]');
    this.initPages();
  }

  update() {
    const previousPage = this.currentPage;
    this.currentPage = Math.round(this.slider.scrollLeft / this.sliderLastItem.clientWidth) + 1;
    if (this.currentPageElement && this.pageTotalElement) {
      this.currentPageElement.textContent = this.currentPage;
      this.pageTotalElement.textContent = this.totalPages;
    }
    if (this.currentPage != previousPage) {
      this.dispatchEvent(new CustomEvent('slideChanged', {
        detail: {
          currentPage: this.currentPage,
          currentElement: this.sliderItemsToShow[this.currentPage - 1]
        }
      }));
    }

    if (this.enableSliderLooping) return;

    if (this.isSlideVisible(this.sliderItemsToShow[0])) {
      this.prevButton.setAttribute('disabled', 'disabled');
    } else {
      this.prevButton.removeAttribute('disabled');
    }

    if (this.isSlideVisible(this.sliderLastItem)) {
      this.nextButton.setAttribute('disabled', 'disabled');
    } else {
      this.nextButton.removeAttribute('disabled');
    }
  }

  isSlideVisible(element, offset = 0) {
    const lastVisibleSlide = this.slider.clientWidth + this.slider.scrollLeft - offset;
    return (element.offsetLeft + element.clientWidth) <= lastVisibleSlide && element.offsetLeft >= this.slider.scrollLeft;
  }

  onButtonClick(event) {
    event.preventDefault();
    const step = event.currentTarget.dataset.step || 1;
    this.slideScrollPosition = event.currentTarget.name === 'next' ? this.slider.scrollLeft + (step * this.sliderLastItem.clientWidth) : this.slider.scrollLeft - (step * this.sliderLastItem.clientWidth);
    this.slider.scrollTo({
      left: this.slideScrollPosition
    });
  }
}

customElements.define('slider-component', SliderComponent);

class SlideshowComponent extends SliderComponent {
  constructor() {
    super();
    this.sliderControlWrapper = this.querySelector('.slider-buttons');
    this.enableSliderLooping = true;

    if (!this.sliderControlWrapper) return;

    this.sliderFirstItemNode = this.slider.querySelector('.slideshow__slide');
    if (this.sliderItemsToShow.length > 0) this.currentPage = 1;

    this.sliderControlLinksArray = Array.from(this.sliderControlWrapper.querySelectorAll('.slider-counter__link'));
    this.sliderControlLinksArray.forEach(link => link.addEventListener('click', this.linkToSlide.bind(this)));
    this.slider.addEventListener('scroll', this.setSlideVisibility.bind(this));
    this.setSlideVisibility();

    if (this.slider.getAttribute('data-autoplay') === 'true') this.setAutoPlay();
  }

  setAutoPlay() {
    this.sliderAutoplayButton = this.querySelector('.slideshow__autoplay');
    this.autoplaySpeed = this.slider.dataset.speed * 1000;

    this.sliderAutoplayButton.addEventListener('click', this.autoPlayToggle.bind(this));
    this.addEventListener('mouseover', this.focusInHandling.bind(this));
    this.addEventListener('mouseleave', this.focusOutHandling.bind(this));
    this.addEventListener('focusin', this.focusInHandling.bind(this));
    this.addEventListener('focusout', this.focusOutHandling.bind(this));

    this.play();
    this.autoplayButtonIsSetToPlay = true;
  }

  onButtonClick(event) {
    super.onButtonClick(event);
    const isFirstSlide = this.currentPage === 1;
    const isLastSlide = this.currentPage === this.sliderItemsToShow.length;

    if (!isFirstSlide && !isLastSlide) return;

    if (isFirstSlide && event.currentTarget.name === 'previous') {
      this.slideScrollPosition = this.slider.scrollLeft + this.sliderFirstItemNode.clientWidth * this.sliderItemsToShow.length;
    } else if (isLastSlide && event.currentTarget.name === 'next') {
      this.slideScrollPosition = 0;
    }
    this.slider.scrollTo({
      left: this.slideScrollPosition
    });
  }

  update() {
    super.update();
    this.sliderControlButtons = this.querySelectorAll('.slider-counter__link');
    this.prevButton.removeAttribute('disabled');

    if (!this.sliderControlButtons.length) return;

    this.sliderControlButtons.forEach(link => {
      link.classList.remove('slider-counter__link--active');
      link.removeAttribute('aria-current');
    });
    this.sliderControlButtons[this.currentPage - 1].classList.add('slider-counter__link--active');
    this.sliderControlButtons[this.currentPage - 1].setAttribute('aria-current', true);
  }

  autoPlayToggle() {
    this.togglePlayButtonState(this.autoplayButtonIsSetToPlay);
    this.autoplayButtonIsSetToPlay ? this.pause() : this.play();
    this.autoplayButtonIsSetToPlay = !this.autoplayButtonIsSetToPlay;
  }

  focusOutHandling(event) {
    const focusedOnAutoplayButton = event.target === this.sliderAutoplayButton || this.sliderAutoplayButton.contains(event.target);
    if (!this.autoplayButtonIsSetToPlay || focusedOnAutoplayButton) return;
    this.play();
  }

  focusInHandling(event) {
    const focusedOnAutoplayButton = event.target === this.sliderAutoplayButton || this.sliderAutoplayButton.contains(event.target);
    if (focusedOnAutoplayButton && this.autoplayButtonIsSetToPlay) {
      this.play();
    } else if (this.autoplayButtonIsSetToPlay) {
      this.pause();
    }
  }

  play() {
    this.slider.setAttribute('aria-live', 'off');
    clearInterval(this.autoplay);
    this.autoplay = setInterval(this.autoRotateSlides.bind(this), this.autoplaySpeed);
  }

  pause() {
    this.slider.setAttribute('aria-live', 'polite');
    clearInterval(this.autoplay);
  }

  togglePlayButtonState(pauseAutoplay) {
    if (pauseAutoplay) {
      this.sliderAutoplayButton.classList.add('slideshow__autoplay--paused');
      this.sliderAutoplayButton.setAttribute('aria-label', window.accessibilityStrings.playSlideshow);
    } else {
      this.sliderAutoplayButton.classList.remove('slideshow__autoplay--paused');
      this.sliderAutoplayButton.setAttribute('aria-label', window.accessibilityStrings.pauseSlideshow);
    }
  }

  autoRotateSlides() {
    const slideScrollPosition = this.currentPage === this.sliderItems.length ? 0 : this.slider.scrollLeft + this.slider.querySelector('.slideshow__slide').clientWidth;
    this.slider.scrollTo({
      left: slideScrollPosition
    });
  }

  setSlideVisibility() {
    this.sliderItemsToShow.forEach((item, index) => {
      const button = item.querySelector('a');
      if (index === this.currentPage - 1) {
        if (button) button.removeAttribute('tabindex');
        item.setAttribute('aria-hidden', 'false');
        item.removeAttribute('tabindex');
      } else {
        if (button) button.setAttribute('tabindex', '-1');
        item.setAttribute('aria-hidden', 'true');
        item.setAttribute('tabindex', '-1');
      }
    });
  }

  linkToSlide(event) {
    event.preventDefault();
    const slideScrollPosition = this.slider.scrollLeft + this.sliderFirstItemNode.clientWidth * (this.sliderControlLinksArray.indexOf(event.currentTarget) + 1 - this.currentPage);
    this.slider.scrollTo({
      left: slideScrollPosition
    });
  }
}

customElements.define('slideshow-component', SlideshowComponent);

class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.addEventListener('change', this.onVariantChange);
  }

  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, '', false);
    this.updatePickupAvailability();
    this.removeErrorMessage();

    if (!this.currentVariant) {
      this.toggleAddButton(true, '', true);
      this.setUnavailable();
    } else {
      this.updateMedia();
      this.updateURL();
      this.updateVariantInput();
      this.renderProductInfo();
      this.updateShareUrl();
    }
  }

  updateOptions() {
    this.options = Array.from(this.querySelectorAll('select'), (select) => select.value);
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options.map((option, index) => {
        return this.options[index] === option;
      }).includes(false);
    });
  }

  updateMedia() {
    if (!this.currentVariant) return;
    if (!this.currentVariant.featured_media) return;

    const mediaGallery = document.getElementById(`MediaGallery-${this.dataset.section}`);
    if (!this.currentVariant.option1) {
      //
    } else {
      document.querySelectorAll(".product-form__selected-value")[0].innerText = this.currentVariant.option1
    }
    if (!this.currentVariant.option2) {
      //
    } else {
      document.querySelectorAll(".product-form__selected-value")[1].innerText = this.currentVariant.option2
    }
    if (this.currentVariant.featured_media.alt) {

      if (!mediaGallery) {
        document.querySelector(".ny-product-img").src = this.currentVariant.featured_media.preview_image.src
        return
      }
      mediaGallery.setActiveMedia(`${this.dataset.section}-${this.currentVariant.featured_media.alt}`, null, true);
    } else {
      mediaGallery.setActiveMedia(null, `${this.dataset.section}-${this.currentVariant.featured_media.id}`, true);
    }

    const modalContent = document.querySelector(`#ProductModal-${this.dataset.section} .product-media-modal__content`);
    const newMediaModal = modalContent.querySelector(`[data-media-id="${this.currentVariant.featured_media.id}"]`);
    modalContent.prepend(newMediaModal);
  }

  updateURL() {
    if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
    window.history.replaceState({}, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateShareUrl() {
    const shareButton = document.getElementById(`Share-${this.dataset.section}`);
    if (!shareButton) return;
    shareButton.updateUrl(`${window.shopUrl}${this.dataset.url}?variant=${this.currentVariant.id}`);
  }

  updateVariantInput() {
    const productForms = document.querySelectorAll(`#product-form-${this.dataset.section}, #product-form-installment`);
    productForms.forEach((productForm) => {
      const input = productForm.querySelector('input[name="id"]');
      input.value = this.currentVariant.id;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  updatePickupAvailability() {
    const pickUpAvailability = document.querySelector('pickup-availability');
    if (!pickUpAvailability) return;

    if (this.currentVariant && this.currentVariant.available) {
      pickUpAvailability.fetchAvailability(this.currentVariant.id);
    } else {
      pickUpAvailability.removeAttribute('available');
      pickUpAvailability.innerHTML = '';
    }
  }

  removeErrorMessage() {
    const section = this.closest('section');
    if (!section) return;

    const productForm = section.querySelector('product-form');
    if (productForm) productForm.handleErrorMessage();
  }

  renderProductInfo() {
    fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
      .then((response) => response.text())
      .then((responseText) => {
        const id = `price-${this.dataset.section}`;
        const html = new DOMParser().parseFromString(responseText, 'text/html')
        const destination = document.getElementById(id);
        const source = html.getElementById(id);

        if (source && destination) destination.innerHTML = source.innerHTML;

        const price = document.getElementById(`price-${this.dataset.section}`);

        if (price) price.classList.remove('visibility-hidden');
        this.toggleAddButton(!this.currentVariant.available, window.variantStrings.soldOut);
      });
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const productForm = document.getElementById(`product-form-${this.dataset.section}`);
    if (!productForm) return;
    const addButton = productForm.querySelector('[name="add"]');
    const addButtonText = productForm.querySelector('[name="add"] > span');

    if (!addButton) return;

    if (disable) {
      addButton.setAttribute('disabled', 'disabled');
      if (text) addButtonText.textContent = text;
    } else {
      addButton.removeAttribute('disabled');
      addButtonText.textContent = window.variantStrings.addToCart;
    }

    if (!modifyClass) return;
  }

  setUnavailable() {
    const button = document.getElementById(`product-form-${this.dataset.section}`);
    const addButton = button.querySelector('[name="add"]');
    const addButtonText = button.querySelector('[name="add"] > span');
    const price = document.getElementById(`price-${this.dataset.section}`);
    if (!addButton) return;
    addButtonText.textContent = window.variantStrings.unavailable;
    if (price) price.classList.add('visibility-hidden');
  }

  getVariantData() {
    this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
}

customElements.define('variant-selects', VariantSelects);

class VariantRadios extends VariantSelects {
  constructor() {
    super();
  }

  updateOptions() {
    const fieldsets = Array.from(this.querySelectorAll('fieldset'));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
    });
  }
}

customElements.define('variant-radios', VariantRadios);
class ProductDetail extends HTMLElement {
  constructor() {
    super()
    this.timer = 0
    this.elements = {
      addColleNode: this.querySelector('.add-collect'),
      removeColleNode: this.querySelector('.remove-collect')
    }
    this.setupEventListeners()
    this.onload()
  }
  setupEventListeners() {
    this.elements.addColleNode && this.elements.addColleNode.addEventListener('click', this.handleRemove)
    this.elements.removeColleNode && this.elements.removeColleNode.addEventListener('click', this.handleAdd)
  }
  onload() {
    const id = this.elements.removeColleNode.getAttribute("data-id")
    var searchData = {
      customerId: customerId,
      productIds: [id]
    }

    if (customerId) {
      postData("customerCollectionProduct/selectProductIsCollection", searchData)
        .then(res => {
          if (res.success) {
            this.elements.addColleNode.parentElement.style.display = 'flex'
            if (res.data[0].isCollection) {
              this.elements.addColleNode.style.display = 'block'
              this.elements.removeColleNode.style.display = "none"
            } else {
              this.elements.addColleNode.style.display = 'none'
              this.elements.removeColleNode.style.display = "block"
            }
          }
        });
    } else {
      this.elements.removeColleNode.style.display = 'block'
      this.elements.removeColleNode.parentElement.style.display = 'flex'
    }
  }

  handleRemove() {
    const newTime = Date.parse(new Date())
    if (newTime - this.timer < 2000) {
      return
    }
    this.timer = newTime
    var collectData = {
      customerId: customerId,
      productId: this.getAttribute('data-id'),
      productSpu: this.getAttribute('data-spu')
    }
    postData("customerCollectionProduct/collectionProduct", collectData)
      .then(res => {
        if (res.success) {
          this.style.display = 'none'
          this.previousElementSibling.style.display = "block"
          // item.parentElement.lastElementChild.innerText = +(item.parentElement.lastElementChild.innerText) - 1
          const text = document.querySelector(".header__icon--collect span").innerText
          if (+(text) - 1 === 0) {
            document.querySelector(".header__icon--collect span").innerText = ""
            document.querySelector(".header__icon--collect span").style.display = "none"
            return
          }
          document.querySelector(".header__icon--collect span").innerText = +(text) - 1
        }
      });
  }

  handleAdd() {
    if (customerId) {
      const newTime = Date.parse(new Date())
      if (newTime - this.timer < 2000) {
        return
      }
      this.timer = newTime
      var collectData = {
        customerId: customerId,
        productId: this.getAttribute('data-id'),
        productSpu: this.getAttribute('data-spu')
      }

      postData("customerCollectionProduct/collectionProduct", collectData)
        .then(res => {
          if (res.success) {
            this.style.display = 'none'
            this.nextElementSibling.style.display = "block"
            // item.parentElement.lastElementChild.innerText = +(item.parentElement.lastElementChild.innerText) + 1
            const text = document.querySelector(".header__icon--collect span").innerText
            if (!text) {
              document.querySelector(".header__icon--collect span").innerText = 1
              document.querySelector(".header__icon--collect span").style.display = "flex"
              return
            }
            document.querySelector(".header__icon--collect span").innerText = +(text) + 1
          }
        });
    } else {
      document.querySelector('.ld-dialog').style.animation = "myOpacity0 .3s"
      document.querySelector(".mask").style.display = "block"
      document.querySelector(".ld-hint").style.display = "block"
      bodyScroll()
      setTimeout(() => {
        document.querySelector(".ld-hint").style.display = "none"
      }, 2000)
    }
  }
}
customElements.define('product-detail', ProductDetail)
class ProductItem extends HTMLElement {
  constructor() {
    super()
    this.timer = 0
    this.elements = {
      colorSelector: this.querySelector('.color-selector'),
      cardMedia: this.querySelector('.card__media'),
      cartNode: this.querySelector('.ny-icon-cart'),
      addColleNode: this.querySelector('.add-collect'),
      removeColleNode: this.querySelector('.remove-collect')
    }
    this.setupEventListeners()
    // this.handleColorActive()
    this.onload()
  }

  setupEventListeners() {
    this.elements.colorSelector && this.elements.colorSelector.addEventListener('click', this.handleColorSelector)
    this.elements.cartNode && this.elements.cartNode.addEventListener('click', this.handleQuickView)
    this.elements.addColleNode && this.elements.addColleNode.addEventListener('click', this.handleRemove)
    this.elements.removeColleNode && this.elements.removeColleNode.addEventListener('click', this.handleAdd)
  }
  onload() {
    const id = this.elements.removeColleNode.getAttribute("data-id")
    var searchData = {
      customerId: customerId,
      productIds: [id]
    }

    if (customerId) {
      postData("customerCollectionProduct/selectProductIsCollection", searchData)
        .then(res => {
          if (res.success) {
            this.elements.addColleNode.parentElement.style.display = 'flex'
            if (res.data[0].isCollection) {
              this.elements.addColleNode.style.display = 'block'
              this.elements.removeColleNode.style.display = "none"
            } else {
              this.elements.addColleNode.style.display = 'none'
              this.elements.removeColleNode.style.display = "block"
            }
          }
        });
    } else {
      this.elements.removeColleNode.style.display = 'block'
      this.elements.removeColleNode.parentElement.style.display = 'flex'
    }
  }

  handleColorSelector = (e) => {
    if (e.target.className.indexOf('color-item') > -1) {
      let newHref = window.location.origin + '/products/' + this.elements.cardMedia.querySelector('a').dataset.handle
      // if (e.target.title === 'more') {
      //   window.location.href = newHref
      // } else {
      let variantObj = e.target.dataset
      this.elements.cardMedia.querySelector('a').href = newHref + `?variant=${variantObj.variantId}`
      let img = this.elements.cardMedia.querySelector('img')
      img.setAttribute('data-media-id', variantObj.mediaId);
      if (this.handleColorActive()) {
        img.style.opacity = 0
        img.style.transition = "opacity .2s ease-in-out,visibility .2s ease-in-out;"
        img.src = variantObj.variantSrc
        img.srcset = variantObj.variantSrcset
        img.sizes = variantObj.svariantSizes
        img.alt = variantObj.variantAlt
        img.width = variantObj.variantWidth
        img.height = variantObj.variantHeight
        img.onload = function (e) {
          e.stopPropagation();
          img.style.opacity = 1
        }
      }
      // }
    }
  }

  handleColorActive() {
    let activeEl = this.elements.colorSelector && this.elements.colorSelector.querySelector('.color--active')
    activeEl && activeEl.classList.remove('color--active')
    if (!this.elements.cardMedia) {
      return
    }
    let img = this.elements.cardMedia.querySelector('img')
    let imgMediaId = img.dataset.mediaId
    let imgList = this.elements.colorSelector.querySelectorAll('img[data-media-id]')
    for (let i = 0; i < imgList.length; i++) {
      if (imgList[i].dataset.mediaId === imgMediaId) {
        imgList[i].parentElement.classList.add('color--active')
        return true
      }
    }
  }
  handleQuickView() {
    document.querySelector('.view-inner').style.animation = "myOpacity0 .3s"
    const url = this.getAttribute('data-product-url').split("?")[0];
    fetch("".concat(url, "?view=quick-view"), {
      credentials: 'same-origin',
      method: 'GET'
    }).then(function (response) {
      response.text().then(function (content) {
        document.querySelector('.view-inner').insertAdjacentHTML('beforeEnd', content);
        document.querySelector(".openQuickView").style.display = "block"
        bodyScroll()
      });
    });
  }

  handleRemove() {
    const newTime = Date.parse(new Date())
    if (newTime - this.timer < 2000) {
      return
    }
    this.timer = newTime
    var collectData = {
      customerId: customerId,
      productId: this.getAttribute('data-id'),
      productSpu: this.getAttribute('data-spu')
    }
    postData("customerCollectionProduct/collectionProduct", collectData)
      .then(res => {
        if (res.success) {
          this.style.display = 'none'
          this.previousElementSibling.style.display = "block"
          // item.parentElement.lastElementChild.innerText = +(item.parentElement.lastElementChild.innerText) - 1
          const text = document.querySelector(".header__icon--collect span").innerText
          if (+(text) - 1 === 0) {
            document.querySelector(".header__icon--collect span").innerText = ""
            document.querySelector(".header__icon--collect span").style.display = "none"
            return
          }
          document.querySelector(".header__icon--collect span").innerText = +(text) - 1
        }
      });
  }

  handleAdd() {
    if (customerId) {
      const newTime = Date.parse(new Date())
      if (newTime - this.timer < 2000) {
        return
      }
      this.timer = newTime
      var collectData = {
        customerId: customerId,
        productId: this.getAttribute('data-id'),
        productSpu: this.getAttribute('data-spu')
      }

      postData("customerCollectionProduct/collectionProduct", collectData)
        .then(res => {
          if (res.success) {
            this.style.display = 'none'
            this.nextElementSibling.style.display = "block"
            // item.parentElement.lastElementChild.innerText = +(item.parentElement.lastElementChild.innerText) + 1
            const text = document.querySelector(".header__icon--collect span").innerText
            if (!text) {
              document.querySelector(".header__icon--collect span").innerText = 1
              document.querySelector(".header__icon--collect span").style.display = "flex"
              return
            }
            document.querySelector(".header__icon--collect span").innerText = +(text) + 1
          }
        });
    } else {
      document.querySelector('.ld-dialog').style.animation = "myOpacity0 .3s"
      document.querySelector(".mask").style.display = "block"
      document.querySelector(".ld-hint").style.display = "block"
      bodyScroll()
      setTimeout(() => {
        document.querySelector(".ld-hint").style.display = "none"
      }, 2000)
    }
  }
}

customElements.define('product-item', ProductItem)
window.getFormatDate = function getFormatDate() {
  //获得当前运行环境时间
  let d = new Date();
  let currentDate = new Date();
  let tmpHours = currentDate.getHours();
  //算得时区
  let time_zone = -d.getTimezoneOffset() / 60;
  if (time_zone < 0) {
    time_zone = Math.abs(time_zone) + 8;
    currentDate.setHours(tmpHours + time_zone);
  } else {
    time_zone -= 8;
    currentDate.setHours(tmpHours - time_zone);
  }
  let Y = currentDate.getFullYear();
  let M = (currentDate.getMonth() + 1 < 10 ? '0' + (currentDate.getMonth() + 1) : currentDate.getMonth() + 1);
  let D = currentDate.getDate() < 10 ? ('0' + currentDate.getDate()) : currentDate.getDate();
  let h = currentDate.getHours() < 10 ? ('0' + currentDate.getHours()) : currentDate.getHours();
  let m = currentDate.getMinutes() < 10 ? ('0' + currentDate.getMinutes()) : currentDate.getMinutes();
  let s = currentDate.getSeconds() < 10 ? ('0' + currentDate.getSeconds()) : currentDate.getSeconds();
  return Y + "-" + M + "-" + D + " " + h + ":" + m + ":" + s;
}
if (!customElements.get('pickup-availability')) {
  customElements.define('pickup-availability', class PickupAvailability extends HTMLElement {
    constructor() {
      super();

      if (!this.hasAttribute('available')) return;

      this.errorHtml = this.querySelector('template').content.firstElementChild.cloneNode(true);
      this.onClickRefreshList = this.onClickRefreshList.bind(this);
      this.fetchAvailability(this.dataset.variantId);
    }

    fetchAvailability(variantId) {
      let rootUrl = this.dataset.rootUrl;
      if (!rootUrl.endsWith("/")) {
        rootUrl = rootUrl + "/";
      }
      const variantSectionUrl = `${rootUrl}variants/${variantId}/?section_id=pickup-availability`;

      fetch(variantSectionUrl)
        .then(response => response.text())
        .then(text => {
          const sectionInnerHTML = new DOMParser()
            .parseFromString(text, 'text/html')
            .querySelector('.shopify-section');
          this.renderPreview(sectionInnerHTML);
        })
        .catch(e => {
          const button = this.querySelector('button');
          if (button) button.removeEventListener('click', this.onClickRefreshList);
          this.renderError();
        });
    }

    onClickRefreshList(evt) {
      this.fetchAvailability(this.dataset.variantId);
    }

    renderError() {
      this.innerHTML = '';
      this.appendChild(this.errorHtml);

      this.querySelector('button').addEventListener('click', this.onClickRefreshList);
    }

    renderPreview(sectionInnerHTML) {
      const drawer = document.querySelector('pickup-availability-drawer');
      if (drawer) drawer.remove();
      if (!sectionInnerHTML.querySelector('pickup-availability-preview')) {
        this.innerHTML = "";
        this.removeAttribute('available');
        return;
      }

      this.innerHTML = sectionInnerHTML.querySelector('pickup-availability-preview').outerHTML;
      this.setAttribute('available', '');

      document.body.appendChild(sectionInnerHTML.querySelector('pickup-availability-drawer'));

      const button = this.querySelector('button');
      if (button) button.addEventListener('click', (evt) => {
        document.querySelector('pickup-availability-drawer').show(evt.target);
      });
    }
  });
}

if (!customElements.get('pickup-availability-drawer')) {
  customElements.define('pickup-availability-drawer', class PickupAvailabilityDrawer extends HTMLElement {
    constructor() {
      super();

      this.onBodyClick = this.handleBodyClick.bind(this);

      this.querySelector('button').addEventListener('click', () => {
        this.hide();
      });

      this.addEventListener('keyup', () => {
        if (event.code.toUpperCase() === 'ESCAPE') this.hide();
      });
    }

    handleBodyClick(evt) {
      const target = evt.target;
      if (target != this && !target.closest('pickup-availability-drawer') && target.id != 'ShowPickupAvailabilityDrawer') {
        this.hide();
      }
    }

    hide() {
      this.removeAttribute('open');
      document.body.removeEventListener('click', this.onBodyClick);
      document.body.classList.remove('overflow-hidden');
      removeTrapFocus(this.focusElement);
    }

    show(focusElement) {
      this.focusElement = focusElement;
      this.setAttribute('open', '');
      document.body.addEventListener('click', this.onBodyClick);
      document.body.classList.add('overflow-hidden');
      trapFocus(this);
    }
  });
}
if (!customElements.get('product-form')) {
  customElements.define('product-form', class ProductForm extends HTMLElement {
    constructor() {
      super();

      this.form = this.querySelector('form');
      this.form.querySelector('[name=id]').disabled = false;
      this.form.addEventListener('submit', this.onSubmitHandler.bind(this));
      this.cartNotification = document.querySelector('cart-notification');
    }

    onSubmitHandler(evt) {
      evt.preventDefault();
      const submitButton = this.querySelector('[type="submit"]');
      if (submitButton.classList.contains('loading')) return;

      this.handleErrorMessage();
      this.cartNotification.setActiveElement(document.activeElement);

      submitButton.setAttribute('aria-disabled', true);
      submitButton.classList.add('loading');
      this.querySelector('.loading-overlay__spinner').classList.remove('hidden');

      const config = fetchConfig('javascript');
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
      delete config.headers['Content-Type'];

      const formData = new FormData(this.form);
      formData.append('sections', this.cartNotification.getSectionsToRender().map((section) => section.id));
      formData.append('sections_url', window.location.pathname);
      config.body = formData;

      fetch(`${routes.cart_add_url}`, config)
        .then((response) => response.json())
        .then((response) => {
          if (response.status) {
            this.handleErrorMessage(response.description);
            return;
          }

          this.cartNotification.renderContents(response);
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          submitButton.classList.remove('loading');
          submitButton.removeAttribute('aria-disabled');
          this.querySelector('.loading-overlay__spinner').classList.add('hidden');
        });
    }

    handleErrorMessage(errorMessage = false) {
      this.errorMessageWrapper = this.errorMessageWrapper || this.querySelector('.product-form__error-message-wrapper');
      this.errorMessage = this.errorMessage || this.errorMessageWrapper.querySelector('.product-form__error-message');

      this.errorMessageWrapper.toggleAttribute('hidden', !errorMessage);

      if (errorMessage) {
        this.errorMessage.textContent = errorMessage;
      }
    }
  });
}

if (!customElements.get('media-gallery')) {
  customElements.define('media-gallery', class MediaGallery extends HTMLElement {
    constructor() {
      super();
      this.elements = {
        liveRegion: this.querySelector('[id^="GalleryStatus"]'),
        viewer: this.querySelector('[id^="GalleryViewer"]'),
        thumbnails: this.querySelector('[id^="GalleryThumbnails"]')
      }
      this.mql = window.matchMedia('(min-width: 750px)');
      if (!this.elements.thumbnails) return;

      this.elements.viewer.addEventListener('slideChanged', debounce(this.onSlideChanged.bind(this), 500));
      this.elements.thumbnails.querySelectorAll('[data-target]').forEach((mediaToSwitch) => {
        mediaToSwitch.querySelector('button').addEventListener('click', this.setActiveMedia.bind(this, mediaToSwitch.dataset.target, false));
      });
      if (this.dataset.desktopLayout !== 'stacked' && this.mql.matches) this.removeListSemantic();
    }

    onSlideChanged(event) {
      const thumbnail = this.elements.thumbnails.querySelector(`[data-target="${event.detail.currentElement.dataset.mediaId}"]`);
      this.setActiveThumbnail(thumbnail);
    }

    setActiveMedia(mediaAlt, mediaId, prepend) {
      if (mediaAlt) {
        const activeMedia = this.elements.viewer.querySelectorAll(`[data-media-id="${mediaAlt}"]`);
        this.elements.viewer.querySelectorAll('[data-media-id]').forEach((element) => {
          element.classList.remove('ld-active');
        });
        activeMedia.forEach((element) => {
          element.classList.add('ld-active');
        });
      }
      if (mediaId) {
        const activeMedia = this.elements.viewer.querySelector(`[data-media-id="${mediaId}"]`);
        this.elements.viewer.querySelectorAll('[data-media-id]').forEach((element) => {
          element.classList.remove('is-active');
        });
        activeMedia.classList.add('is-active');

        if (prepend) {
          activeMedia.parentElement.prepend(activeMedia);
          if (this.elements.thumbnails) {
            const activeThumbnail = this.elements.thumbnails.querySelector(`[data-target="${mediaId}"]`);
            activeThumbnail.parentElement.prepend(activeThumbnail);
          }
          if (this.elements.viewer.slider) this.elements.viewer.resetPages();
        }

        this.preventStickyHeader();
        window.setTimeout(() => {
          if (this.elements.thumbnails) {
            activeMedia.parentElement.scrollTo({ left: activeMedia.offsetLeft });
          }
          if (!this.elements.thumbnails || this.dataset.desktopLayout === 'stacked') {
            activeMedia.scrollIntoView({ behavior: 'smooth' });
          }
        });
        this.playActiveMedia(activeMedia);

        if (!this.elements.thumbnails) return;
        const activeThumbnail = this.elements.thumbnails.querySelector(`[data-target="${mediaId}"]`);
        this.setActiveThumbnail(activeThumbnail);
        this.announceLiveRegion(activeMedia, activeThumbnail.dataset.mediaPosition);
      }

    }

    setActiveThumbnail(thumbnail) {
      if (!this.elements.thumbnails || !thumbnail) return;

      this.elements.thumbnails.querySelectorAll('button').forEach((element) => element.removeAttribute('aria-current'));
      thumbnail.querySelector('button').setAttribute('aria-current', true);
      if (this.elements.thumbnails.isSlideVisible(thumbnail, 10)) return;

      this.elements.thumbnails.slider.scrollTo({ left: thumbnail.offsetLeft });
    }

    announceLiveRegion(activeItem, position) {
      const image = activeItem.querySelector('.product__modal-opener--image img');
      if (!image) return;
      image.onload = () => {
        this.elements.liveRegion.setAttribute('aria-hidden', false);
        this.elements.liveRegion.innerHTML = window.accessibilityStrings.imageAvailable.replace(
          '[index]',
          position
        );
        setTimeout(() => {
          this.elements.liveRegion.setAttribute('aria-hidden', true);
        }, 2000);
      };
      image.src = image.src;
    }

    playActiveMedia(activeItem) {
      window.pauseAllMedia();
      const deferredMedia = activeItem.querySelector('.deferred-media');
      if (deferredMedia) deferredMedia.loadContent(false);
    }

    preventStickyHeader() {
      this.stickyHeader = this.stickyHeader || document.querySelector('sticky-header');
      if (!this.stickyHeader) return;
      this.stickyHeader.dispatchEvent(new Event('preventHeaderReveal'));
    }

    removeListSemantic() {
      if (!this.elements.viewer.slider) return;
      this.elements.viewer.slider.setAttribute('role', 'presentation');
      this.elements.viewer.sliderItems.forEach(slide => slide.setAttribute('role', 'presentation'));
    }
  });
}
