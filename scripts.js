

function updateBlock(id){
    var block = document.getElementsByClassName(id);
    var name = block[0].value;
    var website = block[1].value;

    chrome.storage.local.get(null, function(data){

        var blocks = data.blocks;

        for(var i=0; i<blocks.length; i++){
            if(blocks[i].id == id){
                blocks[i].name = name;
                blocks[i].website = website;
            }
        }

        chrome.storage.local.set({"blocks": blocks}, function () {
            loadBlocks();
        });

    });
}


function deleteBlock(id){
    chrome.storage.local.get(null, function(data) {

        var blocks = data.blocks;

        var index = -1;

        for (var i = 0; i < blocks.length; i++) {
            if(blocks[i].id == id){
                index = i;
                break;
            }
        }

        if(index != -1){
            blocks.splice(index, 1);
        }


        chrome.storage.local.set({"blocks": blocks}, function () {
            loadBlocks();
        });


    });
}


function loadBlocks(){
    chrome.storage.local.get(null, function (data) {

        var blocks = data.blocks;

        if(blocks !== null && blocks.length > 0){
            document.getElementById('elements').innerHTML = "";
            for(var i=0; i<blocks.length; i++){
                document.getElementById("elements").innerHTML += '<tr> ' +
                    '<td>' +
                    '<input class="input is-small '+blocks[i].id+'" type="text" value="'+blocks[i].name+'">' +
                    '</td>' +
                    '<td>' +
                    '<input class="input is-small '+blocks[i].id+'" type="text" value="'+blocks[i].website+'">'+
                    "</td>" +
                    '<td>' +
                    '<a id="'+blocks[i].id+'DELETE" class="button is-small deleteBtn"> <span class="icon is-small"> <i class="fa fa-trash"></i> </span> </a> ' +
                    '<a id="'+blocks[i].id+'UPDATE" class="button is-small updateBtn"> <span class="icon is-small"> <i class="fa fa-floppy-o"></i> </span> </a>' +
                    '</td> ' +
                    '</tr>';
            }



            var deleteBtns = document.getElementsByClassName('deleteBtn');
            for(var x=0; x<deleteBtns.length; x++){
                deleteBtns[x].addEventListener('click', function () {
                    deleteBlock(this.id.replace('DELETE', ''));
                });
            }

            var updateBtns = document.getElementsByClassName('updateBtn');
            for(var y=0; y<updateBtns.length; y++) {
                updateBtns[y].addEventListener('click', function () {
                    updateBlock(this.id.replace('UPDATE', ''));
                });
            }

            document.getElementById('table').style.display = 'block';
            document.getElementById('nothing').style.display = 'none';
        } else {
            document.getElementById('table').style.display = 'none';
            document.getElementById('nothing').style.display = 'block';
        }

    });
}


window.onload = function() {
    loadBlocks();
};