import { StaffModel } from './StaffModel';

export class InstructorModel{
    constructor(
    public instructorId:Number,
    public licence:String,
    public staffId:StaffModel
  ){}
  }