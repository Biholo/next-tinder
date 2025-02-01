export const images = {
  logo: require('../assets/images/tinder-logo.png'),
} as const;

export type ImageType = keyof typeof images;

export default images;
