export const responseClient = ({req, res , message, statsCode = 200}) => {


    // success response
    req.success = () => {
        return res.status(statusCode).json ({
            status: "success",
            message,
        });
    };


    // error response 
    req.error = () => {
        return res.status(statsCode).json({
            status: "error",
            message,
        });
    };



    if(statsCode >= 200 && statsCode < 300) {
        return req.success()
    } else {
        return req.error();
    }
};