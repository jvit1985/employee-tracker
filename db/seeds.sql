INSERT INTO departments (id, name)
VALUES
    (1, Legal),
    (2, Sales),
    (3, Engineering),
    (4, Finance);

INSERT INTO roles (id, title, salary, department_id)
VALUES
    (1, "Sales Manager", 120000, 2),
    (2, "Salesperson", 80000, 2),
    (3, "Lead Engineer", 150000, 3),
    (4, "Software Engineer", 120000, 3),
    (5, "Account Manager", 160000, 4),
    (6, "Accountant", 125000, 4),
    (7, "Legal Team Lead", 250000, 1),
    (8, "Lawyer", 190000, 1);

INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES
    (1, "John", "Doe", 1, null),
    (2, "James", "Moore", 2, 1),
    (3, "")