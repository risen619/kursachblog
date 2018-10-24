import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from "@angular/common/http";
import { Observable, throwError } from "rxjs";

@Injectable()
export class JwtInterceptor implements HttpInterceptor
{
    constructor() { }

    intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>>
    {
        let user = JSON.parse(localStorage.getItem('currentUser'));
        if(user && user.token)
            req = req.clone({ setHeaders: { Authorization: `Bearer ${user.token}` } });

        return next.handle(req);
    }
}