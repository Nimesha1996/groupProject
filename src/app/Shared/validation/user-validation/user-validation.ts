
export class UserValidation {

  constructor() { }

  regExp:any;//Regular Expression
  test:Boolean

  //email validation
  public isValidEmail(email:String){
    this.regExp = new RegExp( /[a-z0-9!#$%&'*+=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g);
    this.test = this.regExp.test(email);
    if(this.test){
      return true;
    }
    return false;
  }

  //valid exam date
  public isFutureDate(date){
    let currentDate = new Date();
    let futureDate = new Date(date);
    if(futureDate>currentDate){
      return true;
    }
    return false;
  }

  //Telephone number Validation
  isValidTelNumber(tel){
    if(tel.length == 10){
      this.regExp = new RegExp('\\d{10,10}');
      this.test = this.regExp.test(tel);
      if(this.test){
        return true;
      }
    }
    return false;
  }

  //valid NIC Number
  isValidNicNumber(nic){
    if(nic.length == 10){
      this.regExp = new RegExp('\\d{9,9}[v,V]');
      this.test = this.regExp.test(nic);
      if(this.test){
        return true;
      }
    }
    return false;
  }

  //valid date
  isValidDate(date){
    this.regExp = new RegExp('^\\\d{4}\\\-(0?[1-9]|1[012])\\\-(0?[1-9]|[12][0-9]|3[01])$');
    this.test = this.regExp.test(date);
    if(this.test){
      return true;
    }
    return false;
  }

  //valid both examDate & Trial Date
  isValidExamDateTrialDate(examDate,trialDate){
    let e=new Date(examDate);
    let t=new Date(trialDate);

    if(e<t){
      return true;
    }
    return false;
  }

  isDigitContain(value){
    this.regExp=new RegExp('[0-9]');
    this.test=this.regExp.test(value);
    if(this.test){
      return true;
    }
    return false;
  }

}
