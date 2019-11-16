export class ExchangeRate{
    constructor(
        public disclaimer:String,
        public license:String,
        public timestamp:String,
        public base:String,
        public rates :{LKR:number}
    ){}
}