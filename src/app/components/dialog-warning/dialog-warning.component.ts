import { Component, Inject, Optional } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-warning',
  standalone: true,
  imports: [MatButtonModule, MatDialogActions, MatDialogClose, MatDialogTitle, MatDialogContent],
  templateUrl: './dialog-warning.component.html',
  styleUrl: './dialog-warning.component.scss'
})
export class DialogWarningComponent {
  message: string;
  constructor(public dialogRef: MatDialogRef<DialogWarningComponent>, @Inject(MAT_DIALOG_DATA) public data: string) {
    this.message = data;
  }
}
