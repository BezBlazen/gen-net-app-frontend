import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { Account, AccountRole } from '../../models/account.model';
import { DataService } from '../../services/data.service';
import { MatButtonModule } from '@angular/material/button';
import { ApiDataWrapper } from '../../services/api-data-wrapper';
import { SignComponent } from '../sign/sign.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account-menu',
  standalone: true,
  imports: [MatMenuModule, MatButtonModule],
  templateUrl: './account-menu.component.html',
  styleUrl: './account-menu.component.scss'
})
export class AccountMenuComponent {
  readonly dialog = inject(MatDialog);
  accountRoleEnum = AccountRole
  account:ApiDataWrapper<Account> | null = null;

  constructor(private authService: AuthService) {
    this.authService.account$.subscribe(account => this.account = account);
  }

  openDialog() {
    const dialogRef = this.dialog.open(SignComponent, { disableClose: true });
  }
  signOut() {
    this.authService.postSignOut();
  }  
  getAccount() {
    this.authService.getAccount();
  }    
  newSession() {
    this.authService.postNewSession();
  }  
  logout() {
    this.authService.postSignOut();
  }  
}