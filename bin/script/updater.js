//Development
require('nw.gui').Window.get().showDevTools();

//Version
const version = "0.0.1"

/* 1st level binaries */
const fs = require("fs")
const unzip = require("../../lib/modules/unzip.js")
const _css = require("../../bin/script/theme.js")
const config = require("../../configuration/config.json")
const request = require("../../bin/script/request.js")
const session = require("../script/session.js")

/* Css */
let documentCss = new _css("../../configuration/themes/" + config.theme + "/theme.json", "updater", version, document, console)
documentCss.apply()
//Fix broken load animation
setTimeout(async () => {
    let animation = document.createElement("link")
    animation.rel = "stylesheet"
    animation.type = "text/css"
    animation.href = "../../cache/animations.css"
    document.getElementsByTagName("head")[0].append(animation)
}, 100)
/* Globals */
global.interrupt = false

/* Classes */
const updater = new (class Updater {
    constructor(version) {
        this.version = version
    }
    /**
     * Download binaries
     */
    async _download() {
        return new Promise(async (resolve, reject) => {
            try {
                let options = {
                    hostname: "esinko.net",
                    path: '/downloads/viljami/application.zip',
                    method: 'GET'
                };
                if (fs.existsSync("./temp")) {
                    async function del(path2) {
                        if (path2 == undefined) path2 = "./temp"
                        fs.readdirSync(path2).forEach((file, index) => {
                            const curPath = path.join(path2, file);
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
                await fs.mkdirSync("./temp")
                await fs.mkdirSync("./temp/application/")
                let temp = fs.createWriteStream("./temp/application.zip")
                let req = await http.request(options, async res => {
                    res.pipe(temp)
                });
                await req.end();
                req.on('error', async e => {
                    console.log("[UPDATER]: " + e + "\nStack: " + e.stack)
                });
                temp.on("close", async () => {
                    let unzipper = fs.createReadStream("./temp/application.zip")
                    let parser = unzipper.pipe(unzip.Extract({
                        path: "./temp/application/"
                    }))
                    parser.on('entry', entry => entry.autodrain())
                        .promise()
                        .then(async () => {
                            await fs.unlinkSync("./bin/temp.zip")
                            resolve()
                        }, e => {
                            throw new Error(e)
                        })
                })
            }
            catch (err) {
                reject(err)
            }
        })
    }

    /**
     * Replace / create new / old application files
     */
    async _push() {
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
                            copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName))
                        })
                    } else {
                        ++copied
                        fs.copyFileSync(src, dest);
                    }
                };
                await copy("./temp/application/", "./")
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
     * Main updater function. Here you check what the state of the application is to see what to do about missing or outdated libraries
     */
    async main() {
        request.get("http://esinko.net/download/viljami/version.txt", {}).then(async res => {
            if (res.status === 200) {
                if (res.body.toString() == version) {
                    //We have the same version, with errors
                    console.log("[UPDATER]: No updates required. Downloading missing application files.")
                    this._download().then(async () => {
                        this._push().then(async () => {
                            console.log("[UPDATER]: Updated application.")
                            document.getElementById("text").innerHTML = "Updated, restarting"
                            window.location.reload() //This good enough?
                        }).catch(async err => {
                            console.log("[UPDATER]: Error replacing/writing application files: " + err.message + "\nStack: " + err.stack)
                        })
                    }).catch(async err => {
                        console.log("[UPDATER]: Error while downloading application archive: " + err.message + "\nStack: " + err.stack)
                    })
                } else {
                    //New version available
                    console.log("[UPDATER]: New version available")
                }
            } else {

            }
        }).catch(async error => {
            console.log("[UPDATER]: " + error + "\nStack: " + error.stack)
        })
    }
})(version)
const updaterSession = new session()
updaterSession.create().then(async () => {
    //Session created
    console.log("[MAIN]: Session created")
}).catch(async err => {
    global.interrupt = err
})

try {
    request.get("http://esinko.net/downloads/viljami/version.txt", {}).then(async res => {
        if (res.status === 200) {
            if (res.body.toString() == version.toString()) {
                document.getElementById("text").innerHTML = "Up to date! Starting..."
                setTimeout(async () => {
                    if(global.interrupt != false){
                        document.getElementById("text").innerHTML = global.interrupt
                    }else {
                        window.location.href = "./app.html"
                    }
                }, 2000)
            } else {
                document.getElementById("text").innerHTML = "Update required<br>Updating..."
                updater.main()
            }
        } else {
            document.getElementById("text").innerHTML = "Failed to fetch updates"
            document.getElementById("text").style.color = "Red"
            document.getElementById("loader").style.visibility = "hidden"
        }
    }).catch(async err => {
        console.log(err)
        document.getElementById("text").innerHTML = "Failed to fetch updates"
        document.getElementById("text").style.color = "Red"
        document.getElementById("loader").style.visibility = "hidden"
    })
}
catch(err){
    console.log(err)
    document.getElementById("text").innerHTML = err
    document.getElementById("text").style.color = "Red"
    document.getElementById("loader").style.visibility = "hidden"
}