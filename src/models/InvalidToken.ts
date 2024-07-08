import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

class InvalidToken {
  public static async createInvalidToken(token: string) {
    try {
      const invalidToken = await prisma.invalidToken.create({
        data: {
          token: token,
        },
      });
      return invalidToken;
    } catch (error) {
      throw new Error("Unexpected error while creating invalid token");
    }
  }

  public static async checkInvalidToken(token: string) {
    try {
      const invalidToken = await prisma.invalidToken.findFirst({
        where: {
          token: token,
        },
      });
      return invalidToken;
    } catch (error) {
      throw new Error("Unexpected error while checking invalid token");
    }
  }
}

export default InvalidToken;
