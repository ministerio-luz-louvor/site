import serverSupabase from '../../../lib/supabaseServerClient';
import { createClient } from '@supabase/supabase-js';

export async function GET(request: Request) {
  // public listing
  try {
    const { data, error } = await serverSupabase
      .from('albums')
      .select('id, name, artist, year, cover_url, tracks_count, created_at')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}

export async function POST(request: Request) {
  // create album — authenticated
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return new Response(JSON.stringify({ error: 'Missing auth token' }), { status: 401 });

    // Validate token with service role client
    const { data: userData, error: userErr } = await serverSupabase.auth.getUser(token);
    if (userErr || !userData?.user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    const user = userData.user;

    const body = await request.json();
    // minimal validation
    if (!body?.name) return new Response(JSON.stringify({ error: 'Missing name' }), { status: 400 });

    const payload = {
      name: body.name,
      description: body.description || null,
      cover_url: body.cover_url || null,
      release_date: body.release_date || null,
      year: body.year || null,
      genre: body.genre || null,
      artist: body.artist || null,
      youtube_link: body.youtube_link || null,
      spotify_link: body.spotify_link || null,
      tracks_count: 0,
      created_by: user.id
    };

    // Create a user-scoped client to respect RLS
    const userClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || '',
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    const { data, error } = await userClient.from('albums').insert([payload]).select().single();
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    return new Response(JSON.stringify(data), { status: 201 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}
