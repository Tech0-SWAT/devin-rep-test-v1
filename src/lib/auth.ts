import { sign, verify } from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import { prisma } from './prisma';
import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIGHAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBG0wawIBAQQgKxR5njoQS9zL8Jhd
9MCR7SsRjgf8Vyj/ygI++NRFSaShRANCAARBqgm7Ky4jJJBr8ztRM3JpLLIcRu6a
e+Bf9MBwdH+ew3pHDoYSvQCKGC/y5OaDJlX9UkdEQj9h13P0hhWe7j8c
-----END PRIVATE KEY-----`;

const DEFAULT_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEQaoJuysuIySQa/M7UTNyaSyyHEbu
mnvgX/TAcHR/nsN6Rw6GEr0Aihgv8uTmgyZV/VJHREI/Yddz9IYVnu4/HA==
-----END PUBLIC KEY-----`;

const privateKey = process.env.JWT_PRIVATE_KEY || DEFAULT_PRIVATE_KEY;
const publicKey = process.env.JWT_PUBLIC_KEY || DEFAULT_PUBLIC_KEY;

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

export function generateToken(payload: any): string {
  try {
    return sign(payload, privateKey, {
      algorithm: 'ES256',
      expiresIn: '7d', // 7 days
    });
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate token');
  }
}

export function verifyToken(token: string): any {
  try {
    return verify(token, publicKey, { algorithms: ['ES256'] });
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export function withAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    const authHeader = req.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    (req as any).user = payload;
    
    return handler(req);
  };
}

export async function getCurrentUser(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
    },
  });
}
