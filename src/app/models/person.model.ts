export const GenderOptions = [
    { label: 'Male', value: 'http://gedcomx.org/Male' },
    { label: 'Female', value: 'http://gedcomx.org/Female' },
    // { label: 'Intersex', value: 'http://gedcomx.org/Intersex' },
    { label: 'Unknown', value: 'http://gedcomx.org/Unknown' }
  ];
export enum NamePartType {
  GIVEN = 'http://gedcomx.org/Given',
  SURNAME = 'http://gedcomx.org/Surname'
}
export interface Gender {
  type?: string;
}

export interface NamePart {
  type?: string;
  value?: string;
}

export interface NameForm {
  preferred?: boolean;
  fullText?: string;
  parts?: NamePart[];
}

export interface Name {
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

export interface PersonCreate {
  projectId?: string;
  gender?: Gender;
  names?: {
    first?: string,
    last?: string
  };
}