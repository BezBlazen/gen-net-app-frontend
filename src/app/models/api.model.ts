import { AccountDtoApi } from "../../api/model/accountDto";
import { NameApi } from "../../api/model/name";
import { NameFormApi } from "../../api/model/nameForm";
import { NamePartApi } from "../../api/model/namePart";
import { PersonApi } from "../../api/model/person";
import { ProjectApi } from "../../api/model/project";

export type Project = Partial<ProjectApi>;
export type Account = Partial<AccountDtoApi>;
export type Person = Partial<PersonApi>;
export type Name = Partial<NameApi>;
export type NameForm = Partial<NameFormApi>;
export type NamePart = Partial<NamePartApi>;

export interface FieldOptions {
    label?: string,
    value?: string,
    description?: string,
}

