import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  user_id: string;
  conversations: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    user_id: { type: String, required: true, unique: true },
    conversations: { type: [String], required: true },
  },
  { timestamps: true }
);

export default mongoose?.models?.User || mongoose.model<IUser>('User', UserSchema);
