import { Dispatcher } from './base';
import { dispatcher as facebook } from './facebook';


export const dispatcher = new Dispatcher();

dispatcher.use(facebook);
