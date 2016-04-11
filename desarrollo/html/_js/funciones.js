var video;
var dataURL;

$.ajaxSetup({
    cache: false,
    async: false
});

function RetornaAJAX(iPagina, iFuncion, iDATA, iEjecucion) {
    var options = {
        type: 'POST',
        url: iPagina + '/' + iFuncion,
        data: iDATA,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (msg) { eval(iEjecucion); },
        error: function (result) { alert(result.statusText + ' - ' + result.status); }
    }
    return options;
}

function getAJAX(url, iEjecucion) {
    var options = {
        type: 'GET',
        url: url,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (msg) { eval(iEjecucion); },
        error: function (result) { /*alert(result.statusText + ' - ' + result.status);*/ }
    }
    return options;
}

function postAJAX(url, data) {
    var options = {
        type: 'POST',
        url: url,
        data: data,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        success: function (msg) { eval(iEjecucion); },
        error: function (result) { /*alert(result.statusText + ' - ' + result.status);*/ }
    }
    return options;
}

$.prototype.seleccion = function (tipo, ticket) {
    var obj = this;
    var objButtons = this.find("button");
    var objButton;
    for (var x = 0; x < objButtons.length; x++) {
        objButton = $(objButtons[x]);
        if (ticket) {
            if (tipo == 1) {
                objButtons.removeClass("item");
            }
            objButton.addClass("item");
        }
        objButton.click(function () {
            if ($(this).attr("class") == "item") {
                $(this).removeClass("item");
            } else {
                if (tipo == 1) {
                    objButtons.removeClass("item");
                }
                $(this).addClass("item");
            }
            obj.acomoda();
        });
    }
}

$.prototype.acomoda = function () {
    try {
        var objButtons = this.find("button");
        var objTemp1 = $("<div id='object_list1'></div>");
        var objTemp2 = $("<div id='object_list2'></div> ");
        for (var x = 0; x < objButtons.length; x++) {
            if ($(objButtons[x]).attr("class") == "item") {
                objTemp1.append($(objButtons[x]));
            } else {
                objTemp2.append($(objButtons[x]));
            }
        }
        this.html("");
        this.append(objTemp1.find("button"));
        this.append(objTemp2.find("button"));
        return true;
    } catch (e) {
        return false;
    }
}