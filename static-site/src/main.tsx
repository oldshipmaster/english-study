import React from "react";
import ReactDOM from "react-dom/client";
import { StoryStageApp } from "../../app/StoryStageApp";
import "../../app/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode><StoryStageApp /></React.StrictMode>,
);
