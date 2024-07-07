import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
class User {
  public static async checkCredentials(username: string, password: string) {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
        password: password,
      },
    });
    return user;
  }
}

export default User;
