export const ios_app_version = '16';
export const android_app_version = '23';

// Set active environment: 'PRODUCTION' | 'STAGING' | 'LOCAL'
// For production store release, use 'PRODUCTION'.
export const CURRENT_ENV = 'PRODUCTION';

const ENDPOINTS = {
  PRODUCTION: {
    Url: 'https://portal.kvimis.co.in/Mobile_app',
    image_Url: 'https://portal.kvimis.co.in/',
  },
  STAGING: {
    Url: 'https://spkvimis.enovasolutions.com/index.php/Mobile_app',
    image_Url: 'https://portal.kvimis.co.in/',
  },
  LOCAL: {
    Url: 'http://172.30.34.188/portal.kvimis.co.in/index.php/Mobile_app',
    image_Url: 'http://172.30.34.188/portal.kvimis.co.in/',
  },
};

export const Url = ENDPOINTS[CURRENT_ENV].Url;
export const image_Url = ENDPOINTS[CURRENT_ENV].image_Url;
