/* Require */
const express = require("express")
const fs = require("fs")
const https = require("https")
const http = require("http")
try {
    global.session = fs.readFileSync("./bin/session.txt").toString()
    if(global.session.split("").length != 256){
        throw new Error("Invalid session lenght")
    }
}
catch(err){
    console.log("[SERVER]: " + err + "\nStack:" + err.stack)
}

/* Memory */
const _memory = {
    user: {
        path: null,
        token: null
    }
}

/* Declaration */
const local = express()
const request = new (class Request {
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
                        headers: options.headers,
                        followAllRedirects: true
                    };
                    let redirectCount = 0
                    async function _https() {
                        let req = https.request(setup, async res => {
                            console.log(res)
                            let bodyBuffer = []
                            res.on('data', async chunk => {
                                bodyBuffer.push(chunk);
                            }).on('end', async () => {
                                console.log("ended")
                                let body = Buffer.concat(bodyBuffer);
                                if (res.statusCode == 301) {
                                    console.log("Redirect: " + res.headers.location)
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
                        headers: options.headers,
                        followAllRedirects: true
                    };
                    let redirectCount = 0
                    async function _http() {
                        let req = http.request(setup, async res => {
                            console.log(res)
                            let bodyBuffer = []
                            res.on('data', async chunk => {
                                bodyBuffer.push(chunk);
                            }).on('end', async () => {
                                console.log("ended")
                                let body = Buffer.concat(bodyBuffer);
                                if (res.statusCode == 301) {
                                    console.log("Redirect: " + res.headers.location)
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
                        headers: options.headers,
                        followAllRedirects: true
                    };
                    let redirectCount = 0
                    async function _https() {
                        let req = https.request(setup, async res => {
                            console.log(res)
                            let bodyBuffer = []
                            res.on('data', async chunk => {
                                bodyBuffer.push(chunk);
                            }).on('end', async () => {
                                console.log("ended")
                                let body = Buffer.concat(bodyBuffer);
                                if (res.statusCode == 301) {
                                    console.log("Redirect: " + res.headers.location)
                                    _url = url.parse(res.headers.location)
                                    setup = {
                                        host: _url.host,
                                        path: _url.path,
                                        port: _url.port,
                                        method: "GET",
                                        query: _url.query,
                                        body: options.body,
                                        headers: options.headers,
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
                        headers: options.headers,
                        followAllRedirects: true
                    };
                    let redirectCount = 0
                    async function _http() {
                        let req = http.request(setup, async res => {
                            console.log(res)
                            let bodyBuffer = []
                            res.on('data', async chunk => {
                                bodyBuffer.push(chunk);
                            }).on('end', async () => {
                                console.log("ended")
                                let body = Buffer.concat(bodyBuffer);
                                if (res.statusCode == 301) {
                                    console.log("Redirect: " + res.headers.location)
                                    _url = url.parse(res.headers.location)
                                    setup = {
                                        host: _url.host,
                                        path: _url.path,
                                        port: _url.port,
                                        method: "GET",
                                        query: _url.query,
                                        body: options.body,
                                        headers: options.headers,
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


/* Server */
//Setup server
local.post("/set", async (req, res) => {
    if(req.query.session != global.session){
        res.status(401).send("Unauthorized")
    }else {
        if(req.query.token == undefined){
            res.status(400).send("Missing token from request query")
        }else if(req.query.path == undefined){
            res.status(400).send("Missing path from request query")
        }else {
            _memory.user.path = req.query.path
            _memory.user.token = req.query.token
            res.status(200).send("Set")
        }
    }
})

//"tiedotteet"
local.post("/infos", async (req, res) => {
    if(req.query.session != global.session){
        res.status(401).send("Unauthorized")
    }else {
        request.get(_memory.user.path + "/news", {headers: {
            "Cookie": "Wilma2SID=" + _memory.user.token
        }, https: true}).then(async res => {
            console.log(res.body.toString("utf8"))
        }).catch(async err => {
            console.log("[SERVER]: " + err)
            res.status(500).send("Unexpected error occured: " + err)
        })
    }
})
// API
local.post("/api", async (req, res) => {
    if(req.query.session != global.session){
        res.status(401).send("Unauthorized.")
    }else {
        if(req.query.path != undefined){
            console.log(_memory.user.path + "/" + req.query.path)
            request.get(_memory.user.path + "/" + req.query.path, {headers: { //Wilma API request happens here
                "Cookie": "Wilma2SID=" + _memory.user.token //Pass the token
            }, https: true}).then(async result => {
                result.body = result.body.toString("utf8") //From buffer to string, Move this later???
                res.status(200).send(result)
            }).catch(async err => {
                console.log("[SERVER]: " + err)
                res.status(500).send("Unexpected error occured: " + err)
            })
        }else {
            res.status(400).send("Missing path!")
        }
    }
})

/* Listen */
local.listen(2000, async () => {
    console.log("[SERVER]: Listening")
})