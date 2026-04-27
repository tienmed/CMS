const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../next-app/.env') });

async function audit() {
    const pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    });

    try {
        console.log('--- DB AUDIT START ---');

        console.log('\n1. Checking Table Structure: rental_ticket');
        const [rtCols] = await pool.query('DESCRIBE rental_ticket');
        console.log(JSON.stringify(rtCols, null, 2));

        console.log('\n2. Checking Table Structure: rental_detail');
        const [rdCols] = await pool.query('DESCRIBE rental_detail');
        console.log(JSON.stringify(rdCols, null, 2));

        console.log('\n3. Checking Data for RT-20260401 (formerly RT-309168)');
        const [tickets] = await pool.query('SELECT id, ticket_no, rented_date, completed_date FROM rental_ticket WHERE ticket_no = "RT-20260401"');
        console.log('Ticket Data:', JSON.stringify(tickets[0], null, 2));

        if (tickets[0]) {
            const [details] = await pool.query('SELECT id, equipment_item_id, returned_at FROM rental_detail WHERE rental_ticket_id = ?', [tickets[0].id]);
            console.log('\nRental Details (Items):');
            console.log(JSON.stringify(details, null, 2));
        }

        console.log('\n--- DB AUDIT END ---');
    } catch (error) {
        console.error('Audit failed:', error);
    } finally {
        await pool.end();
    }
}

audit();
