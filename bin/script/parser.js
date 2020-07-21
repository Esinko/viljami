//MEMO
//types:
//1: opettaja
//2: oppilas
//3: henkilökunta
module.exports = new (class Parser {
    async infos(data){
        return new Promise(async (resolve, reject) => {
            try {
                data = data.replace(/\\\"/g, '"').replace(/\\n/g, "").replace(/\\r/g, "") //Correct formatting
                data = data.split('<div class="panel tab-content">')[1].split('<div class="panel hidden-md-up">')[0] //Split to expected content
                data = data.split('<h2 class="no-border margin-bottom-inline no-bottom-padding">') //Split to every individual info
                data.splice(0, 1) //Remove the first split point definer
                let newData = []
                let count = 0
                data.forEach(async info => {
                    let date = info.split("</h2>")[0]
                    if(info.split("<h3>")[1] == undefined){
                        console.log("ERROR::::::::::\n" + info)
                    }
                    let title = info.split("<h3>")[1].split("</h3>")[0]
                    let id = info.split('<a href="/news/')[1].split('"')[0]
                    let authorId = info.includes('<a href="/profiles/teachers/') ? info.split('<a href="/profiles/teachers/')[1].split('"')[0] : null
                    let authorName = info.includes('<a href="/profiles/teachers/') ? info.split('class="profile-link" title="')[1].split('"')[0] : null
                    let authorShortName = info.includes('<a href="/profiles/teachers/') ? info.split('<a href="/profiles/teachers/' + authorId + '" class="profile-link" title="' + authorName + '">')[1].split("<")[0] : null
                    let pinned = info.includes('<span class="vismaicon vismaicon-sm vismaicon-locked" title="Pysyvä tiedote"></span>') ? true : false
                    newData.push({
                        date: date,
                        title: title,
                        id: id,
                        author: authorId != null ? {
                            id: authorId,
                            name: authorName,
                            shortName: authorShortName
                        } : null,
                        pinned: pinned
                    })
                    ++count
                    if(count == data.length){
                        resolve(newData)
                    }
                })
            }
            catch(err){
                reject(err)
            }
        })
    }
    async schedule(data){
        
    }
    async messages(data){
        return new Promise(async (resolve, reject) => {
            try {
                data = JSON.parse(data)
                if(data.Status == "200"){
                    if(data.Messages != undefined){
                        let count = 0
                        let construct = []
                        data.Messages.forEach(async message => {
                            let others = []
                            let count2 = 0
                            message.Senders.forEach(async sender => {
                                if(sender.Name != message.Sender){
                                    others.push({
                                        id: sender.Href.split("\/")[2],
                                        name: sender.Name
                                    })
                                }
                                ++count2
                                if(count2 == message.Senders.length){
                                    construct.push({
                                        id: message.Id,
                                        title: message.Subject,
                                        timestamp: message.TimeStamp.split("-")[2].split(" ")[0] + "." + message.TimeStamp.split("-")[1] + " " + message.TimeStamp.split(" ")[1],
                                        category: message.Folder,
                                        sender: {
                                            id: message.SenderId, // statement ? true : false
                                            //Note: The message sendertype conversion is just a guess and may be invalid!!!
                                            type: message.SenderType === 0 ? "Huoltaja" : (message.SenderType === 1 ? "Opettaja" : (message.SenderType === 2 ? "Oppilas" : (message.SenderType === 3 ? "Henkilökunta" : "Tuntematon"))),
                                            name: message.Sender,
                                            others: others
                                        }
                                    })
                                    ++count
                                }
                            })
                            if(count == data.Messages.length){
                                resolve(construct)
                            }
                        })
                    }else {
                        resolve([])
                    }
                }else {
                    reject("Unexpected status code: " + data.Status)
                }
            }
            catch(err){
                reject(err)
            }
        })
    }
})