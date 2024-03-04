import React, { SetStateAction, StrictMode } from "react"; // Ensure React is imported
import { createRoot } from "react-dom/client";

import { Menu, Item } from "./Menu";

// Define the App component
function App() {
  return (
    <StrictMode>
      <Menu
        renderTrigger={(props) => <button {...props}>Actions</button>}
        onAction={alert}
        shouldFlip={true}
      >
        <Item key="copy">Copy application</Item>
        <Item key="rename">Rename application</Item>
        <Item key="move" title="Move to">
          <Item key="move-to-shared">Shared</Item>
          <Item key="move-to-desktop">Desktop</Item>
          <Item key="move-to-favorite">Favorite</Item>
        </Item>
        <Item key="delete">Delete application</Item>
      </Menu>
    </StrictMode>
  );
}

// Render the App component to the DOM
const rootElement = document.getElementById("root");
const root = createRoot(rootElement || document.createElement("div"));

root.render(<App />);
