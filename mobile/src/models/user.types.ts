export interface User {
    id: string;
    firstName: string;
    lastName: string;
    age: number;
    avatar: string;
    photos: Photo[];
    bio: string;
    location: string;
    languages: string[];
    dateOfBirth: Date;
    education: string;
    height: string;
    zodiacSign: string;
    pets?: string;
    alcohol?: string;
    smoking?: string;
  }
  
export interface Photo {
    photoUrl: string;
    id: string;
  }
  
export interface UserPreferences {
    gender: string;
    ageRange: { min: number; max: number };
    distance: number;
  }