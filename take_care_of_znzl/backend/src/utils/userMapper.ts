import type { UserRow } from '../types/database';
import type { PublicUser, AdminUserRow } from '../types/api';

export function toPublicUser(row: UserRow): PublicUser {
  return {
    id: row.id,
    nickname: row.nickname,
    role: row.role,
    level: row.level,
    exp: row.exp,
    energy: row.energy,
    stickerRequestCount: row.sticker_request_count,
    isStickerRequesting: row.is_sticker_requesting,
  };
}

export function toAdminUser(row: UserRow): AdminUserRow {
  return {
    id: row.id,
    nickname: row.nickname,
    token: row.token,
    level: row.level,
    exp: row.exp,
    stickerRequestCount: row.sticker_request_count,
    isStickerRequesting: row.is_sticker_requesting,
  };
}
