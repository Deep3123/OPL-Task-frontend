export class ForgotPasswordRequest {
  constructor(public email?: string, public captchaResponse?: string) {}
}
