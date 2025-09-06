import { createClient } from "@supabase/supabase-js";

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL,import.meta.env.VITE_SUPABASE_KEY)
// console.log(supabase)
export default supabase