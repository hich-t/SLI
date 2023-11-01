// pages/api/customers.js
import db from '../../utils/db';
import { customerSchema } from '../../utils/validate';
import bcrypt from 'bcrypt';


export default async function handler(req, res) {
    if (req.method === 'POST') {
    const { error } = customerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const { company_name, email, password, address, phone, rate_table } = req.body;

    // You would need to hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);  // Assuming bcrypt is used for hashing

    const query = `
      INSERT INTO customers (company_name, email, password, address, phone, rate_table)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
db.query(query, [company_name, email, hashedPassword, address, phone, JSON.stringify(rate_table)], (error, results) => {
   if (error) {
     console.error(error);
     return res.status(500).json({ error: 'Database error' });
   }
   res.status(201).json({ message: 'Customer created successfully', customer_id: results.insertId });
 });

  } else {
    // Handle other HTTP methods (e.g., GET)
    db.query('SELECT * FROM customers', (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: 'Database error' });
      }
      res.status(200).json(results);
    });
  }
}
