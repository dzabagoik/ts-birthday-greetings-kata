import fs from 'fs'
import path from 'path'
import { Employee } from './Employee'

export interface EmployeeRepository {
    getEmployees: () => Employee[]
}

export const FsEmployeeRepository: EmployeeRepository = {
    getEmployees: () => {
        const employeesData = fs.readFileSync(path.resolve(__dirname, `../resources/employee_data.txt`), 'UTF-8')
        const lines = employeesData.split(/\r?\n/)
        lines.shift()
        const employees: Employee[] = lines.map(line =>{
            const employeeData =  line.split(', ')
            return new Employee(employeeData[1], employeeData[0], employeeData[2], employeeData[3])
        })
        return employees
    }
}