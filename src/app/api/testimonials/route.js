import { NextResponse } from 'next/server';
import { Testimonial, initDb } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
  await initDb();
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });

  const testimonials = await Testimonial.findAll({ order: [['createdAt', 'DESC']] });
  return NextResponse.json(testimonials);
}

export async function POST(req) {
  await initDb();
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });

  try {
    const { author, message, rating } = await req.json();

    const errors = {};
    if (!author || author.trim().length < 2) errors.author = 'Le nom doit contenir au moins 2 caractères.';
    if (!message || message.trim().length < 10) errors.message = 'Le message doit contenir au moins 10 caractères.';
    if (!rating || rating < 1 || rating > 5) errors.rating = 'La note doit être entre 1 et 5.';

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 422 });
    }

    const testimonial = await Testimonial.create({ author: author.trim(), message: message.trim(), rating, userId: user.id });
    return NextResponse.json(testimonial, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ errors: { general: 'Erreur serveur.' } }, { status: 500 });
  }
}
