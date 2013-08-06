/**
 * controller.js
 * manages the calls to the model and how to display that through
 * the view.
 * @api public
 */
var controller = {

    /**
     * initializes the login form with the stored credentials.
     * @api public
     */
    initLogin: function () {
        model.initialize( sessionStorage || localStorage );
        if (model.credentials) {
            $("#user").val(model.credentials.username);
            $("#pass").val(model.credentials.password);
        }
    },

    /**
     * on user login
     * set new credentials and load root folder.
     */
    login: function ( credentials ) {
        $.mobile.showPageLoadingMsg();
        model.login(credentials).done(function () {
            $.mobile.changePage("#main");
        });
    },

    /**
     * load the contents of a folder in the main list
     * @api public
     */
    loadFolder: function ( name ) {
        $.mobile.showPageLoadingMsg();
        //load the current folder.
        model
            .getFolder(name)
            .done(function ( list ) {
                view.showFiles(model.currentFolder, list);
            })
            .fail(function () {
                alert('Unable to search sharefile service.');
            })
            .always($.mobile.hidePageLoadingMsg);
    },

    /**
     * load the file details into the details view.
     * @api public
     */
    loadFile: function ( id ) {
        $.mobile.showPageLoadingMsg();
        model
            .getFile(id)
            .done(view.showFile)
            .always($.mobile.hidePageLoadingMsg);
    },

    /**
     * download the file through the browser
     * @api public
     */
    downloadFile: function ( id ) {
        model.downloadFile(id).done(function ( result ) {
            window.location = result;
        });
    },

    /**
     * sends the file by email and notices the user through an alert
     * message
     * @api public
     */
    sendFile: function ( id, to ) {
        model
            .sendFile(id, to)
            .done(function () {
                alert('Successfully sent!');
            })
            .fail(function () {
                alert('Unable to send file link by email.');
            });
    },

    /**
     * load the recently viewed files tab
     * @api public
     */
    loadRecently: function () {
        model.getRecently().done(view.showRecently);
    }
};