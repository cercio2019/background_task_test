
import Queue from 'bull';


import {config} from './config/index.js';

import { background_one } from './workers/background_one.js';

const redis = config.redis;

const back_one = new Queue('back_one', { redis });

back_one.process((job, done) => background_one(job, done));

export default back_one;







