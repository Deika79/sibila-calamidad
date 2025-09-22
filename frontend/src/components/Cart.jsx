import React, { useState } from 'react';

export default function Cart({ cart, onUpdateQty, onRemove, onCheckout }) {
  const [customer, setCustomer] = useState({ customer_name: '', email: '', address: '' });

  const subtotal = cart.reduce((s, it) => s + it.price * it.quantity, 0).toFixed(2);

  function handleSubmit(e) {
    e.preventDefault();
    if (!customer.customer_name || !customer.address) return alert('Nombre y dirección obligatorios');
    onCheckout(customer);
  }

  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <h3>Carrito</h3>
      {cart.length === 0 ? <p>Vacío</p> : (
        <div>
          {cart.map(it => (
            <div key={it.product_id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <div>
                <div><strong>{it.name}</strong></div>
                <div>{it.price} €</div>
              </div>
              <div>
                <input type="number" min="1" value={it.quantity} onChange={e => onUpdateQty(it.product_id, Number(e.target.value))} style={{width:60}}/>
                <button onClick={() => onRemove(it.product_id)}>Quitar</button>
              </div>
            </div>
          ))}
          <hr />
          <div><strong>Subtotal: {subtotal} €</strong></div>

          <form onSubmit={handleSubmit} style={{ marginTop: 12 }}>
            <h4>Datos de envío</h4>
            <input placeholder="Nombre" value={customer.customer_name} onChange={e => setCustomer({ ...customer, customer_name: e.target.value })} required style={{width:'100%', marginBottom:8}} />
            <input type="email" placeholder="Email" value={customer.email} onChange={e => setCustomer({ ...customer, email: e.target.value })} style={{width:'100%', marginBottom:8}} />
            <textarea placeholder="Dirección" value={customer.address} onChange={e => setCustomer({ ...customer, address: e.target.value })} required style={{width:'100%', marginBottom:8}} />
            <button type="submit">Pagar (simulado)</button>
          </form>
        </div>
      )}
    </div>
  );
}
