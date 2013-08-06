/**
 * view methods
 *
 * functions for handling the dom manipulation for displaying
 * the data.
 */
var view = {

    showFile: function ( file ) {
        if (!file) {
            console.error('file not found: ' + file.id);
            return;
        }

        $.mobile.changePage( "#file-details-dlg", { transition: "slideup"} );
        //populate the form
        $('.file-details-name').text(file.displayname);
        $('.file-details-size').text((file.size / 1024) + 'KB');
        $('.file-details-creator').text(file.creatorfname + file.creatorlname);
        $('.file-details-created').text(file.creationdate);
        $('.file-details-id').val(file.id);
        //insert a record in the "recently viewed collection"
        var record = $.extend({}, file);
        record.viewed = new Date();
        recently.insert(record, true);
    },

    showFiles: function ( folder, files, ul ) {
        //set the container for the list.
        ul = ul || '#files-list';
        //close the dialogs
        $('.ui-dialog').dialog('close');
        //set the current folder on the title.
        $('#folder-path').text(folder);
        //clean the list.
        $(ul).html('');

        for(var i in files) {
            var file = files[i];
            //leave boxes out of the way.
            if (file.type === 'box') continue;
            //pick the right image for the file type.
            var img = (file.type === 'folder' || file.type === 'back')
                    ? "https://www.sf-cdn.net/cache/20130405/css/default/img/uiSM-folder.png"
                    : "https://www.sf-cdn.net/cache/20130405/css/default/icon_misc.png";
            //calculate the size.
            var size = file.size ? ' (' + file.size / 1024 + 'KB)' : '';
            var timestamp = file.viewed ? ' viewed ' + $.timeago(file.viewed) : '';
            //prepare the row.
            var li =
                '<li class="file-list-item" data-id="' + file.id +
                    '" data-file-type="' + file.type +
                    '"data-file-parent="' + file.parent + '">' +
                    '<a href="javascript:{}">' +
                        '<img src="' + img + '" class="ui-li-icon" />' +
                        '<h2 class="file-name">' +
                            file.displayname +
                        '</h2>' +
                        '<p>' +
                            (timestamp || size) +
                        '</p>' +
                    '</a>' +
                '</li>';
            $(ul).append(li);
        }
        $(ul).listview('refresh');
    },

    showRecently: function ( list ) {
        view.showFiles('', list, '.recently-list');
    }
};