const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

// ASCII Art from text
const figlet = require('figlet');

// console log custom
const chalk = require('chalk');

require('dotenv').config()

// ASCII Art from text
figlet('EMPLOYEE TRACKER', function (err, data) {
  if (err) {
    console.log(chalk.rgb(123, 45, 67).underline('Something went wrong...'));
    console.dir(err);
    return;
  }
  console.log(data)
});

// connection to database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.DB_PASSWORD,
  database: 'employee_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log(chalk.blue.underline.bold("You are now connected to the employee database"));
  employeeMenu();
});

// employee menu
const employeeMenu = () => {
  inquirer.prompt({
      message: 'What would you like to do today?',
      name: 'menu',
      type: 'list',
      choices: [
        'View all Employees',
        'Add Employee',
        'Update Employee Role',
        'View All Roles',
        'Add Role',
        'View All Departments',
        'Add Department',
        'Exit',
      ],
    })
    .then(response => {
      switch (response.menu) {
        case 'View all Employees':
          viewAllEmployees();
          break;
        case 'Add Employee':
          addEmployee();
          break;
        case 'Update Employee Role':
          updateER();
          break;
        case 'View All Roles':
          viewAllRoles();
          break;
        case 'Add Role':
          addRole();
          break;
        case 'View All Departments':
          viewDepartments();
          break;
        case 'Add Department':
          addDepartment();
          break;
        case "Exit":
          connection.end();
          break;
        default:
          connection.end();
      }
    });
};

// view all employees
const viewAllEmployees = () => {
  connection.query(
    'SELECT employee.id, first_name, last_name, title, salary, dept_name, manager_id FROM ((department JOIN roles ON department.id = roles.department_id) JOIN employee ON roles.id = employee.role_id);',
    function (err, res) {
      if (err) throw err;
      console.table(res);
      employeeMenu();
    }
  );
};

// add employee
const addEmployee = () => {
  inquirer.prompt([{
        name: 'firstName',
        type: 'input',
        message: "What is the employee's first name?",
      },
      {
        name: 'lastName',
        type: 'input',
        message: "What is the employee's last name?",
      },
      {
        name: 'roleId',
        type: 'input',
        message: "What is the employee's role id?",
      },
      {
        name: 'managerId',
        type: 'input',
        message: 'What is the manager Id?',
      },
    ])
    .then(answer => {
      connection.query(
        'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
        [answer.firstName, answer.lastName, answer.roleId, answer.managerId],
        function (err, res) {
          if (err) throw err;
          console.log(chalk.blue.bgRed.bold('Employee added!'));
          employeeMenu();
        }
      );
    });
};

// update employee role
const updateER = () => {
  inquirer.prompt([{
        name: 'id',
        type: 'input',
        message: 'Enter employee id',
      },
      {
        name: 'roleId',
        type: 'input',
        message: 'Enter new role id',
      },
    ])
    .then(answer => {
      connection.query(
        'UPDATE employee SET role_id=? WHERE id=?',
        [answer.roleId, answer.id],
        function (err, res) {
          if (err) throw err;
          console.log(chalk.blue.bgRed.bold('Employee updated!'));
          employeeMenu();
        }
      );
    });
};

// view roles
const viewAllRoles = () => {
  connection.query('SELECT * FROM roles', function (err, res) {
    if (err) throw err;
    console.table(res);
    employeeMenu();
  });
};

// add role
const addRole = () => {
  inquirer.prompt([{
        name: 'titleRole',
        type: 'input',
        message: 'What is the role title?',
      },
      {
        name: 'salary',
        type: 'input',
        message: 'What is the salary for this role?',
      },
      {
        name: 'deptId',
        type: 'input',
        message: 'What is the department ID number?',
      },
    ])
    .then(answer => {
      connection.query(
        'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)',
        [answer.titleRole, answer.salary, answer.deptId],
        function (err, res) {
          if (err) throw err;
          console.log(chalk.blue.bgRed.bold('Role added!'));
          employeeMenu();
        }
      );
    });
};

// view departments
const viewDepartments = () => {
  connection.query('SELECT * FROM department', function (err, res) {
    if (err) throw err;
    console.table(res);
    employeeMenu();
  });
};

// add department
const addDepartment = () => {
  inquirer.prompt([{
      name: 'department',
      type: 'input',
      message: 'What is the department name?',
    }, ])
    .then(answer => {
      connection.query(
        'INSERT INTO department (dept_name) VALUES (?)',
        [answer.department],
        function (err, res) {
          if (err) throw err;
          console.log(chalk.blue.bgRed.bold('Department added!'));
          employeeMenu();
        }
      );
    });
};

