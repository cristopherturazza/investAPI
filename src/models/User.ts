import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
class User {
  public static async checkUserCredentials(username: string, password: string) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username: username,
          password: password,
        },
      });
      return user;
    } catch (error) {
      console.error(error);
      throw new Error("Unexpected error while checking user credentials");
    }
  }
}

export default User;
