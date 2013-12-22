real-estate
===========

a master 2 project i did for web development using node.js, express.js, jade, lodash, cradle and jquery as well, in front end i use bower to manage dependencies, i'm using bootstrap, d3 (to rendering svg),lodash and dropzone.

I'm also using couchDB to store my data.

This "website" use a map from open street map, you can click on it to open a page showing the advert related to this location. Then you can add price, pictures and some others infos.


Installation:
I push all my files into the repository but it's not necessary to fetch all of them into your pc:
you need to get these files:
javascripts/*
package.json
server.js
views/*
public/bower.json
public/css/*
public/data/eure.json
public/pictures/realestate.png
public/favicon.png
public/upload/


You have to have node installed as well as couchDB, and bower.
Then npm install, bower install
Configure your couchDB database by adding a database called 'realestate', then you have to create a view like this:
function(doc){
	emit(doc._id, doc);
}
save it and in the following form type : 'view_all' in both text form

your project is ready.

Launch server.js, node server.js
go to this url: localhost:1337/

You are now ready to use this app