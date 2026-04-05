import "dotenv/config";
import app from "./app.ts";
import prisma from './lib/prisma.ts';

const port: number = Number(process.env.PORT) || 8000;

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");

    app.listen(port, () => {
      console.log(`Server started on PORT: ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("Database disconnected");
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  console.log("Database disconnected");
  process.exit(0);
});