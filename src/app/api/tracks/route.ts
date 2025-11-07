import serverSupabase from '../../../lib/supabaseServerClient';

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return new Response(JSON.stringify({ error: 'Missing auth token' }), { status: 401 });

    const { data: userData, error: userErr } = await serverSupabase.auth.getUser(token);
    if (userErr || !userData?.user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    const user = userData.user;

    const body = await request.json();
    if (!body?.name || !body?.album_id) return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });

    // Verify album ownership
    const { data: album, error: albumErr } = await serverSupabase.from('albums').select('created_by').eq('id', body.album_id).single();
    if (albumErr || !album) return new Response(JSON.stringify({ error: 'Album not found' }), { status: 404 });
    if (album.created_by !== user.id) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

    const payload = {
      album_id: body.album_id,
      name: body.name,
      number: body.number || null,
      duration_seconds: body.duration_seconds || null,
      cover_url: body.cover_url || null,
      year: body.year || null,
      youtube_link: body.youtube_link || null,
      spotify_link: body.spotify_link || null,
      chords_link: body.chords_link || null,
      lyrics_link: body.lyrics_link || null,
      created_by: user.id
    };

    const { data, error } = await serverSupabase.from('tracks').insert([payload]).select().single();
        if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

        // update album tracks_count (+1)
        try {
          const { data: albumData } = await serverSupabase.from('albums').select('tracks_count').eq('id', body.album_id).single();
          const current = (albumData && (albumData as any).tracks_count) || 0;
          await serverSupabase.from('albums').update({ tracks_count: current + 1 }).eq('id', body.album_id);
        } catch (e) {
          // non-fatal: ignore
        }

        return new Response(JSON.stringify(data), { status: 201 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}

export async function GET(request: Request) {
  // list tracks (optionally filter by album_id query param)
  try {
    const url = new URL(request.url);
    const album_id = url.searchParams.get('album_id');
    let q = serverSupabase.from('tracks').select('*').order('number', { ascending: true });
    if (album_id) q = q.eq('album_id', album_id);
    const { data, error } = await q;
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}
