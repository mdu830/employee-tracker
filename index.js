const mysql = require("mysql");
const inquirer = require("inquirer");

// mysql database 
const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "12345678",
    database: "employees"
});

function start() {
    // inquirer prompts
    const questions = [ 
        {
            type: "list",
            message: "What would you like to do?",
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'Add Role', 'Remove Role', 'Add Department', 'View All Roles', 'View All Departments'],
            name: "mainMenu"
        }
    ];
 
    inquirer.prompt(questions).then(answer => {
        switch(answer.mainMenu) {
            case 'View All Employees':
                viewEmployees();
                break;
            case 'View All Employees By Department':
                viewEmployeesByDep();
                break;
            case 'View All Employees By Manager':
                viewEmpByManager();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Remove Employee':
                removeEmployee();
                break
            case 'Update Employee Role':
                updateEmpRole();
                break
            case 'Update Employee Manager':
                updateEmpManager();
                break
            case 'Add Role':
                addRole();
                break
            case 'Remove Role':
                removeRole();
                break
            case 'Add Department':
                addDepartment();
                break
            case 'View All Roles':
                viewAllRoles();
                break
            case 'View All Departments':
                viewAlldepartments();
                break
        }
    })
};
// functions
function viewEmployees() {
    const query = "select employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, concat(manager.first_name, ' ', manager.last_name) as manager from employee left join role on employee.role_id = role.id left join department on role.department_id = department.id left join employee manager on manager.id = employee.manager_id;";

    db.query(query, (err, data) => {
        if(err) throw err;

        console.table(data);
        start();
    });
};

const viewAllRoles = () => {
    const query = "SELECT role.title, role.salary, role.department_id AS 'department' FROM employees.role; ";

    db.query(query, (err, data) => {
        if(err) throw err;

        console.table(data);
        start();
    });
};

const viewAlldepartments = () => {
    const query = "SELECT * FROM employees.department;";

    db.query(query, (err, data) => {
        if(err) throw err;

        console.table(data);
        start();
    });
};

const addEmployee = () => {
    const query = 'SELECT * FROM employees.employee;';

    db.query(query, (err, data) => {
        if(err) throw err;

        inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'Please enter the new employees first name'

            },
            {
                name: 'lastName',
                type: 'input',
                message: 'Please enter the new employees last name'
            }
        ]).then((answer) => {

            const query = 'SELECT * FROM role'
            // select all records from role and use all records to prompt from role choice

            inquirer.prompt([
                {
                    name: 'role',
                    type: 'list',
                    message: 'What role do you want for this employee?',
                    choices: [{name: 'Sales Lead', id: 1}, {name: 'Sales Person', id: 2}, {name: 'Lead Engineer', id: 3}, {name: 'Software Engineer', id: 4}, {name: 'Account Manager', id: 5}, {name: 'Accountant', id: 6}, {name:'Legal Team Lead', id: 7}, {name: 'Lawyer', id: 8}]
                }
            ]).then((answer) => {

                const query = 'SELECT * FROM employees.employee; SELECT first_name, last_name, role_id, manager_id FROM employees.employee WHERE manager_id IS NOT NULL'

                inquirer.prompt([
                    {
                        name: 'manager',
                        type: 'list',
                        message: 'Who is the manager of this employee?',
                        choices: [{name: 'Mike Chan', id: 1}, {name: 'Kevin Tupik', id: 3}, {name: 'Malia Brown', id: 5}, {name: 'Tom Allen', id: 7}]
                    }
                ])
            })
            // console.table(data);
            // start();
        });
        // .then get all employees 
        // make an inquirer choice displaying first name and last name and a value of employee id to select manager 
    });
};

const addDepartment = () => {

}

const updateEmpRole = () => {

};

const addRole = () => {

};




// const viewEmployeesByDep = () => {
//     const query = "select * from employee";

//     db.query(query, (err, data) => {
//         if(err) throw err;

//         console.table(data);
//         start();
//     });
// }

// const viewEmpByManager = () => {
//     const query = 

//     db.query(query, (err, data) => {
//         if(err) throw err;

//         console.table(data);
//         start();
//     });
// }

// const removeEmployee = () => {

// }

// const updateEmpManager = () => {

// }

// const removeRole = () => {

// }

start();
