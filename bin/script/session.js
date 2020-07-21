module.exports = class Session {
    constructor(filePath){
        this.filePath = filePath != undefined ? filePath : "../session.txt"
        this.data = null
    }
    /**
     * Get the session token. Returns promise with an event emitter.
     * Events: change, error.
     */
    async watch(){
        let fs = require("fs")
        let events = require("events")
        return new Promise(async (resolve, reject) => {
            if(fs.existsSync(this.filePath)){
                let emitter = new events.EventEmitter()
                resolve(emitter)
                fs.watchFile(this.filePath, async (current, previous) => {
                    try {
                        let file = await fs.readFileSync(this.filePath).toString("utf8")
                        emitter.emit("change", file)
                    }
                    catch(err){
                        emitter.emit("error", err)
                    }
                })
            }else {
                reject("No such file exists. Use <module>.create().")
            }
        })
    }
    /**
     * Create a session file, returns promise.
     */
    async create(){
        let fs = require("fs")
        return new Promise(async (resolve, reject) => {
            try {
                let randomisedSessionString = [...Array(256)].reduce(a=>a+"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#¤%&/()=?@£${[]}*.,-<>|"[~~(Math.random()*"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#¤%&/()=?@£${[]}*.,-<>|".length)],'')
                await fs.writeFileSync(this.filePath, randomisedSessionString)
                resolve()
            }
            catch(err){
                reject(err)
            }
        })
    }
}