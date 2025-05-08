import { MatDialogRef } from "@angular/material/dialog";

export enum PresentationMode {
  Create = "Create",
  Edit = "Edit",
  Show = "Show"
}
export class Presentation {
  constructor(public create:any, public edit : any){}
} 

export type PresentationDataWrapper<T> = {
  data: T;
  mode: PresentationMode;
  dialogRef?: MatDialogRef<any>;
};