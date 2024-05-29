import React from 'react';

interface PriceCardProps {
  title: string;
  price: string;
  features: string[];
  onPurchase: () => void;
  loading: boolean;
}

const PriceCard: React.FC<PriceCardProps> = ({ title, price, features, onPurchase, loading }) => (
  <div className="bg-white shadow-lg rounded-lg p-6 w-96">
    <h2 className="text-center text-2xl font-bold mb-4">{title}</h2>
    <p className="text-center text-4xl font-bold mb-4">${price}</p>
    <ul className="mb-4">
      {features.map((feature, index) => (
        <li key={index}>✔️ {feature}</li>
      ))}
    </ul>
    <button
      onClick={onPurchase}
      className="bg-pink-400 text-white py-2 px-4 rounded w-full"
      disabled={loading}
    >
      {loading ? 'Processing...' : 'Buy plan'}
    </button>
  </div>
);

export default PriceCard;
