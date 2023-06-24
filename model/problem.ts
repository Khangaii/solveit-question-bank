import { Schema, model } from 'mongoose';

// create interface
interface IProblem {
  title: string;
  description: string;
  subject: string;
  tag: string;
  answer: string;
  solution: string;
  fileName: string;
  fileExtension: string;
  filePath: string;
  createdBy: string;
  createdAt: Date;
}

// create schema
const ProblemSchema = new Schema<IProblem>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  subject: {
    type: String,
    required: true
  },
  tag: {
    type: String
  },
  answer: {
    type: String,
    default: '해설 참고'
  },
  solution: {
    type: String,
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  fileExtension: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    default: ''
  },
  createdBy: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})

ProblemSchema.pre('save', function (next) {
  if(!this.filePath) {
    this.filePath = `/assets/img/problems/problem-${this.id}.${this.fileExtension}`;
  }
  next();
});

// create model
const Problem = model('problem', ProblemSchema);

export default Problem;
