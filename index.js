require('dotenv').config();
const mysql = require('mysql');
const inquirer = require('inquirer');

  // create the connection information for the sql database
  const connection = mysql.createConnection({
    host: 'localhost',
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: process.env.DB_USER,
  
    // Your password
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const readEmployees = () => {
    connection.query('SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id', (err, res) => {
      if (err) throw err;
  
      // Log all results of the SELECT statement
      console.log(res);
      inquirerMenu(); 
    })
  };

  const readEmployeesByDepartment = () => {
    inquirer.prompt([
      {
            type: 'input',
            message: 'enter id of department: ',
            name: 'id',
          },
  ]).then((response) => {
    connection.query(`SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id WHERE department_id =${response.id}`, (err, res) => {
      //WHERE department_id =${id}
      if (err) throw err;
  
      // Log all results of the SELECT statement
      console.log(res);
      inquirerMenu(); 
    })
}
)
};

const readEmployeesByManager = () => {
  inquirer.prompt([
    {
          type: 'input',
          message: 'enter id of Manager: ',
          name: 'id',
        },
]).then((response) => {
  connection.query(`SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id WHERE manager_id =${response.id}`, (err, res) => {
    //WHERE department_id =${id}
    if (err) throw err;

    // Log all results of the SELECT statement
    console.log(res);
    inquirerMenu(); 
  })
}
)
};

const addEmployee = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'First Name: ',
            name: 'fname',
        },
        {
            type: 'input',
            message: 'Last Name: ',
            name: 'lname',
        },
        {
            type: 'number',
            message: 'Manager ID: ',
            name: 'managerid',
        },
        {
            type: 'number',
            message: 'Role ID: ',
            name: 'roleid',
        },
    ]).then((response) => {
        
        connection.query(`INSERT INTO employee (first_name, last_name, manager_id, role_id) VALUES ("${response.fname}", "${response.lname}", ${response.managerid}, ${response.roleid})`, (err, res) => {
            if (err) throw err;

            // Log all results of the SELECT statement
            //console.log(res);
            inquirerMenu(); 
          });
    }
    )
  }

  const updateEmployee = () => {
    let employee;
    inquirer.prompt([
      {
            type: 'input',
            message: 'enter id of employee to update: ',
            name: 'id',
          },
  ]).then( (response) => {
      employee = response.id;
    inquirer.prompt([
        {
            type: 'number',
            message: 'Manager ID: ',
            name: 'managerid',
        },
        {
            type: 'number',
            message: 'Role ID: ',
            name: 'roleid',
        },
    ]).then((response) => {
        
        connection.query(`UPDATE employee SET manager_id= ${response.managerid}, role_id=${response.roleid} WHERE id=${employee}`, (err, res) => {
            if (err) throw err;
        
            // Log all results of the SELECT statement
            //console.log(res);
            inquirerMenu(); 
            // connection.end();
          }); 
    }
    )
  })

}



  const readDepartments = () => {
    connection.query('SELECT * FROM department', (err, res) => {
      if (err) throw err;
  
      // Log all results of the SELECT statement
      console.log(res);
      inquirerMenu(); 
      // connection.end();
    });
  };

  const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Deparment Name: ',
            name: 'name',
        },

    ]).then((response) => {
        
        connection.query(`INSERT INTO department (name) VALUES ("${response.name}")`, (err, res) => {
            if (err) throw err;
        
            // Log all results of the SELECT statement
            //console.log(res);
            inquirerMenu(); 
            // connection.end();
          }); 
    }
    ); 
  }

  const readRoles = () => {
    connection.query('SELECT * FROM role', (err, res) => {
      if (err) throw err;
  
      // Log all results of the SELECT statement
      console.log(res);
      inquirerMenu(); 
      // connection.end();
    });
  };

  const addRole = () => {
    inquirer.prompt([
        {
            type: 'input',
            message: 'Title: ',
            name: 'title',
        },
        {
            type: 'number',
            message: 'Salary: ',
            name: 'salary',
        },
        {
            type: 'number',
            message: 'Department ID: ',
            name: 'departmentid',
        },
    ]).then((response) => {
        
        connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${response.title}", "${response.salary}", ${response.departmentid})`, (err, res) => {
            if (err) throw err;
        
            // Log all results of the SELECT statement
            //console.log(res);
            inquirerMenu(); 
            // connection.end();
          }); 
    }
    ); 
  }

  

  function inquirerMenu(){
    var menuOptions = ["View all employees", "View all employees by department", "View all departments", "View all roles", "Add employee", "Add department", "Add role", "Update Employee", "Quit"];
    var quit = 0;
    inquirer.prompt([
        {
            type: 'list',
              message: 'what would you like to do: ',
              name: 'menu',
              choices:["View all employees", "View all employees by manager" ,"View all employees by department", "View all departments", "View all roles", "Add employee", "Add department", "Add role", "Update Employee", "Quit"]
            },
    ]).then( async (response) => {
        const choice = response.menu;
        let cont = -1;
        if(choice === "View all employees"){
            await readEmployees();
      
        }else if(choice === "View all departments"){
          await readDepartments();
          //cont = 1;
        }else if(choice === "View all employees by manager"){
          await readEmployeesByManager();
          //cont = 1;
        }else if(choice === "View all employees by department"){
            await readEmployeesByDepartment();
            //cont = 1;
        }else if(choice === "View all roles"){
            readRoles();
            //cont = 1;
        }else if(choice === "Add employee"){
            addEmployee();
            //cont = 1;
        }else if(choice === "Add department"){
            addDepartment();
            //cont = 1;
        }else if(choice === "Add role"){
            addRole();
            //cont = 1;
        }else if(choice === "Update Employee"){
            updateEmployee();
            //cont = 1;
        }
        else if(choice === "Quit"){
            quit = 1;
            console.log("bye now");
            connection.end();
        }

        // if(cont === 1){
          //  inquirerMenu();
        // }
    }
    )
  }

  

  connection.connect((err) => {
    if (err) throw err;
    console.log(`connected as id ${connection.threadId}\n`);
    inquirerMenu();
  });