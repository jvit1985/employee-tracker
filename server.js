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

function addRole() {
    inquirer.prompt ([
        {
            type: 'input',
            name: 'title',
            message: 'What is the title of the role?'
        },
        {
            type: 'input',
            name: 'salary',
            message: 'What is the salary for this role?'
        }
    ])
    .then(answers => {
       const params = [answers.title, answers.salary];

       const getDept = `SELECT name, id FROM department`;

       connection.query(getDept, (err, data) => {
           if (err) throw (err);
           const depart = data.map(({ name, id }) => ({ name: name, value: id }));

           inquirer.prompt([
               {
                   type: 'list',
                   name: 'depart',
                   message: 'Which department is this role under?',
                   choices: depart
               }
           ])
           .then(departmentChoice => {
               const depart = departmentChoice.depart;
               params.push(depart);

               const sql = `INSERT INTO role (title, salary, department_id)
                            VALUES (?,?,?)`;

                connection.query(sql, params, (err, res) => {
                    if (err) throw (err);
                    console.log('Added ' + answers.title + " to roles.");
                    viewAllRoles();
                });
           });
       });
    });
};

function addEmployee() {
        inquirer.prompt ([
            {
                type: 'input',
                name: 'firstName',
                message: "What is the employee's first name?"
            },
            {
                type: 'input',
                name: 'lastName',
                message: "What is the employee's last name?"
            }
        ])
        .then(answers => {
           const params = [answers.firstName, answers.lastName];
    
           const getRole = `SELECT role.id, role.title FROM role`;
    
           connection.query(getRole, (err, data) => {
               if (err) throw (err);
               const role = data.map(({ id, title }) => ({ name: title, value: id }));
    
               inquirer.prompt([
                   {
                       type: 'list',
                       name: 'role',
                       message: "What is this employee's role?",
                       choices: role
                   }
               ])
               .then(roleChoice => {
                   const role = roleChoice.role;
                   params.push(role);
    
                   const managerSql = `SELECT * FROM employee`;

                   connection.query(managerSql, (err, data) => {
                        if (err) throw (err);
                        const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

                        inquirer.prompt([
                            {
                                type: 'list',
                                name: 'manager',
                                message: "Who is the employee's manager?",
                                choices: managers
                            }
                        ])
                        .then(managerChoice => {
                            const manager = managerChoice.manager;
                            params.push(manager);

                            const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                        VALUES (?,?,?,?)`;

                            connection.query(sql, params, (err, res) => {
                                if (err) throw (err);
                                console.log('Employee has been added to database.')
                                viewAllEmployees();
                            });
                        });
               });
           });
        });
    });
};

function updateEmployee() {
    const employeeSql = `SELECT * FROM employee`;

    connection.query(employeeSql, (err, data) => {
        if (err) throw (err);
        const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " "+ last_name, value: id }));

        inquirer.prompt([
            {
                type: 'list',
                name: 'empName',
                message: 'Which employee would you like to update?',
                choices: employees
            }
        ])
        .then(empChoice => {
            const employee = empChoice.empName;
            const params = [];
            params.push(employee);

            const roleSql = `SELECT * FROM role`;

            connection.query(roleSql, (err, data) => {
                if (err) throw (err);
                const roles = data.map(({ id, title }) => ({ name: title, value: id }));
                inquirer.prompt([
                    {
                        type: 'list',
                        name: 'empRole',
                        message: "What is the employee's new role?",
                        choices: roles
                    }
                ])
                .then(roleChoice => {
                    const empRole = roleChoice.empRole;
                    params.push(empRole);

                    let employee = params[0]
                    params[0] = empRole
                    params[1] = employee

                    const sql = `UPDATE employee SET role_id = ? WHERE id = ?`;

                    connection.query(sql, params, (err, res) => {
                        if (err) throw (err);
                        console.log('Employee has been updated.');
                        viewAllEmployees();
                    });
                });
            });
        });
    });
};
