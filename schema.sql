create table article (
	id serial primary key,
	url text not null,
	year smallint not null,
	name text not null
);

create table artist (
	id serial primary key,
	name text not null
);

create table song (
	id serial primary key,
	name text not null,
	artist_id integer references artist(id),
  video_id text
);

create table article_song_map (
	article_id integer references article(id),
	song_id integer references song(id),
  sort_no smallint not null,
	primary key (article_id, song_id)
);