class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.isclose=false
    this.mainDetailsToggle = this.querySelector('details');
    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener('mouseleave', this.mouseClose.bind(this));
    this.mainDetailsToggle.addEventListener('mouseenter', this.mouseClose.bind(this));
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    })
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
  }
  mouseClose(e){
    this.isclose=e.type==='mouseleave'
    setTimeout(()=>{
      if(this.isclose)this.close();
    },200)
    
  }
}

customElements.define('details-disclosure', DetailsDisclosure);
