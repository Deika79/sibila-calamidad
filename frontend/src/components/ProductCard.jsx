import React from 'react';
export default function ProductCard({ product, onAdd }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: 12, borderRadius: 8 }}>
      <img src={product.image} alt={product.name} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
      <h3>{product.name}</h3>
      <p style={{ fontSize: 14 }}>{product.description}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>{product.price} €</strong>
        <button onClick={onAdd}>Añadir</button>
      </div>
    </div>
  );
}
