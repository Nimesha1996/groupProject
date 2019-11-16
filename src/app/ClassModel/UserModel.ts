export class UserModel{
    constructor(
      public userId:Number,
      public email:String,
      public password:String,
      public regDate:Date,
      public status:Number,
      public role:Number
    ){}
}