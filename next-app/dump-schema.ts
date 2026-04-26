import 'dotenv/config';
import pool from './src/lib/db';
import fs from 'fs';

async function dumpSchema() {
    try {
        const [tables] = await pool.query('SHOW TABLES') as any[];
        const dbName = Object.keys(tables[0])[0];
        const schema: any = {};

        for (const tableRow of tables) {
            const tableName = tableRow[dbName];
            const [columns] = await pool.query(`DESCRIBE \`${tableName}\``) as any[];
            schema[tableName] = columns;
        }

        fs.writeFileSync('schema.json', JSON.stringify(schema, null, 2));
        console.log('Schema dumped to schema.json');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

dumpSchema();
