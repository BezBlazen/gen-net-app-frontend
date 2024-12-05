import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DataService } from '../../services/data.service';
import { ApiDataWrapper } from '../../services/api-data-wrapper';
import { Account, AccountRole } from '../../models/account.model';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  account: ApiDataWrapper<Account> | null = null;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.account$.subscribe(account => {this.account = account});
  } 

  newSession() {
    this.authService.postNewSession().subscribe((account) => {
      if (account?.data?.role == AccountRole.Session) {
        this.router.navigate(['/app']);
      }
    });;
  }
  gotoApp() {
    this.router.navigate(['/app']);
  }
} 
