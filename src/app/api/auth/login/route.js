import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { User, initDb } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req) {
  try {
    await initDb();
  } catch (err) {
    console.error('[login] DB init failed:', err.message);
    return NextResponse.json({ errors: { general: 'Erreur de base de données: ' + err.message } }, { status: 500 });
  }

  try {
    const { email, password } = await req.json();

    const errors = {};
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Adresse courriel invalide.';
    if (!password) errors.password = 'Mot de passe requis.';

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return NextResponse.json({ errors: { email: 'Aucun compte trouvé avec cet email.' } }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ errors: { password: 'Mot de passe incorrect.' } }, { status: 401 });
    }

    const token = signToken({ id: user.id, email: user.email, name: user.name });
    return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('[login] Error:', err.message);
    return NextResponse.json({ errors: { general: 'Erreur serveur: ' + err.message } }, { status: 500 });
  }
}
