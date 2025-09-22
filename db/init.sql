CREATE DATABASE IF NOT EXISTS sibila_store;
USE sibila_store;

CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  stock INT DEFAULT 0,
  image VARCHAR(255)
);

CREATE TABLE IF NOT EXISTS orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  address TEXT,
  total DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT,
  product_id INT,
  quantity INT,
  price DECIMAL(10,2),
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL
);

-- Seed: camisetas y pañuelos
INSERT INTO products (name, description, price, stock, image) VALUES
('Camiseta "Luz de Medianoche"', 'Camiseta 100% algodón, serigrafía artesanal', 19.90, 50, 'https://via.placeholder.com/300x300?text=Camiseta+1'),
('Camiseta "Aullido"', 'Camiseta premium, corte unisex', 22.50, 40, 'https://via.placeholder.com/300x300?text=Camiseta+2'),
('Pañuelo "Sibila"', 'Pañuelo ligero para la cabeza', 9.50, 100, 'https://via.placeholder.com/300x300?text=Pañuelo+1');
