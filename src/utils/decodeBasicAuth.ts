export interface Credentials {
  username: string;
  password: string;
}

export function decodeBasicAuth(authHeader: string): Credentials | null {
  if (!authHeader.startsWith("Basic ")) {
    return null;
  }
  const base64Credentials = authHeader.slice(6);
  const decodedCredentials = Buffer.from(base64Credentials, "base64").toString(
    "utf-8"
  );
  const [username, password] = decodedCredentials.split(":");

  if (!username || !password) {
    return null;
  }
  return { username, password };
}
