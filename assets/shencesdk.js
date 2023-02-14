(function (para) {
  var p = para.sdk_url, n = para.name, w = window, d = document, s = 'script', x = null, y = null;
  if (typeof (w['sensorsDataAnalytic201505']) !== 'undefined') {
    return false;
  }
  w['sensorsDataAnalytic201505'] = n;
  w[n] = w[n] || function (a) { return function () { (w[n]._q = w[n]._q || []).push([a, arguments]); } };
  var ifs = ['track', 'quick', 'register', 'registerPage', 'use', 'registerOnce', 'trackSignup', 'trackAbtest', 'setProfile', 'setOnceProfile', 'appendProfile', 'incrementProfile', 'deleteProfile', 'unsetProfile', 'identify', 'login', 'logout', 'trackLink', 'clearAllRegister', 'getAppStatus', 'setItem', 'deleteItem'];
  for (var i = 0; i < ifs.length; i++) {
    w[n][ifs[i]] = w[n].call(null, ifs[i]);
  }
  if (!w[n]._t) {
    x = d.createElement(s), y = d.getElementsByTagName(s)[0];
    x.async = 1;
    x.src = p;
    x.setAttribute('charset', 'UTF-8');
    w[n].para = para;
    y.parentNode.insertBefore(x, y);
  }
})({
  // sdk_url: 'https://cdn.shopifycdn.net/s/files/1/0595/0691/7535/files/sensorsdata.min.js?v=1639989639',//v1.20.2
  sdk_url: 'https://cdn.shopify.com/s/files/1/0595/0691/7535/files/sensorsdata.min_be8ac7a5-cc19-4af9-9310-5933d1f054b5.js?v=1660706678',//v1.23.3
  name: 'sensors',
  /* 正式环境地址 */
  server_url: 'https://data.ld-bdp.com/sa?project=production',
  /* 测试环境地址 */
  // server_url: 'https://data.ld-bdp.com/sa?project=default',
  send_type: 'beacon',
  show_log: false,
  heatmap: {
    //是否开启点击图，default 表示开启，自动采集 $WebClick 事件，可以设置 'not_collect' 表示关闭。
    clickmap: 'default',
    //是否开启触达图，not_collect 表示关闭，不会自动采集 $WebStay 事件，可以设置 'default' 表示开启。
    scroll_notice_map: 'default',
    scroll_delay_time: 3000,

  }
});
var device_type;
function getDevice_type() {
  if (document.documentElement.clientWidth >= 1000) {
    device_type = "pc";
  } else if (document.documentElement.clientWidth >= 641) {
    device_type = "tablet";
  } else {
    device_type = "mobile";
  }
}
getDevice_type();
/* sensors.register({
  platform_type: "web",
   site_id:"000002",
  vip_level: "",
  site_name: "hyfol",
  site_type: "shopify",
  device_type: device_type
});
sensors.use('PageLoad');//页面加载时长
sensors.quick('autoTrack');
sensors.use('PageLeave');
 */
function getSiteCategory(){
    try {
        let al = document.querySelectorAll('ol a')
        let str = ''
        Array.from(al).map(i => {
            str = str + i.innerText + ';'
        })
        return str
    } catch (error) {
        console.log('没找到面包屑元素ol')
    }

}
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
/*
 *@Version  v5.0
 *@Author   苦行僧|2021/12/17
*/
~function () {
  class sadhus_shence {
    constructor(obj) {
      if (typeof (obj.container) === 'string') {
        this.container = document.querySelector(obj.container);
      } else {
        this.container = obj.container;
      }
      if(!this.container) return;
      this.event = obj.event || 'click';
      this.addFn = obj.customData || function () { return {} };
      this.customSession = obj.customSession || function () { return {} };
      this.type = obj.type || '';
      this.sendType = obj.sendType || obj.type;
      this.callback = obj.callback || function () { return false };
      this.debug = obj.debug || false;
      this.setSessionId = obj.setSessionId || '';
      this.getSessionId = obj.getSessionId || '';
      this.delSession = obj.delSession || false;
      this.scTypeName = obj.typeName || 'sctype'
      this.scDataName = obj.dataName || 'scdata'
      this.scEnableName = obj.enableName || 'scenable'
      this.scSessionName = obj.sessionName || 'scsession'
      this.delayed = obj.delayed || false; //是否延时
      this.delayTime = obj.delayTime || 1000; //是否延时
      this.bind();
    }
    target(ev) {
      let targetEl = ev.target;
      while (targetEl!=''&&targetEl !== this.container && (targetEl.dataset[this.scTypeName] !== this.type || !targetEl.dataset[this.scEnableName])) {
        targetEl = targetEl.parentNode ? targetEl.parentNode : '';
      }
      this.debug && console.info("匹配节点", targetEl);
      return targetEl === this.container ? false : targetEl;
    }
    bind() {
      this.debug && console.info("绑定事件");
      if (this.event === "load") {
        this.debug && console.info("绑定事件", this.event);
        window.addEventListener('load', (ev) => {
          this.debug && console.info("页面加载完毕");
          this.handle(this.container);
        })
      } else if (this.event === 'sync') {
        this.debug && console.info("同步执行事件");
        this.handle(this.container);
      } else if (this.event === 'repeat') {
        let domList = this.container.querySelectorAll(this.type);
        let that = this;
        domList.forEach(item => {
          new sadhus_shence({
            debug: that.debug,
            container: item,
            event: "sync",
            type: that.type,
            customData: that.addFn,
            customSession: that.customSession,
            sendType: that.sendType,
            callback: that.callback,
            setSessionId: that.setSessionId,
            getSessionId: that.getSessionId,
            delSession: that.delSession,
            scTypeName: that.scTypeName,
            scDataName: that.scDataName,
            scEnableName: that.scEnableName,
            scSessionName: that.scSessionName
          })
        })
      } else {
        this.debug && console.info("绑定事件", this.event);
        this.container.addEventListener(this.event, (ev) => {
          this.debug && ev.preventDefault();
          if (this.delayed) {
            setTimeout(() => {
              let el = this.target(ev);
              if (el) {
                this.handle(el)
              } else {
                this.debug && console.info("本次点击不存在目标节点");
              }
            }, this.delayTime)
          } else {
            let el = this.target(ev);
            if (el) {
              this.handle(el)
            } else {
              this.debug && console.info("本次点击不存在目标节点");
            }
          }
        })
      }
    }
    getData(el) {
      let data = el.dataset[this.scDataName];
      if (data) {
        data = JSON.parse(data);
        this.debug && console.info("节点数据", data);
      } else {
        this.debug && console.warn("数据为空");
        data = {}
        this.debug && console.info("节点数据", data);
      }
      data = this.addData(data, el);
      this.debug && console.info("合并数据", data);
      return data;
    }
    addData(data, el) {
      let customData = this.addFn(this.container, el);
      this.debug && console.info("自定义追加数据", customData);
      Object.assign(data, customData)
      this.debug && console.info("追加数据");
      if (this.getSessionId && sessionStorage.getItem(this.getSessionId) || this.getSessionId && localStorage.getItem(this.getSessionId)) {
        let sessionData = JSON.parse(sessionStorage.getItem(this.getSessionId)) || JSON.parse(localStorage.getItem(this.getSessionId));
        Object.assign(data, sessionData)
      } else if (this.getSessionId) {
        this.debug && console.info("session为空，清空所有数据");
        return {}
      }
      return data;
    }
    handle(el) {
      let data = this.getData(el)
      this.setSessionId && this.setSession(el);
      this.debug && console.info("最终数据", data);
      if (Object.keys(data).length) {
        this.sendData(data);
      }
      this.debug && console.info("收尾处理");
      this.sendEnd(el);
      this.debug && console.info("启用回调");
      this.callback(el, this.container);
    }
    sendEnd(el) {
      this.debug && console.info("关闭上报");
      el.dataset[this.scEnableName] = '';
      if (this.delSession) {
        this.debug && console.info("删除session")
        sessionStorage.removeItem(this.getSessionId);
      }
    }
    sendData(data) {
      let sendType = this.sendType;
      let debug = this.debug;
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
      } if(data.commodity_image_quantity) {
        data.commodity_image_quantity = Number(data.commodity_image_quantity);
      }
      if (data.tip_amount) {
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
/*       sensors.quick('isReady', function () {
        debug && console.info("准备", sendType, data);
        sensors.track(sendType, data);
        debug && console.info('上报完毕');
      }) */
    }
    setSession(el) {
      let customSessionData = this.customSession(this.container);
      this.debug && console.info("自定义追加session", customSessionData)
      let data = el.dataset[this.scSessionName];
      if (!data) { data = '{}' }
      data = JSON.parse(data);
      this.debug && console.info("节点session", data)
      Object.assign(data, customSessionData)
      if (Object.keys(data).length) {
        sessionStorage.setItem(this.setSessionId, JSON.stringify(data));
      } else {
        this.debug && console.info("数据为空取消存储")
      }

      this.debug && console.info("最终存储session", data)
    }
    updateFn() {
      let EnableName = this.scEnableName;
      let scDemoArr = this.container.querySelectorAll("[data-" + this.scTypeName + "=" + this.type + "]");
      Array.from(scDemoArr).forEach(item => item.dataset[EnableName] = '1');
      this.debug && console.info("重置可用性")
    }
  }
  window.sadhus_shence = sadhus_shence;
}()
/*获取设备信息*/
!function() {
    var NA_VERSION = "-1";
    var win = window;
    var external = win.external;
    var userAgent = win.navigator.userAgent || "";
    var appVersion = win.navigator.appVersion || "";
    var vendor = win.navigator.vendor || "";

    var re_msie = /\b(?:msie |ie |trident\/[0-9].*rv[ :])([0-9.]+)/;
    var re_blackberry_10 = /\bbb10\b.+?\bversion\/([\d.]+)/;
    var re_blackberry_6_7 = /\bblackberry\b.+\bversion\/([\d.]+)/;
    var re_blackberry_4_5 = /\bblackberry\d+\/([\d.]+)/;

    function toString(object) {
        return Object.prototype.toString.call(object);
    }

    function isObject(object) {
        return toString(object) === "[object Object]";
    }

    function isFunction(object) {
        return toString(object) === "[object Function]";
    }

    function each(object, factory) {
        for (var i = 0, l = object.length; i < l; i++) {
            if (factory.call(object, object[i], i) === false) {
                break;
            }
        }
    }

    // 硬件设备信息识别表达式。
    // 使用数组可以按优先级排序。
    var DEVICES = [
        ["nokia", function(ua) {
            // 不能将两个表达式合并，因为可能出现 "nokia; nokia 960"
            // 这种情况下会优先识别出 nokia/-1
            if (ua.indexOf("nokia ") !== -1) {
                return /\bnokia ([0-9]+)?/;
            } else {
                return /\bnokia([a-z0-9]+)?/;
            }
        }],
        // 三星有 Android 和 WP 设备。
        ["samsung", function(ua) {
            if (ua.indexOf("samsung") !== -1) {
                return /\bsamsung(?:[ \-](?:sgh|gt|sm))?-([a-z0-9]+)/;
            } else {
                return /\b(?:sgh|sch|gt|sm)-([a-z0-9]+)/;
            }
        }],
        ["wp", function(ua) {
            return ua.indexOf("windows phone ") !== -1 ||
                ua.indexOf("xblwp") !== -1 ||
                ua.indexOf("zunewp") !== -1 ||
                ua.indexOf("windows ce") !== -1;
        }],
        ["pc", "windows"],
        ["ipad", "ipad"],
        // ipod 规则应置于 iphone 之前。
        ["ipod", "ipod"],
        ["iphone", /\biphone\b|\biph(\d)/],
        ["mac", "macintosh"],
        // 小米
        ["mi", /\bmi[ \-]?([a-z0-9 ]+(?= build|\)))/],
        // 红米
        ["hongmi", /\bhm[ \-]?([a-z0-9]+)/],
        ["aliyun", /\baliyunos\b(?:[\-](\d+))?/],
        ["meizu", function(ua) {
            return ua.indexOf("meizu") >= 0 ?
                /\bmeizu[\/ ]([a-z0-9]+)\b/
                :
                /\bm([0-9cx]{1,4})\b/;
        }],
        ["nexus", /\bnexus ([0-9s.]+)/],
        ["huawei", function(ua) {
            var re_mediapad = /\bmediapad (.+?)(?= build\/huaweimediapad\b)/;
            if (ua.indexOf("huawei-huawei") !== -1) {
                return /\bhuawei\-huawei\-([a-z0-9\-]+)/;
            } else if (re_mediapad.test(ua)) {
                return re_mediapad;
            } else {
                return /\bhuawei[ _\-]?([a-z0-9]+)/;
            }
        }],
        ["lenovo", function(ua) {
            if (ua.indexOf("lenovo-lenovo") !== -1) {
                return /\blenovo\-lenovo[ \-]([a-z0-9]+)/;
            } else {
                return /\blenovo[ \-]?([a-z0-9]+)/;
            }
        }],
        // 中兴
        ["zte", function(ua) {
            if (/\bzte\-[tu]/.test(ua)) {
                return /\bzte-[tu][ _\-]?([a-su-z0-9\+]+)/;
            } else {
                return /\bzte[ _\-]?([a-su-z0-9\+]+)/;
            }
        }],
        // 步步高
        ["vivo", /\bvivo(?: ([a-z0-9]+))?/],
        ["htc", function(ua) {
            if (/\bhtc[a-z0-9 _\-]+(?= build\b)/.test(ua)) {
                return /\bhtc[ _\-]?([a-z0-9 ]+(?= build))/;
            } else {
                return /\bhtc[ _\-]?([a-z0-9 ]+)/;
            }
        }],
        ["oppo", /\boppo[_]([a-z0-9]+)/],
        ["konka", /\bkonka[_\-]([a-z0-9]+)/],
        ["sonyericsson", /\bmt([a-z0-9]+)/],
        ["coolpad", /\bcoolpad[_ ]?([a-z0-9]+)/],
        ["lg", /\blg[\-]([a-z0-9]+)/],
        ["android", /\bandroid\b|\badr\b/],
        ["blackberry", function(ua) {
            if (ua.indexOf("blackberry") >= 0) {
                return /\bblackberry\s?(\d+)/;
            }
            return "bb10";
        }],
    ];

    // 操作系统信息识别表达式
    var OS = [
        ["wp", function(ua) {
            if (ua.indexOf("windows phone ") !== -1) {
                return /\bwindows phone (?:os )?([0-9.]+)/;
            } else if (ua.indexOf("xblwp") !== -1) {
                return /\bxblwp([0-9.]+)/;
            } else if (ua.indexOf("zunewp") !== -1) {
                return /\bzunewp([0-9.]+)/;
            }
            return "windows phone";
        }],
        ["windows", /\bwindows nt ([0-9.]+)/],
        ["macosx", /\bmac os x ([0-9._]+)/],
        ["iPhone OS", function(ua) {
            if (/\bcpu(?: iphone)? os /.test(ua)) {
                return /\bcpu(?: iphone)? os ([0-9._]+)/;
            } else if (ua.indexOf("iph os ") !== -1) {
                return /\biph os ([0-9_]+)/;
            } else {
                return /\bios\b/;
            }
        }],
        ["yunos", /\baliyunos ([0-9.]+)/],
        ["Android", function(ua) {
            if (ua.indexOf("android") >= 0) {
                return /\bandroid[ \/-]?([0-9.x]+)?/;
            } else if (ua.indexOf("adr") >= 0) {
                if (ua.indexOf("mqqbrowser") >= 0) {
                    return /\badr[ ]\(linux; u; ([0-9.]+)?/;
                } else {
                    return /\badr(?:[ ]([0-9.]+))?/;
                }
            }
            return "android";
            //return /\b(?:android|\badr)(?:[\/\- ](?:\(linux; u; )?)?([0-9.x]+)?/;
        }],
        ["chromeos", /\bcros i686 ([0-9.]+)/],
        ["linux", "linux"],
        ["windowsce", /\bwindows ce(?: ([0-9.]+))?/],
        ["symbian", /\bsymbian(?:os)?\/([0-9.]+)/],
        ["blackberry", function(ua) {
            var m = ua.match(re_blackberry_10) ||
                ua.match(re_blackberry_6_7) ||
                ua.match(re_blackberry_4_5);
            return m ? {version: m[1]} : "blackberry";
        }],
    ];

    // 解析使用 Trident 内核的浏览器的 `浏览器模式` 和 `文档模式` 信息。
    // @param {String} ua, userAgent string.
    // @return {Object}
    function IEMode(ua) {
        if (!re_msie.test(ua)) {
            return null;
        }

        var m,
            engineMode, engineVersion,
            browserMode, browserVersion;

        // IE8 及其以上提供有 Trident 信息，
        // 默认的兼容模式，UA 中 Trident 版本不发生变化。
        if (ua.indexOf("trident/") !== -1) {
            m = /\btrident\/([0-9.]+)/.exec(ua);
            if (m && m.length >= 2) {
                // 真实引擎版本。
                engineVersion = m[1];
                var v_version = m[1].split(".");
                v_version[0] = parseInt(v_version[0], 10) + 4;
                browserVersion = v_version.join(".");
            }
        }

        m = re_msie.exec(ua);
        browserMode = m[1];
        var v_mode = m[1].split(".");
        if (typeof browserVersion === "undefined") {
            browserVersion = browserMode;
        }
        v_mode[0] = parseInt(v_mode[0], 10) - 4;
        engineMode = v_mode.join(".");
        if (typeof engineVersion === "undefined") {
            engineVersion = engineMode;
        }

        return {
            browserVersion: browserVersion,
            browserMode: browserMode,
            engineVersion: engineVersion,
            engineMode: engineMode,
            compatible: engineVersion !== engineMode
        };
    }

    // 针对同源的 TheWorld 和 360 的 external 对象进行检测。
    // @param {String} key, 关键字，用于检测浏览器的安装路径中出现的关键字。
    // @return {Undefined,Boolean,Object} 返回 undefined 或 false 表示检测未命中。
    function checkTW360External(key) {
        if (!external) {
            return;
        } // return undefined.
        try {
            //        360安装路径：
            //        C:%5CPROGRA~1%5C360%5C360se3%5C360SE.exe
            var runpath = external.twGetRunPath.toLowerCase();
            // 360SE 3.x ~ 5.x support.
            // 暴露的 external.twGetVersion 和 external.twGetSecurityID 均为 undefined。
            // 因此只能用 try/catch 而无法使用特性判断。
            var security = external.twGetSecurityID(win);
            var version = external.twGetVersion(security);

            if (runpath && runpath.indexOf(key) === -1) {
                return false;
            }
            if (version) {
                return {version: version};
            }
        } catch (ex) { /* */
        }
    }

    var ENGINE = [
        ["edgehtml", /edge\/([0-9.]+)/],
        ["trident", re_msie],
        ["blink", function() {
            return "chrome" in win && "CSS" in win && /\bapplewebkit[\/]?([0-9.+]+)/;
        }],
        ["webkit", /\bapplewebkit[\/]?([0-9.+]+)/],
        ["gecko", function(ua) {
            var match;
            if ((match = ua.match(/\brv:([\d\w.]+).*\bgecko\/(\d+)/))) {
                return {
                    version: match[1] + "." + match[2]
                };
            }
        }],
        ["presto", /\bpresto\/([0-9.]+)/],
        ["androidwebkit", /\bandroidwebkit\/([0-9.]+)/],
        ["coolpadwebkit", /\bcoolpadwebkit\/([0-9.]+)/],
        ["u2", /\bu2\/([0-9.]+)/],
        ["u3", /\bu3\/([0-9.]+)/],
    ];
    var BROWSER = [
        // Microsoft Edge Browser, Default browser in Windows 10.
        ["edge", /edge\/([0-9.]+)/],
        // Sogou.
        ["sogou", function(ua) {
            if (ua.indexOf("sogoumobilebrowser") >= 0) {
                return /sogoumobilebrowser\/([0-9.]+)/;
            } else if (ua.indexOf("sogoumse") >= 0) {
                return true;
            }
            return / se ([0-9.x]+)/;
        }],
        // TheWorld (世界之窗)
        // 由于裙带关系，TheWorld API 与 360 高度重合。
        // 只能通过 UA 和程序安装路径中的应用程序名来区分。
        // TheWorld 的 UA 比 360 更靠谱，所有将 TheWorld 的规则放置到 360 之前。
        ["theworld", function() {
            var x = checkTW360External("theworld");
            if (typeof x !== "undefined") {
                return x;
            }
            return "theworld";
        }],
        // 360SE, 360EE.
        ["360", function(ua) {
            var x = checkTW360External("360se");
            if (typeof x !== "undefined") {
                return x;
            }
            if (ua.indexOf("360 aphone browser") !== -1) {
                return /\b360 aphone browser \(([^\)]+)\)/;
            }
            return /\b360(?:se|ee|chrome|browser)\b/;
        }],
        // Maxthon
        ["maxthon", function() {
            try {
                if (external && (external.mxVersion || external.max_version)) {
                    return {
                        version: external.mxVersion || external.max_version
                    };
                }
            } catch (ex) { /* */
            }
            return /\b(?:maxthon|mxbrowser)(?:[ \/]([0-9.]+))?/;
        }],
        ["micromessenger", /\bmicromessenger\/([\d.]+)/],
        ["qq", /\bm?qqbrowser\/([0-9.]+)/],
        ["green", "greenbrowser"],
        ["tt", /\btencenttraveler ([0-9.]+)/],
        ["liebao", function(ua) {
            if (ua.indexOf("liebaofast") >= 0) {
                return /\bliebaofast\/([0-9.]+)/;
            }
            if (ua.indexOf("lbbrowser") === -1) {
                return false;
            }
            var version;
            try {
                if (external && external.LiebaoGetVersion) {
                    version = external.LiebaoGetVersion();
                }
            } catch (ex) { /* */
            }
            return {
                version: version || NA_VERSION
            };
        }],
        ["tao", /\btaobrowser\/([0-9.]+)/],
        ["coolnovo", /\bcoolnovo\/([0-9.]+)/],
        ["saayaa", "saayaa"],
        // 有基于 Chromniun 的急速模式和基于 IE 的兼容模式。必须在 IE 的规则之前。
        ["baidu", /\b(?:ba?idubrowser|baiduhd)[ \/]([0-9.x]+)/],
        // 后面会做修复版本号，这里只要能识别是 IE 即可。
        ["ie", re_msie],
        ["mi", /\bmiuibrowser\/([0-9.]+)/],
        // Opera 15 之后开始使用 Chromniun 内核，需要放在 Chrome 的规则之前。
        ["opera", function(ua) {
            var re_opera_old = /\bopera.+version\/([0-9.ab]+)/;
            var re_opera_new = /\bopr\/([0-9.]+)/;
            return re_opera_old.test(ua) ? re_opera_old : re_opera_new;
        }],
        ["oupeng", /\boupeng\/([0-9.]+)/],
        ["yandex", /yabrowser\/([0-9.]+)/],
        // 支付宝手机客户端
        ["ali-ap", function(ua) {
            if (ua.indexOf("aliapp") > 0) {
                return /\baliapp\(ap\/([0-9.]+)\)/;
            } else {
                return /\balipayclient\/([0-9.]+)\b/;
            }
        }],
        // 支付宝平板客户端
        ["ali-ap-pd", /\baliapp\(ap-pd\/([0-9.]+)\)/],
        // 支付宝商户客户端
        ["ali-am", /\baliapp\(am\/([0-9.]+)\)/],
        // 淘宝手机客户端
        ["ali-tb", /\baliapp\(tb\/([0-9.]+)\)/],
        // 淘宝平板客户端
        ["ali-tb-pd", /\baliapp\(tb-pd\/([0-9.]+)\)/],
        // 天猫手机客户端
        ["ali-tm", /\baliapp\(tm\/([0-9.]+)\)/],
        // 天猫平板客户端
        ["ali-tm-pd", /\baliapp\(tm-pd\/([0-9.]+)\)/],
        // UC 浏览器，可能会被识别为 Android 浏览器，规则需要前置。
        // UC 桌面版浏览器携带 Chrome 信息，需要放在 Chrome 之前。
        ["uc", function(ua) {
            if (ua.indexOf("ucbrowser/") >= 0) {
                return /\bucbrowser\/([0-9.]+)/;
            } else if (ua.indexOf("ubrowser/") >= 0) {
                return /\bubrowser\/([0-9.]+)/;
            } else if (/\buc\/[0-9]/.test(ua)) {
                return /\buc\/([0-9.]+)/;
            } else if (ua.indexOf("ucweb") >= 0) {
                // `ucweb/2.0` is compony info.
                // `UCWEB8.7.2.214/145/800` is browser info.
                return /\bucweb([0-9.]+)?/;
            } else {
                return /\b(?:ucbrowser|uc)\b/;
            }
        }],
        ["chrome", / (?:chrome|crios|crmo)\/([0-9.]+)/],
        // Android 默认浏览器。该规则需要在 safari 之前。
        ["android", function(ua) {
            if (ua.indexOf("android") === -1) {
                return;
            }
            return /\bversion\/([0-9.]+(?: beta)?)/;
        }],
        ["blackberry", function(ua) {
            var m = ua.match(re_blackberry_10) ||
                ua.match(re_blackberry_6_7) ||
                ua.match(re_blackberry_4_5);
            return m ? {version: m[1]} : "blackberry";
        }],
        ["safari", /\bversion\/([0-9.]+(?: beta)?)(?: mobile(?:\/[a-z0-9]+)?)? safari\//],
        // 如果不能被识别为 Safari，则猜测是 WebView。
        ["webview", /\bcpu(?: iphone)? os (?:[0-9._]+).+\bapplewebkit\b/],
        ["firefox", /\bfirefox\/([0-9.ab]+)/],
        ["nokia", /\bnokiabrowser\/([0-9.]+)/],
    ];

    // UserAgent Detector.
    // @param {String} ua, userAgent.
    // @param {Object} expression
    // @return {Object}
    //    返回 null 表示当前表达式未匹配成功。
    function detect(name, expression, ua) {
        var expr = isFunction(expression) ? expression.call(null, ua) : expression;
        if (!expr) {
            return null;
        }
        var info = {
            name: name,
            version: NA_VERSION,
            codename: ""
        };
        var t = toString(expr);
        if (expr === true) {
            return info;
        } else if (t === "[object String]") {
            if (ua.indexOf(expr) !== -1) {
                return info;
            }
        } else if (isObject(expr)) { // Object
            if (expr.hasOwnProperty("version")) {
                info.version = expr.version;
            }
            return info;
        } else if (expr.exec) { // RegExp
            var m = expr.exec(ua);
            if (m) {
                if (m.length >= 2 && m[1]) {
                    info.version = m[1].replace(/_/g, ".");
                } else {
                    info.version = NA_VERSION;
                }
                return info;
            }
        }
    }

    var na = {name: "na", version: NA_VERSION};
    // 初始化识别。
    function init(ua, patterns, factory, detector) {
        var detected = na;
        each(patterns, function(pattern) {
            var d = detect(pattern[0], pattern[1], ua);
            if (d) {
                detected = d;
                return false;
            }
        });
        factory.call(detector, detected.name, detected.version);
    }

    // 解析 UserAgent 字符串
    // @param {String} ua, userAgent string.
    // @return {Object}
    var parse = function(ua) {
        ua = (ua || "").toLowerCase();
        var d = {};

        init(ua, DEVICES, function(name, version) {
            var v = parseFloat(version);
            d.device = {
                name: name,
                version: v,
                fullVersion: version
            };
            d.device[name] = v;
        }, d);

        init(ua, OS, function(name, version) {
            var v = parseFloat(version);
            d.os = {
                name: name,
                version: v,
                fullVersion: version
            };
            d.os[name] = v;
        }, d);

        var ieCore = IEMode(ua);

        init(ua, ENGINE, function(name, version) {
            var mode = version;
            // IE 内核的浏览器，修复版本号及兼容模式。
            if (ieCore) {
                version = ieCore.engineVersion || ieCore.engineMode;
                mode = ieCore.engineMode;
            }
            var v = parseFloat(version);
            d.engine = {
                name: name,
                version: v,
                fullVersion: version,
                mode: parseFloat(mode),
                fullMode: mode,
                compatible: ieCore ? ieCore.compatible : false
            };
            d.engine[name] = v;
        }, d);

        init(ua, BROWSER, function(name, version) {
            var mode = version;
            // IE 内核的浏览器，修复浏览器版本及兼容模式。
            if (ieCore) {
                // 仅修改 IE 浏览器的版本，其他 IE 内核的版本不修改。
                if (name === "ie") {
                    version = ieCore.browserVersion;
                }
                mode = ieCore.browserMode;
            }
            var v = parseFloat(version);
            d.browser = {
                name: name,
                version: v,
                fullVersion: version,
                mode: parseFloat(mode),
                fullMode: mode,
                compatible: ieCore ? ieCore.compatible : false
            };
            d.browser[name] = v;
        }, d);
        return d;
    };
    window.detector = parse(userAgent + " " + appVersion + " " + vendor);
}();
