import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

// * read only on users table for basic authentication
class User {
  public static async checkUserCredentials(username: string, password: string) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username: username,
        },
      });
      if (!user) {
        return null;
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      return isPasswordValid ? user : null;
    } catch (error) {
      console.error(error);
      throw new Error("Unexpected error while checking user credentials");
    }
  }
}

export default User;
