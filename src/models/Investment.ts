import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient({ log: ["query", "error"] }); // ! remove before end of development

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

  // create new investment
  public static async createInvestment(investment: Investment) {
    try {
      const createdInvestment = await prisma.investment.create({
        data: {
          ...investment,
        },
      });
      return createdInvestment;
    } catch (error) {
      console.error(error);
      throw new Error("Unexpected error while creating investment");
    }
  }

  // get all investments
  public static async getInvestments() {
    try {
      const investments = await prisma.investment.findMany();
      if (investments.length === 0) {
        throw new Error("No investments found");
      }
      return investments;
    } catch (error) {
      console.error(error);
      throw new Error("Unexpected error while getting investments");
    }
  }

  // get investment by id
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
      console.error(error);
      throw new Error("Unexpected error while getting investment");
    }
  }

  public static async confirmInvestment(id: string, date: Date) {
    try {
      const confirmedInvestment = await prisma.investment.update({
        where: {
          id: id,
        },
        data: {
          confirmDate: new Date(date),
        },
      });
      return confirmedInvestment;
    } catch (error) {
      console.error(error);
      throw new Error("Unexpected error while confirming investment");
    }
  }

  public static async getInvestmentsStatistics(
    startDate: Date,
    endDate: Date,
    groupBy: string,
    includeUnconfirmed: boolean
  ) {
    try {
      const groupBySql = Investment.groupByClause(groupBy);

      const statistics = await prisma.$queryRaw`
      SELECT 
        ${groupBySql} as period,
        COUNT(*)::int as count, 
        SUM(value::numeric) as totalValue
      FROM public."Investment"
      WHERE "createdAt" >= ${startDate}
      AND "createdAt" <= ${endDate}
      ${Prisma.raw(includeUnconfirmed ? "" : `AND "confirmDate" IS NOT NULL`)}
      GROUP BY period
      ORDER BY period
    `;
      return statistics;
    } catch (error) {
      console.error(error);
      throw new Error("Unexpected error while getting investments statistics");
    }
  }
  private static groupByClause = (groupBy: string) => {
    switch (groupBy) {
      case "day":
        return Prisma.sql`DATE_TRUNC('day', "createdAt")`;
      case "week":
        return Prisma.sql`DATE_TRUNC('week', "createdAt")`;
      case "month":
        return Prisma.sql`DATE_TRUNC('month', "createdAt")`;
      case "year":
        return Prisma.sql`DATE_TRUNC('year', "createdAt")`;
      default:
        throw new Error("Invalid groupBy value");
    }
  };
}

export default Investment;
