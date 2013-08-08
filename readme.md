##Kidozen Tasks Management sample application

The purpose of this app is show how you might create an application using
the ShareFile Enterprise API shipped with KidoZen.

For information on Kidozen, please visit: [http://kidozen.com](http://kidozen.com)

#Summary

This sample app shows how a simple file browser system could be built using the
ShareFile Enterprise API shipped with KidoZen, and to provide with a skeleton for
developers to add as much funcionality and test the backend services in a
real world scenario.

#Description

The idea behind the sample is to use the Citrix ShareFile service through our
KidoZen Enterprise APIs in order to operate on the files. Anything can be done
with the files stored in ShareFile, download it, associate it to something else
and even send emails with download links.

- User can use the default credentials configured in the KidoZen Application
Center.
- User can log in with his own ShareFile credentials.
- The home screen displays a list files and folders for that account.
- Folders can be navigated by tapping on the folder rows.
- User can navigate up one level by tapping on the ".." row (the first one, but
only if the user is not in the root folder).
- When the user taps on a file, he will see some file details, and can do the
following things:
   * Done: go back to the folder view.
   * Download: downloads the file via the browser.
   * Send: send the download link by email to anybody.
- The home contains a link to the "Recently Viewed Files" report.

#Code Structure

We have chosen to use MVC, a pattern that keeps the code from the UI separated
from the code of the Domain Model.
Sections:

- Event handlers (app.js): routes the events to the right controller.
- Controllers (controller.js): in charge of calling the model and rendering the right view.
- Views (view.js): render the information in the HTML though dinamic DOM manipulation.
- Model (model.js): Access to the backend services and domain specific logic.

#Setting up the ShareFile Service

You will have to create a service instance using the ShareFile Enterprise API
from your KidoZen Application Center. If you have an admin profile, you can use
the "Admin" tab, and then go to the "Enterprise APIs" menu to see the list of
services available.

Click on the "ShareFile" API and configure your ShareFile account (ie:
kidozen.sharefile.com) with some default credentials (optional).

Note: it might be a good idea to somewhat restrict the access of the default
credentials in your ShareFile site.

#Running the app locally

In order to run the app locally, you need to have a KidoZen account, and have
the `kido` client tool installed (see the [docs](http://docs.kidozen.com/sdks/javascript/)
for more information).