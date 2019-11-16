// import { VehicleCategoryModel } from './InstructorModel'     ----no foreign keys. so no need to import;

export class  VehicleCategoryModel{
    constructor(
    public vehicle_category_Id:Number,
    public category:String,
   
    public num_student:Number

  ){}
  }