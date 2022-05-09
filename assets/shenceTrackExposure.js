var page_title = "OtherPage";
switch(window.theme.pageType) {
  case 'index': 
  page_title = "HomePage";
  break;
  case 'product':
  page_title = "ProductDetailPage";
  break;
  case 'collection':
  page_title = "CategoryListPage";
  break;
  case 'cart':
  page_title = "CartPage";
  break;
}
var startExposure = function () {
  var nodesLength = 0;
  var interval = setInterval(function() {
      var nodes = document.querySelectorAll(".shence_commodityView");
      if (nodes.length > nodesLength) {
        nodesLength = nodes.length;
        nodes.forEach(node => {
          if (node.getAttribute("data-bindexp") == "1") {
            intersectionObserver.observe(node);
            node.setAttribute("data-bindexp","0");
          }
      });
      } else {
        clearInterval(interval);
      }
  },1000)
  
}
sensors.quick('isReady', function () {
  startExposure();
})
function reportExposure(data) {
     if (data.original_price || data.original_price == '') {
        data.original_price = Number((data.original_price / 100).toFixed(2));
      }
      if (data.current_price || data.current_price == '') {
        data.current_price = Number((data.current_price / 100).toFixed(2));
      }
      if (data.discount_price) {
        data.discount_price = Number((data.discount_price / 100).toFixed(2));
      }
      if (data.bonus_amount) {
        data.bonus_amount = Number((data.bonus_amount / 100).toFixed(2));
      } if (data.order_amount) {
        data.order_amount = Number((data.order_amount / 100).toFixed(2));
      } if (data.order_commodity_original_amount) {
        data.order_commodity_original_amount = Number((data.order_commodity_original_amount / 100).toFixed(2));
      } if (data.order_logistics_fee) {
        data.order_logistics_fee = Number((data.order_logistics_fee / 100).toFixed(2));
      } if (data.order_discount_amount) {
        data.order_discount_amount = Number((data.order_discount_amount / 100).toFixed(2));
      } if (data.order_actual_amount) {
        data.order_actual_amount = Number((data.order_actual_amount / 100).toFixed(2));
      } if (data.discount_amount) {
        data.discount_amount = Number((data.discount_amount / 100).toFixed(2));
      } if (data.result_number) {
        data.result_number = Number(data.result_number);
      } if (data.tip_amount) {
        data.tip_amount = Number((data.tip_amount / 100).toFixed(2));
      } if (data.coupon_amount) {
        data.coupon_amount = Number((data.coupon_amount / 100).toFixed(2));
      }
      if(data.commodity_name) {
        data.commodity_name = data.commodity_name.replaceAll('-',' ');
      }
      if(data.commodity_spuid) {
        data.commodity_spuid = data.commodity_spuid.toLocaleUpperCase()
      }
      if(data.compliment_commodities && data.compliment_commodities.length > 0) {
        data.compliment_commodities.forEach(i => {
          i = i.toLocaleUpperCase()
        })
       }
       data.page_title = page_title;
      sensors.track('commodityView',data);
}
var options = {
  threshold: 0.5
}
/* 曝光监听 */
var intersectionObserver = new IntersectionObserver(intersectionCallback, options);
function intersectionCallback(entries) {
  entries.forEach(entry => {
    if (((document.documentElement.clientWidth < 980) || ((document.documentElement.clientWidth >= 980) && !entry.target.classList.contains("nav-dropdown__link"))) && entry.target.getAttribute("data-expenable") == "1") {
      if( entry.intersectionRatio > 0.5 ) {
        window.setTimeout(function () {
          if (entry.intersectionRatio > 0.5 ) {
             reportExposure(JSON.parse(entry.target.getAttribute("data-scdata")));
            intersectionObserver.unobserve(entry.target);
            entry.target.setAttribute("data-expenable","0");
          }
        },1000)
      }
    }
  })
}
/* MutationObserver监听 */

// 观察器的配置（需要观察什么变动）
const config = { attributeFilter:["aria-hidden"]};

// 当观察到变动时执行的回调函数
const MutationObservercallback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type == 'attributes') {
            if (mutation.target.getAttribute("data-expenable") == "1" && mutation.target.getAttribute("aria-hidden") == "false") {
              mutation.target.querySelectorAll(".nav-dropdown__item .shence_commodityView").forEach(commodityViewdom => {
                if (commodityViewdom.getAttribute("data-expenable") == "1") {
                  reportExposure(JSON.parse(commodityViewdom.getAttribute("data-scdata")));
                  commodityViewdom.setAttribute("data-expenable","0");
                }
              })
              mutation.target.setAttribute("data-expenable","0");
              // observer.disconnect();
            }
            
        }
    }
};

// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(MutationObservercallback);

// 以上述配置开始观察目标节点
setTimeout(function (argument) {
  const targetNodes = document.querySelectorAll('.nav-bar__inner .nav-dropdown');
  targetNodes.forEach(targetNode => {
        observer.observe(targetNode, config);
  });
},1000)

// 之后，可停止观察
// observer.disconnect();

window.addEventListener("load",(event) => { 
  document.querySelector("body").addEventListener("click",function(e) {
    if (e.target && e.target.classList.contains("color-swatch__item")) {
      var this_skuid = e.target.parentNode.querySelector(".color-swatch__radio").getAttribute("data-sku");
      if (e.target.closest(".product-item")) {
        var scdata = JSON.parse(e.target.closest(".product-item").querySelector(".product-item__image-wrapper").getAttribute("data-scdata"));
        scdata.commodity_skuid = this_skuid;
        reportExposure(scdata);
        e.target.closest(".product-item").querySelectorAll(".product-item_mktClick").forEach(function (item) {
          item.setAttribute("data-scdata",JSON.stringify(scdata));
        })
      }
    }
  })
},false);