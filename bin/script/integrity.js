module.exports = async function checkIntegrity(){
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