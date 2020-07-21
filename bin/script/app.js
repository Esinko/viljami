/* 1st level binaries */
const puppeteer = require("puppeteer")
const _css2 = require("../script/theme.js")
const parser = require("../script/parser.js")
const config = require("../../configuration/config.json")
const request = require("../script/request.js")
const session = require("../script/session.js")
const fs = require("fs")

/* Css / general */
const version = "0.0.1"
//Apply css
let documentCss2 = new _css2("../../configuration/themes/" + config.theme + "/theme.json", "login", version, document, console)
documentCss2.apply()

//Register images
const images = ["logo", "settingsImage", "logoutImage"]
images.forEach(async elem => {
    elem = document.getElementById(elem)
    elem.src = elem.src.replace("%theme%", config.theme)
})

//Globals
global.shouldClose = false
global.console = console
global.session = null

//Session handlig
const appSession = new session()
appSession.watch().then(async event => {
    event.on("change", async token => {
        global.session = token
    })
    event.on("error", async error => {
        console.log(error)
    })
}).catch(async err => {
    console.log(err)
})

/* Classes */
const loginFunction = async function (path) {
    return new Promise(async (resolve, reject) => {
        nw.Window.open(path + "?path=" + path + "&session=" + encodeURIComponent(global.session), {new_instance: false, inject_js_end: "./bin/script/login.js"}, async (win) => {
            let first = true
            win.onDocumentStart.addListener(async () => {
                let found = null
                win.cookies.getAll({}, async (cookies) => {
                    let count = 0
                    cookies.forEach(async cookie => {
                        console.log(cookie)
                        if(cookie.name == "Wilma2SID"){
                            console.log("found")
                            found = cookie.value
                        }
                        ++count
                        console.log(count, cookies.length)
                        if(count == cookies.length){
                            console.log("Resolving")
                            if(found != null){
                                console.log("Resolved!")
                                global.shouldClose = true
                                resolve(found)
                            }else {
                                if(first == false){
                                    reject()
                                }
                                first = false
                            }
                        }
                    })
                })
            })
            let i = setInterval(async () => {
                if(global.shouldClose){
                    clearInterval(i)
                    win.close(true)
                    global.shouldClose = false
                }
            })
        })
    })
}
const fill = new (class Fill {
    async overview(){
        //News
        request.post("http://localhost:2000/api?session=" + encodeURIComponent(global.session) + "&path=news", {}).then(async result => {
            if(result.status == 200){
                let data = result.body.toString("utf8") //Get the body
                parser.infos(data).then(async parsed => {
                    let count = 0
                    parsed.forEach(async handle => {
                        let element = document.createElement("li")
                        //Class?
                        element.setAttribute("name", "item")
                        element.innerHTML = "<div name='itemParent'><p name='itemTextTopLeft'>" + handle.date + "</p><p name='itemTextMain'><a href='/?tiedote=" + handle.id + "'>" + handle.title + "</a></p>" + "<p name='itemTextTopMiddle'> <a>" + (handle.author != null ? "[" + handle.author.shortName + "]": "") + "</a></p></div>"
                        document.getElementById("infoList").appendChild(element)
                        ++count
                        if(count == parsed.length){
                            documentCss2.applySingle(["item", "itemTextTopLeft", "itemTextMain", "itemParent", "itemTextTopMiddle"])
                        }
                    })
                }).catch(async err => {
                    console.log(err)
                })
            }else {
                console.log("Overview fill failed due to a backend error:", result)
            }
        }).catch(async err => {
            console.log("Unexpected error")
        })
        //Messages
        request.post("http://localhost:2000/api?session=" + encodeURIComponent(global.session) + "&path=messages/list", {}).then(async result => {
            if(result.status == 200){
                let data = JSON.parse(result.body.toString("utf8")).body //Get the body¨
                parser.messages(data).then(async parsed => {
                    if(parsed.length != 0){
                        let count = 0
                        parsed.forEach(async handle => {
                            let element = document.createElement("li")
                            //Class?
                            element.setAttribute("name", "item")
                            element.innerHTML = "<div name='itemParent'><p name='itemTextTopLeft'>" + handle.timestamp + "</p><p name='itemTextMain'><a href='/?message=" + handle.id + "'>" + handle.title + "</a></p>" + "<p name='itemTextTopRight'> <a>" + (handle.sender != null ? (handle.sender.others.length == 0 ? "" + handle.sender.name + "" : "" + handle.sender.name + ", ...") : "") + "</a></p></div>"
                            document.getElementById("messageList").appendChild(element)
                            ++count
                            if(count == parsed.length){
                                documentCss2.applySingle(["item", "itemTextTopLeft", "itemTextMain", "itemParent", "itemTextTopRight"])
                            }
                        })
                    }else {
                        let element = document.createElement("li")
                        element.innerHTML = "<div name='itemParent'><p name='itemTextMain'>Sinulla ei ole vielä viestejä</p></div>"
                        document.getElementById("messageList").appendChild(element)
                        documentCss2.applySingle(["itemParent", "itemTextMain"])
                    }
                }).catch(async err => {
                    console.log(err)
                })
            }else {
                console.log("Overview fill failed due to a backend error:", result)
            }
        }).catch(async err => {
            console.log("Unexpected error")
        })
    }
})

/* Code */
//Edit the window configuration
let me = require('nw.gui').Window.get()
me.resizeTo(900, 600)
me.title = "Viljami - Kirjautuminen"
me.setResizable(true)

//Start the server
const _server = require("../script/server.js")
const server = new _server(console)
server.start()

//Login related
let login = document.getElementById("loginButton")
let read = document.getElementById("agree")
let agreed = false
let input = document.getElementById("wilmaPath")
let open = false
login.onclick = async function () {
    document.getElementById("error").innerHTML = ""
    if (agreed) {
        if(open == false){
            open = true
            if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(input.value)) {
                request.get(input.value, {https: (input.value.startsWith("https://") ? true : false)}).then(async res => {
                    if (res.status.toString() == 200) {
                        loginFunction(input.value).then(async (token) => {
                            open = false
                            console.log("Resolved")
                            console.log("http://localhost:2000/set?token=" + token + "&path=" + encodeURIComponent(input.value))
                            request.post("http://localhost:2000/set?token=" + token + "&path=" + input.value + "&session=" + encodeURIComponent(global.session), {https: false}).then(async res => {
                                console.log("sent")
                                documentCss2.reset().then(async () => { 
                                    documentCss2 = new _css2("../../configuration/themes/" + config.theme + "/theme.json", "app", version, document, console)
                                    documentCss2.apply()
                                    fill.overview()
                                    //App view created
                                }).catch(async (err) => {
                                    documentCss2.apply()
                                    document.getElementById("error").style.color = "Red"
                                    document.getElementById("error").innerHTML = "Virhe avatessa sovellusnäkymää\n" + err
                                })
                            }).catch(async err => {
                                console.log(err)
                                document.getElementById("error").style.color = "Red"
                                document.getElementById("error").innerHTML = "Virhe session\naloittamisessa"
                            })
                        }).catch(async err => {
                            open = false
                            console.log(err)
                            document.getElementById("error").style.color = "Red"
                            document.getElementById("error").innerHTML = "Kirjautumien epäonnistui."
                        })
                    } else {
                        document.getElementById("error").innerHTML = "Palvelin ei ole olemassa tai se ei vastaa."
                    }
                }).catch(async err => {
                    console.log(err)
                    document.getElementById("error").innerHTML = "Palvelimeen yhdistäminen ei onnistu."
                })
            } else {
                document.getElementById("error").innerHTML = "Palvelinosoite on virheellinen"
            }
        }else {
            document.getElementById("error").innerHTML = "Kirjautuminen jo käynnissä<br>sulje nykyinen kirjautumisikkuna."
        }
    } else {
        document.getElementById("error").innerHTML = "Sinun täytyy hyväksyä lisenssiehdot."
    }
}
read.onclick = async function () {
    if (agreed) {
        agreed = false
    } else {
        agreed = true
    }
}