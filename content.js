var clickedElement = null;


function getStringElement(element){
    var id = element.id;
    if(id == null || id == ""){
        var classes = element.className.baseVal;

        if(classes == null || classes == ""){

            var elements = document.getElementsByTagName(element.tagName);
            var tagCount = 0;
            for(var k=0; k<elements.length; k++){
                if(elements[k].isEqualNode(element)){
                    tagCount = k;
                    break;
                }
            }

            return "document.getElementsByTagName('"+ element.tagName + "')["+tagCount+"]";

        } else {

            classes = classes.split(" ");
            console.log(classes);

            var count = -1;
            var currentClass = "";
            for (var i = 0; i < classes.length; i++) {
                var elementCount = document.getElementsByClassName(classes[i]).length;
                if (count == -1 || elementCount < count) {
                    count = elementCount;
                    currentClass = classes[i];
                }
            }



            if (currentClass != "") {

                element.setAttribute("id", "jsblocktempid");

                var elems = document.getElementsByClassName(currentClass);
                var classCount = 0;
                for (var j = 0; j < elems.length; j++) {
                    if (elems[j].getAttribute("id") == "jsblocktempid") {
                        classCount = j;
                        break;
                    }
                }

                element.removeAttribute("id");

                return "document.getElementsByClassName('" + currentClass + "')[" + classCount + "]";
            }
        }
    } else {
        return "document.getElementById('"+id+"')";
    }
}



function createBlock(name, website, element){

    chrome.storage.local.get(null, function(data){

        console.log(element);
        var elementString = getStringElement(element);
        console.log(elementString);

        var newBlock = {
            "id": makeid(),
            "name": name,
            "website": location.href,
            "element": elementString
        };


        if(data.blocks == null) {
            chrome.storage.local.set({"blocks": [newBlock]}, function () {
                removeElement(element);
            });
        } else {
            var blocks = data.blocks;
            blocks.push(newBlock);
            chrome.storage.local.set({"blocks": blocks}, function () {
                removeElement(element);
            });
        }

    });
}


function removeElement(element){
    element.parentNode.removeChild(element);
}


function matchUrl(url, rule) {
    return new RegExp("^" + rule.split("*").join(".*") + "$").test(url);
}



document.addEventListener("mousedown", function(event){
    //right click
    if(event.button == 2) {
        clickedElement = event.target;
    }
}, true);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action == "fromMenu"){
            createBlock('', request.content.pageUrl, clickedElement);
            clickedElement = null;
        }
    }
);


function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function removeSlash(site) {
    return site.replace(/\/$/, "");
}


function runBlocker(e){
    setInterval(function () {
        try{
            eval(e.element + ".parentNode.removeChild(" + e.element + ");")
        } catch (err){

        }
    }, 1000);
}




window.onload = function() {

    chrome.storage.local.get(null, function(data){

        var blocks = data.blocks;

        if(blocks != null) {

            var currentUrl = location.href;

            for (var i = 0; i < blocks.length; i++) {
                console.log(currentUrl);
                console.log(blocks[i].website);
                console.log(matchUrl(currentUrl, blocks[i].website));
                if (matchUrl(currentUrl, blocks[i].website)) {

                    if (blocks[i].element.includes("ClassName") || blocks[i].element.includes("TagName")) {
                        try {
                            eval(blocks[i].element + ".parentNode.removeChild(" + blocks[i].element + ");")
                        } catch (err) {
                        }
                    } else {
                        runBlocker(blocks[i]);
                    }
                        // eval("document.getElementsByClassName('dynamic-modal-container')[0].parentNode.removeChild(document.getElementsByClassName('dynamic-modal-container')[0]);");
                }
            }
        }

    });

};




