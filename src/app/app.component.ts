import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AccountMenuComponent } from "./components/account-menu/account-menu.component";
import { ApiDataWrapper } from './services/api-data-wrapper';
import { Account, AccountRole } from './models/account.model';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DataService } from './services/data.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MatToolbarModule, AccountMenuComponent, MatButtonModule, RouterLink, RouterOutlet, MatSlideToggleModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'gen-net-app';
  accountRoleEnum = AccountRole;
  account: ApiDataWrapper<Account> | null = null;

  constructor(private dataService: DataService, private router: Router) {
    this.dataService.account$.subscribe(account => {this.account = account;});
    this.dataService.rereadAccount();
  }  
}
