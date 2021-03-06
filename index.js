const mysql = require("mysql");
const inquirer = require("inquirer");
const {printTable} = require("console-table-printer");
const figlet = require("figlet");

// mysql database 
const db = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "12345678",
    database: "employees"
});


figlet('Employee Tracker', function(err, data) {
    if (err) {
        console.log('Something went wrong...');
        console.dir(err);
        return;
    }
    console.log(data)
    start();
});


function start() {
    
    // inquirer prompts
    const question = [ 
        {
            type: "list",
            message: "What would you like to do?",
            choices: ['View All Employees', 'Add Employee', 'Remove Employee', 'Update Employee Role', 'Update Employee Manager', 'View All Departments', 'Add Department', 'View All Roles', 'Add Role', 'Remove Role', 'View Employees by Manager', 'Exit'],
            name: "mainMenu"
        }
    ];
 
    inquirer.prompt(question).then(answer => {

        switch(answer.mainMenu) {
            case 'View All Employees':
                viewEmployees();
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
            case 'View All Departments':
                viewAlldepartments();
                break
            case 'Add Department':
                addDepartment();
                break
            case 'View All Roles':
                viewAllRoles();
                break
            case 'Add Role':
                addRole();
                break
            case 'Remove Role':
                removeRole();
                break
            case 'View Employees by Manager':
                viewEmpByManager();
                break
            case 'Exit':
                return
                break
            // case 'View All Employees By Manager':
            //     viewEmpByManager();
            //     break; 
        }
    })
};
// functions
function viewEmployees() {
    const query = `select employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, concat(manager.first_name, ' ', manager.last_name) as manager from employee left join role on employee.role_id = role.id left join department on role.department_id = department.id left join employee manager on manager.id = employee.manager_id;`;

    db.query(query, (err, data) => {
        if(err) throw err;

        printTable(data);
        start();
    });
};

const viewAllRoles = () => {
    const query = `SELECT role.title, role.salary, role.department_id AS 'department' FROM employees.role;`;

    db.query(query, (err, data) => {
        if(err) throw err;

        printTable(data);
        start();
    });
};

const viewAlldepartments = () => {
    const query = `SELECT * FROM employees.department;`

    db.query(query, (err, data) => {
        if(err) throw err;

        printTable(data);
        start();
    });
};

const addEmployee = () => {
    const roleQuery = `SELECT id, title FROM employees.role;`


    db.query(roleQuery, (err, roleData) => {
        if(err) throw err;

        const managerQuery = `select employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, employee.manager_id, concat(manager.first_name, ' ', manager.last_name) as manager from employee left join role on employee.role_id = role.id left join department on role.department_id = department.id left join employee manager on manager.id = employee.manager_id WHERE employee.manager_id IS NOT NULL`

        db.query(managerQuery, (err, managerData) => {
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
                },
                {
                    name: 'role',
                    type: 'list',
                    message: 'What role do you want for this employee?',
                    choices: () => {
                        let choiceArray = roleData.map(choices => {
                            return {
                                name: choices.title,
                                 value: choices.id
                            }});
                            return choiceArray
                            
                    }
                },
                {
                    name: 'manager',
                    type: 'list',
                    message: 'Who is the manager of this employee?',
                    choices: () => {
                        let choiceArray = managerData.map(choices => {
                            return {
                                name: choices.manager,
                                value: choices.manager_id
                            }});
                        return choiceArray;
                    }
                }
            ]).then((answer) =>{
                // console.log(answer.role, answer.manager)
           const statement = db.query(
                    `INSERT INTO employees.employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)`,[answer.firstName, answer.lastName, answer.role, answer.manager], (err, data) => {
                        console.log("employee added!")
                        start()
                    }
                )
                // console.log(statement.sql);
            })
     

        });
    
       
    })

  
};

const addDepartment = () => {
    const departmentQuery = `SELECT name, id FROM employees.department`

    db.query(departmentQuery, (err, depData) => {
        if(err) throw err;

        inquirer.prompt([
            {
                name: 'newDep',
                type: 'input',
                message: 'Please enter the name of the new department'
            }
        ]).then((answer) => {
            const statement = db.query(
                `INSERT INTO employees.department(name) VALUES(?)`,[answer.newDep], (err, data) => {
                    console.log("department added!")
                    start()
                }
            )
        })
    })

}

const updateEmpRole = () => {
    const employeeQuery = `SELECT id, concat(first_name, " ", last_name) as full_name FROM employees.employee`

    const roleQuery = `SELECT id, title FROM employees.role;`

    db.query(employeeQuery, (err, empData) => {
        if(err) throw err;

        db.query(roleQuery, (err, roleData) => {
            if(err) throw err;

            inquirer.prompt([
                {
                    name: 'whichEmp',
                    type: 'list',
                    message: 'choose an employee to update their role',
                    choices: () => {
                        let choiceArray = empData.map(choices => {
                            return {
                                name: choices.full_name,
                                value: choices.id
                            }});
                            return choiceArray
                            
                    }
                },
                {
                    name: 'whichRole',
                    type: 'list',
                    message: 'Choose which role you would like to set for the employee',
                    choices: () => {
                        let choiceArray = roleData.map(choices => {
                            return {
                                name: choices.title,
                                value: choices.id
                            }});
                            return choiceArray
                            
                    }
                    
                }
            ]).then((answer) => {
                const statement = db.query(
                    `UPDATE employee SET role_id = ${answer.whichRole} WHERE id = ${answer.whichEmp};`, (err, data) => {
                        console.log("employee role changed!")
                        start()
                    }
                )
            })
        });
    })


};

const addRole = () => {

    const departmentQuery = `SELECT name, id FROM employees.department`

    db.query(departmentQuery, (err, depData) => {
        if(err) throw err;
        inquirer.prompt([
            {
                name: 'whatRole',
                type: 'input',
                message: 'What is the name for the new role?'
            },
            {
                name: 'whatSalary',
                type: 'input',
                message: 'What do you want to salary to be for this role?'
            },
            {
                name: 'whatDep',
                type: 'list',
                message: 'Which department will this role fall under?',
                choices: () => {
                    let choiceArray = depData.map(choices => {
                        return {
                            name: choices.name,
                            value: choices.id
                        }});
                    return choiceArray;
                }
            }
        ]).then((answer) =>{
            console.log(answer.whatRole, answer.whatSalary, answer.whatDep)
            const statement = db.query(
                `INSERT INTO employees.role(title, salary, department_id) VALUES(?, ?, ?)`,[answer.whatRole, answer.whatSalary, answer.whatDep], (err, data) => {
                    console.log("Role added!")
                    start();
                }
            )
            // console.log(statement)
        })
        
    });
};

const viewEmpByManager = () => {
    const query = `select employee.id, employee.first_name, employee.last_name, role.title, department.name as department, employee.manager_id, concat(manager.first_name, ' ', manager.last_name) as manager from employee left join role on employee.role_id = role.id left join department on role.department_id = department.id left join employee manager on manager.id = employee.manager_id WHERE employee.manager_id IS NOT NULL`

    db.query(query, (err, data) => {
        if(err) throw err;

        printTable(data);
        start();
    });
}

// const removeEmployee = () => {

// }

// const updateEmpManager = () => {

// }

// const removeRole = () => {

// }

// figlet();
// start();

