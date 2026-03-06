import mysql from 'mysql2/promise';

export const handler = async (event) => {
  const id = event.pathParameters?.id;
  const body = JSON.parse(event.body || '{}');
  const { status } = body;

  if (!id || !status) {
    return {
      statusCode: 400,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: 'id and status are required' })
    };
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: 'delivery_user',
    password: 'Delivery@123!',
    database: 'delivery_db'
  });

  const [result] = await connection.execute(
    'UPDATE orders SET status = ? WHERE id = ?',
    [status, id]
  );
  await connection.end();

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify({ message: 'Order updated', affectedRows: result.affectedRows })
  };
};
