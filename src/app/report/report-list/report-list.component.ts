import { Component, OnInit } from '@angular/core';
import { StudentServiceService } from '../../service/student/student-service.service';


@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss']
})
export class ReportListComponent implements OnInit {

  payment=1000;
  constructor(
    private studentService:StudentServiceService
  ) { }

  ngOnInit() {
  }

  // pay(){
  //   console.log(this.payment);
  //   this.studentService.makePayment(this.payment).subscribe(
  //     response => {
  //         console.log("Response:")
  //         console.log(response.redirect_url);  
  //         window.open(""+response.redirect_url, "_blank");   
  //     },
  //     error =>{
  //       console.log(error);
        
  //     }
  //   )
  // }

}
