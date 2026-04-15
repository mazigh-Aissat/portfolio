import { NextResponse } from 'next/server';
import { Project, initDb } from '@/lib/db';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(req, { params }) {
  await initDb();
  const user = getUserFromRequest(req);
  if (!user) return NextResponse.json({ error: 'Non autorisé.' }, { status: 401 });

  const project = await Project.findByPk(params.id);
  if (!project) return NextResponse.json({ error: 'Projet introuvable.' }, { status: 404 });

  return NextResponse.json({ ...project.toJSON(), technologies: JSON.parse(project.technologies) });
}
