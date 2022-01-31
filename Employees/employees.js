window.onload = function (){
    employeeList.init();
    console.log("Aplication running!");
}

class Employee{
    constructor(employeeName, employeeSurname, company, id = Date.now()){
        this.Name = employeeName;
        this.Surname = employeeSurname;
        this.Company = company;
        this.id =id;
        // console.log(this.id);
    }
}
class EmployeeList{
    constructor(){
        this.employees = [];
    }
    init(){
        document.getElementById("dodajPracownika").addEventListener("click", (e) => this.saveEmployee(e));
        this.loadDataFromLocalStorage();
    }
    loadDataFromLocalStorage(){
        console.log("Loading data from local storage");
        const data = storage.getItems();
        if (data == null || data == undefined) return;
        this.employees = data;
        console.log(data);
        data.forEach((employee, index) => {
            ui.addEmployeeToTable(employee);
        });
    }
    saveDataToLocalStorage(){
        storage.saveItems(this.employees);

    }
    saveEmployee(data){
        console.log(data)
        const name = document.getElementById("employeeName").value;
        const surname = document.getElementById("employeeSurname").value;
        const company = document.getElementById("employeeCompanySelect").value;
        const id = document.getElementById("employeeId").value;
        console.log("Employee id:", id);
        
        if (name === "" || surname ===""){
            console.log("Requried field missing!");
            return
        }
        data.preventDefault();
        if(id.length == 0 ){
            const employee = new Employee(name, surname, company);
            this.addEmployee(employee);
        }else{
            this.updateEmployee(name,surname,company,id);
        }
        ui.updateButtonDescription("dodaj");
    }
    addEmployee(employee){
        this.employees.push(employee);
        ui.addEmployeeToTable(employee);
        this.saveDataToLocalStorage();
    }
    updateEmployee(name,surname,company,id){
        console.log("Employee udpated!")
        this.employees.forEach((employee,index) => {
            if( employee.id == id){
                employee.Name = name;
                employee.Surname = surname;
                employee.Company = company;
            }
        })
        ui.deleteAllRowsInEmployeeTable()
        console.log("Updating employee: ", id);
        this.saveDataToLocalStorage();
        this.loadDataFromLocalStorage();
        
    }
    removeEmployee(employeeId){
        console.log("Employee removed", employeeId)
        this.employees.forEach((employee,index) => {
            if(employee.id == employeeId){
                this.employees.splice(index,1);
            }
        })
        this.saveDataToLocalStorage();
    }
    editEmployee(employeeId){
        this.employees.forEach((employee,index) =>{
            if(employee.id == employeeId){
                console.log("Editing:", employeeId);
                document.getElementById("employeeName").value = employee.Name;
                document.getElementById("employeeSurname").value = employee.Surname;
                document.getElementById("employeeCompanySelect").value = employee.Company;
                document.getElementById("employeeId").value = employee.id;
            }
        })
    }

    moveEmployeeUp(employeeId){
        let tempArr = this.employees;
        for(let a=0; a < tempArr.length; a++) {
            let employee = tempArr[a];
            if(employee.id == employeeId) {
                if(a >= 1) {
                    let temp = tempArr[a-1];
                    tempArr[a-1] = tempArr[a];
                    tempArr[a] = temp;
                    break;
                }
            }
        }
        this.saveDataToLocalStorage();
        ui.deleteAllRowsInEmployeeTable();
        this.loadDataFromLocalStorage();
    }

    moveEmployeDown(employeeId){
        let tempArr = this.employees;
        for(let a=0; a < tempArr.length; a++) {
            let employee = tempArr[a];
            if(employee.id == employeeId) {
                if(a <= tempArr.length - 2) {
                    let temp = tempArr[a+1];
                    tempArr[a+1] = tempArr[a];
                    tempArr[a] = temp;
                    break;
                }
            }
        }
        this.saveDataToLocalStorage();
        ui.deleteAllRowsInEmployeeTable();
        this.loadDataFromLocalStorage();

    }
}

class Ui{
    addEmployeeToTable(employee){
        console.log("Employee Added");
        const table =document.querySelector("#employeesTable tbody");
        const rowTable = document.createElement("tr");
        
        rowTable.innerHTML = `
            <td>${employee.Name}</td>
            <td>${employee.Surname}</td>
            <td>${employee.Company}</td>
            <td>
                <button type="button" data-employee-id="${employee.id}" class="btn btn-danger delete">Remove</button>
                <button type="button" data-employee-id="${employee.id}" class="btn btn-info edit">Edit</button>
                <button type="button" data-employee-id="${employee.id}" class="btn btn-secondary up-arrow">▲</button>
                <button type="button" data-employee-id="${employee.id}" class="btn btn-secondary down-arrow">▼</button>
            </td>
        `;
        table.appendChild(rowTable);

        let deleteEmployee = document.querySelector(`button.delete[data-employee-id='${employee.id}']`);
        deleteEmployee.addEventListener("click", (e) => this.deleteEmployee(e));
        
        let editEmployee = document.querySelector(`button.edit[data-employee-id='${employee.id}']`);
        editEmployee.addEventListener("click", (e) => this.editEmployee(e));
        
        let upButton = document.querySelector(`button.up-arrow[data-employee-id='${employee.id}']`);
        upButton.addEventListener("click", (e) => this.moveUp(e));
        
        let downButton = document.querySelector(`button.down-arrow[data-employee-id='${employee.id}']`);
        downButton.addEventListener("click", (e) => this.moveDown(e));

        this.clearForm();
    }
    deleteEmployee(employee){
        const employeeId = employee.target.getAttribute("data-employee-id");
        console.log("Deleting employee in progress: ", employeeId);
        employee.target.parentElement.parentElement.remove();  
        employeeList.removeEmployee(employeeId);
    }

    deleteAllRowsInEmployeeTable(){
        const tBodyRows = document.querySelectorAll("#employeesTable tbody tr");
        tBodyRows.forEach((e)=> {
            e.remove();
        });
        
    }
    editEmployee(employee){
        
        const employeeId = employee.target.getAttribute("data-employee-id");
        console.log("Editing employee in progress: ", employeeId );
        this.updateButtonDescription("update");
        employeeList.editEmployee(employeeId);
    }

    moveUp(employee){
        const employeeId = employee.target.getAttribute("data-employee-id");
        console.log("moving Up:", employeeId);
        employeeList.moveEmployeeUp(employeeId);
    }

    moveDown(employee){
        const employeeId = employee.target.getAttribute("data-employee-id");
        console.log("moving Down:", employeeId);
        employeeList.moveEmployeDown(employeeId);
    }
    updateButtonDescription(state){
        console.log(state);
        const buttonDescription = document.getElementById("dodajPracownika");
        const cancelButton = document.getElementById("anulujAktualizacje");
        const buttonSection = document.getElementById("actionButtons");
        if(state == "update" && cancelButton == undefined){
            buttonDescription.innerHTML = "Zaktualizuj dane"
            const cancelButton = document.createElement("button");
            cancelButton.classList.add("btn");
            cancelButton.classList.add("btn-danger");
            cancelButton.setAttribute("id", "anulujAktualizacje");
            cancelButton.innerHTML = `Anuluj`;
            buttonSection.appendChild(cancelButton);
            document.getElementById("anulujAktualizacje").addEventListener("click", (e) => this.cancelUpdate(e));
        }else if(state !="update"){
            buttonDescription.innerHTML = "Dodaj pracownika"
        }
    }
    cancelUpdate(){
        const buttonSection = document.getElementById("actionButtons");
        const cancelButton = document.getElementById("anulujAktualizacje");
        buttonSection.removeChild(cancelButton);
        this.clearForm();
        this.updateButtonDescription("dodaj");
    }
    clearForm(){
        document.getElementById("employeeName").value = "";
        document.getElementById("employeeSurname").value = ""; 
        document.getElementById("employeeCompanySelect").value = ""; 
        document.getElementById("employeeId").value = ""; 
        document.getElementById("employeeForm").classList.remove("was-validated");
    }
}

const ui = new Ui();

const employeeList = new EmployeeList();

class Storage{
    getItems(){
        let employeesInStorage = null;
        if(localStorage.getItem("employees") !== null) {
            employeesInStorage = JSON.parse(localStorage.getItem("employees"));
        }else{
            employeesInStorage = [];
        }
        return employeesInStorage;
    }
    saveItems(employees){
        console.log(employees);
        localStorage.setItem("employees", JSON.stringify(employees));
    }
}
const storage = new Storage();

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () {
    'use strict'
  
    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.querySelectorAll('.needs-validation')
  
    // Loop over them and prevent submission
    Array.prototype.slice.call(forms)
      .forEach(function (form) {
        form.addEventListener('submit', function (event) {
          if (!form.checkValidity()) {
            event.preventDefault()
            event.stopPropagation()
          }
  
          form.classList.add('was-validated')
        }, false)
      })
  })()
