import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { Account, AccountRole } from '../../models/account.model';
import { DataService } from '../../services/data.service';
import { MatButtonModule } from '@angular/material/button';
import { SignDialogComponent } from '../sign-dialog/sign-dialog.component';
import { ApiDataWrapper } from '../../services/api-data-wrapper';

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

  constructor(private dataService: DataService) {
    this.dataService.account$.subscribe(account => this.account = account);
  }

  openDialog() {
    this.dialog.open(SignDialogComponent);
  }
  signOut() {
    this.dataService.postSignOut();
  }  
  getAccount() {
    this.dataService.getAccount();
  }    
  newSession() {
    this.dataService.postNewSession();
  }  
  logout() {
    this.dataService.postSignOut();
  }  
}