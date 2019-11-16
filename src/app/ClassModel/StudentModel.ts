import { UserModel } from './UserModel';

export class StudentModel{
    constructor(
    public studentId:Number,
    public name:String,
    public tel:String,
    public nic:String,
    public examDate:Date,
    public trialDate:Date,
    public address:String,
    public userId:UserModel
  ){}
  }