const path =require("path");
const express = require("express");
const app = express();

const bcrypt = require("bcrypt");
const {open} =require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname,"database.db");

let database = null;

const user=[{
    id:1,
    "name":"A",
    "Gmail":"xyz@gmail.com",
    password:91215,
    phoneNo:9102021484
    },
    {
    id:2,
    "name":"B",
    "Gmail":"abc@gmail.com",
    password:91214,
    phoneNo:9102021422
    }];

const initializeServer= async ()=>{
    try {
        database = await open({
            filename:dbPath,
            driver:sqlite3.Database,
        });
        app.listen(3000, ()=>{
            console.log(`sever running`);
        });
    }
    catch(e){

    }console.log(`DataBase Error : ${e.message}`);
}

initializeServer();

app.post("user", async (request,response)=>{
    const {Gmail,password} =request.body;
    const hashedPassword = await bcrypt.hash(request.body,10);
    const selectUserQuary = `SELECT * FROM user WHERE Gmail =${Gmail};`;
    const dbUser = await database.get(selectUserQuary);
    if(dbUser === undefined){
        const createUserQuery = `INSERT INTO user (name, Gmail, passwaord, phoneNo)
        VALUES (
        '${name}',
        ${Gmail},
        ${hashedPassword},
        ${phoneNo});`
    const dbResponse = await dbUser.run(createUserQuery);
    const newUserId = dbResponse.lastId;
    response.send("Created new user")
    }
    else{
        response.status(400);
        response.send("User already exists");
    }
})

app.post("/login", async(request,response)=>{
    const {name,password} = request.body
    const selectUserQuary =`SELECT * FROM user WHERE name = "${name}";`
    const dbUser = await database.get(selectUserQuary);
    if(dbUser === undefined){
        response.status(400);
        response.send("Invalid User");
    }else{
        const isPasswordMatch = await bcrypt.compare(password,database.password);
        if(isPasswordMatch){
            response.send("login Success!");
        }
        else{
            response.status(400);
            response.send("Invalid Password")
        }
    }
})

