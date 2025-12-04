import pkg from "pg";
import dotenv from "dotenv";

process.env.DOTENV_CONFIG_SUPPRESS_LOG = "true";
dotenv.config({ suppressLog: true });

const { Pool } = pkg;

function buildPool() {
    const url = process.env.DATABASE_URL;
    if (url) {
        const sslEnabled = process.env.DB_SSL === "true";
        const ssl = sslEnabled ? { rejectUnauthorized: process.env.DB_SSL_REJECT_UNAUTHORIZED !== "false" } : undefined;
        return new Pool({ connectionString: url, ssl });
    }
    const user = process.env.DB_USER || process.env.PGUSER || process.env.USER || process.env.USERNAME || "postgres";
    const database = process.env.DB_NAME || process.env.PGDATABASE || "postgres";
    const password = process.env.DB_PASSWORD || process.env.PGPASSWORD || "";
    const host = process.env.DB_HOST || process.env.PGHOST || "localhost";
    const port = Number(process.env.DB_PORT || process.env.PGPORT) || 5432;
    return new Pool({ user, host, database, password, port });
}

const pool = buildPool();

pool.connect()
    .then(() => console.log("Connected to PostgreSQL"))
    .catch(err => console.error("Connection error:", err));

export default pool;
