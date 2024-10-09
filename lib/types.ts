export type Users = {
  _id?: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type UserUpdate = Partial<Users>;

export type Pkgs = {
  _id?: string;
  name: string;
  price: number;
  features: string[];
  popular?: boolean;
};

export type PkgUpdate = Partial<Pkgs>;

export type Context = {
  user: Users;
};

export type Token = {
  token: string;
};

export type TokenWithUser = Token & {
  user: Users;
};
