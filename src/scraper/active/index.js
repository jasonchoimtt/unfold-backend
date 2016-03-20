import { Dispatcher } from './base';
import { dispatcher as facebook } from './facebook';
import { dispatcher as iframely } from './iframely';


export const dispatcher = new Dispatcher();

dispatcher.use(facebook);
dispatcher.use(iframely);
