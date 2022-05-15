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
    const sql = `SELECT role.id AS Id, role.title AS Title, department.name AS Department
    FROM role
    INNER JOIN department ON role.department_id = department.id`;

    connection.query(sql, (err, rows) => {
        if (err) throw (err);
        console.table(rows);
        mainMenu();
    });
};

function viewAllEmployees() {
    const sql = `SELECT employee.id AS ID, employee.first_name AS FirstName, employee.last_name AS LastName, role.title AS Title, department.name AS Department, role.salary AS Salary, CONCAT (manager.first_name, " ", manager.last_name) AS Manager
    FROM employee
        LEFT JOIN role on employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee manager ON employee.manager_id = manager.id`;
    
    connection.query(sql, (err, rows) => {
        if (err) throw (err);
        console.table(rows);
        mainMenu();
    });
};

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'dept',
            message: 'What is the name of the department you want to add?'
        }
    ])
    .then(answer => {
        const sql = `INSERT INTO department (name)
                    VALUES (?)`;
        
        connection.query(sql, answer.dept, (err, res) => {
            if (err) throw (err);
            console.log("Added " + answer.dept + " to departments table.");
            viewAllDepartments();
        });
    });
};

// function addRole() {

// };

// function addEmployee() {

// };

// function updateEmployee() {

// };
