import { User } from "./user";

export class UserParams {
    pageNumber = 1;
    pageSize =  5;
    gender: string;
    minAge = 18;
    maxAge = 99;
    orderBy = 'lastActive';
    predicate = 'liked';

    constructor(user: User) {
        this.gender = user.gender === 'female' ? 'male' : 'female';
    }
}