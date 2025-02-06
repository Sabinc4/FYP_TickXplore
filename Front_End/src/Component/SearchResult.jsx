import React from "react";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const pickup = queryParams.get("pickup");
  const drop = queryParams.get("drop");
  const date = queryParams.get("date");

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Search Results</h2>
        <p className="text-lg">Showing tickets from <strong>{pickup}</strong> to <strong>{drop}</strong> on <strong>{date}</strong></p>

        {/* Example bus listing */}
        <div className="mt-6 border-t pt-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold">AC - {pickup} to {drop}</h3>
              <p className="text-gray-600">Seat Layout - 2 x 2</p>
            </div>
            <p className="text-green-600 text-lg font-bold">$100.00</p>
          </div>
          <button className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            Select Seat
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
