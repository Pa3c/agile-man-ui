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
}
export class BasicUserInfo {
  constructor(public login: string,
  public name: string,
  public surname: string){
  }
}
