const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const jwt = require("jsonwebtoken");

const app = express();

app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "crud",
});

app.get("/", (req, res) => {
  
  const sql = "select * FROM student";
  db.query(sql, (err, data) => {
    if (err) {
      return res.json("Error");
    }
    return res.json(data);
  });
});

//creat Function 
app.post('/create',(req, res)=>{

    const sql="Insert into student (`sname`,`semail`) VALUES (?)";
    const values=[
        req.body.name,
        req.body.email
    ]
    db.query(sql, [values],(err , data) =>{
        if (err) {
            return res.json("Error");
          }
          return res.json(data);
    })
})

//update student by id
app.put('/update/:id',(req, res)=>{

  const sql="update student set 'sname' = ?, 'semail'= ? where id= ?";
  const values=[
      req.body.name,
      req.body.email
  ]
  const id = req.params.id;
  db.query(sql, [...values , id],(err , data) =>{
      if (err) {
          return res.json("Error");
        }
        return res.json(data);
  })
})

//delete
app.delete('/student/:id',(req, res)=>{

  const sql="DELETE FROM student WHERE id= ?";
 
  const id = req.params.id;
  db.query(sql,[id],(err , data) =>{
      if (err) {
          return res.json("Error");
        }
        console.log(data);
        return res.json(data);
  })
})

//search student details by name
app.post('/student/search', (req, res) => {
  const sql = "SELECT * FROM student WHERE sname = ?";
  
  const Name = req.body.sname; 
  
  db.query(sql, [Name], (err, data) => {
    if (err) {
      return res.json("Error");
    }
    console.log(data);
    return res.json(data);
  });
});




const user = [
  {
    id:"1",
    username:"jhon",
    password:"j123",
    isAdmin:true,
  },
  {
    id:"2",
    username:"mama_Ajith",
    password:"aj88",
    isAdmin:false,
  }
];
//sdaaassaaQAWQAS


//WWSSWDWFWSSAADAWEWS
//asaaaaAAAAAAAAAAAAAAAASS

app.post('/api/login', (req, res) => {
 const{username,password}=req.body;

 const user = user.find(u=>{
  return u.username === username && u.password === password;
 });
 if(user){
  const acsessToken = jwt.sign({id: user.id,isAdmin: user.isAdmin}, "mysecretkey")
  res.json({
    username:user.username,
    isAdmin:user,isAdmin,
    acsessToken
  })
}else{
  res.status(400).json("User or password incorrect");
 }
});


app.listen(8081, () => {
  console.log("listening");
});
