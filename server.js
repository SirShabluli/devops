const http = require('http');
const { Client } = require('pg');

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
		// health check
		if (req.url === "/health") {
			res.writeHead(200, { "Content-Type": "application/json" });
			return res.end(JSON.stringify({ status: "ok" }));
		}
		if (req.url === "/ready") {
			try {
				await client.query("SELECT 1");

				res.writeHead(200, { "Content-Type": "application/json" });
				return res.end(JSON.stringify({ status: "ready" }));
			} catch (error) {
				res.writeHead(503, { "Content-Type": "application/json" });
				return res.end(JSON.stringify({ status: "not ready" }));
			}
		}
		const result = await client.query('SELECT * FROM test_data');
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify({
			status: "Automatic deployment WORKS",
			rows: result.rows
		}));
	});
	server.listen(3000, '0.0.0.0');
}
start();
