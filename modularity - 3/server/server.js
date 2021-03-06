
var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require("url");

var helpers = require("./request-helpers.js");

// incoming request
//



// This to yourself, what are the steps we want to modularize?
//
// ...
//
// Incoming Request
//  If (valid url)
//    convert url to file system address
//    load file
//    send response with contents of file
//
//  else
//    respond with 404 not found
//
//  <sendResponse might be in common>
//
//
// Each of these steps appear to be resuable for many requests.  That is what
//  we'll attempt to refactor.
//

// Previously, we used a switch statement.  That is not ideal.  It is a common practice
//  to ue 'routes' as a way to figure out what to do.  A route is a way for the server application
//  to match a url to an action that must be performed.
//
// What you'll note below is a Javascript object where the key is the page itself, and the value
//  is an array holding the function that will be called, and the content-type that must be used
//  with the file type.
//
var routes = {
  "/index.html": [ helpers.sendFileResponse, "text/html" ],
  "/about.html": [ helpers.sendFileResponse, "text/html"],
  "/contact.html": [ helpers.sendFileResponse, "text/html" ],
  "/style.css": [ helpers.sendFileResponse, "text/css" ],
  "/scripts.js": [ helpers.sendFileResponse, "application/javscript" ]
};


var server = http.createServer(function (request, response) {
  // incoming request
  // if GET
  //   then handle GET
  // else if POST
  //   then handle POST
  // else
  //   then handle it another way / or not
  //
  if (request.method === "GET") {
    var addy = (request.url === "/" ? "/index.html" : request.url);

    // Use 'addy' as a key to lookup the function handler in routes.
    //
    var route = routes[addy];
    if (route) {
      //
      // If the key exists, then use array index [0] -- which is the function handler
      //  for this route -- to execute the response.  Again, you'll notice that route[1]
      //  is the second element in the routes value array to indicate the content-type.
      //
      // There is no technical reason why I used 'null' instead of 'this'.  Both would
      //  be valid.  But in case of this example, the 'this' context is not being used
      //  anywhere so it doesn't matter what is passed in.  I chose null to reflect that.
      //
      route[0].call(null, request, response, addy, route[1], 200);

      // or try this instead:
      //
      //route[0](request, response, addy, route[1], 200);

      // Both work.  I think I did the route[0].call(...) syntax to make it clearer
      //  that it is calling a function.
      //
    }
    else {
      //
      // Key doesn't exists, issue a 404.
      //
      sendResponse(request, response, "Not found", "text/html", 404);

    }
  }
});

server.listen(3000);
console.log("Server running at http://127.0.0.1:3000/");


// NOTE: notice that the helper functions are not here anymore.  Here we decided to move the helper
//  functions into "request-helper.js".  Doing this helps keep 'server.js' clean but also allows
//  the helper functions to be used by different places through the application.
//
// Why aren't they exported from server.js?  In more complex applications, server.js would be the
//  entry point to all other functionality.  It will require other modules.  But those modules
//  would not be able to require('server.js'); because it would create a circular reference.
//
// A circular reference is when module a requires module b, and module b requires module a.  Node
//  does not allow this to happen.  So we move the files into a 'nuetral' module that can be
//  referenced anywhere.
//