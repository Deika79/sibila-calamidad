require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --------------------
// ENDPOINT DE PRUEBA
// --------------------
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Backend funcionando' });
});

// --------------------
// PRODUCTOS
// --------------------

// Listar todos los productos
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// Obtener producto por ID
app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener producto' });
  }
});

// --------------------
// PEDIDOS / CARRITO
// --------------------

// Crear pedido
app.post('/api/orders', async (req, res) => {
  const { customer_name, email, address, items } = req.body;
  if (!customer_name || !items || !items.length) return res.status(400).json({ error: 'Datos incompletos' });

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // calcular total
    let total = 0;
    for (const it of items) {
      const [rows] = await conn.query('SELECT price FROM products WHERE id = ?', [it.product_id]);
      if (rows.length === 0) throw new Error(`Producto ${it.product_id} no encontrado`);
      total += parseFloat(rows[0].price) * it.quantity;
    }

    // insertar pedido
    const [orderResult] = await conn.query(
      'INSERT INTO orders (customer_name, email, address, total) VALUES (?, ?, ?, ?)',
      [customer_name, email, address, total]
    );
    const orderId = orderResult.insertId;

    // insertar items
    for (const it of items) {
      const [rows] = await conn.query('SELECT price FROM products WHERE id = ?', [it.product_id]);
      const price = rows[0].price;
      await conn.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, it.product_id, it.quantity, price]
      );
      // actualizar stock opcional
      await conn.query('UPDATE products SET stock = stock - ? WHERE id = ?', [it.quantity, it.product_id]);
    }

    await conn.commit();
    res.status(201).json({ orderId });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: err.message || 'Error al crear pedido' });
  } finally {
    conn.release();
  }
});

// Obtener pedido por ID con sus items
app.get('/api/orders/:id', async (req, res) => {
  try {
    const [orders] = await pool.query('SELECT * FROM orders WHERE id = ?', [req.params.id]);
    if (!orders.length) return res.status(404).json({ error: 'Pedido no encontrado' });

    const [items] = await pool.query(
      `SELECT oi.*, p.name FROM order_items oi 
       LEFT JOIN products p ON p.id = oi.product_id 
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    res.json({ order: orders[0], items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener pedido' });
  }
});

// --------------------
// INICIAR SERVIDOR
// --------------------
app.listen(PORT, () => console.log(`Backend escuchando en http://localhost:${PORT}`));
