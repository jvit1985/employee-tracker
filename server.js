const inquirer = require("inquirer");
const mysql = require('mysql2');
const cTable = require('console.table');


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Justinis#1!',
    database: 'employee_db'
});

connection.connect(err => {
    if (err) throw (err);
    console.log('Database connected.');
        mainMenu();
});

const mainMenu = () => {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'choice',
            choices: [
                'View All Departments',
                'View All Roles',
                'View All Employees',
                'Add a Department',
                'Add a Role',
                'Add an Employee',
                'Update an Employee Role',
                'Quit'
            ]
        }
    ])
    .then((answers) => {
        const { choice } = answers;

        if (choice === 'View All Departments') {
            viewAllDepartments();
        }
        if (choice === 'View All Roles') {
            viewAllRoles();
        }
        if (choice === 'View All Employees') {
            viewAllEmployees();
        }
        if (choice === 'Add a Department') {
            addDepartment();
        }
        if (choice === 'Add a Role') {
            addRole();
        }
        if (choice === 'Add an Employee') {
            addEmployee();
        }
        if (choice === 'Update an Employee Role') {
            updateEmployee();
        }
        if (choice === 'Quit') {
            console.log('Goodbye');
            connection.end()
        };
    });
};

viewAllDepartments = () => {
    const sql = `SELECT department.id AS Id, department.name AS Department FROM department`;

    connection.query(sql, (err, rows) => {
        if (err) throw (err);
        console.table(rows);
        mainMenu();
    });
};

viewAllRoles = () => {
    const sql = `SELECT role.id, role.title, department.name AS Department
    FROM role
    INNER JOIN department ON role.department_id = department.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw (err);
        console.table(rows);
        mainMenu();
    });
};

// function viewAllEmployees() {

// };

// function addDepartment() {
    
// };

// function addRole() {

// };

// function addEmployee() {

// };

// function updateEmployee() {

// };
