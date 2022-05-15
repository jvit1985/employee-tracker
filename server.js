const inquirer = require("inquirer");
const express = require('express');
const mysql = require('mysql2');
const cTable = require('console.table');
const PORT = process.env.PORT || 3001;
const app = express();

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Justinis#1!',
    database: 'employee_db'
});

connection.connect(err => {
    if (err) throw (err);
    console.log('Database connected.');
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        mainMenu();
    });
});

function mainMenu () {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'selection',
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
    ]).then(function(answer) {
        switch (answer.choice) {
            case 'View All Departments':
                viewAllDepartments();
                break;
            case 'View All Roles':
                viewAllRoles();
                break;
            case 'View All Employees':
                viewAllEmployees();
                break;
            case 'Add a Department':
                addDepartment();
                break;
            case 'Add a Role':
                addRole();
                break;
            case 'Add an Employee':
                addEmployee();
                break;
            case 'Update an Employee Role':
                updateEmployee();
                break;
            case 'Quit':
                connection.end();
                console.log('Goodbye');
                break;
        }
    });
};

function viewAllDepartments() {
    connection.query(`SELECT * FROM department;`, 
    function(err, res) {
        if (err) throw (err)
        console.table(res);
        mainMenu();
    });
};

function viewAllRoles() {
    connection.query(`SELECT * FROM role, department.name AS name FROM department LEFT JOIN department ON role.department_id = department.id;`,
    function(err, res) {
        if (err) throw (err)
        console.table(res);
        mainMenu();
    });
};

function viewAllEmployees() {
    connection.query(`SELECT * FROM employee, role.title, role.salary FROM role JOIN role on employee.role_id = role.id, department.name FROM department JOIN department ON roles.department_id = department.id, CONCAT(e.first_name, " " ,e.last_name) AS manager FROM employee LEFT JOIN employee e on employee.manager_id = e.id;`,
    function(err, res) {
        if (err) throw (err)
        console.table(res);
        mainMenu();
    });
};

// function addDepartment() {
    
// };

// function addRole() {

// };

// function addEmployee() {

// };

// function updateEmployee() {

// };
