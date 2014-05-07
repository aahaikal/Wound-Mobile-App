/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    takePicture: function() {
        console.log("in the takePicture")
        navigator.camera.getPicture(onSuccess, onFail, {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI
        });

        function onSuccess(imageURI) {
            var image = document.getElementById('myImage');
            image.src = imageURI;
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
    },

    callserver: function() {
        var form = $("#new_status").serialize();
        //  console.log('the ajax method')
        // $.ajax({
        //     type: "GET",
        //     url: "http://localhost:3000/api/v1/statuses",
        //      data: {},
        //     dataType: "jsonp"
        // }).done(function(msg) {
        //     console.log("msg000000000" + msg);
        // });
        $.ajax({
            type: "POST",
            url: "http://0.0.0.0:3000/api/v1/statuses",
            crossDomain: true,
            beforeSend: function() {
                $.mobile.loading('show')
            },
            complete: function() {
                $.mobile.loading('hide')
            },
            data: form,
            dataType: 'json',
            success: function(response) {
                console.log(response.status);

                var status = response.status
                if (status !== null) {
                    if (typeof(Storage) !== "undefined") {
                        localStorage.status = status;
                    }
                    $.mobile.changePage("ios/www/status.html", {
                        type: "post",
                        data: localStorage.status,
                        changeHash: false
                    });
                } else {
                    console.log("in the else ")
                    // navigator.notification.alert("Your Status failed", function() {});
                }




            }

        });
        $(document).on('pagebeforeshow', '#show', function() {
            // alert('this is the alert ' + localStorage.status);

            //--------------------------ajax---wounds----           
            $.ajax({
                url: "http://0.0.0.0:3000/api/v1/patients/" + localStorage.status,
                success: function(e) {
                    console.log(e);
                    var ul = $('<ul>').appendTo('.ui-content');
                    $(e.status).each(function(index, item) {
                        ul.append(
                            $(document.createElement('button')).text(item.location).addClass(" ui-btn ui-shadow ui-corner-all")
                        );
                    });
                    // body...
                },
                dataType: "json"
            });
            //---------------------------ajax

        });
    }

};