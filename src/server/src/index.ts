/** Server entry point: connect to MongoDB, then start listening. */
import { config } from './config.js';
import { connectDb } from './db.js';
import { createApp } from './app.js';

async function main(): Promise<void> {
  await connectDb(config.mongoUri);
  const app = createApp();
  app.listen(config.port, () => {
    console.log(
      `Expense Tracker API listening on http://localhost:${config.port} (${config.nodeEnv})`,
    );
  });
}

main().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
