import { NextResponse } from 'next/server';
import { Project, initDb } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req) {
  await initDb();
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });

  const projects = await Project.findAll();
  const parsed = projects.map(p => ({
    ...p.toJSON(),
    technologies: JSON.parse(p.technologies),
  }));
  return NextResponse.json(parsed);
}
