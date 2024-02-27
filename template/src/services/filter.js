// outsource dependencies
import _ from 'lodash';

// local dependencies
import { CURRENCY, DIR, urlRegExp } from '../constants';

export const validUrlRegExp = new RegExp(
  '^'
  // protocol identifier
  + '(?:(?:https?|ftp)://)'
  // user:pass authentication
  + '(?:\\S+(?::\\S*)?@)?'
  + '(?:'
  // IP address exclusion
  // private & local networks
  + '(?!(?:10|127)(?:\\.\\d{1,3}){3})'
  + '(?!(?:169\\.254|192\\.168)(?:\\.\\d{1,3}){2})'
  + '(?!172\\.(?:1[6-9]|2\\d|3[0-1])(?:\\.\\d{1,3}){2})'
  // IP address dotted notation octets
  // excludes loopback network 0.0.0.0
  // excludes reserved space >= 224.0.0.0
  // excludes network & broadcast addresses
  // (first & last IP address of each class)
  + '(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])'
  + '(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}'
  + '(?:\\.(?:[1-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))'
  + '|'
  // host name
  + '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)'
  // domain name
  + '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*'
  // TLD identifier
  + '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))'
  // TLD may end with dot
  + '\\.?'
  + ')'
  // port number
  + '(?::\\d{2,5})?'
  // resource path
  + '(?:[/?#]\\S*)?'
  + '$',
  'i'
);


/**
 *
 * @param {String} string
 * @returns {String}
 */
export const humanize = string => !string ? '' : String(string)
  // from camel case
  .replace(/([A-Z])([A-Z])([a-z])|([a-z])([A-Z])/g, '$1$4 $2$3$5')
  // spec
  .replace(/[_-]+/g, ' ')
  // normalize
  .replace(/\s+/g, ' ')
  // trim
  .replace(/^\s*|\s*$/g, '')
  // capitalize
  .toLowerCase()
  .replace(/^.{1,1}/, sib => sib.toUpperCase());

/**
 * formatting:cut string by options
 *
 * @param {String} string
 * @param {Object} [options] - truncate.defaultOptions
 * @returns {String}
 */
export const truncate = (string = '', options) => {
  const { length, end, breakOnWord } = Object.assign({}, truncate.defaultOptions, options);
  // NOTE skip cases
  if (isNaN(length) || length <= 0) { return ''; }
  if (typeof string !== 'string') { return ''; }
  // NOTE short enough
  if (string.length <= length) { return string; }
  // NOTE cut source
  string = string.substring(0, length);
  // NOTE cut more to the spice symbol
  if (!breakOnWord) {
    const lastSpace = string.lastIndexOf(' ');
    // NOTE get last space
    if (lastSpace !== -1) {
      string = string.substr(0, lastSpace);
    }
  }
  return string.trim() + end;
};
/********************************
 *  default configuration
 ********************************/
truncate.defaultOptions = {
  breakOnWord: false,
  length: 12,
  end: '...'
};

/**
 * handle string and make enum from it
 *
 * @param {String} string
 * @returns {String}
 */
export const toEnum = (string = '') => String(string)
  .replace(/[^\w\d\s]/gi, '')
  .replace(/[\s]+/g, '_')
  .replace(/^_+|_+$/g, '')
  .toUpperCase();

/**
 * formatting html to plain text
 *
 * @param {String} html
 * @returns {String}
 */
export const escapeHtml = (html = '') => String(html).replace(/<[^>]*>?/gm, '');

/**
 * trim text input
 * @param {String} value
 * @return {string}
 */
export const trim = value => String(value).trim();

/**
 * formatting number to duration string
 *
 * @param {Number} number
 * @param {Object} [options]
 * @returns {String}
 */
export const duration = (number = 0, options) => {
  let { format, regDay, regHour, regMin, regSec } = Object.assign({}, duration.defaultOptions, options);
  number = typeof number === 'number' ? Math.abs(number) : 0;
  format = typeof format === 'string' ? format : `${regDay}d ${regHour}h ${regMin}m ${regSec}s`;
  let days = 0,
    hours = 0,
    minutes = 0;

  if (new RegExp(regDay).test(format) && number >= duration.equal.days) {
    days = Math.floor(number / duration.equal.days);
    number -= (days * duration.equal.days);
  }

  if (new RegExp(regHour).test(format) && number >= duration.equal.hours) {
    hours = Math.floor(number / duration.equal.hours);
    number -= (hours * duration.equal.hours);
  }

  if (new RegExp(regMin).test(format) && number >= duration.equal.minutes) {
    minutes = Math.floor(number / duration.equal.minutes);
    number -= (minutes * duration.equal.minutes);
  }
  return format
    .replace(regDay, days)
    .replace(regHour, hours)
    .replace(regMin, minutes)
    .replace(regSec, number);
};
/********************************
 *  default configuration
 ********************************/
duration.defaultOptions = {
  // output format
  format: '[D]d [H]h [M]m [S]s',
  // regular expression to parse day
  regDay: '[D]',
  // regular expression to parse hour
  regHour: '[H]',
  // regular expression to parse minute
  regMin: '[M]',
  // regular expression to parse second
  regSec: '[S]',
};
duration.equal = {
  // day 24*60*60=86400
  days: 86400,
  // hour 60*60=3600
  hours: 3600,
  // minute 60
  minutes: 60,
  // second 1
  seconds: 1,
};


/**
 * checks - is this string can be url
 *
 * @param {String} string
 * @returns {Boolean}
 */
export const isUrl = (string = '') => urlRegExp.test(string);

/**
 * has definitions of BE s3 path and doesn't have the protocol
 * probably we should check exact s3 host, but i do not think so
 * @param url
 * @return {boolean|boolean}
 */
export const isS3RelativePath = url => {
  const s3RBEPathReg = new RegExp(`/public/(${Object.values(DIR).join('|')})/`);
  return s3RBEPathReg.test(url) && !/^http(s?):\/\//.test(url);
};

/**
 * @typedef {'short' | 'long'} NumberShortenerFormatDisplay
 */
/**
 * number shortener
 * @param {number} val number
 * @param {NumberShortenerFormatDisplay=} compactDisplay (short | long)
 * @returns {String}
 */
export const numberShortener = (val, compactDisplay= 'short') => Intl.NumberFormat('en-US', {
  notation: 'compact',
  maximumFractionDigits: 1,
  compactDisplay: compactDisplay
}).format(val);

/**
 * parses the text, extracts the first link it finds
 * @param text
 * @return {string|undefined}
 */
export const getLinkFromText = text => {
  if (!text || !_.isString(text)) { return; }
  return text.replace(/\n/g, ' ').split(' ').find(token => validUrlRegExp.test(token));
};

/**
 * prepare text price depend on currency
 * @param {Number|String} price amount of money
 * @param {String} currency currency enum
 * @param {Number} minimumFractionDigits min fraction digits
 * @returns {String}
 */
export const formatPrice = (price = 1, currency = CURRENCY.USD, minimumFractionDigits = 2) => `${new Intl.NumberFormat('en-US', { style: 'currency', currency, minimumFractionDigits }).format(price) }`;

/**
 * helper to format String|Number to number
 * @param value
 * @return {number}
 */
export const stringToNumber = value => Number(String(value).replace(/\D/g, '').substring(0, 15)) || 0;
