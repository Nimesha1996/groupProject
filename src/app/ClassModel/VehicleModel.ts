import {  VehicleCategoryModel } from './VehicleCategoryModel';
import { InstructorModel } from './InstructorModel';


export class VehicleModel{
    constructor(
    public vehicleId:Number,
    public brand:String,
    public number:String,
    public model:String,
    public transmission:Number,
    public fuel_type:Number,
    public document_lic:String,
    public instructor_id:InstructorModel,
    public vehicle_category_id: VehicleCategoryModel
  ){}
  }