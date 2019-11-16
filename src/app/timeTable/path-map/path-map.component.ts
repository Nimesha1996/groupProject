import { Component, OnInit } from '@angular/core';
import { TimeTableServiceService } from '../../service/TimeTable/time-table-service.service';
import { Path } from '../../ClassModel/PathModel';
import { HttpErrorResponse } from '@angular/common/http';
import { HttpError } from '../../Shared/httpError/HttpError';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-path-map',
  templateUrl: './path-map.component.html',
  styleUrls: ['./path-map.component.scss']
})
export class PathMapComponent implements OnInit {

  errorMessage;

  pathList:Path[]=[];
  subPathList:String[]=[];
  isSubPathHas=false;

  isAddMap=false;
  newMap:Path=new Path(-1,""," ","");
  errorPathName;
  errorOrigin;
  errorDestination;
  
  newSubPath="";
  newsubPaths=[];
  errorSubPath;

  isUpdateMap=false;
  updateMap:Path;
  errorUpdatePathName;
  errorUpdateOrigin;
  errorUpdateDestination;
  
  updateSubPaths:String[]=[];
  updateSubPath="";
  isUpdateSubpath=false;
  errorUpdateSubPath;

  constructor(
    private timeTableService:TimeTableServiceService
  ) { }

  ngOnInit() {
    this.getPathList();
  }

  //getPathDetails
  getPathList(){
    this.timeTableService.getPathList().subscribe(
      response => {
        this.pathList=response;
      },
      error => {
        console.error(error);
        this.handleErrorResponse(error);
      }
    )
  }

  //subPathList
  getSubPathList(pathId){
    this.isSubPathHas=false;
    this.timeTableService.getSubPathList(pathId).subscribe(
      response => {
        this.subPathList=response;
        if(this.subPathList.length >0){
          this.isSubPathHas=true;
        }
      },
      error => {
        console.log(error);
        this.handleErrorResponse(error);
      }
    );
  }

  //buttons

  //This function use List(1)/Insert(2)/Update(3)
  googleMap(map:Path,type){
    let error;

    if(type==2){
      this.errorPathName="";
      this.errorOrigin="";
      this.errorDestination="";
    }else if(type==3){
      this.errorUpdatePathName="";
      this.errorUpdateOrigin="";
      this.errorUpdateDestination="";
    }

    if(map.origin == ""){
      error="Origin is mandatory";
      (type==2 ? this.errorOrigin=error : this.errorUpdateOrigin=error);
    }
    if(map.destination == ""){
      error="Destination is mandatory.";
      (type==2 ? this.errorDestination=error : this.errorUpdateDestination=error);
    }

    if( (map.origin != "") && (map.destination!="")){
      let mapUrl="https://www.google.com/maps/"+
              "dir/?api=1&origin="+map.origin+
              "&destination="+map.destination+
              "&travelmode=driving";

      //select type
      let subPaths:String[]=[];
      if(type==1){
        this.getSubPathList(map.pathId);
        this.delay(1000).then(any=>{
          subPaths=this.subPathList;
          mapUrl=this.subPathUrl(mapUrl,subPaths);
          console.log(mapUrl);
          window.open(""+mapUrl, "_blank"); 
        });
      }else if(type==2){
        subPaths=this.newsubPaths;
        mapUrl=this.subPathUrl(mapUrl,subPaths);
        console.log(mapUrl);
        window.open(""+mapUrl, "_blank"); 
      }else if(type==3){
        subPaths=this.updateSubPaths;
        mapUrl=this.subPathUrl(mapUrl,subPaths);
        console.log(mapUrl);
        window.open(""+mapUrl, "_blank"); 
      }
    }
   
  }

  subPathUrl(mapUrl,subPaths){
    if(subPaths.length >0){
      mapUrl+="&waypoints=";
    
      let i=0;
      subPaths.forEach(element => {
        if(i == subPaths.length-1){
          mapUrl+=element;
        }else{
          mapUrl+=element+"%7C";
        }
        i++;
      });
      return mapUrl;
    }
    return mapUrl;
  }

  addMap(){
    this.newMap.pathName="";
    this.newMap.origin="";
    this.newMap.destination="";
    this.newSubPath="";
    this.newsubPaths=[];

    this.isAddMap=true;
  }

  //This function use both update and insert functionality.
   //type=1 --> Insert , type=2 --> Update
  addSubPath(type){

    let error;
    let subPath;

    (type==1 ? this.errorSubPath="" : this.errorUpdateSubPath="");
    (type==1 ? subPath=this.newSubPath : subPath=this.updateSubPath);

    if(subPath != ""){
        (type==1 ? this.newsubPaths.push(subPath) : this.updateSubPaths.push(subPath) );
    }else{
         error="Insert Valid Path";
         (type==1 ? this.errorSubPath=error : this.errorUpdateSubPath=error);
    }
    (type==1 ?  this.newSubPath="" : this.updateSubPath="");
  }

  //use Insert/Update Functionality
  saveConfirm(type){
   
    if(type==1){
      this.errorPathName="";
      this.errorOrigin="";
      this.errorDestination="";
    }else{
      this.errorUpdatePathName="";
      this.errorUpdateOrigin="";
      this.errorUpdateDestination="";
    }
    
    //validation
    let error="";
    let pathMap:Path;

    (type==1 ? pathMap=this.newMap : pathMap=this.updateMap);
 
    if(pathMap.pathName == ""){
      error="Path Name is mandatory";
      (type==1 ? this.errorPathName=error : this.errorUpdatePathName=error);
    }
    if(pathMap.origin == ""){
      error="Origin is mandatory.";
      (type==1 ? this.errorOrigin=error : this.errorUpdateOrigin=error);
    }
    if(pathMap.destination == ""){
      error="Destination is mandatory.";
      (type==1 ? this.errorDestination=error : this.errorUpdateDestination=error);
    }

    if( error=="" ){
      
      //save newMap/updateMap Data
      (type==1 ? this.timeTableService.addPath(pathMap) : this.timeTableService.updatePath(pathMap)).subscribe(
        response => {
          let pathId=response;
          let subPaths=[];

          (type==1 ? subPaths=this.newsubPaths : subPaths=this.updateSubPaths);
          
          if(subPaths.length>0){
              //save the subpath
              (type==1 ?  this.timeTableService.addSubPath(pathId,subPaths) : this.timeTableService.updateSubPath(pathId,subPaths)).subscribe(
                response =>{
                  let msg="";
                  (type==1 ? msg="Submission is Completed." :msg="Update Successful.");
                  Swal.fire(msg);

                  pathMap.pathName="";
                  pathMap.origin="";
                  pathMap.destination="";
                  
                  subPaths=[];
                  (type==1 ? this.isAddMap=false : this.isUpdateMap=false);
                  
                  this.getPathList();
                },
                error => {
                  //delete Path
                  this.timeTableService.deletePath(pathId).subscribe();

                  let msg;
                  (type==1 ? msg="submission is not Successful!" : msg="Update not Successful!");

                  Swal.fire({
                    type: 'error',
                    title: 'Oops...',
                    text: msg,
                    footer: 'Something bad happened, please try again later.'
                  });
                  console.log(error);
                  this.handleErrorResponse(error);
                }
              );
          }else{
                let msg="";
                (type==1 ? msg="Submission is Completed." :msg="Update Successful.");
                Swal.fire(msg);
               
                (type==1 ? this.isAddMap=false : this.isUpdateMap=false);
                this.getPathList();
          }
        },
        error => {
          console.error(error)
          let msg;
          (type==1 ? msg="submission is not Successful!" : msg="Update not Successful!");
          Swal.fire({
            type: 'error',
            title: 'Oops...',
            text: msg,
            footer: 'Something bad happened, please try again later.'
          });
        }
      )
      
    
    }
  }

  deletePath(){

  }

  isUpdate(path:Path){
    this.errorUpdatePathName="";
    this.errorUpdateOrigin="";
    this.errorUpdateDestination="";
    this.errorUpdateSubPath="";

    this.isUpdateMap=true;
    this.updateMap=new Path(path.pathId,path.pathName,path.origin,path.destination);
    this.getSubPathList(path.pathId);
        this.delay(1000).then(any=>{
          this.updateSubPaths=this.subPathList;
          if(this.updateSubPaths.length > 0){
            this.isUpdateSubpath=true;
          }
        });
  }

  closeAddMap(){
    this.isAddMap=false;
  }

  clearSubPath(type){
    (type==1? this.newsubPaths=[] : this.updateSubPaths=[]);
  }

  closeUpdateMap(){
    this.isUpdateMap=false;
  }

  handleErrorResponse(error: HttpErrorResponse) {
    //this.errorMessage="There is a problem with the service. please try again later.";
    let httpError = new HttpError();
    httpError.ErrorResponse(error);
  };

  async delay(ms: number) {
    await new Promise(resolve => setTimeout(()=>resolve(), ms)).then(()=>console.log("fired"));
  }
}
