const db = require("./db")
const path = require('path');
const express = require('express');
const app = express();
const session = require('express-session');
const cors = require("cors")

app.use(cors())
app.set('views', './views')
app.set('view engine', 'ejs');
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'customCSS')));
app.use(express.static(path.join(__dirname, 'customJS')));
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))

// http://localhost:3000/
app.get('/', function (request, response) {
	// Render login template
	response.sendFile(path.join(__dirname + '/login.html'));
});

// http://localhost:3000/auth
app.post('/auth', function (request, response) {
	// Capture the input fields
	let username = request.body.username;
	let password = request.body.password;
	// Ensure the input fields exists and are not empty
	if (username && password) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		db.query('SELECT login, password FROM accessLevel WHERE login = ? AND BINARY password = ?', [username, password], function (error, results, fields) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// Authenticate the user
				request.session.loggedin = true;
				request.session.username = username;
				// Redirect to home page
				response.redirect('/home');
			} else {
				response.send('Incorrect Username and/or Password!');
			}
			response.end();
		});
	} else {
		response.send('Please enter Username and Password!');
		response.end();
	}
});

// http://localhost:3000/home
app.get('/home', function (request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Render homepage
		response.render('home');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

// http://localhost:3000/cadastro
app.post('/cadastro', function (request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username

		response.render('cadastro');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

app.get('/classe', function (request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Execute SQL query that'll select the account from the database based on the specified username and password
		db.query('SELECT * FROM tabClasse Order By Classe ASC', function (error, results) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If the account exists
			if (results.length > 0) {
				// console.log(results)
				return response.json(results)
			} else {
				console.log("Not Found")
			}
		})
	} else {
		// Not logged in
		response.send('Please login to view this page!')
	}
	// response.end();
});

app.post('/modelo', function (request, response) {
	let classe = request.body.classe;
	// If the user is loggedin
	if (request.session.loggedin) {
		db.query(`Select DISTINCT Modelo from tabPreco Where Classe like "${classe}" Order By Modelo ASC`, function (error, results) {
			global.modelo = results
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If result is not empty
			if (results.length > 0) {
				// console.log(results)
			} else {
				console.log("Not Found")
			}
		})
	} else {
		// Not logged in
		response.send('Please login to view this page!')
	}
	response.end();
});

// app.get('/modelo2', function (request, response) {
// 	console.log(results)
// 	return response.json(results)
// })

app.listen(3000);