const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3001;


app.use(cors());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'job_report_db'
});

app.get('/api/login', (req, res) => {
  
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

app.post('/api/report', upload.single('image'), (req, res) => {
  const {
    type_repair,
    type_problem,
    NameDevice,
    Urgency,
    description,
    IDAnydesk,
    NameUser,
    phone
  } = req.body;

  const image = req.file ? req.file.filename : null;

  const sql = `INSERT INTO job_report
    (type_repair, type_problem, NameDevice, Urgency, description, IDAnydesk, NameUser, phone, image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    console.log("BODY:", req.body);
console.log("FILE:", req.file);


  db.query(
    sql,
    [type_repair, type_problem, NameDevice, Urgency, description, IDAnydesk, NameUser, phone, image]
,
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
      }
      res.json({ message: 'บันทึกข้อมูลสำเร็จ' });
    }
  );
});

