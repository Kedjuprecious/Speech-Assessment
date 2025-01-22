import React, { useState } from "react";
import { getStory } from "./api";

function Story() {
  const [story, setStory] = useState([]);
  const [storyId, setStoryId] = useState(0);

  const fetchStory = async () => {
    const data = await getStory(storyId);
    if (data.code === 200) {
      setStory(data.story);
    } else {
      alert("No more stories available!");
    }
  };

  return (
    <div>
      <h1>Story</h1>
      <input
        type="number"
        value={storyId}
        onChange={(e) => setStoryId(Number(e.target.value))}
      />
      <button onClick={fetchStory}>Get Story</button>
      <div>
        {story.map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </div>
  );
}

export default Story;
