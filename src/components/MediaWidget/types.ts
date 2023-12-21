interface Playlist {
  title: string;
  id: string;
}

interface Song {
  src: string;
  type: string;
  id: string;
  originId: string;
  owner: string;
  title: string;
}

export { Playlist, Song };
