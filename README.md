# Yifan's Captone Project

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 14.1.3.

[PrimeNG](https://www.primefaces.org/primeng/setup) components are widely used in this project.

It is the Capstone project built at the end out the Angular Academy course provided by J.B.Hunt and Pluralsight.

The theme of the projecrt is Animal Adoption, it has Shelters as Organizations, Animal Types as Groups, and Animals as Members.

The main functionality of the project includes but not limited to, Nav bar navigation, CRUD on Animal Types, CRUD on Animals, search for Animal Types, some form validation is implement, as well as toast messages on different senarios.

Logic checks are implemented, for example, cannot add new Animal to a Animal Type if that Animal Type is at full capacity, cannot delete Animal Type if there're still animals within that Animal Type, and cannot update capacity to a lower number than existing Animal numbers of that type.

## Development server

### Server

Prior of running the project, go to client folder and run `npm i` then `npm start` to bring up the server.js to act as a backend server.

### Client

After server is up, go to server folder and run `npm i` then `npm start` to start the application. Navigate to `http://localhost:5500/`. The app will automatically reload if you change any of the source files.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
