import type { Match } from './match.types';

export interface Swipe {
    target_user_id: string;
    type: 'LIKE' | 'DISLIKE';
  }
  
export interface SwipeResponse {
    match?: Match;
    message: string;
  }