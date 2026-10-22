-- One unowned playtest slot. Not per-user. Reset writes an empty blob
-- with a newer stamp so an older in-flight write cannot restore itself.
create table if not exists yard_save (
  id smallint primary key,
  blob text not null,
  client_saved_at bigint not null default 0,
  saved_at timestamptz not null default now()
);
