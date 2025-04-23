# PROJECT-CAMP
------------
### Setup projects, Collaborate with teammates, Have fun.
-----------------------------------------------------
<THIS IS INCOMPLETE. COME BACK ONCE IT IS FINISHED>

## Goal - To create a project management system

## #Features - 
1. User work on different projects
2. Each project has it's own admin and it's members
3. Each project has its tasks and sub tasks with attachments
4. Each project needs to have the ability to write notes

## Coding Flow
1. Boiler plate
2. Basic server setup
3. Database connection setup
4. Standardise errors
5. Standardise responses
6. Project constants
7. Mongo models
8. Generate controllers & route files
9. Healthcheck setup
10. Async handler
11. Validator setup
12. Email setup


## 1. Bolier Plate setup (not defined anywhere but we need to have it) - 
1. npm init -y
2. npm i express mongoose dotenv cors express-validator bcryptjs jsonwebtoken
3. npm install --save-dev prettier (code format)
    1. file -> .prettierrc -> copy paste from web general prettier format which needs to be shared and implemented by all users in the project
    2. file -> .prettierignore -> node_module, .env (wherever prettier formating is not needed)
4. package.json -> "type": "module"
5. file -> .gitignore
   1. add 'node_modules' and '.env' in this file
6. file -> .env + .env.example + .env.local (make sure these are added in .gitignore file)
7. file -> Readme.md (all details of the project)
8. folder -> public (keep static files)
    1. folder -> images (like favicon files)
    2. file -> .gitkeep (empty file -> kept to track changes in git)
9.  folder -> src
    1. cd src 
    2. mkdir db models controllers middlewares routes utils validators (make folders in one go)

## 2. Basic server setup

1. file -> src/app.js 
    1. configure express (make an app and export it)

## 3. Database connection setup
1. update -> .env 
    1. configure PORT (say PORT=8000)
    2. configure MONGO_DB_CONNECTION_STRING (get it from mongoAtlas)

2. file -> db/index.js 
    1. configure mongoose
    2. import mongodb connection string from .env
    3. connectdb with an async await function (process.exit(1) in catch part)
    4. export it

3. file -> src/index.js 
    1. import the express app in app.js 
    2. import dotenv 
    3. import connectDb from db/index.js
    4. configure dotenv    
        1. dotenv.config({path:"./.env"})
        2. get the PORT from .env file || 8000
    5.  import connectdb().then(app.listen(PORT)).catch()

## 4. Standardise Errors
1. file -> utils/api-error.js 
    1. class ApiError extends Error {
        constructor(statusCode, message, errors=[], stack=""){
            super(message);
            this.statusCode = statusCode;
            this.message = message;
            this.success = false;
            this.errors = errors;
            if(stack){
                this.stack = stack;
            } else {
                Error.captureStackTrace(this,this.constructor)
            }
        }
    }
    export {ApiError}

## 5. Standardise Responses
    file -> utils/api-response.js 
    1. class ApiResponse {
        constructor(statusCode, data, message="Success"){
            this.statusCode = statusCode;
            this.data = data;
            this.message = message;
            this.success = statusCode > 400;
        }
    }
    export {ApiResponse}

## 6. General project constants in utils
    Declare general project constants and export them as both objects (to get the default) & arrays (get all the data)
    file -> utils/constants.js 

    export const UserRolesEnum = {
        ADMIN: "admin",
        PROJECT_ADMIN: "project_admin",
        MEMBER: "member"
    }
    export const AvailableUserRoles = Object.values(UserRolesEnum)

    export const TaskStatusEnum = {
        TODO: "todo",
        IN_PROGRESS: "in_progress",
        DONE: "done"
    }

    export const AvailableTaskStatuses = Object.values(TaskStatusEnum)

## 7. Standardise Mongo Models
    1. cd src/models
    2. touch user.model.js task.model.js subtask.model.js project.model.js project_member.model.js note.models.js 
    (based on the collections in the mongodb)
    3. create the standard model schema for all models in this format
        import mongoose, {Scheme} from "mongoose";
        const xSchema = new Schema({
            (to get from other schema)x: {
                type: Schema.Types.ObjectId,
                ref: "X",
                (optional)required: [true, "x reference is required"],
                (optional for strings)trim:true
            },
            attachments: {
                type: [
                    {
                        url: String,
                        mimeType: String,
                        size:   Number
                    }
                ],
                default:[]
            },
            avatar: {
                type: {
                    url: String,
                    localpath: String
                }, default: {
                    url: "https://placehold.co/600x400",
                    localpath: ""
                }
            },
            username: {
                type: String,
                required: true,
                unique: true,
                required: true,
                index: true,
                lowercase: true
            }
        },{(optional)timestamps: true});
        export const X = mongoose.model("X", xSchema)
    4. add pre and post hooks 
        userSchema.pre("save", async function(next){
            if(!this.isModified("password")) return next();
            this.password = await bcrypt.hash(this.password, 10);
            next();
        })
    5. add methods in Schema
        userSchema.methods.isPasswordCorrect = async function(password){
            return await bcrypt.compare(password, this.password)
        }

        userSchema.methods.generateAccessToken = function(){
            return jwt.sign({
                _id: this._id,
                email: this.email,
                username: this.username
            },
            process.env.JWT_ACCESS_SECRET,
            {expiresIn: process.env.JWT_ACCESS_EXPIRESIN})
        }

        userSchema.methods.generateTempToken = function(){
            const unhashedToken = crypto.randomBytes(32).toString("hex);
            const hashedToken = crypto.createHash("sha256").update(unhashedToken).digest("hex")
            const tokenExpiry = Date.now()+(20*60*1000);

            return {hashedToken, unhashedToken, tokenExpiry}
        }

## 8. Generate Controller & Route files
    1. cd src/controllers
        touch healthCheck.controller.js auth.controller.js note.controller.js project.controller.js task.controller.js  

    2. cd ../routes
        touch healthCheck.route.js auth.route.js note.route.js project.route.js task.route.js 

[General Format : Update Controller -> Update Route to use this controller -> Update app.js to use this route]

## 9. Healthcheck configuration
1. write healthcheck controller
    import {ApiResponse} from "../utils/api-response.js " 
    const healthCheck = (req,res) => {
        res.status(200).json({
            new ApiResponse(200,{message: "Server is running"})
        })
    }
    export {healthCheck};

2. write healthCheck route
    import {Router} from "express";
    import {X} from "../controller/<>.js"
    const router = Router()
    router.route("/).get(X)
    export defualt router;

3. update app.js with the router details
    1. import the router to user
    2. write app.use("/api/v1/healthCheck",healthCheckRouter)

## Advanced code section

## 10. Async Handler
    write async handler in utils to centralise try-catch block for all controllers
    1. store the asyncHandler in utils
    function asyncHandler(requestHandler){
        return function(req,res,next){
            Promise.resolve(requestHandler(req,res,next))
            .catch(function(err){
                next(err)
            })
        }
    }
    export {asyncHandler}

    2. all controllers where they are written must be wrapped within asyncHandler to handle all errors effectively


## 11. Validators
   1. write validators for userRegistration and login validators using express-validator library and export it
       1. const userRegistrationValidator = () => {
        return[
            body("email)
                .trim()
                .notEmpty().withMessage("Email should not be empty")
                .isEmail().withMessage("This should be a email"),
            body("username")
                .trim()
                .notEmpty().withMessage("Username should not be empty")
                .isLength({min: 3}).withMessage("Username should be of at least 3 chars")
                .isLength({max:15}).withMessage("Username should not be more than 15 characters")
                ]
        }
       2. const LoginValidator = () => {
        return[
            body("email")
                .isEmail().withMessage("Email is not valid"),
            body("password")
                .notEmpty().withMessage("Password should not be empty")

        ]
        }
       3. export {userRegistrationValidator,LoginValidator}

2.  write a generic middleware which uses express-validator using validator
    1.  import {} from "../util/api-errors.js"
        import {validationResult} from "express-validator";
        
        export const validate = (req,res,next) => {
            const errors = validationResult(req);
            if(errors.isEmpty()){
                return next();
            }
            const extractedErrors = [];
            errors.array().map((eachError) => {
                [eachError.path]:eachError.msg
            })
            throw new ApiError(400,"Request validation failed", extractedErrors)
        }

3.  use the middleware and validator in the router
    1. import middleware
    2. import validator
    3. set the route, use the validator(), middleware & controller in that order

## 12. Email setup 
1.  write a utility to work with emails (mailgun and nodemailer)
    1. npm install mailgun (crafting the email we want to send) & nodemailer (sending an email)
    2. Look at the examples from their NPM site - https://www.npmjs.com/package/mailgen || https://www.npmjs.com/package/nodemailer
    3. file -> utils/mail.js
    4. import mailgun and nodemailer
    5. configure the sendMail method:
        1. configure the nodmailer transporter (using mailtrap settings)
        2. configure the mailgen theme and project info using mailGenerator method
        3. generate a plain-text version and html version of content for the email
        4. configure the from, to, subject, and content (plain text and html) of the mail to be send using above info
        5. using nodemailer transporter, send the above configured email in a try-catch block
    6. Now we can use this sendMail method to craft and send custom emails
