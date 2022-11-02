import fs from 'fs'
import path from 'path'
import nodemailer from 'nodemailer'
import { Employee } from './Employee'
import { OurDate } from './OurDate'
import Mail from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'

export class BirthdayService {
    sendGreetings(ourDate: OurDate, smtpHost: string, smtpPort: number) {
        const employees : Employee[] =  this.getEmployees('employee_data.txt')
        const employeesBirthday : Employee[] = this.getEmployeesBirthday(employees,ourDate)
        this.sendHappyBirthdayEmail(employeesBirthday,smtpHost,smtpPort)
        
        /*
        employeesBirthday.forEach((employee) => {
            const recipient = employee.getEmail()
            const body = 'Happy Birthday, dear %NAME%!'.replace('%NAME%',
            employee.getFirstName())
            const subject = 'Happy Birthday!'
            this.sendMessage(smtpHost, smtpPort, 'sender@here.com', subject, body, recipient)
        })
        */
    }

    async sendMessage(smtpHost: string, smtpPort: number, sender: string,
        subject: string, body: string, recipient: string) {

        const message = {
            host: smtpHost,
            port: smtpPort,
            from: sender,
            to: [recipient],
            subject,
            text: body
        }

        this.deliveryMessage(message)
    }

    // made protected for testing :-(
    protected async deliveryMessage({host, port, ...msg}: Message) {
        const transport = nodemailer.createTransport({host, port})

        await transport.sendMail(msg)
    }

    private getEmployees(fileName: string):Employee[]{
        const employeesData = fs.readFileSync(path.resolve(__dirname, `../resources/${fileName}`), 'UTF-8')
        const lines = employeesData.split(/\r?\n/)
        lines.shift()
        const employees: Employee[] = lines.map(line =>{
            const employeeData =  line.split(', ')
            return new Employee(employeeData[1], employeeData[0], employeeData[2], employeeData[3])
        })
        return employees
    }

    private getEmployeesBirthday(employees:Employee[], ourDate: OurDate):Employee[]{
        return employees.filter(employee => employee.isBirthday(ourDate))
    }

    private sendHappyBirthdayEmail(employeesBirthday:Employee[], smtpHost: string, smtpPort: number){
        employeesBirthday.forEach((employee) => {
            const recipient = employee.getEmail()
            const body = 'Happy Birthday, dear %NAME%!'.replace('%NAME%',
            employee.getFirstName())
            const subject = 'Happy Birthday!'
            this.sendMessage(smtpHost, smtpPort, 'sender@here.com', subject, body, recipient)
        })
    }
   
}

export interface Message extends SMTPTransport.Options, Mail.Options {
}