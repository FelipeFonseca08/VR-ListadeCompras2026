// Importa a função de criação do client Supabase via CDN
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Cria o client com a URL e a chave fornecidas
export const supabase = createClient(
  'https://rambpvqaolnhmuvrikgq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJhbWJwdnFhb2xuaG11dnJpa2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIxMTIxNzcsImV4cCI6MjA4NzY4ODE3N30.dk-SRI5k0r50wBoIIhCzNDKMDNnZZ4e_G_3Jh5W32is'
)
    