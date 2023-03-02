// when click on card, it will open a modal with the card details
//
// Path: src\components\Card\CardModal.tsx
// Compare this snippet from src\pages\index.tsx:
import React, { useState } from "react";
import type { CardProps } from "~/components/Card/Card.types";
type Props = {
  card: CardProps;
  // react node
  children: React.ReactNode;
};

const CardModal: React.FC<Props> = () => {
  return (
    <div className="fixed inset-0 z-10 flex items-center justify-center bg-black bg-opacity-50">
      <div className="h-96 w-96 rounded-lg bg-white shadow-lg">
        <div className="flex h-full flex-col items-center justify-center">
          <h1 className="text-2xl font-bold text-black">Modal</h1>

          <button className="mt-4 rounded-md bg-[#2e026d] px-4 py-2 text-sm font-medium text-white hover:bg-[#15162c]">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
