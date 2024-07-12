var express = require('express');
var router = express.Router();
const user = require('./users.js');
const task = require('./task.js');
const ejs = require('ejs')
var path = require('path');
const xlsx = require('xlsx');
const { JSDOM } = require('jsdom');


const validator = require('validator');

function validateEmail(email) {
  // Use validator module to validate the email
  return validator.isEmail(email);
}

/* GET home page. */
router.get('/', async function(req, res, next) {
  let users = await user.find()
  let tasks = await task.find()
  res.render('index', { title: 'Hackerkernel' ,users,tasks});
});

router.post('/create-user', async (req,res)=>{
  const email = req.body.email;
  const isValid = validateEmail(email);

  if (isValid) {
    let newUser =  await user.create(req.body);
    newUser.save()
    res.redirect('back');
  } else {
    res.send("email is not valid");
    setTimeout(() => {
      res.redirect('back');
    }, 1000);
  }
})

router.post('/create-task', async (req,res)=>{
  let newTask = await task.create(req.body);
  newTask.save()
  res.redirect('back');
})

router.post('/update-task_type/:id',async (req,res)=>{
  console.log(req.body)
  let tasks = await task.findOne({_id:req.params.id});
  tasks.task_type = req.body.task_type;
  tasks.save()
  res.redirect('back');
})


router.get('/export',async (req,res)=>{
  let users = await user.find()
  let tasks = await task.find()

  let userSheet = await ejs.renderFile(path.join(__dirname, '../views/excel_template.ejs'),{users,tasks})
  let taskSheet = await ejs.renderFile(path.join(__dirname, '../views/excel_template_task.ejs'),{tasks})

  const workbook = xlsx.utils.book_new();

  const userSheetName = 'Users';
  const userSheetData = htmlToSheetData(userSheet);
  xlsx.utils.book_append_sheet(workbook, userSheetData, userSheetName);

  const taskSheetName = 'Tasks';
  const taskSheetData = htmlToSheetData(taskSheet);
  xlsx.utils.book_append_sheet(workbook, taskSheetData, taskSheetName);

  const excelBuffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Disposition', 'attachment; filename="users_and_tasks.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

  res.send(excelBuffer);
})

function htmlToSheetData(html) {
  const dom = new JSDOM(html);
  const table = dom.window.document.querySelector('table');
  const sheetData = xlsx.utils.table_to_sheet(table);
  return sheetData;
}

module.exports = router;
