import { VehicleCategoryModel } from './MapObject/VehicleCategory';

export class PackageModel{
    constructor(
    public packageId:Number,
    public title:String,
    public description:String,
    public url:String,
    public price:number,
    public status:Number,
    public manualLes:Number,
    public autoLes:Number,
    public vehicleCategoryId:VehicleCategoryModel
  ){}
  }