import { Injectable } from "@angular/core";
import { ApiService } from "./api.service";
import { map } from "rxjs/operators";

@Injectable({ providedIn: 'root' })
export class AuthService
{
    constructor(private api: ApiService) { }

    private takeToken()
    {
        return map((user: any) =>
        {
            console.log('User: ', user);
            if(user && user.token)
                localStorage.setItem('currentUser', JSON.stringify(user));

            return user;
        });
    }

    login(login: string, password: string)
    {
        return this.api.simplePost('/login', { login, password })
        .pipe(this.takeToken());
    }

    register(email: string, login: string, password: string, passwordConfirm: string)
    {
        return this.api.simplePost('/register', { email, login, password })
        .pipe(this.takeToken());
    }

    logout()
    {
        localStorage.removeItem('currentUser');
    }
}