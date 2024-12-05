"use client";

import { useState } from "react";

export default function Home() {
  const [filterTagIds, setFilterTagIds] = useState<string[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const handleFilter = async () => {
    const res = await fetch("/api/products/filter", {
      method: "POST",
      body: JSON.stringify({ filterTagIds }),
    });

    const data = await res.json();
    setProducts(data.products || []);
  };

  return (
    <div>
      
      <input
        type="text"
        placeholder="Filter Tag IDs (comma separated)"
        onChange={(e) => setFilterTagIds(e.target.value.split(","))}
      />
      <button onClick={handleFilter}>Filter</button>
      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}