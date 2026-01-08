import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterModule,
        ToastModule,
        NgxSpinnerModule
    ],
    template: `
        <p-toast key="top-right" position="top-right"></p-toast>
        <p-toast key="top-center" position="top-center"></p-toast>
        <p-toast key="top-left" position="top-left"></p-toast>

        <p-toast key="bottom-right" position="bottom-right"></p-toast>
        <p-toast key="bottom-center" position="bottom-center"></p-toast>
        <p-toast key="bottom-left" position="bottom-left"></p-toast>

        <router-outlet></router-outlet>

        <ngx-spinner
            bdColor="rgba(0, 0, 0, 0.8)"
            size = "medium"
            color = "#fff"
            type = "ball-atom"
            [fullScreen]="true">
            <p style="color: white">Loading...</p>
        </ngx-spinner>
    `
})
export class AppComponent {}
