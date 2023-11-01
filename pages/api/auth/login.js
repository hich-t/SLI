// pages/api/auth/login.js
import db from '../../../utils/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const query = 'SELECT * FROM customers WHERE email = ?';
    const results = await db.query(query, [email]);  // Use the query function from db.js

    // console.log('Database results:', results);

    if (results.length === 0) {
      return res.status(401).json({ message: 'Informations erronées ! Veuillez réessayer' });
    }

    const passwordMatch = await bcrypt.compare(password, results[0].password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: results[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
