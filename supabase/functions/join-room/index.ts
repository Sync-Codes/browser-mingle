import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

Deno.serve(async (req: Request) => {
  
  // create supabase client
  const authHeader = req.headers.get('Authorization')!
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } }
  )

  // get request body
  const params = await req.json()!

  // check if room for the topic exists
  const { data: query, error: e } = await supabase
    .from('rooms')
    .select("*")
    .eq('topic', params.topic);

  if (query.length >= 1) {
    // TODO log if more than one room present

    return new Response(
      JSON.stringify({ "room_id": query[0].room_id }),
      { headers: { "Content-Type": "application/json" } },
    )
  }

  // create topic if it doesn't exist
  const { data, error } = await supabase
    .from('rooms')
    .insert([
      { topic: params.topic },
    ])
    .select('room_id')
    .eq('topic', params.topic);

  console.log("😗", data[0]);

  return new Response(
    JSON.stringify(data[0]),
    { headers: { "Content-Type": "application/json" } },
  )
})

