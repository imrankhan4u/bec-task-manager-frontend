import React from 'react';

const SummaryCard = ({ icon, title, count, onClick }) => {
  return (
    <div
      className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center cursor-pointer hover:shadow-lg transition duration-300 ease-in-out"
      onClick={onClick}
    >
      <div className="text-3xl text-blue-500 mb-2">{icon}</div>
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className="text-2xl font-bold text-gray-900">{count}</p>
    </div>
  );
};

export default SummaryCard;
