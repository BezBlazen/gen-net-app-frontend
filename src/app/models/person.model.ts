// export const GenderOptions = [
//     { label: 'Unknown', value: 'http://gedcomx.org/Unknown' },
//     { label: 'Male', value: 'http://gedcomx.org/Male' },
//     { label: 'Female', value: 'http://gedcomx.org/Female' },
//   ];
export const Gender = {
  UNKNOWN: { label: 'Unknown', value: 'http://gedcomx.org/Unknown' },
  MALE: { label: 'Male', value: 'http://gedcomx.org/Male' },
  FEMALE: { label: 'Female', value: 'http://gedcomx.org/Female' },
}
export const GenderOptions = Object.values(Gender);
// export enum GenderType {
//   UNKNOWN = 'http://gedcomx.org/Unknown',
//   MALE = 'http://gedcomx.org/Male',
//   FEMALE = 'http://gedcomx.org/Female',
// }
// export Record GenderTypeLabels: Record<GenderType, string> = {
//   [GenderType.UNKNOWN]: "Unknown",
//   [GenderType.MALE]: "Male",
//   [GenderType.FEMALE]: "Female",
// };
export enum NamePartType {
  GIVEN = 'http://gedcomx.org/GivenName',
  SURNAME = 'http://gedcomx.org/Surname'
}
export const NameType = {
  BIRTH_NAME: { label: 'Birth Name', value: 'http://gedcomx.org/BirthName', description: 'Name given at birth.' },
  DEATH_NAME: { label: 'Death Name', value: 'http://gedcomx.org/DeathName', description: 'Name used at the time of death.' },
  MARRIED_NAME: { label: 'Married Name', value: 'http://gedcomx.org/MarriedName', description: 'Name accepted at marriage.' },
  ALSO_KNOWN_AS: { label: 'Also Known As', value: 'http://gedcomx.org/AlsoKnownAs', description: '"Also known as" name.' },
  NICK_NAME: { label: 'Nickname', value: 'http://gedcomx.org/Nickname', description: 'Nickname.' },
  ADOPTIVE_NAME: { label: 'Adoptive Name', value: 'http://gedcomx.org/AdoptiveName', description: 'Name given at adoption.' },
  FORMAL_NAME: { label: 'Formal Name', value: 'http://gedcomx.org/FormalName', description: 'A formal name, usually given to distinguish it from a name more commonly used.' },
  RELIGIOUS_NAME: { label: 'Religious Name', value: 'http://gedcomx.org/ReligiousName', description: 'A name given at a religious rite or ceremony.' },
}
export const NameTypeOptions = Object.values(NameType);
export interface Gender {
  type?: string;
}

export interface NamePart {
  type?: string;
  value?: string;
}

export interface NameForm {
  // preferred?: boolean;
  // fullText?: string;
  parts?: NamePart[];
}
export interface DaoNameForm {
  preferred?: boolean;
  type?: string,
  first?: string,
  last?: string
}
export interface DaoName {
  index?: number,
  name: Name
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
export interface DaoPerson {
  id?: string;
  projectId?: string;
  version?: number;
  gender?: Gender;
  names?: Name[];
  preferredName?: string;
}

export interface PersonCreate {
  projectId?: string;
  gender?: Gender;
  names?: {
    type?: string,
    first?: string,
    last?: string
  };
}

