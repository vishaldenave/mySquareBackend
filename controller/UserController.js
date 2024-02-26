
import UserModel from "../model/user.js";
import Message from "../messages.js"
import encrypt from "bcrypt"
class UserController{
    static getDetail = async(req,res)=>{
       return res.status(200).send({success: true, message: "Fetch Successfully",
        data:req.user});
    } 
    static editDetail  =  async(req,res)=>{

        const {name,email,personalEmail,password,contactNo,
            alternativeContactNo,currentAddress,permanetAddress,
            dateOfJoining,dateOfBirth,gender,bloodGroup,maritalStatus,languagesKnown,
            higherEducationQualification,employeeType,probationDuration,workingStatus,
            department,designation,reportTo,reportUserId,role
        } = req.body;

        var userObject = {}
        if(name) userObject.name = name
        if(email) userObject.email = email
        if(personalEmail) userObject.personalEmail = personalEmail
        if(contactNo) userObject.contactNo = contactNo
        if(alternativeContactNo) userObject.alternativeContactNo = alternativeContactNo

        if(currentAddress) userObject.currentAddress = currentAddress
        if(permanetAddress) userObject.permanetAddress = permanetAddress
        if(dateOfJoining) userObject.dateOfJoining = dateOfJoining
        if(dateOfBirth) userObject.dateOfBirth = dateOfBirth
        if(gender) userObject.gender = gender

        if(bloodGroup) userObject.bloodGroup = bloodGroup
        if(maritalStatus) userObject.maritalStatus = maritalStatus
        if(languagesKnown) userObject.languagesKnown = languagesKnown
        if(higherEducationQualification) userObject.higherEducationQualification = higherEducationQualification
        if(employeeType) userObject.employeeType = employeeType

        if(probationDuration) userObject.probationDuration = probationDuration
        if(workingStatus) userObject.workingStatus = workingStatus
        if(department) userObject.department = department
        if(designation) userObject.designation = designation
        if(reportTo) userObject.reportTo = reportTo

        if(reportUserId) userObject.reportUserId = reportUserId
        if(role) userObject.role = role
        try{
          const userdata =   await UserModel.findOneAndUpdate({_id:req.user._id},{$set:userObject})
        if(userdata){
            return res.status(200).send({success: true, message:"Edit Successfully.",data:userdata});
        }else{
            return res.status(401).send({success: false,message:"Unauthorized request"});
        }  
        }catch(error){
            console.log(error);
            return res.status(500).send({success: false,message:Message.serverError});
        } 
    }
    static changePassword = async (req,res)=>{
        const {oldPassword,newpassword} = req.body
        try{
            if(oldPassword && newpassword){
                if(oldPassword!==newpassword){
                    const salt = await encrypt.genSalt(10);
                    const hashPassword  =  await encrypt.hash(newpassword,salt);
                    await UserModel.findOneAndUpdate({_id:req.user._id},{$set:{password:hashPassword}})
                    return res.status(200).send({success: true, message:"Password changed Successfully."});
                }else{
                    return res.status(401).send({success: false,message:"New Password should different from old password."});
                }
            }
            else{
                return res.status(404).send({success: false,message:Message.required});
            }
        }catch(error){
            console.log(error);
            return res.status(500).send({success: false,message:Message.serverError});
        } 
    }

    static getMenu = async (req,res)=>{
        const role =  req.user;
        if(role==="admin"|| role ==='hr'){
            return res.status(200).send({success: true, message: "Fetch Successfully",
            data:[{"name":"Dashboard","isActive":true},{"name":"Personal Information","isActive":true},
            {"name":"Team","isActive":true},
            {"name":"Leave & Attendance","isActive":true}]});
        }else{
            return res.status(200).send({success: true, message: "Fetch Successfully",
            data:[{"name":"Dashboard","isActive":true},{"name":"Personal Information","isActive":true},
            {"name":"Leave & Attendance","isActive":true}]});
        }      
    }
}
export default UserController