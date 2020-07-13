const https = require("https")
const http = require("http")
const url = require("url")
module.exports = new (class Request { // The request class, performs simple http or https requests
    /**
     * Perform a simple http(s) get request
     * @param {""} path Url path
     * @param {{}} options Body: {}, https: boolean
     * @returns {Promise} 
    */
    async get(path, options) {
        return new Promise(async (resolve, reject) => {
            if(options.https){
                try {
                    let _url = url.parse(path)
                    let setup = {
                        host: _url.host,
                        path: _url.path,
                        port: _url.port,
                        method: "GET",
                        query: _url.query,
                        body: options.body,
                        followAllRedirects: true
                    };
                    let redirectCount = 0
                    async function _https() {
                        let req = https.request(setup, async res => {
                            let bodyBuffer = []
                            res.on('data', async chunk => {
                                bodyBuffer.push(chunk);
                            }).on('end', async () => {
                                let body = Buffer.concat(bodyBuffer);
                                if (res.statusCode == 301) {
                                    _url = url.parse(res.headers.location)
                                    setup = {
                                        host: _url.host,
                                        path: _url.path,
                                        port: _url.port,
                                        method: "GET",
                                        query: _url.query,
                                        body: options.body,
                                        followAllRedirects: true
                                    };
                                    ++redirectCount
                                    if(redirectCount == 10){
                                        reject("Too many redirects (over 10)")
                                    }else {
                                        _https()
                                    }
                                } else {
                                    resolve({
                                        body: body,
                                        headers: JSON.stringify(res.headers),
                                        status: res.statusCode,
                                        message: res.statusMessage
                                    })
                                }
                            })
                        })
                        req.on("error", async error => {
                            reject(error)
                        })
                        req.end()
                    }
                    _https()
                }
                catch (error) {
                    reject(error)
                }
            }else {
                try {
                    let _url = url.parse(path)
                    let setup = {
                        host: _url.host,
                        path: _url.path,
                        port: _url.port,
                        method: "GET",
                        query: _url.query,
                        body: options.body,
                        followAllRedirects: true
                    };
                    let redirectCount = 0
                    async function _http() {
                        let req = http.request(setup, async res => {
                            let bodyBuffer = []
                            res.on('data', async chunk => {
                                bodyBuffer.push(chunk);
                            }).on('end', async () => {
                                let body = Buffer.concat(bodyBuffer);
                                if (res.statusCode == 301) {
                                    _url = url.parse(res.headers.location)
                                    setup = {
                                        host: _url.host,
                                        path: _url.path,
                                        port: _url.port,
                                        method: "GET",
                                        query: _url.query,
                                        body: options.body,
                                        followAllRedirects: true
                                    };
                                    ++redirectCount
                                    if(redirectCount == 10){
                                        reject("Too many redirects (over 10)")
                                    }else {
                                        _http()
                                    }
                                } else {
                                    resolve({
                                        body: body,
                                        headers: JSON.stringify(res.headers),
                                        status: res.statusCode,
                                        message: res.statusMessage
                                    })
                                }
                            })
                        })
                        req.on("error", async error => {
                            reject(error)
                        })
                        req.end()
                    }
                    _http()
                }
                catch (error) {
                    reject(error)
                }
            }
        })
    }
    /**
     * Perform a simple http(s) post request
     * @param {""} path 
     * @param {{}} options 
     * @returns {Promise} 
    */
    async post(path, options) {
        return new Promise(async (resolve, reject) => {
            if(options.https){
                try {
                    let _url = url.parse(path)
                    let setup = {
                        host: _url.host,
                        path: _url.path,
                        port: _url.port,
                        method: "POST",
                        query: _url.query,
                        body: options.body,
                        followAllRedirects: true
                    };
                    let redirectCount = 0
                    async function _https() {
                        let req = https.request(setup, async res => {
                            let bodyBuffer = []
                            res.on('data', async chunk => {
                                bodyBuffer.push(chunk);
                            }).on('end', async () => {
                                let body = Buffer.concat(bodyBuffer);
                                if (res.statusCode == 301) {
                                    _url = url.parse(res.headers.location)
                                    setup = {
                                        host: _url.host,
                                        path: _url.path,
                                        port: _url.port,
                                        method: "GET",
                                        query: _url.query,
                                        body: options.body,
                                        followAllRedirects: true
                                    };
                                    ++redirectCount
                                    if(redirectCount == 10){
                                        reject("Too many redirects (over 10)")
                                    }else {
                                        _https()
                                    }
                                } else {
                                    resolve({
                                        body: body,
                                        headers: JSON.stringify(res.headers),
                                        status: res.statusCode,
                                        message: res.statusMessage
                                    })
                                }
                            })
                        })
                        req.on("error", async error => {
                            reject(error)
                        })
                        req.end()
                    }
                    _https()
                }
                catch (error) {
                    reject(error)
                }
            }else {
                try {
                    let _url = url.parse(path)
                    let setup = {
                        host: _url.host,
                        path: _url.path,
                        port: _url.port,
                        method: "POST",
                        query: _url.query,
                        body: options.body,
                        followAllRedirects: true
                    };
                    let redirectCount = 0
                    async function _http() {
                        let req = http.request(setup, async res => {
                            let bodyBuffer = []
                            res.on('data', async chunk => {
                                bodyBuffer.push(chunk);
                            }).on('end', async () => {
                                let body = Buffer.concat(bodyBuffer);
                                if (res.statusCode == 301) {
                                    _url = url.parse(res.headers.location)
                                    setup = {
                                        host: _url.host,
                                        path: _url.path,
                                        port: _url.port,
                                        method: "GET",
                                        query: _url.query,
                                        body: options.body,
                                        followAllRedirects: true
                                    };
                                    ++redirectCount
                                    if(redirectCount == 10){
                                        reject("Too many redirects (over 10)")
                                    }else {
                                        _http()
                                    }
                                } else {
                                    resolve({
                                        body: body,
                                        headers: JSON.stringify(res.headers),
                                        status: res.statusCode,
                                        message: res.statusMessage
                                    })
                                }
                            })
                        })
                        req.on("error", async error => {
                            reject(error)
                        })
                        req.end()
                    }
                    _http()
                }
                catch (error) {
                    reject(error)
                }
            }
        })
    }
})