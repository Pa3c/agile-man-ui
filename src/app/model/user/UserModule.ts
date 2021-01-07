export class SignInSO {
  public login: string;
  public password: string;
}
export class User {
  public name: string;
  public surname: string;
  public login: string;
  public email: string;
  public phoneNumber: string;
  public birthday: string;
  public skype: string;
  public description: string;
  public photo: any;

}
export class BasicUserInfo {
  constructor(public login: string,
  public name: string,
  public surname: string){
  }
}
export class RoleBasicUser {
  constructor(public login: string,public name: string,public surname: string,public role: string){
  }
}
export class MultiRoleBasicUser {
  constructor(public login: string,public name: string,public surname: string,public roles: string[]){
  }
}
export class UserSpecialization {
  id: string;
  skill: number;
}
