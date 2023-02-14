function ajax_method(url,data,method,success) {
    // 异步对象
    var ajax = new XMLHttpRequest();

    // get 跟post  需要分别写不同的代码
    if (method==='get') {
        // get请求
        if (data) {
            // 如果有值
            url+='?';
            url+=data;
        }else{

        }
        // 设置 方法 以及 url
        ajax.open(method,url);

        // send即可
        ajax.send();
    }else{
        // post请求
        // post请求 url 是不需要改变
        ajax.open(method,url);

        // 需要设置请求报文
        ajax.setRequestHeader("Content-type","application/json");
        ajax.setRequestHeader("siteValue","hyfol");
        // 判断data send发送数据
        if (data) {
            // 如果有值 从send发送
            ajax.send(JSON.stringify(data));
        }else{
            ajax.send();
        }
    }

    // 注册事件
    ajax.onreadystatechange = function () {
        if (ajax.readyState===4&&ajax.status===200) {
            if(success){
                success(ajax.responseText);
            }
        }
    }

}
