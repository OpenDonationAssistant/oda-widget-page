interface Playlist {
  title: string;
  id: string;
}

interface Song {
  src: string;
  type: string;
  id: string;
  originId: string|null;
  owner: string;
  title: string;
  listened: boolean;
}

export { Playlist, Song };
