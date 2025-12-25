import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageModule } from 'primeng/message';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TabsModule,
        InputTextModule,
        PasswordModule,
        ButtonModule,
        CardModule,
        FileUploadModule,
        MessageModule,
        ToggleSwitchModule
    ],
    template: `
        <div class="space-y-6">
            <h1 class="text-3xl font-bold">Configurações</h1>
            <p class="text-muted-color">Gerencie suas informações pessoais e configurações</p>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 container">
                <p-card class="card text-center">
                    <img src="https://i.pravatar.cc/150?img=3" alt="avatar" class="rounded-full w-24 h-24 mx-auto mb-4" />
                    <h3 class="text-xl font-semibold mb-1">{{ profile.name }}</h3>
                    <p class="text-muted-color mb-4">{{ profile.email }}</p>
                    <p-fileupload
                        mode="basic"
                        name="avatar"
                        chooseIcon="pi pi-upload"
                        url="https://www.primefaces.org/cdn/api/upload.php"
                        accept="image/*"
                        maxFileSize="1000000"
                        [auto]="true"
                        chooseLabel="Alterar Foto"
                        class="w-full flex justify-center mt-10" />
                </p-card>

                <div class="card lg:col-span-2">
                    <p-tabs [(value)]="activeTab" class="mb-4">
                        <p-tablist class="flex justify-center w-full">
                            <p-tab header="Perfil" [value]="'profile'">
                                <i class="pi pi-user mr-2"></i>
                                Perfil
                            </p-tab>
                            <p-tab header="Segurança" [value]="'security'">
                                <i class="pi pi-lock mr-2"></i>
                                Segurança
                            </p-tab>
                            <p-tab header="Preferências" [value]="'preferences'">
                                <i class="pi pi-cog mr-2"></i>
                                Preferências
                            </p-tab>
                        </p-tablist>

                        <p-tabpanels>
                            <p-tabpanel [value]="'profile'">
                                <p-card>
                                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label class="block mb-1">Nome Completo</label>
                                            <input pInputText [(ngModel)]="profile.name" placeholder="Seu nome" class="w-full" />
                                        </div>
                                        <div>
                                            <label class="block mb-1">Email</label>
                                            <input
                                                pInputText
                                                type="email"
                                                [(ngModel)]="profile.email"
                                                placeholder="Seu email"
                                                class="w-full"
                                            />
                                        </div>
                                        <div class="md:col-span-2">
                                            <label class="block mb-1">Telefone</label>
                                            <input
                                                pInputText
                                                [(ngModel)]="profile.phone"
                                                placeholder="(11) 99999-9999"
                                                class="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div class="flex justify-end mt-4">
                                        <button pButton label="Salvar Alterações" (click)="saveProfile()"></button>
                                    </div>
                                </p-card>
                            </p-tabpanel>

                            <p-tabpanel [value]="'security'">
                                <p-card>
                                    <div class="space-y-4">
                                        <div>
                                            <label class="block mb-1">Senha Atual</label>
                                            <input
                                                pPassword
                                                [(ngModel)]="security.current"
                                                toggleMask="true"
                                                placeholder="Senha atual"
                                                class="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label class="block mb-1">Nova Senha</label>
                                            <input
                                                pPassword
                                                [(ngModel)]="security.new"
                                                toggleMask="true"
                                                placeholder="Nova senha"
                                                class="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label class="block mb-1">Confirmar Nova Senha</label>
                                            <input
                                                pPassword
                                                [(ngModel)]="security.confirm"
                                                toggleMask="true"
                                                placeholder="Confirmar nova senha"
                                                class="w-full"
                                            />
                                        </div>
                                    </div>

                                    <div class="flex justify-end mt-4">
                                        <button pButton label="Alterar Senha" (click)="changePassword()"></button>
                                    </div>
                                </p-card>
                            </p-tabpanel>

                            <p-tabpanel [value]="'preferences'">
                                <p-card>
                                    <div class="space-y-4">
                                        <div class="flex items-center justify-between mb-4">
                                            <span>Notificações por Email</span>
                                            <p-toggleswitch [(ngModel)]="preferences.emailNotifications" />
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <span>Tema Escuro</span>
                                            <p-toggleswitch [(ngModel)]="preferences.darkTheme" />
                                        </div>
                                        <div class="flex items-center justify-between">
                                            <span>Sons de Notificação</span>
                                            <p-toggleswitch [(ngModel)]="preferences.notificationSounds" />
                                        </div>
                                    </div>

                                    <div class="flex justify-end mt-4">
                                        <button pButton label="Salvar Preferências" (click)="savePreferences()"></button>
                                    </div>
                                </p-card>
                            </p-tabpanel>
                        </p-tabpanels>
                    </p-tabs>
                </div>
            </div>
        </div>
    `,
    styles: [`
        h1 {
            margin-bottom: 0;
        }

        .container {
            margin-top: 2%
        }
    `]
})
export class Settings {
    activeTab: string = 'profile';

    profile = { name: 'Administrador', email: 'admin@dashboard.com', phone: '(11) 99999-9999' };
    security = { current: '', new: '', confirm: '' };
    preferences = { emailNotifications: true, darkTheme: true, notificationSounds: false };

    saveProfile() {
        console.log('Perfil atualizado:', this.profile);
    }

    changePassword() {
        if (this.security.new !== this.security.confirm) {
            alert('As senhas não conferem!');
            return;
        }
        console.log('Senha alterada:', this.security);
    }

    savePreferences() {
        console.log('Preferências salvas:', this.preferences);
    }
}
