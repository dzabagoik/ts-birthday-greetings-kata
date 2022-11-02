import nodemailer from 'nodemailer'
import { Employee } from './Employee'
import { OurDate } from './OurDate'
import Mail from 'nodemailer/lib/mailer'
import SMTPTransport from 'nodemailer/lib/smtp-transport'
import { FileSystemEmployeeRepository } from './EmployeeRepository'

export class BirthdayService {
    sendGreetings(ourDate: OurDate, smtpHost: string, smtpPort: number) {
        const employees : Employee[] = FileSystemEmployeeRepository.getEmployees()
        const employeesBirthday : Employee[] = this.getEmployeesBirthday(employees,ourDate)
        this.sendHappyBirthdayEmail(employeesBirthday,smtpHost,smtpPort)   
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