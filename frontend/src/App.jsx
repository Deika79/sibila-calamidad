import React, { useEffect, useState } from 'react';
import ProductCard from './components/ProductCard';
import Cart from './components/Cart';

export default function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(setProducts)
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  function addToCart(product) {
    setCart(prev => {
      const found = prev.find(p => p.product_id === product.id);
      if (found) return prev.map(p => p.product_id === product.id ? { ...p, quantity: p.quantity + 1 } : p);
      return [...prev, { product_id: product.id, name: product.name, price: product.price, quantity: 1 }];
    });
  }

  function updateQty(product_id, qty) {
    setCart(prev => prev.map(p => p.product_id === product_id ? { ...p, quantity: qty } : p));
  }

  function removeFromCart(product_id) {
    setCart(prev => prev.filter(p => p.product_id !== product_id));
  }

  async function handleCheckout(customer) {
    const items = cart.map(i => ({ product_id: i.product_id, quantity: i.quantity }));
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...customer, items })
    });
    if (res.ok) {
      const data = await res.json();
      setCart([]);
      alert(`Pedido creado: ${data.orderId}`);
    } else {
      const err = await res.json();
      alert('Error: ' + (err.error || 'Error al crear pedido'));
    }
  }

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: 20 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Sibila Calamidad — Tienda</h1>
        <div>Marca de camisetas y pañuelos</div>
      </header>

      <main style={{ display: 'flex', gap: 20, marginTop: 20 }}>
        <section style={{ flex: 2 }}>
          <h2>Productos</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {products.map(p => (
              <ProductCard key={p.id} product={p} onAdd={() => addToCart(p)} />
            ))}
          </div>
        </section>

        <aside style={{ flex: 1 }}>
          <Cart
            cart={cart}
            onUpdateQty={updateQty}
            onRemove={removeFromCart}
            onCheckout={handleCheckout}
          />
        </aside>
      </main>
    </div>
  );
}
