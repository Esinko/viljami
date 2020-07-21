//window.resizeTo(420, 520)
//let frame = document.getElementById("frame")
//let _url = window.location.href.split("?path=")[1].split("&")[0]
//let sessionKey = window.location.href.split("session=")[1]
//frame.src = _url
//function urlChange(){
//    let error = frame.contentWindow.document.getElementsByClassName("align-left")[0]
//    if(frame.src.includes("?loginfailed")){
//        frame.src = _url
//    }else if(frame.src == _url){
//        document.title = frame.contentWindow.document.title
//        //Check for cookies
//        if(document.cookie.includes("Wilma2SID")){
//            //Send cookies to local server
//            let cookies = cookies.split(";")
//            request.post("http://localhost2000/set?token=" + cookies[1].split("="[1]) + "&path=" + _url).then(async res => {
//                if(res == 200){
//                    window.close()
//                }else {
//                    error.innerHTML = "Virhe paikallisessa kirjautumispalvelimessa. Kokeile uudelleen pian."
//                }
//            }).catch(async err => {
//                error.innerHTML = "Virhe session\naloittamisessa."
//            })
//        }else {
//            error.innerHTML = "Muille sivuille siirtyminen ei ole mahdollista tässä ikkunassa."
//        }
//    }else {
//        //Redirect back
//        frame.src = url
//    }
//}
//Modify viewport
let toEdit = document.getElementsByClassName("col-md-pull-4")[0]
toEdit.remove()
let items = document.getElementsByTagName("a")
for (let i = 0; items.length - 1 > i; i++) {
    if (items[i].children[0] != undefined && items[i].children[0].className == "Mobile") {
        items[i].remove()
    }
}