export interface Gender {
  type?: string;
}

export interface NamePart {
  version?: number;
  type?: string;
  value?: string;
}

export interface NameForm {
  version?: number;
  lang?: string;
  preferred?: boolean;
  fullText?: string;
  parts?: NamePart[];
}

export interface Name {
  version?: number;
  type?: string;
  nameForms?: NameForm[];
}

export interface Person {
  id?: string;
  projectId?: string;
  version?: number;
  gender?: Gender;
  names?: Name[];
}