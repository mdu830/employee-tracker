const mysql = require("mysql");
const inquirer = require("inquirer");
// const { start } = require("repl");


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
            choices: ['View All Employees', 'View All Employees By Department', 'View All Employees By Manager', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'Add Role', 'Remove Role', 'View All Roles'],
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
            case 'View All Roles':
                viewAllRoles();
                break
            
        }
    })
};

function viewEmployees() {
    const query = "select employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, concat(manager.first_name, ' ', manager.last_name) as manager from employee left join role on employee.role_id = role.id left join department on role.department_id = department.id left join employee manager on manager.id = employee.manager_id;";

    db.query(query, (err, data) => {
        if(err) throw err;

        console.table(data);
        start();
    });
};

function viewEmployeesByDep() {
    const query = "select * from employee";

    db.query(query, (err, data) => {
        if(err) throw err;

        console.table(data);
        start();
    });
}

function viewEmpByManager() {

}

function addEmployee() {

}

function removeEmployee() {

}

function updateEmpRole() {

}

function updateEmpManager() {

}

function addRole() {

}

function removeRole() {

}

function viewAllRoles() {

}

start();
