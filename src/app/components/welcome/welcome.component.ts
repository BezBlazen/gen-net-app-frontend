import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ApiDataWrapper } from '../../services/api-data-wrapper';
import { Account, AccountRole } from '../../models/account.model';
import { Router } from '@angular/router';

import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatSidenavModule, MatListModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  account: ApiDataWrapper<Account> | null = null;

  constructor(private router: Router) {
  } 

  gotoApp() {
    this.router.navigate(['/app']);
  }
} 
