var cradle = require('cradle'),
	express = require('express'),
	fs = require('fs');

var app = express();


app.use(express.logger('dev')); //a commenter pour le deploiement

app.locals({
	'pretty' : true
});
var db = new(cradle.Connection)().database('realestate');

app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/javascript'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart());
app.set('view engine', 'jade');

app.use(function(req, res, next) {
	console.log('request : ' + req.method + ', url : ' + req.url + '\n');
	next();
});



app.get('/', function(req, res){
	db.view('view_all/view_all', function(err, response) {
		if(!err){
			var tab = [];
			response.forEach(function(row){
				console.log("consultation de l'annonce id : "+row._id);
				tab.push(row);
			});
			res.render('index.jade', {'adverts':tab});
		}else{
			console.log('erreur recuperation view_all');
			res.render('error.jade');
		}
		
	});
});


app.get('/moreInfo/:id', function(req, res){
	db.get(req.params.id, function(err, doc){
		if(err){
			console.log('erreur recuperation id ' + req.params.id);
			res.render('error.jade');
		}else{
			res.render('more-infos.jade', {'infos': doc});
		}
	});
});


app.get('/advert/id/:id', function(req, res){
	var name , price, description, urlImages, date, id = req.params.id, country;
	db.get(id, function (err, doc) {
		if( err ) {
			console.log('erreur recuperation id ' + id );
			// res.render('error.jade');
		} else {
			name = doc.name;
			country = doc.country;
			price = doc.price;
			description = doc.description;
			date = doc.available_date;
			urlImages = doc.file_path;
		}
		var param = {'id': id, 'name': name, 'price': price, 'description': description, 'date': date, 'path': urlImages, 'country': country}
		res.render('add-advert.jade', {'param': param});
	});
});

app.get('/remove/id/:id', function(req, res){
	removeDir('/upload/'+req.params.id+'/');
	db.remove(req.params.id, function(err, res){
		if(err){
			res.render('error.jade');
		}else{
			res.render('success.jade');
		}
	});
});

app.post('/file_upload', function(req, res){
	console.log('file upload called');
	console.log(req.files.file.path);

	fs.readFile(req.files.file.path, function(err, data){
		var directory = __dirname + '/public/upload/'+req.body.identifiant;
		if(!fs.existsSync(directory)){
			fs.mkdirSync(directory);
		}
		var newPath = directory+'/'+req.files.file.name,
			projectPath = '/upload/'+req.body.identifiant+'/'+req.files.file.name;
		if(!fs.existsSync(newPath)){
			fs.renameSync(req.files.file.path, newPath);
		}


		db.get(req.body.identifiant, function(err, doc){
			//si l enregistrement existe
			if(!err){
				db.save(req.body.identifiant,{
					'available_date': doc.available_date,
					'country': doc.country,
					'description': doc.description,
					'file_path': projectPath,
					'name': doc.name,
					'price': doc.price
				},function(err1, doc1){
					if(err1){
						console.log('erreur enregistrement imagePath');	
					}
				});
			}
			//si il n existe pas
			else{
				console.log('erreur recuperation info id : ' + req.body.identifiant);
				db.save(req.body.identifiant, {
					'file_path': projectPath
				}, function(err1, doc1){
					if(err1){
						console.log('erreur creation document id :' + req.body.identifiant);
					}else{
						console.log('creation du document id: ' + req.body.identifiant);
					}
				});
			}
		});

	});
	res.render('success.jade');
});


app.post('/traitement_advert', function(req, res){

	db.get(req.body.identifiant, function(err, doc){
		//si il existe
		console.log(doc.file_path);
		if(!err){
			console.log('avant save');
			db.save(req.body.identifiant,{
				'available_date': req.body.date,
				'country':req.body.country,
				'description':req.body.description,
				'file_path':doc.file_path,
				'price':req.body.price,
				'name':req.body.name
			},function(err1, doc1){
				if(err1){
					console.log('erreur sauvegarde info id : ' + req.body.identifiant);
					res.render('error.jade');
				}else{
					console.log('save ok ');
				}
			});
		}
		//sinon
		else{
			console.log('erreur recuperation info id : ' + req.body.identifiant);
			db.save(req.body.identifiant, {
				'available_date': req.body.date,
				'country':req.body.country,
				'description':req.body.description,
				'price':req.body.price,
				'name':req.body.name
			},function(err1,doc1){
				if(err1){
					res.render('error.jade');
				}
				else{
					console.log('creation du document id: ' + req.body.identifiant);
				}
			});
		}
	});
	res.render('success.jade');
});


var removeDir = function(path){
	console.log(__dirname+'/public'+path);
	var files = fs.readdirSync(__dirname+'/public'+path);
	for (var i = 0; i < files.length; i++){
		fs.unlinkSync(__dirname+'/public'+path+'/'+files[i]);
	}
	fs.rmdirSync(__dirname+'/public'+path);
}

app.listen(1337);