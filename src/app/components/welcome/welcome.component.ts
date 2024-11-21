import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DataService } from '../../services/data.service';
import { ApiDataWrapper } from '../../services/api-data-wrapper';
import { Account } from '../../models/account.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule],
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.scss'
})
export class WelcomeComponent {
  account: ApiDataWrapper<Account> | null = null;

  constructor(private dataService: DataService, private router: Router) {
    this.dataService.account$.subscribe(account => {this.account = account});
  } 

  newSession() {
    this.dataService.postNewSession();
  }
  gotoApp() {
    this.router.navigate(['/app']);
  }
} 
