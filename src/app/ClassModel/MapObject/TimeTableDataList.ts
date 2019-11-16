export class TimeTableDataList{
    constructor(
    public day:string,
    public timeSlotData:String[],
    public packageData:String[][],
    public instructorData:String[][],
    public pathData:String[][],
    public numStuData:Number[][],
    public idData:Number[][]
  ){}
  }