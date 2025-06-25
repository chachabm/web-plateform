import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Lesson title is required'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: [true, 'Course is required']
  },
  section: {
    type: String,
    required: [true, 'Section is required']
  },
  videoUrl: {
    type: String,
    required: [true, 'Video URL is required']
  },
  duration: {
    type: String,
    required: [true, 'Duration is required'],
    match: [/^\d+:\d{2}$/, 'Duration must be in format MM:SS or HH:MM']
  },
  order: {
    type: Number,
    required: [true, 'Lesson order is required'],
    min: [1, 'Order must be at least 1']
  },
  resources: [{
    name: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['pdf', 'doc', 'video', 'audio', 'other'],
      required: true 
    },
    url: { type: String, required: true },
    size: { type: String }
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  isPreview: {
    type: Boolean,
    default: false
  },
  transcript: {
    type: String
  },
  notes: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes
lessonSchema.index({ course: 1, order: 1 });
lessonSchema.index({ course: 1, section: 1 });
lessonSchema.index({ isPublished: 1 });

export default mongoose.model('Lesson', lessonSchema);