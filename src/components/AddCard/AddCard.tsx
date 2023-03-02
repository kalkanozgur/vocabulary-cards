import React, { useState } from "react";

const AddCardModal: React.FC = () => {
  const [text, setText] = useState("");

  return (
    // modal for adding new card for translation
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="h-96 w-96 rounded-lg bg-white shadow-lg">
        <div className="flex h-full flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-black">Modal</h1>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Search"
            value={text}
            onChange={(e) => {
              e.preventDefault();
              setText(e.target.value);
            }}
            onSubmit={(e) => {
              e.preventDefault();
              setText(text);
            }}
            className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-lg text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-100"
          />
          <button className="mt-4 rounded-md bg-[#2e026d] px-4 py-2 text-sm font-medium text-white hover:bg-[#15162c]">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
