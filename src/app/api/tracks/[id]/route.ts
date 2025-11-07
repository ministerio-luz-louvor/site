import serverSupabase from '../../../../lib/supabaseServerClient';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const { data, error } = await serverSupabase.from('tracks').select('*').eq('id', id).single();
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

    const { data: existing, error: existErr } = await serverSupabase.from('tracks').select('created_by, album_id').eq('id', id).single();
    if (existErr || !existing) return new Response(JSON.stringify({ error: 'Track not found' }), { status: 404 });
    if (existing.created_by !== user.id) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

    // ensure album ownership if album_id is changed
    const body = await request.json();
    if (body.album_id && body.album_id !== existing.album_id) {
      const { data: album, error: albumErr } = await serverSupabase.from('albums').select('created_by').eq('id', body.album_id).single();
      if (albumErr || !album) return new Response(JSON.stringify({ error: 'Target album not found' }), { status: 404 });
      if (album.created_by !== user.id) return new Response(JSON.stringify({ error: 'Forbidden to move track to this album' }), { status: 403 });
    }

    const updates = {
      name: body.name,
      number: body.number || null,
      duration_seconds: body.duration_seconds || null,
      cover_url: body.cover_url || null,
      year: body.year || null,
      youtube_link: body.youtube_link || null,
      spotify_link: body.spotify_link || null,
      chords_link: body.chords_link || null,
      lyrics_link: body.lyrics_link || null,
      album_id: body.album_id || existing.album_id
    };

    const { data, error } = await serverSupabase.from('tracks').update(updates).eq('id', id).select().single();
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    
    // if album_id changed, adjust tracks_count on both albums
    try {
      const newAlbumId = updates.album_id;
      const oldAlbumId = existing.album_id;
      if (newAlbumId && newAlbumId !== oldAlbumId) {
        // decrement old
        const { data: oldData } = await serverSupabase.from('albums').select('tracks_count').eq('id', oldAlbumId).single();
        const oldCount = (oldData && (oldData as any).tracks_count) || 0;
        await serverSupabase.from('albums').update({ tracks_count: Math.max(0, oldCount - 1) }).eq('id', oldAlbumId);
        // increment new
        const { data: newData } = await serverSupabase.from('albums').select('tracks_count').eq('id', newAlbumId).single();
        const newCount = (newData && (newData as any).tracks_count) || 0;
        await serverSupabase.from('albums').update({ tracks_count: newCount + 1 }).eq('id', newAlbumId);
      }
    } catch (e) {
      // ignore non-fatal
    }
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

    const { data: existing, error: existErr } = await serverSupabase.from('tracks').select('created_by').eq('id', id).single();
    if (existErr || !existing) return new Response(JSON.stringify({ error: 'Track not found' }), { status: 404 });
    if (existing.created_by !== user.id) return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403 });

    // get album id to decrement count
    const { data: trackData } = await serverSupabase.from('tracks').select('album_id').eq('id', id).single();
    const albumId = trackData?.album_id;

    const { error } = await serverSupabase.from('tracks').delete().eq('id', id);
    if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 });

    try {
      if (albumId) {
        const { data: albumData } = await serverSupabase.from('albums').select('tracks_count').eq('id', albumId).single();
        const current = (albumData && (albumData as any).tracks_count) || 0;
        await serverSupabase.from('albums').update({ tracks_count: Math.max(0, current - 1) }).eq('id', albumId);
      }
    } catch (e) {
      // ignore non-fatal
    }

    return new Response(null, { status: 204 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || String(err) }), { status: 500 });
  }
}
