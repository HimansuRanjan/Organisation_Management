export const generateToken = (user, message, statusCode, res)=>{
    const token = user.grnerateJsonWebToken();

    res.status(statusCode).cookie("token", token,{
        expires: new Date(Date.now() + process.env.COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "None",
        secure: true
    }).json({
        success: true,
        message,
        token,
        user
    });
}

export const generateTokenServiceAdmin = (service, message, statusCode, res)=>{
    const token = service.grnerateJsonWebToken();

    res.status(statusCode).cookie("token", token,{
        expires: new Date(Date.now() + process.env.COOKIE_SERVICE_EXPIRES * 24 * 60 * 60 * 1000),
        httpOnly: true,
        sameSite: "None",
        secure: true
    }).json({
        success: true,
        message,
        token,
        service
    });
}