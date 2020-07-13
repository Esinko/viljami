// Exit codes:
//  0: error (exited too early)
//  1: error (hardcoded)
//  2: restart
//  3: success
/* Require */
const fs = require("fs")
const cp = require("child_process")
const events = require("events")
const url = require("url")
const http = require("http")
const https = require("https")
/* UI_Memory */
global.ui = {
    title: "",
    description: "",
    progressOutOf: null,
    progressTo: null
}

/* Classes */
const request = new (class Request { // The request class, performs simple http or https requests
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

const updater = new (class Updater { // The updater class, this handles downloads and file writing 
    /**
     * Download binaries
     */
    async _download(file, event) {
        return new Promise(async (resolve, reject) => {
            try {
                let options = { // Create the request config
                    hostname: "esinko.net",
                    path: '/downloads/viljami/' + file,
                    method: 'GET'
                };
                if (fs.existsSync("./temp")) { // Remove an existing temp folder
                    async function del(path2) {
                        if (path2 == undefined) path2 = "./temp"
                        fs.readdirSync(path2).forEach((file, index) => {
                            const curPath = path2 + "/" + file
                            if (fs.lstatSync(curPath).isDirectory()) {
                                del(curPath);
                            } else {
                                fs.unlinkSync(curPath);
                            }
                        });
                        fs.rmdirSync(path2);
                    }
                    await del()
                }
                await fs.mkdirSync("./temp") // Create a temporary folder
                await fs.mkdirSync("./temp/" + file.split(".")[0] + "/") // Create a folder for unpacked data
                let temp = fs.createWriteStream("./temp/" + file ) // Create a writestream to the destination
                let req = await http.request(options, async res => {
                    event.emit("to", parseInt(res.headers['content-length'], 10))
                    res.pipe(temp) // Pipe the incomming data to to the writestream
                    res.on("data", async () => {
                        event.emit("prog", null)
                    })
                });
                await req.end(); // Wait for the download to complete
                req.on('error', async e => {
                    reject(e) // Reject promise on error
                });
                temp.on("close", async () => {
                    resolve() // Download completed, resolve promise
                })
            }
            catch (err) {
                reject(err) // Reject promise on error
            }
        })
    }
    async _unzip(file){
        return new Promise(async (resolve, reject) => {
            let unzipper = fs.createReadStream("./temp/ + file")
            let parser = unzipper.pipe(unzip.Extract({
                path: "./temp/" + file.split(".")[1] + "/"
            }))
            parser.on('entry', entry => entry.autodrain())
                .promise()
                .then(async () => {
                    await fs.unlinkSync("./temp/" + file)
                    resolve()
                }, e => {
                    reject(e)
                })
        })
    }

    /**
     * Replace / create new / old application files
     */
    async _push(file) {
        return new Promise(async (resolve, reject) => {
            //Redo this later! This is bad coding!!!
            try {
                let path = require("path")
                let copied = 0
                let expected = await function (dirPath, arrayOfFiles) {
                    let files = fs.readdirSync(dirPath)
                    arrayOfFiles = arrayOfFiles || []
                    files.forEach(function (file) {
                        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
                            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
                        } else {
                            arrayOfFiles.push(file)
                        }
                    })
                    return arrayOfFiles
                }
                async function copy(src, dest) {
                    let exists = fs.existsSync(src);
                    let stats = exists && fs.lstatSync(src);
                    let isDirectory = exists && stats.isDirectory();
                    if (isDirectory) {
                        if (!exists) fs.mkdirSync(dest);
                        fs.readdirSync(src).forEach(async function (childItemName) {
                            copy(path.join(src, childItemName), path.join(dest, childItemName))
                        })
                    } else {
                        dest = dest.replace("Viljami\\", "./").replace(/\//g, "/")
                        let dirname = path.dirname(dest);
                        if (!fs.existsSync(dirname)) {
                            await fs.mkdirSync(dirname, { recursive: true });
                        }
                        fs.copyFileSync(src, dest);
                        ++copied
                    }
                };
                await copy("./temp/" + file.split(".")[1] + "/", "./")
                let waiting = setInterval(async () => {
                    if (copied == expected) {
                        clearInterval(waiting)
                        resolve()
                    }
                }, 100)
            }
            catch (err) {
                reject(err)
            }
        })
    }

    /**
     * Main downloader function.
     */
    async main(file) {
        let event = new events.EventEmitter()
        return {
            promise: async function(){
                return new Promise(async (resolve, reject) => {
                    this._download(file, event).then(async () => {
                        event.emit("stage", null)
                        this._unzip(file).then(async () => {
                            event.emit("stage", null)
                            this._push(file).then(async () => {
                                resolve()
                            }).catch(async err => {
                                reject(err)
                            })
                        }).catch(async (err) => {
                            reject(err)
                        })
                    }).catch(async err => {
                        reject(err)
                    })
                })
            },
            listener: async function(){
                return event
            }
        }
    }
})
const UI = new (class Ui { // The UI class, this handles all the visual parts of this executable.
    constructor(){
        //Color codes
        this.colors = {
            // Text styling
            Reset: "\x1b[0m",
            Bright: "\x1b[1m",
            Dim: "\x1b[2m",
            Underscore: "\x1b[4m",
            Blink: "\x1b[5m",
            Reverse: "\x1b[7m",
            Hidden: "\x1b[8m",
            // Text colors
            Black: "\x1b[30m",
            Red: "\x1b[31m",
            Green: "\x1b[32m",
            Yellow: "\x1b[33m",
            Blue: "\x1b[34m",
            Magenta: "\x1b[35m",
            Cyan: "\x1b[36m",
            White: "\x1b[37m",
        }
        this.spinner = null
        this.spinnerState = null
        this.spinnerFrames = ["-","\\","|","/"] // This needs to be ASCII?
    }
    async log(data, color, spinner){
        color = color = undefined ? "": (this.colors[color] != undefined ? this.colors[color] : "") // Make sure the color exists and convert it to the colorcode¨
        spinner = spinner == undefined ? false : spinner // If the spinner setting parameter is missing, make it false bu default
        if(spinner == true){ //Should this text include a badass spinner?
            console.log("") // Create an empty line
            if(this.spinner != null) clearInterval(this.spinner) // Remove any currently spinning stuff
            this.spinnerState = null // Reset the frame state
            this.spinner = setInterval(async () => { //Simple loop to create a spinner before the last line of the console, really cool :p
                if(this.spinnerState == null) this.spinnerState = -1
                ++this.spinnerState // Move onto the next frame, or the the first frame
                process.stdout.clearLine() // Clear the last line in the console
                process.stdout.cursorTo(0) // Move the cursor to the start of the last line
                process.stdout.write(color)
                process.stdout.write("[" + this.spinnerFrames[this.spinnerState] + "] ")
                process.stdout.write(data)
                process.stdout.write(this.colors["Reset"]) // Log the data and spinner
                if(this.spinnerState == this.spinnerFrames.length-1) this.spinnerState = -1 // If the last frame of the spinner has been shown, go back to the first frame
            }, 200)
        }else { // Log the data normally, with colors if needed, the boring way normal way
            if(this.spinner != null) clearInterval(this.spinner) // Remove any currently spinning stuff
            this.spinnerState = null // Reset the frame state
            console.log("")
            console.log(color, data, this.colors["Reset"])
        }
    }
    async replace(data, color, spinner){
        if(this.spinner != null) clearInterval(this.spinner) // Remove any currently spinning stuff
        this.spinnerState = null // Reset the frame state
        process.stdout.clearLine() // Clear the last line in the console
        process.stdout.cursorTo(0) // Move the cursor to the start of the last line
        this.log(data, color, spinner) // Log normally as now the last line is empty and all spinners stopped
    }
    /**
     * Log the title to the console
     */
    async displayTitle(){
        this.log("")
        this.log("Running: ")
        this.log("  Viljami 0.2.0", "Green")
        this.log("")
    }
})
const functions = new (class Functions { // The functions class contains some common functions run throughout this executable. In short this is a class to store all functions in one place
    async checkIntegrity(){
        return new Promise(async (resolve, reject) => {
            let allItems = []
            let expected = 0
            let count = 0
            async function self(dir){
                ++expected
                fs.readdir("./" + dir, async (err, files) => { // Get files array
                    if(err != null){
                        reject(err)
                    }else {
                        let thisCount = 0
                        if(files.length == 0) {
                            ++count
                            if(count == expected){
                                if(fs.existsSync("./cache/integrity.txt")){
                                    fs.readFile("./cache/integrity.txt", async (err, data) => {
                                        if(err != null){
                                            reject(err)
                                        }else {
                                            data = data.toString()
                                            if(data === allItems.join(",")){
                                                resolve(allItems, true)
                                            }else {
                                                resolve(allItems, false)
                                            }
                                        }
                                    })
                                }else {
                                    resolve(allItems, false)
                                }
                            }
                        }
                        
                        files.forEach(async item => {
                            if(item == "themes" || item == "cache"){ // Ignore themes and cache folder
                                ++count
                                if(count == expected){
                                    if(fs.existsSync("./cache/integrity.txt")){
                                        fs.readFile("./cache/integrity.txt", async (err, data) => {
                                            if(err != null){
                                                reject(err)
                                            }else {
                                                data = data.toString()
                                                if(data === allItems.join(",")){
                                                    resolve(allItems, true)
                                                }else {
                                                    resolve(allItems, false)
                                                }
                                            }
                                        })
                                    }else {
                                        resolve(allItems, false)
                                    }
                                }
                            }else {
                                if(fs.statSync("./" + dir + "/" + item).isDirectory()) { // Scan item if it's a directory
                                    self(dir + "/" + item)
                                }else {
                                    allItems.push("./" + dir + "/" + item)
                                }
                                ++thisCount          
                                if(thisCount == files.length){
                                    ++count
                                    if(count == expected){
                                        if(fs.existsSync("./cache/integrity.txt")){
                                            fs.readFile("./cache/integrity.txt", async (err, data) => {
                                                if(err != null){
                                                    reject(err)
                                                }else {
                                                    data = data.toString()
                                                    if(data === allItems.join(",")){
                                                        resolve(allItems, true)
                                                    }else {
                                                        resolve(allItems, false)
                                                    }
                                                }
                                            })
                                        }else {
                                            resolve(allItems, false)
                                        }
                                    }
                                }
                            }
                        })
                    }
                })
            }
            self("")
        })
    }
    async _update(){ // Actually update the application
        return {
            promise: async function(){
                return new Promise(async (resolve, reject) => {

                })
            }
        }
    }
    async update(){ // Check for updates
        return new Promise(async (resolve, reject) => {
            this.checkIntegrity().then(async (array, result) => {
                if(result == false){
                    // Fix required
                    UI.log("There seems to be some problems with your installation")
                }else {
                    // Check for updates
                    if(fs.existsSync("./configuration/config.json")){
                        let version = require("./configuration/config.json").version
                        request.get("http://esinko.net/downloads/viljami/version.txt", {}).then(async res => {
                            if(res.status === 200) {
                                if(res.body.toString() == version.toString()) {
                                    UI.log("You are up to date!")
                                    resolve()
                                }else { 
                                    UI.log("You need to update")
                                    this._update()
                                }
                            }else {
                                UI.log("Unable to get current version details. Try again later. Application will launch in 5 seconds", "Red")
                                setTimeout(async () => {
                                    resolve()
                                }, 5000)
                            }
                        }).catch(async err => {
                            UI.log(err)
                            console.log(err.stack)
                        })
                    }else {
                        UI.log("It seems some expected config values or files are missing, so we need to fix that with an update.")
                    }
                }
            })
        })
    }
    async launch(){
        return new Promise(async (resolve, reject) => {
            // All code to run before launch
            resolve()
        })
    }
})

/* Code */
UI.displayTitle()
if(fs.existsSync("./bin/script/request.js") && fs.existsSync("./cache/integrity.txt")){ //This means that a version check cannot be performed -> This is a first run of the application
    // Perform the install
    UI.log("It looks like you are running Viljami for the first time. Please wait as we install the application runtime and other required files. The download will begin shortly.")
    UI.log("[INSTALLER]: Getting ready to download application runtime", "Yellow", true)
    let installer = updater.main("runtime.zip")
    let to = null
    let progress = 0
    UI.log("0% [" + "] 100% | Now: " + "%")
    installer.promise().then(async () => {
        UI.log("The application runtime has now been downloaded and installed. Now we just need to install the application binaries / scripts. This will be delivered via an update package.")
        // Continue download here
        // Perform a version check and integrity check
        UI.log("Checking file integrity and for updates", undefined, true)
        functions.update().then(async () => {
            UI.log("Launching application", "Green", true)
                functions.launch().then(async () => {
                    process.exit(3) // All done!
                }).catch(async err => {
                    UI.log(err)
                    console.log(err.stack)
                })
        }).catch(async err => {
            UI.log(err)
            console.log(err.stack)
        })
    })
    let stage = [
        "[INSTALLER]: Getting ready to unpack downloaded archive",
        "[INSTALLER]: Overwriting / Writing files to the application directories"
    ]
    let stageCount = -1
    installer.listener().on("stage", async () => {
        ++stageCount
        UI.log(stage[stageCount], "Yellow")
        UI.log("0% [" + "] 100% | Now: " + "%")
    })
    installer.listener().on("to", async data => {
        to = data
        progress = 0
        let bars = function(){
            let count = ""
            for(let i = 0;(progress * 100 / to).toFixed(1) != i;i++){
                count = count + "="
            }
            return count;
        }
        UI.replace("0% [" + bars() + "] 100% | Now: " (progress * 100 / to) + "%")
    })
    installer.listener().on("prog", async () => {
        ++progress
    })
}else {
    // Perform a version check and integrity check
    UI.log("Checking file integrity and for updates", undefined, true)
    functions.update().then(async () => {
        UI.log("Launching application", "Green", true)
            functions.launch().then(async () => {
                process.exit(3) // All done!
            }).catch(async err => {
                UI.log(err)
                console.log(err.stack)
            })
    }).catch(async err => {
        UI.log(err)
        console.log(err.stack)
    })
}