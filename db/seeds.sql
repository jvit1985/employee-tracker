INSERT INTO department (name)
VALUES
    ("Legal"),
    ("Sales"),
    ("Engineering"),
    ("Finance");

INSERT INTO role (title, salary, department_id)
VALUES
    ("Legal Team Lead", 250000, 1),
    ("Lawyer", 190000, 1),
    ("Sales Manager", 120000, 2),
    ("Salesperson", 80000, 2),
    ("Lead Engineer", 150000, 3),
    ("Software Engineer", 120000, 3),
    ("Account Manager", 160000, 4),
    ("Accountant", 125000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
    ("John", "Doe", 1, null),
    ("James", "Moore", 2, 1),
    ("Brian", "Jones", 3, null),
    ("Sarah", "Combs", 4, 2),
    ("Kevin", "Johnson", 5, null),
    ("Lisa", "Williams", 6, 3),
    ("Kimberly", "Wexler", 7, null),
    ("Howard", "Jefferson", 8, 4);