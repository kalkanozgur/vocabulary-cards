import { useRouter } from "next/router";
import { useState } from "react";
import { Word } from "~/server/api/routers/wordSchema";

const SwipableWordCard: React.FC<Word> = (props: Word) => {
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState(["First", "Second", "Third"]);

  const onSwipe = (direction) => {
    console.log("You swiped: ", direction);
  };

  const wrapperStyles = {
    position: "relative",
    width: "250px",
    height: "250px",
  };
  const actionsStyles = {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 12,
  };

  const appStyles = {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    minHeight: "100vh",
    fontFamily: "sans-serif",
    overflow: "hidden",
  };

  return <></>;
};

export default SwipableWordCard;
