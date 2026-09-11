const http = require('http');
const {Client} = require('pg');

const client = new Client({
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

async function start() {
	await client.connect();
	console.log('Connected to PostgreSQL');
	const server = http.createServer(async (req, res) => {
		console.log(req.method, req.url);
		const result = await client.query('SELECT * FROM not_a_faucken_table');
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({
			status: "Automatic deployment from GitHub Actions",
			rows: result.rows
}));
	});
server.listen(3000, '0.0.0.0');
}
start();
