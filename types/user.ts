export interface IUser {
  id: string;
  email: string;
  name: string;
  age: number;
  createdAt: number;
  updatedAt: number;
}

export interface ICreateUser {
  email: string;
  name: string | null;
  age: number | null;
}
