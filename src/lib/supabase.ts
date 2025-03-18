import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://opklfjvxlrzfopxnkhbw.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9wa2xmanZ4bHJ6Zm9weG5raGJ3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0MDUxMjU5NCwiZXhwIjoyMDU2MDg4NTk0fQ.Jr29_VQgMkvOuI-5AGz4L16AeFLDk7vA-9olgBQUBoE";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
