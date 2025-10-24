import mongoose, { Document, Schema } from 'mongoose';

export interface INote {
  by: mongoose.Types.ObjectId;
  text: string;
  at: Date;
}

export interface IRequest extends Document {
  userId: mongoose.Types.ObjectId;
  platform: 'facebook' | 'instagram' | 'gmail' | 'tiktok' | 'youtube' | 'twitter' | 'whatsapp' | 'other';
  description: string;
  hasEmailAccess: boolean | null;
  status: 'new' | 'in_progress' | 'resolved' | 'failed';
  tx_ref: string;
  paymentStatus: 'pending' | 'paid' | 'failed';
  notes: INote[];
  createdAt: Date;
  updatedAt: Date;
}

const RequestSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  platform: {
    type: String,
    required: [true, 'Platform is required'],
    enum: {
      values: ['facebook', 'instagram', 'gmail', 'tiktok', 'youtube', 'twitter', 'whatsapp', 'other'],
      message: '{VALUE} is not a supported platform'
    }
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  hasEmailAccess: {
    type: Boolean,
    default: null
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'resolved', 'failed'],
    default: 'new',
    index: true
  },
  tx_ref: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
    index: true
  },
  notes: [{
    by: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    at: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Compound indexes for common queries
RequestSchema.index({ userId: 1, createdAt: -1 });
RequestSchema.index({ paymentStatus: 1, status: 1 });
RequestSchema.index({ platform: 1, createdAt: -1 });

export default mongoose.model<IRequest>('Request', RequestSchema);
