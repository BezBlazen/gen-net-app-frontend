// import { MatDialogRef } from "@angular/material/dialog";

import { NzModalRef } from "ng-zorro-antd/modal";

export enum PresentationMode {
  Create = "Create",
  Edit = "Edit",
  Show = "Show"
}
export class Presentation {
  constructor(public create:any, public edit : any){}
} 

export interface IPresentationData<T> {
  data?: T;
  mode: PresentationMode;
  // modalRef?: NzModalRef;
};