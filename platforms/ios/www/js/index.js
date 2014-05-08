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
            // var image2 = document.getElementById('theimg');
            image.src = imageURI;
            
        }

        function onFail(message) {
            alert('Failed because: ' + message);
        }
    },

    callserver: function() {
        console.log('in the callserver')
        var form = $("#new_status").serialize();
        $.ajax({
            type: "POST",
            url: "http://morning-wave-9385.herokuapp.com/api/v1/statuses",
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
                console.log(response.status)
                $.mobile.changePage("wounds.html", {
                type: "post",
                data: localStorage.id,
                changeHash: false
            }); 

            }

        });
        //---------------------------------------------------------
        $(document).on('pagebeforeshow', '#show', function() {

            //--------------------------ajax---wounds----           
            $.ajax({
                url: "http://morning-wave-9385.herokuapp.com/api/v1/patients/" + localStorage.status,
                success: function(e) {
                    console.log(e);
                    var ul = $('<ul>').appendTo('.ui-content');
                    $(e.status).each(function(index, item) {
                        ul.append(
                            $(document.createElement('button')).text(item.location).addClass(" ui-btn ui-shadow ui-corner-all")
                        );
                    });

                },
                dataType: "json"
            });
            //---------------------------ajax

        });
        //----------------------------------------document---end method--


    }




};