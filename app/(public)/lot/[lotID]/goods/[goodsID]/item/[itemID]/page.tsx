'use client';

import React from 'react';
import { useParams } from 'next/navigation';

const ItemPage = () => {
  const params = useParams();
  const { lotID, goodsID, itemID } = params;

  console.log('Route params:', { lotID, goodsID, itemID });

  return (
    <div>
      <h1>Item Details</h1>
      <p>Lot ID: {lotID}</p>
      <p>Goods ID: {goodsID}</p>
      <p>Item ID: {itemID}</p>
    </div>
  );
};

export default ItemPage;
