export default class AppError extends Error {
    readonly message: string;
    readonly statusCode: number;

    constructor(message: string, statusCode: number){
        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}


// export default class AppError extends Error {
//     readonly message: string;
//     readonly statusCode: number;
  
//     constructor(message: string, statusCode: number) {
//       super(message); // Call the base Error constructor with the message
//       this.message = message;
//       this.statusCode = statusCode;
//     }
//   }