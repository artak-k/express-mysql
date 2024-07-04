export class ApiErrorResponse {
    status = false;
    message: string;
    errorCode: string;
    data: any = null;
  
  
    constructor(message: string, errorCode: string, data: any = null) {
      this.message = message;
      this.errorCode = errorCode;
      this.data = data;
    }
  }