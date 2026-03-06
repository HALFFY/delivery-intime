import mysql from 'mysql2/promise';

export const handler = async (event) => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: 'delivery_user',
    password: 'Delivery@123!',
    database: 'delivery_db'
  });

  const [rows] = await connection.execute('SELECT * FROM fleet');
  await connection.end();

  return {
    statusCode: 200,
    headers: { "Access-Control-Allow-Origin": "*" },
    body: JSON.stringify(rows)
  };
};
