export class ApiResponse {
    status = true;
    result: any;
  
    constructor(result: any = null) {
      this.result = result;
    }
  }