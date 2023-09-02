// Code by https://github.com/interaminense
export type TCredentials = {
  emailAddress: string;
  password: string;
};

export type TGroupedData = {
  data: TData[];
  total: number;
};

type TDataOptions = string | number | boolean | TData;

export type TData = {
  [key: string]: TDataOptions | TDataOptions[];
};

export interface IDataBaseProps {
  path: string;
}

export enum TSortType {
  Asc = "ASC",
  Desc = "DESC",
}

export enum TSortValue {
  CreateDate = "createDate",
  Label = "label",
}

export type TSortBy = {
  value: TSortValue;
  type: TSortType;
};
