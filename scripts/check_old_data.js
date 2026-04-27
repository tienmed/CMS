const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../next-app/.env') });

async function checkOldData() {
    const pool = mysql.createPool({
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE,
    });

    try {
        console.log('--- CHECKING HISTORICAL DATA ---');

        // Lấy 20 phiếu gần đây nhất
        const [tickets] = await pool.query(`
            SELECT id, ticket_no, rented_date, completed_date 
            FROM rental_ticket 
            WHERE completed_date IS NOT NULL
            ORDER BY rented_date DESC 
            LIMIT 20
        `);

        console.log(`Found ${tickets.length} completed tickets.`);

        for (const t of tickets) {
            const [details] = await pool.query('SELECT COUNT(*) as total, COUNT(returned_at) as returned FROM rental_detail WHERE rental_ticket_id = ?', [t.id]);
            console.log(`Ticket ${t.ticket_no} (${t.rented_date.toISOString().split('T')[0]}): Total items: ${details[0].total}, Returned with timestamp: ${details[0].returned}, Completed Date: ${t.completed_date ? t.completed_date.toISOString() : 'NULL'}`);
        }

        console.log('\n--- CHECKING PARTIALLY RETURNED TICKETS ---');
        const [partial] = await pool.query(`
            SELECT id, ticket_no, rented_date 
            FROM rental_ticket 
            WHERE completed_date IS NULL
            ORDER BY rented_date DESC 
            LIMIT 10
        `);

        for (const t of partial) {
            const [details] = await pool.query('SELECT COUNT(*) as total, COUNT(returned_at) as returned FROM rental_detail WHERE rental_ticket_id = ?', [t.id]);
            console.log(`Ticket ${t.ticket_no} (Partial): Total items: ${details[0].total}, Returned with timestamp: ${details[0].returned}`);
        }

    } catch (error) {
        console.error('Audit failed:', error);
    } finally {
        await pool.end();
    }
}

checkOldData();
