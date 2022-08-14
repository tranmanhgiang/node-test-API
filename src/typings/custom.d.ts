/* eslint-disable */
// Twilio brought @types/express meaning that all reqs are typed with Request class
declare namespace Express {
    interface User {
        id: string;
        userRole: 'User' | 'Admin';
    }
    export interface Request {
        user?: User;
    }
}
