import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { User, initDb } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req) {
  try {
    await initDb();
  } catch (err) {
    console.error('[register] DB init failed:', err.message);
    return NextResponse.json({ errors: { general: 'Erreur de base de données: ' + err.message } }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { name, email, password } = body;

    // Validation
    const errors = {};
    if (!name || name.trim().length < 2) errors.name = 'Le nom doit contenir au moins 2 caractères.';
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Adresse courriel invalide.';
    if (!password || password.length < 8) errors.password = 'Le mot de passe doit contenir au moins 8 caractères.';

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return NextResponse.json({ errors: { email: 'Cet email est déjà utilisé.' } }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name: name.trim(), email, password: hashed });
    const token = signToken({ id: user.id, email: user.email, name: user.name });

    return NextResponse.json(
      { token, user: { id: user.id, name: user.name, email: user.email } },
      { status: 201 }
    );
  } catch (err) {
    console.error('[register] Error:', err.message, err.stack);
    return NextResponse.json({ errors: { general: 'Erreur serveur: ' + err.message } }, { status: 500 });
  }
}
