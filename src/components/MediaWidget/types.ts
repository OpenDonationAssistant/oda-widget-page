enum Provider {
  YOUTUBE,
  VK
}

interface Song {
  src: string;
  type: string;
  id: string;
  originId: string|null;
  owner: string;
  title: string;
  provider: Provider;
}

export { Song, Provider };
