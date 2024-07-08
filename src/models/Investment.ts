import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

class Investment {
  id?: string;
  createdAt?: Date;
  confirmDate?: Date | null;
  value: Prisma.Decimal;
  annualRate: Prisma.Decimal;

  constructor(
    id: string,
    createdAt: Date,
    value: Prisma.Decimal,
    annualRate: Prisma.Decimal,
    confirmDate?: Date | null
  ) {
    this.id = id;
    this.createdAt = createdAt;
    this.confirmDate = confirmDate;
    this.value = value;
    this.annualRate = annualRate;
  }
  public static async createInvestment(investment: Investment) {
    try {
      const createdInvestment = await prisma.investment.create({
        data: {
          ...investment,
        },
      });
      return createdInvestment;
    } catch (error) {
      throw new Error("Unexpected error while creating investment");
    }
  }

  public static async getInvestments() {
    try {
      const investments = await prisma.investment.findMany();
      if (investments.length === 0) {
        throw new Error("No investments found");
      }
      return investments;
    } catch (error) {
      throw new Error("Unexpected error while getting investments");
    }
  }

  public static async getInvestment(id: string) {
    try {
      const investment = await prisma.investment.findUnique({
        where: {
          id: id,
        },
      });

      if (!investment) {
        throw new Error("Investment not found");
      }
      return investment;
    } catch (error) {
      throw new Error("Unexpected error while getting investment");
    }
  }
}

export default Investment;
