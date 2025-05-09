import { sign, verify } from 'jsonwebtoken';
import { compare, hash } from 'bcrypt';
import { prisma } from './prisma';
import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const KEYS_DIR = path.join(process.cwd(), 'keys');
const PRIVATE_KEY_PATH = path.join(KEYS_DIR, 'private.key');
const PUBLIC_KEY_PATH = path.join(KEYS_DIR, 'public.key');

if (!fs.existsSync(KEYS_DIR)) {
  fs.mkdirSync(KEYS_DIR, { recursive: true });
}

let privateKey: string;
let publicKey: string;

try {
  if (!fs.existsSync(PRIVATE_KEY_PATH) || !fs.existsSync(PUBLIC_KEY_PATH)) {
    const { generateKeyPairSync } = require('crypto');
    const { privateKey: privKey, publicKey: pubKey } = generateKeyPairSync('ed25519');
    
    privateKey = privKey.export({ type: 'pkcs8', format: 'pem' }).toString();
    publicKey = pubKey.export({ type: 'spki', format: 'pem' }).toString();
    
    fs.writeFileSync(PRIVATE_KEY_PATH, privateKey);
    fs.writeFileSync(PUBLIC_KEY_PATH, publicKey);
  } else {
    privateKey = fs.readFileSync(PRIVATE_KEY_PATH, 'utf8');
    publicKey = fs.readFileSync(PUBLIC_KEY_PATH, 'utf8');
  }
} catch (error) {
  console.error('Error generating or loading keys:', error);
  privateKey = process.env.JWT_PRIVATE_KEY || 'dev-private-key';
  publicKey = process.env.JWT_PUBLIC_KEY || 'dev-public-key';
}

const gitignorePath = path.join(process.cwd(), '.gitignore');
if (fs.existsSync(gitignorePath)) {
  const gitignore = fs.readFileSync(gitignorePath, 'utf8');
  if (!gitignore.includes('keys/')) {
    fs.appendFileSync(gitignorePath, '\n# ED25519 Keys\nkeys/\n');
  }
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword);
}

export function generateToken(payload: any): string {
  return sign(payload, privateKey, {
    algorithm: 'ES256',
    expiresIn: '7d', // 7 days
  });
}

export function verifyToken(token: string): any {
  try {
    return verify(token, publicKey, { algorithms: ['ES256'] });
  } catch (error) {
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
