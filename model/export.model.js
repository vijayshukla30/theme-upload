import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
const { Schema } = mongoose;

const exportSchema = new Schema(
  {
    projectId: {
      type: String,
      required: true,
    },
    s3path: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
      default: () => {
        return uuidv4()
      }
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('theme', exportSchema);
