/**
 * app.js
 * event handlers
 */

$('#recently').live('pageshow', function () {
    controller.loadRecently();
});

$(document).delegate( "#login", "pageinit", function() {

    controller.initLogin();

    $('#accept-login').click(function () {
        var user = $('#user').val();
            pass = $('#pass').val();
        controller.login({ username: user, password: pass});
    });
});

$(document).delegate( "#main", "pageinit", function() {

    controller.loadFolder();

    /**
     * on file list item click
     */
    $(document).delegate('.file-list-item', 'click', function (e) {
        var $this = $(this);
        var type = $this.attr('data-file-type');

        //load the folder
        if (type === 'folder') {
            var name = $this.find('.file-name').text();
            controller.loadFolder(name);
        }
        //or go back one level
        else if (type === 'back') {
            controller.loadFolder('..');
        }
        //or load the file by id
        else if (type === 'file') {
            var id = $this.attr('data-id');
            controller.loadFile(id);
        }
    });

    //on file download.
    $(document).delegate('.file-details-download', 'click', function (e) {
        var id = $('.file-details-id').val();
        controller.downloadFile(id);
    });
    //on file send (by email)
    $(document).delegate('.file-details-send', 'click', function ( e ) {
        var id = $('.file-details-id').val(),
            to = $('.file-details-email').val();
        controller.sendFile(id, to);
    });
});

//store the current state on storage
$(window).unload( model.unload );

// will use console.error if in localhost (development) or kidozen logging
// service if running on the cloud.
model.setLogging ( window.location.hostname === 'localhost' );