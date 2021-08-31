INSERT INTO department (dept_name)
VALUES ('Accounting'), ('Engineering'), ('Marketing'), ('Sales');

INSERT INTO roles (title, salary, department_id)
VALUES ('Accountant', 100000, 1), ('Engineer', 150000, 2), ('Manager', 200000, 3), ('Salesman', 75000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 1, NULL), ('Jane', 'Doe', 2, NULL), ('Bob', 'Smith', 3, NULL), ('Sally', 'Smith', 4, NULL);