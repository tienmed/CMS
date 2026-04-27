const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../next-app/.env') });

async function migrate() {
    const pool = mysql.createPool({
        host: process.env.MYSQL_HOST || 'localhost',
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'cms',
    });

    try {
        console.log('Fetching all tickets...');
        const [tickets] = await pool.query('SELECT id, rented_date, ticket_no FROM rental_ticket ORDER BY rented_date ASC');

        console.log(`Found ${tickets.length} tickets. Re-assigning codes...`);

        const monthCounters = new Map();

        for (const ticket of tickets) {
            const date = new Date(ticket.rented_date);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const prefix = `RT-${year}${month}`;

            const count = (monthCounters.get(prefix) || 0) + 1;
            monthCounters.set(prefix, count);

            const newTicketNo = `${prefix}${String(count).padStart(2, '0')}`;

            console.log(`Updating ID ${ticket.id}: ${ticket.ticket_no} -> ${newTicketNo}`);

            await pool.query('UPDATE rental_ticket SET ticket_no = ? WHERE id = ?', [newTicketNo, ticket.id]);
        }

        console.log('Migration completed successfully.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await pool.end();
    }
}

migrate();
