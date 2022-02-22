const verifyRegister = (req,res,next) =>{
    const {username,email,password} = req.body;
    const error = {};
    const re = /\S+@\S+\.\S+/;

    if(!username || username.trim().length < 4 || username.trim().length > 30){
       error.username = "Username is required and must contain at least 4 caracters and at most 30 caracters";
    }
    if(!email || !re.exec(email.trim()) || email.trim().length > 40){
       error.email = "Email is required and must be a valid email";
    }
    if(!password || password.trim().length < 8 || password.trim().length > 50){
       error.password = "Password is required and must contain at least 8 caracters and at most 50 caracters";
    }

    if(Object.keys(error).length > 0){
        return res.status(400).json({
            status : 400,
            message : "Bad User Data",
            error
        });
    }
     
    req.body.username = username.trim();
    req.body.email = email.trim();
    req.body.password = password.trim();

    next();

}
const verifyLogin = (req,res,next) =>{
    const {email,password} = req.body;
    const error = {};
    
    if(!email){
       error.email = "Email is required and must be a valid email";
    }
    if(!password){
       error.password = "Password is required";
    }

    if(Object.keys(error).length > 0){
        return res.status(400).json({
            status : 400,
            message : "Bad User Data",
            error
        });
    }
    
    req.body.email = email.trim();
    req.body.password = password.trim();

    next();

}


module.exports = {verifyRegister,verifyLogin};