/**
 * Entry point for the scraper.
 * Do NOT import this file if you don't want to start the workers!
 */
import { kue, queue } from './queue';

import './scrap-link';


export { kue, queue };
