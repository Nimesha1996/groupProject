import { Time } from '@angular/common';

export class TimeSlotModel{
    constructor(
      public timeSlotId:Number,
      public startTime:Date,
      public finishTime:Date
    ){}

}