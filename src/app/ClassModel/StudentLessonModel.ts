import { StudentModel } from './StudentModel';
import { LessonModel } from './LessonModel';

export class StudentLessonModel{
    constructor(
        public studentLessonId,
        public date:Date,
        public complete:Number,
        public studentId:StudentModel,
        public lessonId:LessonModel
    ){}
}