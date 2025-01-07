import sentences from "../Data/sentences";

export const generateRandomSentence = () => {
  const randomIndex = Math.floor(Math.random() * sentences.length);
  return sentences[randomIndex];
};
