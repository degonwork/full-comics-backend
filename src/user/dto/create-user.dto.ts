export class CreateUserDto {
  userName: string;
  email: string;
  password: string;
  uuid: string;
  firebase_token: string;
  subscriptions: string[];
}
