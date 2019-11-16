import { StudentModel } from './StudentModel';
import { PackageModel } from './PackageModel';

export class StudentPackageModel{
    constructor(
        public studentPackageId:Number,
        public joinDate:Date,
        public transmission:Number,
        public studentId:StudentModel,
        public packageId:PackageModel
    ){}
}