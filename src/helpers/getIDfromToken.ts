import jwt from 'jsonwebtoken';
export async function getIDfromToken(token: string, type: string) {
  const id = jwt.verify(token, type) as { sub: string };
  return id;
}
