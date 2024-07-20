import "./app.css";
import App from "./pages/Settings.svelte";

const app = new App({
  target: document.getElementById("app")!,
});

export default app;
