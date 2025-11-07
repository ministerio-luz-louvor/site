import serverSupabase from '../../../../lib/supabaseServerClient';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const { data, error } = await serverSupabase
      .from('albums')
      .select('*, tracks(*)')
      .eq('id', id)
      .single();
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 404 });
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return new Response(JSON.stringify({ error: 'Missing auth token' }), { status: 401 });

    const { data: userData, error: userErr } = await serverSupabase.auth.getUser(token);
    if (userErr || !userData?.user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    const user = userData.user;

    // verify ownership
    const { data: existing, error: existErr } = await serverSupabase.from('albums').select('created_by').eq('id', id).single();
    if (existErr || !existing) return new Response(JSON.stringify({ error: 'Album not found' }), { status: 404 });
    if (existing.created_by !== user.id) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

    const body = await request.json();
    const updates = {
      name: body.name,
      description: body.description || null,
      cover_url: body.cover_url || null,
      release_date: body.release_date || null,
      year: body.year || null,
      genre: body.genre || null,
      artist: body.artist || null,
      youtube_link: body.youtube_link || null,
      spotify_link: body.spotify_link || null
    };

    const { data, error } = await serverSupabase.from('albums').update(updates).eq('id', id).select().single();
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const authHeader = request.headers.get('authorization') || '';
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return new Response(JSON.stringify({ error: 'Missing auth token' }), { status: 401 });

    const { data: userData, error: userErr } = await serverSupabase.auth.getUser(token);
    if (userErr || !userData?.user) return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401 });
    const user = userData.user;

    const { data: existing, error: existErr } = await serverSupabase.from('albums').select('created_by').eq('id', id).single();
    if (existErr || !existing) return new Response(JSON.stringify({ error: 'Album not found' }), { status: 404 });
    if (existing.created_by !== user.id) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

    // delete tracks belonging to album first (to keep counts and avoid orphans) -- if DB has cascade this will be fine too
    try {
      await serverSupabase.from('tracks').delete().eq('album_id', id);
    } catch (e) {
      // ignore
    }

    const { error } = await serverSupabase.from('albums').delete().eq('id', id);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    return new Response(null, { status: 204 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}
