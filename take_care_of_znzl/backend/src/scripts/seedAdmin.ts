import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const ADMIN_NICKNAME = 'admin';
const ADMIN_PASSWORD = '1234';

async function seedAdmin(): Promise<void> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.');
    process.exit(1);
  }

  const supabase = createClient(url, key);
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('nickname', ADMIN_NICKNAME)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from('users')
      .update({ password_hash: passwordHash, role: 'admin' })
      .eq('nickname', ADMIN_NICKNAME);

    if (error) {
      console.error('Failed to update admin:', error.message);
      process.exit(1);
    }
    console.log('Admin account updated (nickname: admin, password: 1234)');
    return;
  }

  const { error } = await supabase.from('users').insert({
    nickname: ADMIN_NICKNAME,
    password_hash: passwordHash,
    role: 'admin',
    token: null,
    level: 0,
    exp: 0,
    energy: 3,
    last_energy_reset_date: new Date().toISOString().slice(0, 10),
    sticker_request_count: 0,
    is_sticker_requesting: false,
  });

  if (error) {
    console.error('Failed to create admin:', error.message);
    process.exit(1);
  }

  console.log('Admin account created (nickname: admin, password: 1234)');
}

seedAdmin();
