import { HttpErrorResponse } from '@angular/common/http';

export class HttpError {

    constructor() { }
  
    
    public ErrorResponse(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
          // A client-side or network error occurred. Handle it accordingly.
          console.error('Client Side Error:', error.error.message);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          console.error(
            `Server Side Error:`+
            `Backend returned code ${error.status}, ` +
            `body was: ${error.error}`);
        }
        // return an observable with a user-facing error message
        //  return throwError(
        //    'There is a problem with the service. please try again later.');
      };
     
  }
  