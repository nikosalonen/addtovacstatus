function save_options() {
    var customapikey = document.getElementById('customapikey').value;
    var vaclist = document.getElementById('vaclist');
    var selection = vaclist.options[vaclist.selectedIndex].id;
    if (selection != '') {
        chrome.storage.sync.set({
            selectedlist: selection
        }, function () {
            var selecstatus = document.getElementById('selecstatus');
            selecstatus.textContent = 'List selected';
            setTimeout(function () {
                selecstatus.textContent = '';
            }, 750);
        });
    }

    if (customapikey != '') {
        //use custom key
        chrome.storage.sync.set({
            customapikey: customapikey
        }, function () {
            // update status
            var status = document.getElementById('status');
            status.textContent = 'Options saved.';
            setTimeout(function () {
                status.textContent = '';
            }, 750);

            removeOptions(document.getElementById("vaclist"));
            getLists(customapikey);
        });
    }
}

function restore_options() {
    chrome.storage.sync.get("customapikey", function (data) {
        if (typeof data['customapikey'] == 'undefined') {
            var o = document.createElement('option');

            o.textContent = "No lists or private key";
            document.getElementById("vaclist").appendChild(o);
        } else {
            document.getElementById('customapikey').value = data['customapikey'];
            getLists(data['customapikey']);
        }
    });
}

function getLists(a) {
    var selection = '';
    chrome.storage.sync.get("selectedlist", function (data) {
        if (typeof data['selectedlist'] == 'undefined') {

        }else{
          selection = data['selectedlist'];
        }



        var xhr = new XMLHttpRequest();
        xhr.open("GET", "https://vacstat.us/api/v1/list?_key=" + a, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                // JSON.parse does not evaluate the attacker's scripts.
                var resp = JSON.parse(xhr.responseText);
                if (!resp.error) {


                    arr = resp.my_list;
                    removeOptions(document.getElementById("vaclist"));
                    arr.forEach(function (item) {
                        var o = document.createElement('option');
                        o.setAttribute('id', item.id);
                        if(item.id == selection){
                          o.selected = true;
                        }
                        o.textContent = item.title;
                        document.getElementById("vaclist").appendChild(o);
                    });
                } else {
                    removeOptions(document.getElementById("vaclist"));
                    var o = document.createElement('option');
                    o.selected = true;
                    o.textContent = 'Error retrieving lists.';
                    document.getElementById("vaclist").appendChild(o);
                }
            }
        }
        xhr.send();




    });


}

function removeOptions(selectbox)
{
    var i;
    for (i = selectbox.options.length - 1; i >= 0; i--)
    {
        selectbox.remove(i);
    }
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click',
        save_options);
