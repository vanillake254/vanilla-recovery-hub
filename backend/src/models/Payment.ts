import mongoose, { Document, Schema } from 'mongoose';

export interface IPayment extends Document {
  requestId: mongoose.Types.ObjectId;
  tx_ref: string;
  amount: number;
  currency: string;
  status: 'pending' | 'successful' | 'failed';
  gateway_response?: Record<string, any>;
  flw_ref?: string;
  transaction_id?: string;
  createdAt: Date;
  updatedAt: Date;
}

const PaymentSchema: Schema = new Schema({
  requestId: {
    type: Schema.Types.ObjectId,
    ref: 'Request',
    required: true,
    index: true
  },
  tx_ref: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive']
  },
  currency: {
    type: String,
    required: true,
    default: 'KES',
    uppercase: true
  },
  status: {
    type: String,
    enum: ['pending', 'successful', 'failed'],
    default: 'pending',
    index: true
  },
  gateway_response: {
    type: Schema.Types.Mixed,
    default: {}
  },
  flw_ref: {
    type: String,
    index: true
  },
  transaction_id: {
    type: String,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for common queries
PaymentSchema.index({ requestId: 1, status: 1 });
PaymentSchema.index({ createdAt: -1 });

export default mongoose.model<IPayment>('Payment', PaymentSchema);
