module.exports = class Theme {
    constructor(path, list){
        this.path = path
        this.list = list
        this.version = version
        this.theme = path.split("/themes/")[1].split("/")[0]
    }
    async _import(){
        try {
            //Restructure later?
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
            console.log("[THEME]: " + err + "\nStack: " + err.stack)
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
                console.log(id)
                Object.keys(style).forEach(async name => {
                    let value = style[name]
                    if(document.getElementById(id) == null){
                        document.getElementsByName(id).forEach(async elem => {
                            elem.style[name] = value
                        })
                    }else {
                        document.getElementById(id).style[name] = value
                    }
                })
            })
        }
        catch(err){
            console.log("[THEME]: " + err + "\nStack: " + err.stack)
        }
    }
    async reset(){
        return new Promise(async (resolve, reject) => {
            try {
                let all = document.getElementsByTagName("*")
                for(let i=0; all.length-1 > i;i++){
                    let element_ = all[i]
                    element_.removeAttribute("style")
                    console.log("Removed " + element_.id)
                    if(i+1 == all.length-1){
                        console.log("Cleared")
                        resolve()
                    }
                }
            }
            catch(err){
                console.log("[THEME]: " + err + "\nStack: " + err.stack)
                reject()
            }
        })
    }
}