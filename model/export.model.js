import mongoose from 'mongoose';
const { Schema } = mongoose;

const exportSchema = new Schema(
  {
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    projectId: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    key: {
      type: String,
      required: true,
    },
    bucket: {
      type: String,
      required: true,
    },
    uuid: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('theme', exportSchema);
