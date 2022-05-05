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

// CSS Define
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
// app.use('/css', express.static(path.join(__dirname, 'node_modules/datatables.net-select-bs5/css')))
// app.use('/css', express.static(path.join(__dirname, 'node_modules/datatables.net-bs5/css')))
// app.use('/css', express.static(path.join(__dirname, 'node_modules/datatables.net-buttons-bs5/css')))

// JS Define
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
// app.use('/js', express.static(path.join(__dirname, 'node_modules/datatables.net/js')))
// app.use('/js', express.static(path.join(__dirname, 'node_modules/datatables.net-buttons/js')))
// app.use('/js', express.static(path.join(__dirname, 'node_modules/datatables.net-select/js')))
// app.use('/js', express.static(path.join(__dirname, 'node_modules/datatables.net-bs5/js')))
// app.use('/js', express.static(path.join(__dirname, 'node_modules/datatables.net-buttons-bs5/js')))
// app.use('/js', express.static(path.join(__dirname, 'node_modules/datatables.net-select-bs5/js')))

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
app.get('/cadastro', function (request, response) {
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

// http://localhost:3000/consulta
app.get('/consulta', function (request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.render('consulta');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

// http://localhost:3000/relatorios
app.get('/relatorios', function (request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Output username
		response.send("To Be Done")
		// response.render('relatorios');
	} else {
		// Not logged in
		response.send('Please login to view this page!');
	}
	response.end();
});

// http://localhost:3000/home
app.get('/busca', function (request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		// Render homepage
		response.render('busca');
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

app.get('/q/tabPreco', function (request, response) {
	// If the user is loggedin
	if (request.session.loggedin) {
		db.query(`Select Modelo, Descricao, Fabricante, Valor from tabPreco ORDER BY Modelo ASC`, function (error, results) {
			global.modelo = results
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If result is not empty
			if (results.length > 0) {
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

app.get('/ativo/:ativo', async (request, response) => {
	const { ativo } = request.params
	// If the user is loggedin
	if (request.session.loggedin) {
		db.query(`SELECT * FROM master WHERE Ativo = "${ativo}"`, function (error, results) {
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If result is not empty
			if (results.length > 0) {
				return response.json(results.pop())
			} else {
				console.log("Not Found")
			}
		})
	} else {
		// Not logged in
		response.send('Please login to view this page!')
	}
	// response.end();
})

app.get('/count/:valor', async (request, response) => {
	const { valor } = request.params
	if (request.session.loggedin) {
		db.query(`SELECT *, (SELECT COUNT (*) as Valor FROM master Where Ativo Like "%${valor}%" Or Hostname Like "%${valor}%" OR Classe Like "%${valor}%" OR Modelo Like "%${valor}%" OR Descricao Like "%${valor}%" OR PartNumber Like "%${valor}%" OR NumeroSerie Like "%${valor}%" OR Perifericos Like "%${valor}%" OR Fabricante Like "%${valor}%" OR Fornecedor Like "%${valor}%" OR DataRecebimento Like "%${valor}%" OR DataEntrega Like "%${valor}%" OR Vencimento Like "%${valor}%" OR Exercicio Like "%${valor}%" OR CartaRemessa Like "%${valor}%" OR NFRemessa Like "%${valor}%" OR NFVenda Like "%${valor}%" OR Contrato Like "%${valor}%" OR CrServico Like "%${valor}%" OR Usuario Like "%${valor}%" OR Unidade Like "%${valor}%" OR Local Like "%${valor}%" OR ChamadoServico Like "%${valor}%" OR ID Like "%${valor}%" OR Resumo Like "%${valor}%" OR Observacao Like "%${valor}%" OR Servico Like "%${valor}%" OR Status Like "%${valor}%" OR Operacao Like "%${valor}%" OR CrCobranca Like "%${valor}%" OR ChamadoEntrega Like "%${valor}%" OR ValorDolar Like "%${valor}%" OR ValorPtax Like "%${valor}%" OR ValorReais Like "%${valor}%" OR Lote Like "%${valor}%" OR ContratoEmbraer Like "%${valor}%" OR Login Like "%${valor}%" OR Nome Like "%${valor}%" OR Chapa Like "%${valor}%" OR Titulo Like "%${valor}%" OR Email Like "%${valor}%" OR Ramal Like "%${valor}%" OR Telefone Like "%${valor}%" OR Celular Like "%${valor}%" OR Departamento Like "%${valor}%" OR Empresa Like "%${valor}%" OR Site Like "%${valor}%") AS Total FROM master WHERE Ativo Like "%${valor}%" Or Hostname Like "%${valor}%" OR Classe Like "%${valor}%" OR Modelo Like "%${valor}%" OR Descricao Like "%${valor}%" OR PartNumber Like "%${valor}%" OR NumeroSerie Like "%${valor}%" OR Perifericos Like "%${valor}%" OR Fabricante Like "%${valor}%" OR Fornecedor Like "%${valor}%" OR DataRecebimento Like "%${valor}%" OR DataEntrega Like "%${valor}%" OR Vencimento Like "%${valor}%" OR Exercicio Like "%${valor}%" OR CartaRemessa Like "%${valor}%" OR NFRemessa Like "%${valor}%" OR NFVenda Like "%${valor}%" OR Contrato Like "%${valor}%" OR CrServico Like "%${valor}%" OR Usuario Like "%${valor}%" OR Unidade Like "%${valor}%" OR Local Like "%${valor}%" OR ChamadoServico Like "%${valor}%" OR ID Like "%${valor}%" OR Resumo Like "%${valor}%" OR Observacao Like "%${valor}%" OR Servico Like "%${valor}%" OR Status Like "%${valor}%" OR Operacao Like "%${valor}%" OR CrCobranca Like "%${valor}%" OR ChamadoEntrega Like "%${valor}%" OR ValorDolar Like "%${valor}%" OR ValorPtax Like "%${valor}%" OR ValorReais Like "%${valor}%" OR Lote Like "%${valor}%" OR ContratoEmbraer Like "%${valor}%" OR Login Like "%${valor}%" OR Nome Like "%${valor}%" OR Chapa Like "%${valor}%" OR Titulo Like "%${valor}%" OR Email Like "%${valor}%" OR Ramal Like "%${valor}%" OR Telefone Like "%${valor}%" OR Celular Like "%${valor}%" OR Departamento Like "%${valor}%" OR Empresa Like "%${valor}%" OR Site Like "%${valor}%"`, function (error, results) {		
			// If there is an issue with the query, output the error
			if (error) throw error;
			// If result is not empty
			if (results.length > 0) {
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
})

app.listen(3000);