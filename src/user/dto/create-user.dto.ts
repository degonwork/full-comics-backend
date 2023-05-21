export class CreateUserDto {
  userName: string;
  email: string;
  password: string;
  device_id: string;
  firebase_token: string;
  subscriptions: string[];
}
