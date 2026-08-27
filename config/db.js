// importing pg using ESM
import pg from 'pg';
// load .env variables with dotenv
import dotenv from 'dotenv'

dotenv.config();

const { Pool } = pg

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT, 
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,

    // maximum number of client in the pool
    max: 20,
    // return an error if connection takes > 10s
    connectionTimeoutMillis: 10000,
    
    // close idle client after 60s
    idleTimeoutMillis: 30000,

    // fail a query that hangs > 30s
    statement_timeout: 30000
})
// listens for unexpected errors fro idle database clients
// prevent lost DB connection from crashing the process
pool.on('error', (err) => {
    console.error('Unexpected error on an idle client', err)
})

export default pool