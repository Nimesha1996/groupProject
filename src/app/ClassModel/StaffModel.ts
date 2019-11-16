import { UserModel } from './UserModel';

export class StaffModel{
    constructor(
    public staffId:Number,
    public name:String,
    public nic:String,
    public tel:String,
    public address:string,
    public userId:UserModel
  ){}
  }