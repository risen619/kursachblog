import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from "@angular/common/http";

import { AppComponent } from './app.component';
import { ComponentsModule } from '../components/components.module';

import { ErrorsInterceptor, JwtInterceptor } from "../interceptors";

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		ComponentsModule
	],
	providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorsInterceptor, multi: true },
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
