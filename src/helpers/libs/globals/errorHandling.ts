class ErrorHandling {
    public getErrorMessage(error: any) {
        if(error['message'] != null) {
            return error['message'];
        } else {
            console.log('errrrorr isss ', error)
            // return 'Error is different than others add nnew conndition in error handling class'
            return error;
        }
    } 
}

export default ErrorHandling;