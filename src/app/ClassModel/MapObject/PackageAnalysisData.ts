import { TimeSlotModel } from '../TimeSlotModel';

export class PackageAnalysisData{
    constructor(
        public lessonId:Number[],
        public day:String,
        public timeSlot:TimeSlotModel[],
        public student:Number[],
        public stuPercentage:Number[]
    ){}
}