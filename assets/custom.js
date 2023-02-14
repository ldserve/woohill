/**
 * Include your custom JavaScript here.
 *
 * We also offer some hooks so you can plug your own logic. For instance, if you want to be notified when the variant
 * changes on product page, you can attach a listener to the document:
 *
 * document.addEventListener('variant:changed', function(event) {
 *   var variant = event.detail.variant; // Gives you access to the whole variant details
 * });
 *
 * You can also add a listener whenever a product is added to the cart:
 *
 * document.addEventListener('product:added', function(event) {
 *   var variant = event.detail.variant; // Get the variant that was added
 *   var quantity = event.detail.quantity; // Get the quantity that was added
 * });
 *
 * If you are an app developer and requires the theme to re-render the mini-cart, you can trigger your own event. If
 * you are adding a product, you need to trigger the "product:added" event, and make sure that you pass the quantity
 * that was added so the theme can properly update the quantity:
 *
 * document.documentElement.dispatchEvent(new CustomEvent('product:added', {
 *   bubbles: true,
 *   detail: {
 *     quantity: 1
 *   }
 * }));
 *
 * If you just want to force refresh the mini-cart without adding a specific product, you can trigger the event
 * "cart:refresh" in a similar way (in that case, passing the quantity is not necessary):
 *
 * document.documentElement.dispatchEvent(new CustomEvent('cart:refresh', {
 *   bubbles: true
 * }));
 */
function ready(fn){

    if(document.addEventListener) {
        document.addEventListener('DOMContentLoaded', function() {
            document.removeEventListener('DOMContentLoaded',arguments.callee, false);
            fn();
        }, false);
    }

    // 如果IE
    else if(document.attachEvent) {
        // 确保当页面是在iframe中加载时，事件依旧会被安全触发
        document.attachEvent('onreadystatechange', function() {
            if(document.readyState == 'complete') {
                document.detachEvent('onreadystatechange', arguments.callee);
                fn();
            }
        });

        // 如果是IE且页面不在iframe中时，轮询调用doScroll 方法检测DOM是否加载完毕
        if(document.documentElement.doScroll && typeof window.frameElement === "undefined") {
            try{
                document.documentElement.doScroll('left');
            }
            catch(error){
                return setTimeout(arguments.callee, 20);
            };
            fn();
        }
    }
}
window.handleCartTimeReserved = function handleCartTimeReserved() {
    try {
        var maxtime = sessionStorage.getItem('cartNumBefore') != sessionStorage.getItem('cartNumAfter') ? 20*60 : sessionStorage.getItem('cartTimeReservedMaxtime')
        sessionStorage.setItem('cartNumBefore',sessionStorage.getItem('cartNumAfter'))
        let headerBox = document.querySelector('.header__cart__time_reserved')
        let mainCartBox = document.querySelector('.main__cart__time_reserved')
        let mainCartBoxText = mainCartBox && mainCartBox.querySelector('.main__cart__time_reserved_text')
        if (sessionStorage.getItem('cartNumAfter') > 0) {
            window.clearInterval(window.cartTimeReserved);
            window.cartTimeReserved = null;
            window.cartTimeReserved = setInterval(function () {
                if (maxtime >= 1) {
                    let minutes = Math.floor(maxtime / 60);
                    let seconds = Math.floor(maxtime % 60) <= 9 ? '0' + Math.floor(maxtime % 60) : Math.floor(maxtime % 60)
                    headerBox.innerHTML = minutes + ":" + seconds
                    mainCartBoxText ? mainCartBoxText.innerHTML = minutes + ":" + seconds : ''
                    headerBox.style.display = 'inline-flex'
                    mainCartBox ? mainCartBox.style.display = 'flex' : ''
                    --maxtime;
                    sessionStorage.setItem('cartTimeReservedMaxtime', maxtime)
                } else {
                    headerBox.style.display = 'none'
                    mainCartBox ? mainCartBox.style.display = 'none' : ''
                    window.clearInterval(window.cartTimeReserved);
                    window.cartTimeReserved = null;
                    sessionStorage.setItem('cartTimeReservedMaxtime', maxtime)
                }
            }, 1000);
        } else {
            headerBox.style.display = 'none'
            mainCartBox ? mainCartBox.style.display = 'none' : ''
            window.clearInterval(window.cartTimeReserved);
            window.cartTimeReserved = null;
            sessionStorage.setItem('cartTimeReservedMaxtime', maxtime)
        }
    } catch (e) {

    }
}
ready(window.handleCartTimeReserved)
/*回到顶部*/
~function (){
  let gotop=document.querySelector('#gotop');
  function throttle(method,delay){
    var timer=null;
    return function(){
      var context=this;
      var args=arguments;
      clearTimeout(timer);
      timer=setTimeout(function(){
        method.apply(context,args);
      },delay);
    }
  }
  function  show(){
    if(window.scrollY>1500){
      gotop.style.display="block";
    }
    if(window.scrollY<=1500){
      gotop.style.display="none";
    }
  }
  window.addEventListener('scroll',throttle(show,500))
  gotop.onclick=function () {
    let end=0;
    let start=window.scrollY;
    let step;
    let timer=setInterval(()=>{
     if(start>10){
       end=start-start/10
       window.scrollTo(0,end)
       start=end
     }else{
       window.scrollTo(0,0)
       clearInterval(timer);
       timer=null
     }
    },10);
  }
}()

