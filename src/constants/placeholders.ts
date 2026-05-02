/**
 * High-quality placeholder images from Unsplash for music and video streaming theme.
 */

const buildUrl = (id: string, width = 800, height = 800) => 
  `https://images.unsplash.com/photo-${id}?w=${width}&h=${height}&fit=crop&q=80`;

export const PLACEHOLDERS = {
  MUSIC: {
    VINYL: buildUrl('1470225620780-dba8ba36b745'),
    HEADPHONES: buildUrl('1511671782779-c97d3d27a1d4'),
    GUITAR: buildUrl('1514525253361-b83f85f5e43a'),
    STAGE: buildUrl('1493225255756-d9584f8606e9'),
    INSTRUMENTS: buildUrl('1459749411177-042180ce5a39'),
    MICROPHONE: buildUrl('1510915228340-29c8d249f3e'),
    STUDIO: buildUrl('1598488035139-bdbb2231ce04'),
    CONCERT: buildUrl('1459749411177-042180ce5a39'),
  },
  VIDEO: {
    CINEMA: buildUrl('1536440136628-849c177e76a1'),
    CLAPPERBOARD: buildUrl('1485846234645-a62644f84728'),
    RETRO: buildUrl('1478720568477-152d9b164e26'),
    STREAMING: buildUrl('1594908900066-3f47337549d8'),
    POPCORN: buildUrl('1517604931442-7e0c8ed2963c'),
    RECORDING: buildUrl('1492691527719-9d1e07e534b4'),
  },
  AVATARS: {
    MAN: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    WOMAN: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
  }
};

export const getRandomMusic = () => {
  const keys = Object.keys(PLACEHOLDERS.MUSIC) as (keyof typeof PLACEHOLDERS.MUSIC)[];
  return PLACEHOLDERS.MUSIC[keys[Math.floor(Math.random() * keys.length)]];
};

export const getRandomVideo = () => {
  const keys = Object.keys(PLACEHOLDERS.VIDEO) as (keyof typeof PLACEHOLDERS.VIDEO)[];
  return PLACEHOLDERS.VIDEO[keys[Math.floor(Math.random() * keys.length)]];
};
