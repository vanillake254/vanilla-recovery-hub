import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  from: 'user' | 'bot' | 'admin';
  text: string;
  ts: Date;
  intent?: string;
  confidence?: number;
}

export interface IChatLog extends Document {
  sessionId: string;
  requestId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  messages: IMessage[];
  status: 'active' | 'escalated' | 'resolved' | 'abandoned';
  context?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const ChatLogSchema: Schema = new Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  requestId: {
    type: Schema.Types.ObjectId,
    ref: 'Request',
    default: null,
    index: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  messages: [{
    from: {
      type: String,
      enum: ['user', 'bot', 'admin'],
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    ts: {
      type: Date,
      default: Date.now
    },
    intent: {
      type: String
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1
    }
  }],
  status: {
    type: String,
    enum: ['active', 'escalated', 'resolved', 'abandoned'],
    default: 'active',
    index: true
  },
  context: {
    type: Schema.Types.Mixed,
    default: {}
  }
}, {
  timestamps: true
});

// Indexes for common queries
ChatLogSchema.index({ sessionId: 1, createdAt: -1 });
ChatLogSchema.index({ status: 1, updatedAt: -1 });
ChatLogSchema.index({ requestId: 1 });

export default mongoose.model<IChatLog>('ChatLog', ChatLogSchema);
