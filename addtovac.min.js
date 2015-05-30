!function () {

    function addLink() {

        var a = document.createElement('a');
        var span = document.createElement('span');
        span.textContent = ' - ';
        var linkText = document.createTextNode("Add to VacStat.us");
        var divi = document.querySelector(".listOptionsRight");
        a.appendChild(linkText);
        a.title = "Add to VacStat.us";

        a.id = "addToVac";

        divi.appendChild(span);
        divi.appendChild(a);


        var linkki = document.getElementById('addToVac');
        linkki.addEventListener("click", addSelectedVacStatus);


    }

    function addSelectedVacStatus() {
        var list = '', checked = [];
        chrome.storage.sync.get("selectedlist", function (data) {

            if (typeof data['selectedlist'] == 'undefined') {

            } else {
                list = data['selectedlist'];
            }
            if (list != '') {
                var i = [].slice.call(document.querySelectorAll("#memberList .member_block, .friendHolder, label, input"));
                i.forEach(function (e) {
                    if (e.checked == true) {
                        var re = /\[(.*?)\]/;
                        var str = e.id;
                        checked.push(str.match(re)[1]);

                    }
                });

                chrome.storage.sync.get("customapikey", function (data) {
                    if (typeof data['customapikey'] == 'undefined') {


                    } else {
                        postMany(data['customapikey'], list, checked);
                    }
                });

            }


        });
    }

    function postMany(a, b, c) {
        var xhr = new XMLHttpRequest();
        var string = '';
        c.forEach(function (e) {
            string = string + e + ',';
        });

        string = string.substring(0, string.length - 1);
        xhr.open("POST", "https://vacstat.us/api/v1/list/add/many?_key=" + a + "&list_id=" + b + "&search=" + string, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                // JSON.parse does not evaluate the attacker's scripts.
                var resp = JSON.parse(xhr.responseText);
                if (!resp.error) {

                    alert('Added!');
                } else {
                    alert('Something went wrong');
                }
            }
        }
        xhr.send();
    }

    addLink();
}();
