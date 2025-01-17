import {Role} from '../enum/Role';

export class User {

    email: string;

    password: string;

    token: string;

    name: string;

    role: string;

    constructor() {
        this.role = Role.Customer;
    }
}
