import mysql from 'mysql2/promise';

export const handler = async (event) => {
  const body = JSON.parse(event.body || '{}');
  const { id, route, driver, vehicle, status, eta, value } = body;

  if (!id || !route) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: 'id and route are required' })
    };
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: 'delivery_user',
    password: 'Delivery@123!',
    database: 'delivery_db'
  });

  await connection.execute(
    'INSERT INTO orders (id, route, driver, vehicle, status, eta, value) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [id, route, driver, vehicle, status, eta, value]
  );
  await connection.end();

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ message: 'Order created successfully' })
  };
};
