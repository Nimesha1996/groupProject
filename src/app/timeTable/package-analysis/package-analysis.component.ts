import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { PackageServiceService } from '../../service/package/package-service.service';
import { PackageModel } from '../../ClassModel/PackageModel';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpError } from '../../Shared/httpError/HttpError';
import { TimeTableServiceService } from '../../service/TimeTable/time-table-service.service';
import { LessonDistributionMap } from '../../ClassModel/MapObject/LessonDistributionMap';
import { hasClassName } from '@ng-bootstrap/ng-bootstrap/util/util';
import { LessonModel } from '../../ClassModel/LessonModel';
import { TimeTableDataList } from '../../ClassModel/MapObject/TimeTableDataList';
import { PackageAnalysisData } from '../../ClassModel/MapObject/PackageAnalysisData';
import { TimeSlotModel } from '../../ClassModel/TimeSlotModel';
import { StudentAttendanceWeeksMap } from '../../ClassModel/MapObject/StudentAttendanceWeeksMap';
import Swal from 'sweetalert2';
import { NotificationServisceService } from '../../service/notification/notification-service.service';
import { WebSocketCommunicationDataMap } from '../../ClassModel/MapObject/WebSocketCommunicationDataMap';
import { TimeTableValidation } from '../../Shared/validation/timetable-validation/time-table-validation';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TrialLessonDayFeedbackChartComponent } from '../../LessonBooking/trial-lesson-day-feedback-chart/trial-lesson-day-feedback-chart.component';

@Component({
  selector: 'app-package-analysis',
  templateUrl: './package-analysis.component.html',
  styleUrls: ['./package-analysis.component.scss']
})
export class PackageAnalysisComponent implements OnInit {

  packageList:PackageModel[]=[];
  selectPackage:PackageModel;

  isManual;
  manualTotalStudent;
  manualTotalLesson:number=0;
  isManualLessonMore;

  isAuto;
  autoTotalStudent;
  autoTotalLesson:number=0;

  isManualLesson=false;
  manualLessonDay;
  manualLessonTimeSlot;

  isAutoLesson=false;
  autoLessonDay;
  autoLessonTimeSlot;

  isManualLessonAnalysisActive=false;
  isManualTableActive=false;
  isManualGraphActive=false;
  lessonTimePeriodManual;
  studentTimePeriodManual;
  vehicleCategoryManual;
  numStudentForOneVehicleManual;
  manualTotalLessonRecommend;
  manualLessonTimeTable:PackageAnalysisData[]=[];
  timeSlotIdManual:TimeSlotModel[]=[];
  errorMsgStudentTimePeriodManual;
  errorMsgLessonTimePeriodManual;
  errorMsgManual;

  isAutoLessonAnalysisActive=false;
  isAutoGraphActive=false;
  isAutoTableActive=false;
  lessonTimePeriodAuto;
  studentTimePeriodAuto;
  vehicleCategoryAuto;
  numStudentForOneVehicleAuto;
  autoTotalLessonRecommend;
  autoLessonTimeTable:PackageAnalysisData[]=[];
  timeSlotIdAuto:TimeSlotModel[]=[];
  errorMsgStudentTimePeriodAuto;
  errorMsgLessonTimePeriodAuto;
  errorMsgAuto;

  vehicleCategory;
  errorMessage;

  isFutureStudentAttendanceManual;
  isPastStudentAttendanceManual;
  isFutureStudentAttendanceAuto;
  isPastStudentAttendanceAuto;
  studentAttendanceLessonIdManual;
  studentAttendanceLessonIdAuto;
  lessonPublishDateManual;
  lessonPublishDateAuto;
 
  deactivateLesson:LessonModel;
  updateLesson:LessonModel;
  timeValidation;

  isSelectPackage=false;

  public canvas : any;
  public ctx;
  public gradientFill;
  public gradientStroke;
  public chartColor;

  public lessonChartOptionConfiguration;
  public lessonStudentAttendanceChartOptionConfiguration;

  public lineChartGradientsNumbersType;
  public lineChartGradientsNumbersOptions:any;
  public lineChartGradientsNumbersLabels:Array<any>;
  public lineChartGradientsNumbersColors:Array<any>;

  public lineChartWithNumbersAndGridType;
  public lineChartWithNumbersAndGridOptions:any;
  public lineChartWithNumbersAndGridLabelsManual:Array<any>;
  public lineChartWithNumbersAndGridLabelsAuto:Array<any>;
  public lineChartWithNumbersAndGridColors:Array<any>;

  public lineChartManualData:Array<any>;
  public lineChartAutoData:Array<any>;
  public lineChartStudentAttendanceDataManual:Array<any>;
  public lineChartStudentAttendanceDataAuto:Array<any>;

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }
  public ManualLessonChartClicked(e:any){
    this.isManualLessonMore=false;
    if(e['active'].length > 0){
      //console.log(e['active'][0]['_index']);
      let index=e['active'][0]['_index'];
      this.ManualLessonMoreGraph();
    }
  }

  public chartHovered(e:any):void {
    console.log(e);
  }
  public hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);

    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }

  constructor(
    private packageService:PackageServiceService,
    private timeTableService:TimeTableServiceService,
    private notificationService:NotificationServisceService,
    private router:Router,
    private modalService: NgbModal
  ) { }

  ngOnInit() {

    this.timeValidation = new TimeTableValidation();

    this.getpackageList();
    this.chartColor = "#FFFFFF";
    //options

    //start lessonChart Option 
    this.lessonChartOptionConfiguration = {
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
      },
      responsive: 1,
      scales: {
        yAxes: [{
          gridLines: {
            zeroLineColor: "transparent",
            drawBorder: false
          }
        }],
        xAxes: [{
          display: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 15,
          bottom: 15
        }
      }
    }
    //finish lessonChart Option Finish
//---------------------------------------------------------------------------------------------------------------------
    //lessonStudentAttendanceChartConfiguration Option Start
    this.lessonStudentAttendanceChartOptionConfiguration={
    
      maintainAspectRatio: false,
      legend: {
        display: false
      },
      tooltips: {
        bodySpacing: 4,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
        xPadding: 10,
        yPadding: 10,
        caretPadding: 10
      },
      responsive: true,
      scales: {
        yAxes: [{
          gridLines: {
            zeroLineColor: "transparent",
            drawBorder: false
          }
        }],
        xAxes: [{
          display: 0,
          ticks: {
            display: false
          },
          gridLines: {
            zeroLineColor: "transparent",
            drawTicks: false,
            display: false,
            drawBorder: false
          }
        }]
      },
      layout: {
        padding: {
          left: 0,
          right: 0,
          top: 15,
          bottom: 15
        }
      },
      elements: {
        line: {
            tension: 0
        }
      }
    };
    //lessonStudentAttendanceChartConfiguration Option Finish
    //------------------------------------------------------------------------------------------------------------------------

    // Manual Lesson Graph Initialize
    this.canvas = document.getElementById("manualLessonChart");
    this.ctx = this.canvas.getContext("2d");

    this.gradientFill = this.ctx.createLinearGradient(0, 170, 0, 50);
    this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradientFill.addColorStop(1, this.hexToRGB('#2CA8FF', 0.6));


    this.lineChartManualData = [
        {
          label: "Lessons",
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 1,
          pointRadius: 4,
          fill: true,
          borderWidth: 1,
          data: [0, 0, 0, 0, 0, 0, 0]
        }
      ];
    this.lineChartGradientsNumbersColors = [
     {
       backgroundColor: this.gradientFill,
       borderColor: "#2CA8FF",
       pointBorderColor: "#FFF",
       pointBackgroundColor: "#2CA8FF",
     }
   ];
    this.lineChartGradientsNumbersLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    this.lineChartGradientsNumbersOptions = this.lessonChartOptionConfiguration;

    this.lineChartGradientsNumbersType = 'bar';
    // Finish Manual Lesson Graph Initialization
    
//--------------------------------------------------------------------------------------------------
    
    // Auto Lesson  Graph Initialize
    this.canvas = document.getElementById("autoLessonChart");
    this.ctx = this.canvas.getContext("2d");

    this.gradientFill = this.ctx.createLinearGradient(0, 170, 0, 50);
    this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradientFill.addColorStop(1, this.hexToRGB('#2CA8FF', 0.6));


    this.lineChartAutoData = [
        {
          label: "Students",
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 1,
          pointRadius: 4,
          fill: true,
          borderWidth: 1,
          data: [2, 0, 3, 0, 1, 0, 2]
        }
      ];
    this.lineChartGradientsNumbersColors = [
     {
       backgroundColor: this.gradientFill,
       borderColor: "#2CA8FF",
       pointBorderColor: "#FFF",
       pointBackgroundColor: "#2CA8FF",
     }
   ];
    this.lineChartGradientsNumbersLabels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    this.lineChartGradientsNumbersOptions = this.lessonChartOptionConfiguration;

    this.lineChartGradientsNumbersType = 'bar';
    // Finish Manual Lesson More Details Graph Initialization


    //------------------------------------------------------------------------------------------
    //manualLessonStudentAttendance Graph(Manual) Initialize
    this.canvas = document.getElementById("manualLessonStudentAttendanceChart");
    this.ctx = this.canvas.getContext("2d");

    this.gradientStroke = this.ctx.createLinearGradient(500, 0, 100, 0);
    this.gradientStroke.addColorStop(0, '#18ce0f');
    this.gradientStroke.addColorStop(1, this.chartColor);

    this.gradientFill = this.ctx.createLinearGradient(0, 170, 0, 50);
    this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradientFill.addColorStop(1, this.hexToRGB('#18ce0f', 0.4));

    this.lineChartStudentAttendanceDataManual = [
        {
           label: "Student Attendance",
           pointBorderWidth: 2,
           pointHoverRadius: 4,
           pointHoverBorderWidth: 1,
           pointRadius: 4,
           fill: true,
           borderWidth: 2,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      ];
      this.lineChartWithNumbersAndGridColors = [
       {
         borderColor: "#18ce0f",
         pointBorderColor: "#FFF",
         pointBackgroundColor: "#18ce0f",
         backgroundColor: this.gradientFill
       }
     ];
    this.lineChartWithNumbersAndGridLabelsManual = ['','','','','','','','','','','',''];
    this.lineChartWithNumbersAndGridOptions = this.lessonStudentAttendanceChartOptionConfiguration;

    this.lineChartWithNumbersAndGridType = 'line';
    //Finish manualLessonStudentAttendance Graph(Manual) Initialize


     //------------------------------------------------------------------------------------------
    //autoLessonStudentAttendance Graph(Manual) Initialize
    this.canvas = document.getElementById("autoLessonStudentAttendanceChart");
    this.ctx = this.canvas.getContext("2d");

    this.gradientStroke = this.ctx.createLinearGradient(500, 0, 100, 0);
    this.gradientStroke.addColorStop(0, '#18ce0f');
    this.gradientStroke.addColorStop(1, this.chartColor);

    this.gradientFill = this.ctx.createLinearGradient(0, 170, 0, 50);
    this.gradientFill.addColorStop(0, "rgba(128, 182, 244, 0)");
    this.gradientFill.addColorStop(1, this.hexToRGB('#18ce0f', 0.4));

    this.lineChartStudentAttendanceDataAuto = [
        {
           label: "Student Attendance",
           pointBorderWidth: 2,
           pointHoverRadius: 4,
           pointHoverBorderWidth: 1,
           pointRadius: 4,
           fill: true,
           borderWidth: 2,
          data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
      ];
      this.lineChartWithNumbersAndGridColors = [
       {
         borderColor: "#18ce0f",
         pointBorderColor: "#FFF",
         pointBackgroundColor: "#18ce0f",
         backgroundColor: this.gradientFill
       }
     ];
    this.lineChartWithNumbersAndGridLabelsAuto = ['','','','','','','','','','','',''];
    this.lineChartWithNumbersAndGridOptions = this.lessonStudentAttendanceChartOptionConfiguration;

    this.lineChartWithNumbersAndGridType = 'line';
    //Finish manualLessonStudentAttendance Graph(Auto) Initialize

  }



  //get package details
  getpackageList(){
    this.packageService.packageList().subscribe(
      response => {
        this.packageList=response;
        },
      error => {
        console.log(error);
        this.handleErrorResponse(error);
      }
    );
  }



    //when user select package this function will be fired
    selectPackageDetails(selectpackage:PackageModel){
    
      this.isAuto=false;
      this.isManual=false;
      this.isAutoLesson=false;
      this.isManualLesson=false;
      this.errorMsgLessonTimePeriodManual=false;
      this.errorMsgStudentTimePeriodManual=false;
      this.errorMsgLessonTimePeriodAuto=false;
      this.errorMsgStudentTimePeriodAuto=false;
      this.isManualGraphActive=false;
      this.isAutoGraphActive=false;
      this.isManualTableActive=false;
      this.isAutoTableActive=false;
      this.errorMsgAuto="";
      this.errorMsgManual="";
  
      this.selectPackage=selectpackage;
      this.isSelectPackage=true;
  
      if(selectpackage.manualLes>0){
        this.getTotalStudentOfPackage(1);
        this.timeTableService.isAnyLesson(selectpackage.packageId,1).subscribe(
          response => {
            if(response){
              this.getLessonTimeTable(1);
              this.getLessonDistributionDetails(1);
            }else{
              this.errorMsgManual="There is no any lesson(Manual) for this package yet.";
            }
          },
          error => {
            console.log(error);
            this.handleErrorResponse(error)
          }
        );
        
      }
  
      if(selectpackage.autoLes>0){
        this.getTotalStudentOfPackage(2);
        this.timeTableService.isAnyLesson(selectpackage.packageId,2).subscribe(
          response => {
            if(response){
              this.getLessonTimeTable(2);
              this.getLessonDistributionDetails(2);
            }else{
              this.errorMsgAuto="There is no any  lesson(Auto) for this package yet."
            }
          },
          error => {
            console.log(error);
            this.handleErrorResponse(error)
          }
        );
      }
      
    }

    getTotalStudentOfPackage(transmissionType){
    this.packageService.getNumStudentPackage(this.selectPackage.packageId,transmissionType).subscribe(
      response => {
        (transmissionType == 1 ? this.isManual=true : this.isAuto=true);
        (transmissionType == 1 ? this.manualTotalStudent=response : this.autoTotalStudent=response);
      },
      error => {
        console.log(error);
        this.handleErrorResponse(error);
      }
    );
  }

  getLessonTimeTable(transmission){
    this.timeTableService.getLessonsByPackageId(this.selectPackage.packageId,transmission).subscribe(
      response => {
        (transmission==1 ? this.manualLessonTimeTable=response : this.autoLessonTimeTable=response);
        this.timeTableService.getLessonTimeSlotByPackageId(this.selectPackage.packageId,transmission).subscribe(
          response => {
            (transmission==1 ? this.timeSlotIdManual=response : this.timeSlotIdAuto=response);
            (transmission==1 ? this.isManualTableActive=true  :  this.isAutoTableActive=true);          
          },
          error => {
            console.log(error);
            this.handleErrorResponse(error); 
          }
        );
      },
      error => {
        console.log(error);
        this.handleErrorResponse(error);
      }
    )
  }


    //get number of lessons per week days
    getLessonDistributionDetails(transmission){

      this.timeTableService.getLessonDistributionDetails(this.selectPackage.packageId,transmission).subscribe(
        response => {
          if(response.length>0){
            (transmission==1 ? this.isManualGraphActive=true : this.isAutoGraphActive=true);
            let lessonDistribution:LessonDistributionMap[] = response;
            (transmission == 1 ? this.manualLessonGraph(lessonDistribution) : this.autoLessonGraph(lessonDistribution));
          }
        },
        error => {
          console.log(error);
          this.handleErrorResponse(error);
        }
      );
    }



  manualLessonGraph(lessonDistribution:LessonDistributionMap[]){
    
    // index:
    // 0 -> Sunday
    // 1 -> Monday
    let array=[0,0,0,0,0,0,0];
    this.manualTotalLesson=0;
    lessonDistribution.forEach(element => {
      array[+element.day]=element.lessonCount;
      this.manualTotalLesson+=+element.lessonCount;
    });
   

    this.lineChartManualData = [
      {
        label: "Lessons",
        pointBorderWidth: 2,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 1,
        pointRadius: 4,
        fill: true,
        borderWidth: 1,
        data: [array[1], array[2], array[3],array[4], array[5], array[6], array[0]]
      }
    ];
  }

  autoLessonGraph(lessonDistribution:LessonDistributionMap[]){
    
    // index:
    // 0 -> Sunday
    // 1 -> Monday
    let array=[0,0,0,0,0,0,0];
    this.autoTotalLesson=0;
    lessonDistribution.forEach(element => {
      array[+element.day]=element.lessonCount;
      this.autoTotalLesson+=+element.lessonCount;
    });
   

    this.lineChartAutoData = [
      {
        label: "Lessons",
        pointBorderWidth: 2,
        pointHoverRadius: 4,
        pointHoverBorderWidth: 1,
        pointRadius: 4,
        fill: true,
        borderWidth: 1,
        data: [array[1], array[2], array[3],array[4], array[5], array[6], array[0]]
      }
    ];
  }

 

  lessonAnalysisReport(transmission){
        let lessonTimePeriod;
        let studentTimePeriod;
        let totalStudent;
       
        if(transmission == 1){
          this.errorMsgStudentTimePeriodManual=false;
          this.errorMsgLessonTimePeriodManual=false;
          this.isManualLessonAnalysisActive=false;
          lessonTimePeriod=this.lessonTimePeriodManual;
          studentTimePeriod=this.studentTimePeriodManual;
          totalStudent=this.manualTotalStudent;
        }else{
          this.errorMsgStudentTimePeriodAuto=false;
          this.errorMsgLessonTimePeriodAuto=false;
          this.isAutoLessonAnalysisActive=false;
          lessonTimePeriod=this.lessonTimePeriodAuto;
          studentTimePeriod=this.studentTimePeriodAuto;
          totalStudent=this.autoTotalStudent;
        }
        
        if(totalStudent>0){
            let errorMsg=false;
            if(lessonTimePeriod==null){
              let error = "Insert Valid Lesson Time Period";
              (transmission==1 ? this.errorMsgLessonTimePeriodManual=error : this.errorMsgLessonTimePeriodAuto=error);
              errorMsg=true;
            }
            if(studentTimePeriod==null){
              let error = "Insert Valid Time Period";
              (transmission==1 ? this.errorMsgStudentTimePeriodManual=error : this.errorMsgStudentTimePeriodAuto=error);
              errorMsg=true;
            }
          
          

            if(!errorMsg){
              if( (lessonTimePeriod>0) && (studentTimePeriod>0)  &&  (+studentTimePeriod <= +lessonTimePeriod)){
                    this.vehicleCategory=this.selectPackage.vehicleCategoryId.category;
                    let numStudentForOneVehicle=this.selectPackage.vehicleCategoryId.numStudent;
                    let numOfStudentPerOneLesson=lessonTimePeriod/studentTimePeriod;
                    numOfStudentPerOneLesson=Math.floor(numOfStudentPerOneLesson);

                    let temporyNumberOfLesson = 0;
                    temporyNumberOfLesson=totalStudent/numOfStudentPerOneLesson
                    temporyNumberOfLesson=Math.ceil( temporyNumberOfLesson );
                    
                    if(numOfStudentPerOneLesson > numStudentForOneVehicle){
                      
                      let remainStudentForOneLesson = numOfStudentPerOneLesson-numStudentForOneVehicle;
                      let totalRemainStudent = remainStudentForOneLesson*temporyNumberOfLesson;

                      if(totalStudent%numOfStudentPerOneLesson > 0){
                        temporyNumberOfLesson-=1;
                        let remainStudentForLesson=totalStudent%numOfStudentPerOneLesson;

                        if(remainStudentForLesson < remainStudentForOneLesson){
                          totalRemainStudent = totalRemainStudent - (remainStudentForOneLesson-remainStudentForLesson);
                        }
                        if(remainStudentForLesson > remainStudentForOneLesson){
                          totalRemainStudent = totalRemainStudent + (remainStudentForLesson-remainStudentForOneLesson);
                        }
                      }

                      let extranLesson =Math.ceil(totalRemainStudent/numStudentForOneVehicle);
                      let recommendLesson=temporyNumberOfLesson + extranLesson;
        
                      (transmission==1 ? this.manualTotalLessonRecommend=recommendLesson : this.autoTotalLessonRecommend=recommendLesson);
                      

                    }else{
                      (transmission==1 ? this.manualTotalLessonRecommend=temporyNumberOfLesson : this.autoTotalLessonRecommend=temporyNumberOfLesson);
                    }

                    (transmission==1 ? this.numStudentForOneVehicleManual=numStudentForOneVehicle : this.numStudentForOneVehicleAuto=numStudentForOneVehicle);
                    (transmission==1 ? this.isManualLessonAnalysisActive=true : this.isAutoLessonAnalysisActive=true);
              }else{
                let error="Student TimePeriod Should be lessthan or equal to Lesson TimePeriod(Time Period Should be greater than Zero)";
                (transmission==1 ? this.errorMsgStudentTimePeriodManual=error : this.errorMsgStudentTimePeriodAuto=error);
              }

            }
        }else{
          this.errorMessage = "There is no any student for this course.";
        }
   
  }

  ManualLessonMoreGraph(){
    this.isManualLessonMore=true;
  }

  closeMsg(type){
    (type == 1 ? this.errorMsgManual="" : this.errorMsgAuto="");
  }

  lessonStudentAttendance(lessonId,day,transmission,timeSlot:TimeSlotModel){
   
    if(transmission == 1){
      this.studentAttendanceLessonIdManual=lessonId;
      this.manualLessonDay=day;
      this.manualLessonTimeSlot=timeSlot;
      this.studentAttendanceGraphManual(lessonId,1);
      this.isPastStudentAttendanceManual=true;
      this.isFutureStudentAttendanceManual=false;
    }else{
      this.studentAttendanceLessonIdAuto=lessonId;
      this.autoLessonDay=day;
      this.autoLessonTimeSlot=timeSlot;
      this.studentAttendanceGraphAuto(lessonId,1);
      this.isPastStudentAttendanceAuto=true;
      this.isFutureStudentAttendanceAuto=false;
    }

    //get Lesson Publish Date
    this.timeTableService.getLessonPublishDate(lessonId).subscribe(
      response => {
        (transmission==1 ? this.lessonPublishDateManual=response : this.lessonPublishDateAuto=response);
      },
      error => {
        console.log(error);
      }
    );
  }

  //time 1->past ,2->future
  studentAttendanceGraphManual(lessonId,time){
    this.isManualLesson=false;
    this.timeTableService.getStudentAttendance(lessonId,time).subscribe(
      response => {
        let studentAttendance:StudentAttendanceWeeksMap[] = response;
        
        //set lables and data
        let lineChartWithNumbersAndGridLabelsManualData = [];
        let studentAttendancedata=[];

        studentAttendance.forEach(element => {
          lineChartWithNumbersAndGridLabelsManualData.push(element.week);
          studentAttendancedata.push(element.numStudent);
        });
       
        this.lineChartStudentAttendanceDataManual = [
          {
            label: "Student Attendance",
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 1,
            pointRadius: 4,
            fill: true,
            borderWidth: 2,
            data: studentAttendancedata
          }
        ];
     
        this.lineChartWithNumbersAndGridLabelsManual=lineChartWithNumbersAndGridLabelsManualData;
        this.isManualLesson=true;

      },
      error => {
        console.log(error);
        this.handleErrorResponse(error);
      }
    )
  }

  studentAttendanceGraphAuto(lessonId,time){
    this.isAutoLesson=false;
    this.timeTableService.getStudentAttendance(lessonId,time).subscribe(
      response => {
        let studentAttendance:StudentAttendanceWeeksMap[] = response;
        
        //set lables and data
        let lineChartWithNumbersAndGridLabelsManualData = [];
        let studentAttendancedata=[];

        studentAttendance.forEach(element => {
          lineChartWithNumbersAndGridLabelsManualData.push(element.week);
          studentAttendancedata.push(element.numStudent);
        });
       
        this.lineChartStudentAttendanceDataAuto = [
          {
            label: "Student Attendance",
            pointBorderWidth: 2,
            pointHoverRadius: 4,
            pointHoverBorderWidth: 1,
            pointRadius: 4,
            fill: true,
            borderWidth: 2,
            data: studentAttendancedata
          }
        ];
        this.lineChartWithNumbersAndGridLabelsAuto=lineChartWithNumbersAndGridLabelsManualData;
        this.isAutoLesson=true;

      },
      error => {
        console.log(error);
        this.handleErrorResponse(error);
      }
    )
  }

  //time 1->Past , 2->Future
  studentAttendanceChangeButton(transmission,time){
    if(transmission==1){
      if(time==1){
        this.isFutureStudentAttendanceManual=false;
        this.isPastStudentAttendanceManual=true;
        this.studentAttendanceGraphManual(this.studentAttendanceLessonIdManual,1);
      }else{
        this.isFutureStudentAttendanceManual=true;
        this.isPastStudentAttendanceManual=false;
        this.studentAttendanceGraphManual(this.studentAttendanceLessonIdManual,2);
      }
    }else{
      if(time==1){
        this.isFutureStudentAttendanceAuto=false;
        this.isPastStudentAttendanceAuto=true;
        this.studentAttendanceGraphAuto(this.studentAttendanceLessonIdAuto,1);
      }else{
        this.isFutureStudentAttendanceAuto=true;
        this.isPastStudentAttendanceAuto=false;
        this.studentAttendanceGraphAuto(this.studentAttendanceLessonIdAuto,2);
      }
    }
  }

  lessonDeactivate(transmission){
    let lessonId ;
    (transmission==1 ? lessonId=this.studentAttendanceLessonIdManual : lessonId=this.studentAttendanceLessonIdAuto);
    this.getLesson(2,lessonId);

    Swal.fire({
      title: 'Are you sure?',
      text: "Lesson Is Deactivated.",
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Deactivate!'
    }).then((result) => {
      if (result.value) {

        //check Deactivate Lesson's Day is not today
        if(!this.timeValidation.isToday(this.deactivateLesson.day)){
            this.timeTableService.lessonDeactivate(lessonId).subscribe(
              response => {
              this.getLessonTimeTable(transmission);
              this.getLessonDistributionDetails(transmission);
              (transmission==1 ? this.isManualLesson=false : this.isAutoLesson=false);
    
              this.notificationService.notifyChange(new WebSocketCommunicationDataMap([0,0,0,1,1]));
    
              Swal.fire({
                position: 'center',
                type: 'success',
                title: 'Lesson deactivate successful',
                showConfirmButton: false,
                timer: 1500
              });
              },
              error => {
                console.log(error);
    
                Swal.fire({
                  position: 'center',
                  type: 'error',
                  title: 'Lesson deactivate not successful',
                  showConfirmButton: false,
                  timer: 1500
                });
    
                this.handleErrorResponse(error);
              }
            );
        }else{
          Swal.fire({
            type: 'info',
            title: 'Cannot deactivate today lesson',
            text: 'Lesson deactivate process cannot perform',
          });
        }
      }
    });
  }

  getLesson(type,lessonId){
    this.timeTableService.getLesson(lessonId).subscribe(
      response => {
        (type==1 ? this.updateLesson=response : this.deactivateLesson = response);
      },
      error => {
        console.log(error);
        this.handleErrorResponse(error);
      }
    );
  }

  lessonUpdate(transmission){
    let lessonId ;
    (transmission==1 ? lessonId=this.studentAttendanceLessonIdManual : lessonId=this.studentAttendanceLessonIdAuto);
    this.getLesson(1,lessonId);
    this.delayLessonUpdate(1500,lessonId);
  }

  async delayLessonUpdate(ms: number,lessonId:Number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>{  
      if(!this.timeValidation.isToday(this.updateLesson.day)){
        this.router.navigate(['lesson-update',lessonId,1]);
      }else{
        Swal.fire({
          type: 'info',
          title: 'Cannot update today lesson',
          text: 'Lesson update process cannot perform',
        });
      }
      
    }
    );
  }

  trialLessonDayFeedbackChart(transmission){
    const modalRef = this.modalService.open(TrialLessonDayFeedbackChartComponent,{ centered: true });
    modalRef.componentInstance.packageId = this.selectPackage.packageId;
    modalRef.componentInstance.packageTitle = this.selectPackage.title;
    modalRef.componentInstance.transmission = transmission;
  }


  addLesson(){
    this.router.navigate(['lesson-add']);
  }

 //error handling
 private handleErrorResponse(error: HttpErrorResponse) {
    let httpError = new HttpError();
    httpError.ErrorResponse(error);
    };

}
