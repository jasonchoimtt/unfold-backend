/**
 * Entry point for the scraper.
 * Do NOT import this file if you don't want to start the workers!
 */
if (process.env.NODE_ENV !== 'production')
    require('source-map-support/register');

import './scrap-link';
