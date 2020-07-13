/* 1st level binaries */
const puppeteer = require("puppeteer")
const _css2 = require("../script/theme.js")
const parser = require("../script/parser.js")
const config = require("../../configuration/config.json")
const request = require("../script/request.js")
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

/* Classes */
const loginFunction = async function (path) {
    return new Promise(async (resolve, reject) => {
        puppeteer.launch({ headless: false, executablePath: "./lib/nw/nw.exe", args: ['--app=' + path, '--disable-infobars', '--enable-automation', '--window-size=410,510'], defaultViewport: null , ignoreDefaultArgs: true}).then(browser => {
            let cookies = null
            browser.on("disconnected", async function (err) {
                if (cookies == null) {
                    reject("Virhe avatessa kirjautumisikkunaa<br>tai kirjautuminen keskeytettiin")
                }
            })
            //This triggers when we're done
            browser.on("close", async () => {
                if (cookies == null) {
                    reject("Kirjautuminen epäonnistui")
                }
            })
            //Load the page and edit it to fit the login window
            browser.pages().then(pages => {
                let waited = 0
                let timeout = setInterval(async function () {
                    if (waited * 10 == "30") {
                        browser.close()
                    }
                }, 100)
                let first = false
                pages[0].setViewport({ width: 410, height: 510 }).then(() => {
                    pages[0].on("domcontentloaded", async () => {
                        if (first) {
                            cookies = await pages[0].cookies()
                            console.log("Nav trigger")
                            resolve(cookies)
                            browser.close()
                        } else {
                            first = true
                            pages[0].click("#approve-cookies").then(() => {
                                pages[0].evaluate(page => {
                                    let toEdit = document.getElementsByClassName("col-md-pull-4")[0]
                                    toEdit.remove()
                                    let items = document.getElementsByTagName("a")
                                    for (let i = 0; items.length - 1 > i; i++) {
                                        if (items[i].children[0] != undefined && items[i].children[0].className == "Mobile") {
                                            items[i].remove()
                                        }
                                    }
                                }).then(() => {
                                    console.log("Page loaded")
                                })
                            })
                        }
                    })
                })
            })
        })
    })
}
const fill = new (class Fill {
    async overview(){
        //"Tiedotteet"
        request.post("http://localhost:2000/api?session=" + encodeURIComponent(fs.readFileSync("./bin/session.txt").toString()) + "&path=news", {}).then(async result => {
            if(result.status == 200){
                let data = result.body.toString("utf8") //Get the body
                parser.infos(data).then(async parsed => {
                    parsed.forEach(async handle => {
                        let element = document.createElement("li")
                        //Class?
                        element.innerHTML = (handle.pinned ? "<p style='text-decoration: bold'>" : "<p>") + "<" + handle.date + "> <a href='/?tiedote=" + handle.id + "'>" + handle.title + "<a> " + (handle.author != null ? "[" + handle.author.shortName + "]": "") + "</p>"
                        document.getElementById("infoList").appendChild(element)
                    })
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

//Login related
let login = document.getElementById("loginButton")
let read = document.getElementById("agree")
let agreed = false
let input = document.getElementById("wilmaPath")
login.onclick = async function () {
    document.getElementById("error").innerHTML = ""
    if (agreed) {
        if (/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/.test(input.value)) {
            if (input.value.startsWith("http://")) {
                request.get(input.value, {https: false}).then(async res => {
                    if (res.status.toString() == 200) {
                        loginFunction(input.value).then(async cookies => {
                            document.getElementById("error").style.color = "Green"
                            document.getElementById("error").innerHTML = "Ladataan..."
                            request.post("http://127.0.0.1:2000/set?token=" + cookies[1].value + "&path=" + input.value).then(async res => {
                                documentCss2.reset().then(async () => { 
                                    console.log("Reset view")
                                    documentCss2 = new _css2("../settings/themes/" + config.theme + "/theme.json", "app", version)
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
                        }).catch(async errorMessage => {
                            document.getElementById("error").innerHTML = errorMessage
                        })
                    } else {
                        document.getElementById("error").innerHTML = "Palvelin ei ole olemassa tai ei vastaa"
                    }
                }).catch(async err => {
                    console.log(err)
                    document.getElementById("error").innerHTML = "Palvelimeen yhdistäminen ei onnistu"
                })
            } else {
                request.get(input.value, {https: true}).then(async res => {
                    if (res.status.toString() == 200) {
                        loginFunction(input.value).then(async cookies => {
                            document.getElementById("error").style.color = "Green"
                            document.getElementById("error").innerHTML = "Ladataan..."
                            //console.log(cookies[1].value) //Wilma2SID
                            request.post("http://localhost:2000/set?token=" + cookies[1].value + "&path=" + input.value + "&session=" + encodeURIComponent(fs.readFileSync("./bin/session.txt").toString()), {}).then(async res => {
                                documentCss2.reset().then(async () => { 
                                    console.log("Reset view")
                                    documentCss2 = new _css2("../settings/themes/" + config.theme + "/theme.json", "app", version)
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
                        }).catch(async errorMessage => {
                            document.getElementById("error").innerHTML = errorMessage
                        })
                    } else {
                        document.getElementById("error").innerHTML = "Palvelin ei ole olemassa tai ei vastaa"
                    }
                }).catch(async err => {
                    console.log(err)
                    document.getElementById("error").innerHTML = "Palvelimeen yhdistäminen ei onnistu"
                })
            }
        } else {
            document.getElementById("error").innerHTML = "Palvelinosoite on virheellinen"
        }
    } else {
        document.getElementById("error").innerHTML = "Sinun täytyy hyväksyä lisenssiehdot"
    }
}
read.onclick = async function () {
    if (agreed) {
        agreed = false
    } else {
        agreed = true
    }
}