import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const gamesDirectories = [
      { path: path.join(process.cwd(), 'public', 'games'), prefix: '/games/' },
      { path: path.join(process.cwd(), 'public', 'pico-8'), prefix: '/pico-8/' }
    ];
    
    let allGames: string[] = [];

    for (const dir of gamesDirectories) {
      if (fs.existsSync(dir.path)) {
        const files = fs.readdirSync(dir.path);
        const gameFiles = files.filter(file => 
          file.endsWith('.p8.png') || 
          file.endsWith('.p8') || 
          file.endsWith('.js')
        );
        
        const games = gameFiles.map(file => `${dir.prefix}${file}`);
        allGames = allGames.concat(games);
      }
    }

    return NextResponse.json(allGames);
  } catch (error) {
    console.error('Error reading games directory:', error);
    return NextResponse.json({ error: 'Failed to load games' }, { status: 500 });
  }
}