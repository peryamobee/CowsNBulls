function Http(domain){
    var xhr = new XMLHttpRequest();
    const OK = 200;

    return {
        get: function (url, restParams) {
            xhr.open('GET', encodeURI([domain,url,restParams].join('/')));
            xhr.setRequestHeader('Content-Type', 'application/json');
            return new Promise(function (resolve, reject) {
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        resolve(JSON.parse(xhr.responseText));
                    }else { //400
                        reject(JSON.parse(xhr.responseText), xhr.status);
                    }
                };
                xhr.send();
            });
        },
        post:function (url,restParams, data){
            xhr.open('POST', encodeURI([domain,url,restParams].join('/')));
            xhr.setRequestHeader('Content-Type', 'application/json');
            return new Promise(function (resolve, reject) {
                xhr.onload = function() {
                    if (xhr.status === OK) {
                        resolve(JSON.parse(xhr.responseText));
                    }else { //400
                        reject(JSON.parse(xhr.responseText), xhr.status);
                    }
                };
                xhr.send(JSON.stringify(data));
            });

        }
    }
}
