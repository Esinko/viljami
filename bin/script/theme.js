module.exports = class Theme {
    constructor(path, list, version, document, console){
        this.path = path
        this.list = list
        this.version = version
        this.theme = path.split("/themes/")[1].split("/")[0]
        this.document = document
        this.console = console
    }
    async _import(){
        try {
            //Restructure later?
            return;
            let fs = require("fs")
            let animation = fs.readFileSync("./lib/local_assets/animation.css").toString()
            let fonts = fs.readFileSync("./lib/local_assets/animation.css").toString()
            let general = fs.readFileSync("./lib/local_assets/general.css").toString()
            if(fs.existsSync("./settings/themes/" + this.theme + "/animation.css")){
                if(!animation.includes("\n/* THEME: " + this.path + " - " + this.version + "*/\n" + fs.readFileSync("./settings/themes/" + this.theme + "/animation.css").toString())){
                    let data = "\n/* THEME: " + this.path + " - " + this.version + "*/\n" + fs.readFileSync("./settings/themes/" + this.theme + "/animation.css").toString() 
                    fs.writeFileSync("./lib/local_assets/animation.css", data)
                }
            }
            if(!fonts.includes("\n/* THEME: " + this.path + " - " + this.version + "*/\n" + fs.readFileSync("./settings/themes/" + this.theme + "/fonts.css").toString())){
                if(fs.existsSync("./settings/themes/" + this.theme + "/fonts.css")){
                    let data = "\n/* THEME: " + this.path + " - " + this.version + "*/\n" + fs.readFileSync("./settings/themes/" + this.theme + "/fonts.css").toString() 
                    fs.writeFileSync("./lib/local_assets/animation.css", data)
                }
            }
            if(fs.existsSync("./settings/themes/" + this.theme + "/fonts.css")){
                if(!fonts.includes("\n/* THEME: " + this.path + " - " + this.version + "*/\n" + fs.readFileSync("./settings/themes/" + this.theme + "/fonts.css").toString())){
                    let data = "\n/* THEME: " + this.path + " - " + this.version + "*/\n" + fs.readFileSync("./settings/themes/" + this.theme + "/fonts.css").toString() 
                    fs.writeFileSync("./lib/local_assets/animation.css", data)
                }
            }
            if(fs.existsSync("../settings/themes/" + this.theme + "/general.css")){
                if(!general.includes("\n/* THEME: " + this.path + " - " + this.version + "*/\n" + fs.readFileSync("./settings/themes/" + this.theme + "/general.css").toString())){
                    let data = "\n/* THEME: " + this.path + " - " + this.version + "*/\n" + fs.readFileSync("./settings/themes/" + this.theme + "/general.css").toString() 
                    fs.writeFileSync("./lib/local_assets/animation.css", data)
                }
            }
        }
        catch(err){
            this.console.log("[THEME]: " + err + "\nStack: " + err.stack)
        }
    }
    async apply(){
        try {
            this._import()
            let theme = require(this.path)
            if(theme.version != this.version){
                throw new Error("Outdated theme file")
            }
            Object.keys(theme.list[this.list].css).forEach(async id => {
                let style = theme.list[this.list].css[id]
                Object.keys(style).forEach(async name => {
                    let value = style[name]
                    if(this.document.getElementById(id) == null){
                        this.document.getElementsByName(id).forEach(async elem => {
                            elem.style[name] = value
                        })
                    }else {
                        this.document.getElementById(id).style[name] = value
                    }
                })
            })
        }
        catch(err){
            this.console.log("[THEME]: " + err + "\nStack: " + err.stack)
        }
    }
    /**
     * 
     * @param {Array|String} id 
     */
    async applySingle(id){
        return new Promise(async (resolve, reject) => {
            try {
                this._import()
                let theme = require(this.path)
                if(theme.version != this.version){
                    throw new Error("Outdated theme file")
                }
                if(typeof id == "string"){
                    if(theme.list[this.list].css[id] != undefined){
                        let style = theme.list[this.list].css[id]
                        Object.keys(style).forEach(async name => {
                            let value = style[name]
                            if(this.document.getElementById(id) == null){
                                this.document.getElementsByName(id).forEach(async elem => {
                                    elem.style[name] = value
                                })
                            }else {
                                this.document.getElementById(id).style[name] = value
                            }
                        })
                    }else {
                        reject("No such class exists.")
                    }
                }else {
                    let count = 0
                    id.forEach(async actualId => {
                        if(theme.list[this.list].css[actualId] != undefined){
                            let style = theme.list[this.list].css[actualId]
                            Object.keys(style).forEach(async name => {
                                let value = style[name]
                                if(this.document.getElementById(actualId) == null){
                                    this.document.getElementsByName(actualId).forEach(async elem => {
                                        elem.style[name] = value
                                    })
                                }else {
                                    this.document.getElementById(actualId).style[name] = value
                                }
                            })
                            ++count
                            if(count == id.length){
                                resolve()
                            }
                        }else {
                            reject("No such class exists.")
                        }
                    })  
                }
            }
            catch(err){
                reject(err)
            }
        })
    }
    async reset(){
        return new Promise(async (resolve, reject) => {
            try {
                let all = this.document.getElementsByTagName("*")
                for(let i=0; all.length-1 > i;i++){
                    let element_ = all[i]
                    element_.removeAttribute("style")
                    if(i+1 == all.length-1){
                        resolve()
                    }
                }
            }
            catch(err){
                this.console.log("[THEME]: " + err + "\nStack: " + err.stack)
                reject()
            }
        })
    }
}