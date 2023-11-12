// pages/api/customers.js
import db from '../../utils/db';
import { customerSchema } from '../../utils/validate';
import bcrypt from 'bcrypt';

export default async function handler(req, res) {
    switch (req.method) {
        case 'POST':
            const { error } = customerSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ error: error.details[0].message });
            }

            const { 
                company_name, 
                email, 
                password, 
                address, 
                phone, 
                parcel_pricing, 
                pallet_pricing 
            } = req.body;

            const hashedPassword = await bcrypt.hash(password, 10);

            const query = `
                INSERT INTO customers (company_name, email, password, address, phone, parcel_pricing, pallet_pricing)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;
            try {
                const results = await db.query(query, [company_name, email, hashedPassword, address, phone, JSON.stringify(parcel_pricing), JSON.stringify(pallet_pricing)]);
                res.status(201).json({ message: 'Customer created successfully', customer_id: results.insertId });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Database error' });
            }
            break;
        case 'GET':
            try {
                const results = await db.query('SELECT * FROM customers');
                res.status(200).json(results);
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Database error' });
            }
            break;
        case 'PATCH':
            const { id, updateFields } = req.body;
            if (!id || typeof updateFields !== 'object') {
                return res.status(400).json({ error: 'Invalid request body' });
            }

            const updateQueries = Object.entries(updateFields).map(
                ([field, value]) => `${field} = ?`
            );
            const updateValues = Object.values(updateFields);

            const queryPatch = `
                UPDATE customers
                SET ${updateQueries.join(', ')}
                WHERE id = ?
            `;
            try {
                await db.query(queryPatch, [...updateValues, id]);
                res.status(200).json({ message: 'Customer updated successfully' });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Database error' });
            }
            break;
        case 'DELETE':
            const { id: customerId } = req.body;
            if (!customerId) {
                return res.status(400).json({ error: 'Invalid request body' });
            }

            const deleteQuery = `
                DELETE FROM customers
                WHERE id = ?
            `;
            try {
                await db.query(deleteQuery, [customerId]);
                res.status(200).json({ message: 'Customer deleted successfully' });
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Database error' });
            }
            break;
        default:
            res.status(405).json({ error: 'Method Not Allowed' });
    }
}
