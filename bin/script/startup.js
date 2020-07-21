nw.Window.open("./bin/viewport/updater.html", {}, async (win) => {
    let frame = null
    win.on("document-start", async (frame_) => {
        frame = frame_
    })
    win.on("navigate", async (frame, url, policy) => {
        if(win.Window.href.startsWith("chrome://")){
            win.reloadDev()
            win.eval(frame, "window.location.href = './bin/viewport/crash.html'") 
        }
    })
    win.on("loaded", async () => {
        if(win.Window.href.startsWith("chrome://")){
            win.reloadDev()
            win.eval(frame, "window.location.href = './bin/viewport/crash.html'") 
        }
    })
})