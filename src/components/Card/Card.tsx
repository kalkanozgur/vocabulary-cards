import React from "react";
import { CardProps } from "./Card.types";

const Card: React.FC<CardProps> = ({ tr, en }) => {
  return (
    <div className="flex h-64 w-64 flex-col items-center justify-center rounded-lg bg-gradient-to-br from-[#2e026d] to-[#15162c] shadow-lg">
      <h1>{tr}</h1>
      <h1>{en}</h1>
    </div>
  );
};

export default Card;
