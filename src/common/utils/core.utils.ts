import * as bcrypt from 'bcrypt';

export class CoreUtils {
  static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 10);
  }
}
