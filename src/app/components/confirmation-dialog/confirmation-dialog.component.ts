import { Component, EventEmitter, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent, MatDividerModule, MatProgressBarModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss'
})
export class ConfirmationDialogComponent {
  @Input() title!: string;
  @Input() action!: string;
  @Input() dialogRef!: MatDialogRef<ConfirmationDialogComponent>;
  @Input() errorMessage: string | undefined;
  @Input() isLoading: boolean | undefined;
  onConfirm = new EventEmitter();
  // dialogRef.action.changes 
  confirm() {
    this.onConfirm.emit();
  }  
}
