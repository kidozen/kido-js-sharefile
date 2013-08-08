/**
 * model functions
 * here is where we access the backend services and the apis.
 * @api public
 */

// global variables
var kido = new Kido(),
    logging = kido.logging(),
    recently = kido.storage().objectSet('recently');

var model = {

    //set the default sharefile without credentials.
    sharefile: kido.services('sharefile'),
    //set the default sharefile folder.
    currentFolder: '/',

    /**
     * set the default storage mechanism, and restore the state that
     * was found in the storage.
     * @api public
     */
    initialize: function ( storage ) {
        if (!storage) return;
        model.storage = storage;
        model.currentFolder = storage.getItem('currentFolder') || model.currentFolder;
        if (storage.getItem('cred')) {
            try
            {
                var cred = JSON.parse(storage.getItem('cred'));
                model.credentials = cred;
            }
            catch (err) {
                //avoid an exception next time.
                storage.setItem('cred', '');
            }
        }
        return;
    },

    /**
     * stores the current state in default storage
     * @api public
     */
    unload: function () {
        if (model.storage && model.credentials)
            model.storage.setItem('cred', JSON.stringify(model.credentials));
        if (model.storage && model.currentFolder !== '/')
            model.storage.setItem('currentFolder', model.currentFolder);
    },

    /**
     * attempts to log in to the sharefile service, and sets the
     * identity as the default for subsequent calls.
     * @returns {$.Deferred}
     * @api public
     */
    login: function ( credentials ) {
        //basic valiadtions
        var invalidCredentials = $.Deferred().rejectWith('Invalid credentials, login again.');
        if (!credentials) credentials = {};
        if (!credentials.username || !credentials.password) return invalidCredentials;

        return kido
            .services('sharefile')
            .invoke('authenticate', credentials)
            .done(function ( result ) {
                //replace the default service with the ones that uses
                //the custom credentials.
                model.sharefile = kido.services('sharefile').defaults({ authid: result.auth });
                model.credentials = credentials;
            })
            .fail(function (err) {
                console.error('Unable to login: ' + JSON.stringify(err));
            });
    },

    /**
     * getFolder
     * 
     * @param folder {string} - use this to load a folder relative to the
     *                          local folder. If you pass '..', it will go
     *                          up one level.
     * @returns {$.Deferred}
     */
    getFolder: function ( folder ) {
        //calculate the path for the folder relative to the
        //current folder.
        var path = model.currentFolder;
        if (folder) {
            if (folder === '..') {
                //remove the last part of the path.
                var parts = path.split('/');
                path = parts.splice(0, parts.length -2).concat('').join('/');
            } else {
                //append the folder to the current.
                path += folder + '/';
            }
        }

        //invoke sharefile api
        return model.sharefile
            .invoke('folder', { op: 'list', path: path })
            .done(function () {
                //set the current folder
                model.currentFolder = path;
            })
            .pipe(function ( list ) {
                //if we are not at the root
                //add an item for going back one level.
                if (path !== '/')
                    list = [{type: 'back', displayname: '..'}].concat(list);

                return list;
            })
            .fail(function (err) {
                console.error('Unable to get folder "' + path + '": ' + JSON.stringify(err));
            });
    },

    /**
     * get the file details by id
     * @returns {$.Deferred}
     * @api public
     */
    getFile: function ( id ) {
        return model.sharefile.invoke('file', { op: 'get', id: id })
            .fail(function (err) {
                console.error('Unable to get file "' + id + '": ' + JSON.stringify(err));
            });
    },

    /**
     * gets the download link for the file.
     * @returns {$.Deferred}
     * @api public
     */
    downloadFile: function ( id ) {
        return model.sharefile.invoke('file', { fileId: id, op: 'download' })
            .fail(function (err) {
                console.error('Unable to get download link "' + id + '": ' + JSON.stringify(err));
            });
    },

    /**
     * sends the file download link by email.
     * @returns {$.Deferred}
     * @api public
     */
    sendFile: function ( id, to ) {
        return model.sharefile
            .invoke('file', { op: 'download', id: id })
            .pipe(function ( result ) {
                //construct the email.
                var from     = "dev@kidozen.com",
                    subject  = model.credentials.user + ' wants to share a file with you',
                    bodyText = 'Follow this link to download the file: ' + result.result,
                    bodyHtml = bodyText;
                //pipe both requests into one single deferred object
                return kido
                    .email()
                    .send(from, to, subject, bodyText, bodyHtml);
            })
            .fail(function (err) {
                console.error('Unable to send file "' + id + '" to "' + to + '": ' + JSON.stringify(err));
            });
    },

    /**
     * gets the recently viewed files from KidoZen storage.
     * @returns {$.Deferred}
     * @api public
     */
    getRecently: function () {
        return recently.query({}, null, { "$sort": { "viewed" : -1 }}).fail(function (err) {
                console.error('Unable to get recently viewed files: ' + JSON.stringify(err));
            });
    },

    /**
     * override the console.error in production to redirect
     * the error logs to the KidoZen Logging service.
     * @api public
     */
    setLogging: function ( development ) {
        console = (console || { error: function () {} });
        if (!development) {
            var logging = kido.logging();
            console.error = function ( msg ) {
                kido.logging().writeError(msg);
            };
        }
    }
};