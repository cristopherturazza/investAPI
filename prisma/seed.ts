import { PrismaClient, Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { addDays, addMonths } from "date-fns";

const prisma = new PrismaClient();

const VALUES = [250, 500, 1000, 5000, 10000];
const ANNUAL_RATES = [5, 7.5, 10, 12];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomFutureDate(start: Date, maxDaysAhead: number) {
  const daysToAdd = Math.floor(Math.random() * maxDaysAhead) + 1;
  return addDays(start, daysToAdd);
}

async function main() {
  console.log("Starting seed...");

  // User creation
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash("testpassword", saltRounds);

  const user = await prisma.user.upsert({
    where: { email: "test@gmail.com" },
    update: {},
    create: {
      email: "test@gmail.com",
      username: "testuser",
      password: hashedPassword,
    },
  });

  console.log("User created:", user);

  // Investment creation
  console.log("Starting investment seed...");

  const startDate = new Date(); // Today
  const endDate = addMonths(startDate, 2); // Two months from now

  for (
    let currentDate = startDate;
    currentDate <= endDate;
    currentDate = addDays(currentDate, 1)
  ) {
    for (let i = 0; i < 2; i++) {
      // 2 investments per day
      const createdAt = currentDate;
      const confirmDate =
        Math.random() < 0.5 ? getRandomFutureDate(createdAt, 7) : null; // 50% chance of having a confirmDate within 7 days

      const investment = await prisma.investment.create({
        data: {
          createdAt: createdAt,
          confirmDate: confirmDate,
          value: new Prisma.Decimal(getRandomElement(VALUES)),
          annualRate: new Prisma.Decimal(getRandomElement(ANNUAL_RATES)),
        },
      });
      console.log(
        `Investment created: ${investment.id}, createdAt: ${createdAt}, confirmDate: ${confirmDate}`
      );
    }
  }

  console.log("Seed completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
