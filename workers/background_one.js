
import { clamscanClient } from '../src/utils/clamscanClient.js';

export const  background_one  =  async (job, done) => {
    try {
      job.progress(100);
      const { filePath } = job.data;
      let data =  await clamscanClient.isInfected(filePath);
      
      done(null, data);

    } catch (error) {
      done(error);
    }
  };