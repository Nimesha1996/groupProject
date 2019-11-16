export class CourseFee{
    constructor(
    public courseFeeId:number,
    public amount:number,
    public date:Date,
    public method:Number,
    public studentPackageId:any
  ){}
  }