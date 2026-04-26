import pool from './src/lib/db.js';

async function dumpSchema() {
    try {
        const [tables] = await pool.query('SHOW TABLES');
        const dbName = Object.keys(tables[0])[0];

        for (const tableRow of tables) {
            const tableName = tableRow[dbName];
            console.log(`\n--- Table: ${tableName} ---`);
            const [columns] = await pool.query(`DESCRIBE ${tableName}`);
            console.table(columns);
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

dumpSchema();
