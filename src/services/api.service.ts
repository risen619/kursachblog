import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService
{
	private url = "localhost:3030/api/v1";

	constructor(private http: HttpClient) { }

	simpleGet<T>(endpoint: string, options?: object) : Observable<any>
	{
		return this.http.get<T>(this.url + endpoint, options);
	}

	simplePost<T>(endpoint: string, data: object, options?: object) : Observable<any>
	{
		return this.http.post<T>(this.url + endpoint, data, options);
	}

	simplePut<T>(endpoint: string, data: object, options?: object) : Observable<any>
	{
		return this.http.put<T>(this.url + endpoint, data, options);
	}

	simpleDelete<T>(endpoint: string, options?: object) : Observable<any>
	{
		return this.http.delete<T>(this.url + endpoint, options);
	}

}
