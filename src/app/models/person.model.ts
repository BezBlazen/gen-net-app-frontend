// import { NamePartTypeApi } from "../../api/model/namePartType";
import { NameApi } from "../../api/model/name";
import { PersonApi } from "../../api/model/person";
// import { Name } from "./api.model";

// export const Gender = {
//   UNKNOWN: { label: 'Unknown', uri: 'http://gedcomx.org/Unknown' },
//   MALE: { label: 'Male', uri: 'http://gedcomx.org/Male' },
//   FEMALE: { label: 'Female', uri: 'http://gedcomx.org/Female' },
// }
// export const GenderOptions = Object.values(Gender);
// export enum NamePartType {
//   GIVEN = 'http://gedcomx.org/GivenName',
//   SURNAME = 'http://gedcomx.org/Surname'
// }
// export const NameType = {
//   BIRTH_NAME: { label: 'Birth Name', uri: 'http://gedcomx.org/BirthName', description: 'Name given at birth.' },
//   DEATH_NAME: { label: 'Death Name', uri: 'http://gedcomx.org/DeathName', description: 'Name used at the time of death.' },
//   MARRIED_NAME: { label: 'Married Name', uri: 'http://gedcomx.org/MarriedName', description: 'Name accepted at marriage.' },
//   ALSO_KNOWN_AS: { label: 'Also Known As', uri: 'http://gedcomx.org/AlsoKnownAs', description: '"Also known as" name.' },
//   NICK_NAME: { label: 'Nickname', uri: 'http://gedcomx.org/Nickname', description: 'Nickname.' },
//   ADOPTIVE_NAME: { label: 'Adoptive Name', uri: 'http://gedcomx.org/AdoptiveName', description: 'Name given at adoption.' },
//   FORMAL_NAME: { label: 'Formal Name', uri: 'http://gedcomx.org/FormalName', description: 'A formal name, usually given to distinguish it from a name more commonly used.' },
//   RELIGIOUS_NAME: { label: 'Religious Name', uri: 'http://gedcomx.org/ReligiousName', description: 'A name given at a religious rite or ceremony.' },
// }
// export const NameTypeOptions = Object.values(NameType);
export interface Gender {
  type?: string;
}

// export interface NamePart {
//   type?: string;
//   value?: string;
// }

// export interface NameForm {
//   fullText?: string;
//   parts?: NamePart[];
// }
// export interface DaoNameForm {
//   preferred?: boolean;
//   type?: string,
//   full?: string,
//   first?: string,
//   last?: string
// }
// export interface DaoName {
//   index?: number,
//   name: Name
// }

// export interface DaoPerson {
//   id?: string;
//   projectId?: string;
//   version?: number;
//   gender?: Gender;
//   names?: Name[];
//   preferredName?: string;
// }

export interface PersonCreateLocal {
  projectId?: string;
  gender?: Gender;
  names?: {
    type?: string,
    full?: string,
    first?: string,
    last?: string
  },
  date?: {
    birth?: string,
    death?: string,
  }
}
export interface PersonLocal {
  personApi?: PersonApi
  preferredName?: string;
}

export interface NameFormLocal {
  preferred?: boolean;
  type?: string,
  full?: string,
  first?: string,
  last?: string
}

export interface NameLocal {
  index?: number,
  name: NameApi
}