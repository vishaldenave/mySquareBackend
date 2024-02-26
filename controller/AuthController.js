import UserModel from "../model/user.js"
import Message from "../messages.js"
import JwtService from "../services/JwtServices.js"
import encrypt from "bcrypt"
class AuthController{

    static register = async (req,res)=>{
        const {name,email,password,contactNo,dateOfJoining,dateOfBirth,employeeType,probationDuration,
            workingStatus,department,designation,reportTo,reportUserId,role} = req.body;
        try{
            if(name && email && password && dateOfJoining && dateOfBirth && employeeType 
                && probationDuration && workingStatus && department && designation && reportUserId 
                && reportTo && role){
                    
            var isExist = await UserModel.findOne({$or: [{email: email},{contactNo:contactNo}]});
            if (isExist && isExist.email.toString() === email.toString())
            return res.status(404).send({success: false,message:"User with this email is already exist."});
            if (isExist && isExist.phone.toString() === contactNo.toString()) 
            return res.status(404).send({success: false,message: "User with this phone number is already exist."});
            const empData = await UserModel.findOne({},{'empId':1}).sort({_id:-1});
            let newEmpId = 0;
            if(empData){
                newEmpId = parseInt(empData.empId.substring(3,empData.empId.length));
            }
            newEmpId++
            const newCreateEmp =  "00000".slice(0,0-newEmpId.toString().length)+newEmpId;
            var doc  =  new UserModel({
                name:name,
                email:email,
                password:password,
                empId:`SAT${newCreateEmp}`,
                dateOfJoining:dateOfJoining,
                dateOfBirth:dateOfBirth,
                employeeType:employeeType,
                probationDuration:probationDuration,
                workingStatus:workingStatus,
                department:department,
                designation:designation,
                reportTo:reportTo,
                reportUserId:reportUserId,
                role:role
               })
             await doc.save();
             return res.status(200).send({success: true, message: "Register Successfully"});
            }else{
                return res.status(404).send({success: false,message:Message.required});
            }
        }catch(error){
            console.log(error);
           return res.status(500).send({success: false,message:Message.serverError});
        }
    }

    static login  = async (req,res)=>{
        const {username,password} = req.body
        try{
            if(username && password){
                const  user = await UserModel.findOne({$or:[{email:username},{empId:username}]});
                if(user){
                    user.comparePassword(password,isMatch=>{
                        if(!isMatch){
                            return res.status(401).send({success: false,message:"Invalid Username & Password"});
                        }
                        return res.status(200).send({success: true, message: "Login Successfully",
                        "token": `LUA ${JwtService.issue({id:user._id})}`,
                        data:user});
                    })
                }else{
                    return res.status(401).send({success: false,message:"Invalid Username & Password"});
                }
            }else{
                return res.status(404).send({success: false,message:Message.required});
            }
        }catch(error){
            console.log(error);
            return res.status(500).send({success: false,message:Message.serverError});
        }
    }

    static forgotPassword =  async(req,res)=>{
        const {username} = req.body
        try{
             if(username){
                const  user = await UserModel.findOne({$or:[{email:username},{empId:username}]});
                if(user){
                    const secret =  JwtService.isseueExpireTokenWithSecretKey({id:user._id},"15m",`${user._id}${process.env.SECRETKEY}`);
                    const link  = `http://local:8656/verify/${user._id}/${secret}`
                    return res.status(200).send({success: true, message: "Please check your e-mail. Resent Password mail has been sent to your email.","verifyLink":link});
                }else{
                    return res.status(401).send({success: false,message:"Invalid Username."});
                }
             }else {
                return res.status(404).send({success: false,message:Message.required});
             }
        }catch(error){
            return res.status(500).send({success: false,message:Message.serverError});
        }

    }
   static resetPassword = async (req,res)=>{
    const {newPassword,confirmPassword} = req.body
    const {id,token} = req.params
    try {
        if(newPassword && confirmPassword){
            if(newPassword !==confirmPassword){
                return res.status(404).send({success: false,message:Message.passwordNotMatched});
            }else{
                const user =  await UserModel.findById({_id:id});
                const verified =  JwtService.verifyExpireTokenWithSecretKey(token,`${user._id}${process.env.SECRETKEY}`,(error,verified)=>{
                    return verified
                })
                if(verified){
                    const salt = await encrypt.genSalt(10);
                    const hashPassword  =  await encrypt.hash(newPassword,salt);
                    await UserModel.findOneAndUpdate({_id:user._id},{$set:{password:hashPassword}})
                    return res.status(200).send({success: true, message:"Reset Successfully."});
                }
                else {
                    return res.status(401).send({success: false,message:"Expire Token or Un-Authorized"});
                }
            } 
        }else {
            return res.status(404).send({success: false,message:Message.required});
         }
    }catch(error){
        return res.status(500).send({success: false,message:Message.serverError});
        }
   }
}
export default AuthController