"use strict";

var App = App || {
    baseUrl: Config.Endpoint,
    getChannels: function () {
        return this.get(this.baseUrl + '/channels', '');
    },
    setChannel: function (channelID) {
        return this.post(this.baseUrl + '/channels/current', JSON.stringify({ "id": channelID }));
    },
    getVolume: function () {
        return this.get(this.baseUrl + '/audio/volume', '');
    },
    setVolume: function (volume) {
        return this.post(this.baseUrl + '/audio/volume', JSON.stringify(volume));
    },
    postKey: function (key) {
        return this.post(this.baseUrl + '/input/key', JSON.stringify({ "key": key }));
    },
    get: function (url, data) {
        return this.query(url, data, "GET");
    },
    post: function (url, data) {
        return this.query(url, data, "POST");
    },
    query: function (url, data, method) {
        var jqXHR = $.ajax({
            method: method,
            url: url,
            data: data,
            async: false
        }).fail(function (err) {
            alert("error: " + err.statusText);
        });
        return jqXHR.responseJSON;
    }
};

function htmlEncode(value){
    return $('<div/>').text(value).html();
}
  
function htmlDecode(value){
    return $('<div/>').html(value).text();
}

$(document).ready(function () {

    if (Config.Endpoint.length === 0) {

        $('.buttons').hide();
        $('.channels').append('<span id="errorMessage">' + htmlEncode(Config.MissingConfigMsg) + '</span>')

    } else {

        var channels = App.getChannels();
        var html = '';
        var channelName = '';

        $.each(channels, function (i, channel) {
    
            channelName = channel.name;
            
            html = '<button class="button onButtonClick" id="' + i + '">';
            html += '<div class="button-text">' + channel.name  + '</div>';
            html += '<div class="button-desc">' + channel.preset + '</div>';
            html += '</button>';
                        
            $('.channels').append(html);
        });
    
        $('.onButtonClick').on('click', function (event) {
    
            let buttonID = event.currentTarget.id;
            let currVolume;
    
            switch (buttonID) {
                case "volume_plus":
                    App.postKey("VolumeUp");
                    break;
                case "volume_minus":
                    App.postKey("VolumeDown");
                    break;
                case "key_standby":
                    App.postKey("Standby");
                    break;
                case "key_info":
                    App.postKey("Info");
                    break;
                default:
                    App.setChannel(buttonID);
            }
        });
    }
});