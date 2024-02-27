// outsource dependencies
import _ from 'lodash';


export const noop = () => void (0);
export const stopEvent = event => {
  event.nativeEvent.stopImmediatePropagation();
  event.stopPropagation();
  event.preventDefault();
};

export const getCurrentPosition = () => new Promise((resolve, reject) => navigator.geolocation
  .getCurrentPosition(resolve, reject, { timeout: 6e3, maximumAge: Infinity, enableHighAccuracy: false }))
  // NOTE map to regular object ¯\_(ツ)_/¯
  .then(location => ({
    location,
    lat: _.get(location, 'coords.latitude', 0),
    lng: _.get(location, 'coords.longitude', 0)
  })).catch(() => ({}));

export const NEW_ID = 'new';

export const CURRENCY = {
  USD: 'USD',               // US Dollar
  EUR: 'EUR',               // Euro
};

export const DIR = {
  EMPTY: '',
  POST: 'POST',             // post pics
  USER: 'USER',             // user pics
};

export const ASPECT = { // NOTE common rules for pics aspect ratio
  POST_IMAGE: 2 / 1.6,
  USER_COVER: 4 / 1,
  USER_PROFILE: 1,
};

export const ACCEPTED_FILE_TYPES = {
  IMAGES: ['image/jpe', 'image/jpg', 'image/jpeg', 'image/gif', 'image/png'],
  VIDEOS: ['video/*']
};

export const GENDER = {
  MALE: 'MALE',
  OTHER: 'OTHER',
  FEMALE: 'FEMALE',
  UNKNOWN: 'UNKNOWN',
  NON_BINARY: 'NON_BINARY',
  TRANSGENDER: 'TRANSGENDER',
  I_PREFER_NOT_TO_SAY: 'I_PREFER_NOT_TO_SAY',
};

export const USER_ROLE = {
  USER: 'USER',
  MANAGER: 'MANAGER'
};
export const USER_STATE = {
  INACTIVE: 'INACTIVE',     // user was deleted from the system
  CREATED: 'CREATED',       // user created but does not finish sign up wizard
  PENDING: 'PENDING',       // user was created pass sign up but does not confirm email
  ACTIVE: 'ACTIVE',         // user was created pass sign up and confirm email
};

export const TEST_PAGE_TABS = {
  LIVE: 'LIVE',
  RECENT: 'RECENT',
  UPCOMING: 'UPCOMING',
  FAVORITE: 'FAVORITE',
  PURCHASED: 'PURCHASED',
};
