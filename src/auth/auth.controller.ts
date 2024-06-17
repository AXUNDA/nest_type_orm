import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentials } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {}

  /**
   * Handles user signup process.
   *
   * @param dto - The user credentials to be used for signup.
   * @returns The result of the signup process, which could be a success message or an error.
   *
   * @throws Will throw an error if the signup process fails.
   *
   * @remarks
   * This function is responsible for validating the user credentials,
   * checking if the user already exists, and creating a new user record in the database.
   *
   * @example
   * ```typescript
   * const credentials: AuthCredentials = { username: 'john', password: 'ecret' };
   * const result = await authController.signup(credentials);
   * console.log(result); // Output: 'User created successfully.'
   * ```
   */
  @Post()
  signup(@Body() dto: AuthCredentials) {
    return this.service.signup(dto);
  }

  @Post('/login')
  login(@Body() dto: AuthCredentials) {
    return this.service.signIn(dto);
  }
}
