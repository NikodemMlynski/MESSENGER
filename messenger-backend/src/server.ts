process.on('uncaughtException', (err) => {
    console.log(err);
    console.log('UNCAUGHT EXEPTION shutting down...');
    process.exit(1);
});

import app from "./app";
import connectDB from './database';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server running at http:127.0.0.1${PORT}`)
})
connectDB();

process.on('unhandledRejection', (err) => {
    console.log(err);
    console.log('UNHANDLED REJECTION shutting down...');
    server.close(() => {
      process.exit(1);
    });
  });
  