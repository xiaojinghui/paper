import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion extends Document {
  metadata: {
    title: string;
    grade: string;
    difficulty: string;
    total_questions: number;
  };
  type: 'choice' | 'blank';
  category: string;
  stem: string;
  options: string[] | null;
  answer: string;
  explanation: string;
  createdAt: Date;
}

const QuestionSchema = new Schema({
  metadata: {
    title: String,
    grade: String,
    difficulty: String,
    total_questions: Number,
  },
  type: { type: String, enum: ['choice', 'blank'], required: true },
  category: { type: String, required: true },
  stem: { type: String, required: true },
  options: [String],
  answer: { type: String, required: true },
  explanation: String,
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Question || mongoose.model<IQuestion>('Question', QuestionSchema);
