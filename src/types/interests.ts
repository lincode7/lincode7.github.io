export interface Game {
  id: string;
  title: string;
  platform: string[];
  hoursPlayed: number;
  status: "playing" | "completed" | "backlog";
  rating?: number;
  lastPlayed: string;
  coverImage: string;
}

export interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  watchedDate: string;
  review?: string;
  poster: string;
}

export interface MusicAlbum {
  id: string;
  title: string;
  artist: string;
  genre: string[];
  rating: number;
  lastListened: string;
  coverImage: string;
}

export interface TravelLocation {
  id: string;
  name: string;
  country: string;
  visitDate: string;
  rating: number;
  photos: string[];
  description: string;
}

export interface InterestStats {
  totalGames: number;
  totalMovies: number;
  totalAlbums: number;
  totalLocations: number;
  recentActivity: {
    games: Game[];
    movies: Movie[];
    music: MusicAlbum[];
    travels: TravelLocation[];
  };
}
