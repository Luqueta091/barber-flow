import { createApp, schemaReady } from "./app.js";

const port = Number(process.env.PORT) || 3000;

schemaReady
  .then(() => {
    const app = createApp();
    app.listen(port, () => {
      console.log(`API listening on ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to start server", err);
    process.exit(1);
  });
