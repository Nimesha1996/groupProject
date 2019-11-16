export class StudentPractricalChartDataMap{
    constructor(
        public packageName:String,
        public completeLesson:Number,
        public notCompleteLesson:Number,
        public bookLesson:Number,
        public remainLesson:Number,
        public trialExamDate:Date,
        public remainDays:Number
    ){}
}