module.exports = class Theme {
    constructor(path, list){
        this.path = path
        this.list = list
    }

    async apply(){
        try {
            let theme = require(this.path)
            Object.keys(theme.list[this.list].css).forEach(async id => {
                let style = theme.list[this.list].css[id]
                Object.keys(style).forEach(async name => {
                    let value = style[name]
                    console.log(id)
                    document.getElementById(id).style[name] = value
                })
            })
        }
        catch(err){
            console.log("[THEME]: " + err + "\nStack: " + err.stack)
        }
    }
}