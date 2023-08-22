const app = require("./app.js");

const db = require("./src/database/db.js");

const port = process.env.PORT || 3000;

app.listen(port, async () => {
  await db.connectToDatabase();
  console.log(`Listening on port ${port}`);
});
