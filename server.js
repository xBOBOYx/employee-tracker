const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const figlet = require('figlet');
const chalk = require('chalk');

require('dotenv').config()

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
            addAD();
            break;
          case 'Add Department':
            addDepartmen();
            break;
          case "Exit":
            connection.end();
            break;
          default:
            connection.end();
        }
      });
  };

const viewAllEmployees = () => {
  connection.query(
    'SELECT employee.id, first_name, last_name, title, salary, dept_name, manager_id FROM ((department JOIN roles ON department.id = roles.department_id) JOIN employee ON roles.id = employee.role_id);',
    function(err, res) {
      if (err) throw err;
      console.table(res);
      employeeMenu();
    }
  );
};


figlet('EMPLOYEE TRACKER', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
});