use employees;

insert into department(name) values
("Sales"),
("Engineering"),
("Finance"),
("Legal");

insert into role(title, salary, department_id) values 
("Sales Lead", 100000.00, 1),
("Salesperson", 80000.00, 1),
("Lead Engineer", 150000.00, 2),
("Softare Engineer", 120000.00, 2),
("Accountant", 125000.00, 3),
("Legal Team Lead", 250000.00, 4),
("Lawyer", 190000.00, 4);

insert into employee(first_name, last_name, role_id) values
("John", "Doe", 1),
("Mike", "Chan", 2),
("Ashley", "Rodriguez", 3),
("Kevin", "Tupil", 4),
("Malia", "Brown", 5),
("Sarah", "Lourd", 6),
("Tom", "Allen", 7);

  update employee set manager_id =3 where id=1;
  update employee set manager_id =1 where id=3;