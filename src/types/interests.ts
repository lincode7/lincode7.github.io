export interface Interest {
  id: string;
  type: string;
  title: string;
  image?: string;
  description: string;
  tags: string[];
  date: string;
  link?: string;
  rating?: number;
}

export interface GameInterest extends Interest {
  platform?: string;
  hours?: number;
}

export interface MovieInterest extends Interest {
  year?: number;
  director?: string;
  duration?: number;
}

export interface MusicInterest extends Interest {
  year?: number;
  artist?: string;
  album?: string;
  favoriteTracks?: string[];
}

export interface TravelInterest extends Interest {
  period?: string;
}

export interface InterestIndex {
  byID: Record<string, number>;
  byType: Record<string, number[]>;
}

export interface InterestRepo {
  data: Interest[];
  index: InterestIndex;
}
