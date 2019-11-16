import { PackageModel } from './PackageModel';
import { TimeSlotModel } from './TimeSlotModel';
import { Path } from './PathModel';
import { InstructorModel } from './InstructorModel';

export class LessonModel{
    constructor(
    public lessonId:Number,
    public day:Number,
    public transmission:Number,
    public numStu:Number,
    public status:Number,
    public instructorId:InstructorModel,
    public packageId:PackageModel,
    public timeSlotId:TimeSlotModel,
    public pathId:Path
  ){}
  }