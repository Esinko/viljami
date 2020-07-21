module.exports = class Server {
    constructor(console){
        this.console = console
    }
    async start(){
        /* Require */
        const express = require("express")
        const fs = require("fs")
        const request = require("../script/request.js")
        try {
            global.session = fs.readFileSync("./bin/session.txt").toString()
            if(global.session.split("").length != 256){
                throw new Error("Invalid session lenght")
            }
        }
        catch(err){
            this.console.log("[SERVER]: " + err + "\nStack:" + err.stack)
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
        /* Server */
        //Setup server
        local.post("/set", async (req, res) => {
            this.console.log("Incomming")
            if(req.hostname == "localhost"){
                if(req.query.session != global.session){
                    res.status(401).send("Unauthorized")
                }else {
                    this.console.log("Setting?")
                    if(req.query.token == undefined){
                        res.status(400).send("Missing token from request query")
                    }else if(req.query.path == undefined){
                        res.status(400).send("Missing path from request query")
                    }else {
                        global.console.log("set", req.query.path, req.query.token)
                        _memory.user.path = req.query.path
                        _memory.user.token = req.query.token
                        res.status(200).send("Set")
                    }
                }
            }else {
                res.status(401).send("Unauthorized.")
            }
        })
        // API
        local.post("/api", async (req, res) => {
            if(req.hostname == "localhost"){
                if(req.query.session != global.session){
                    res.status(401).send("Unauthorized.")
                }else {
                    if(req.query.path != undefined){
                        this.console.log(_memory.user.path + "/" + req.query.path)
                        global.console.log(_memory.user.token)
                        request.get(_memory.user.path + "/" + req.query.path, {headers: { //Wilma API request happens here
                            "Cookie": "Wilma2SID=" + _memory.user.token //Pass the token
                        }, https: true}).then(async result => {
                            global.console.log(result)
                            result.body = result.body.toString("utf8") //From buffer to string, Move this later???
                            res.status(200).send(result)
                        }).catch(async err => {
                            this.console.log("[SERVER]: " + err)
                            res.status(500).send("Unexpected error occured: " + err)
                        })
                    }else {
                        res.status(400).send("Missing path!")
                    }
                }
            }else {
                res.status(401).send("Unauthorized.")
            }
        })
        /* Listen */
        local.listen(2000, async () => {
            this.console.log("[SERVER]: Listening")
        })
    }
}