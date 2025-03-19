export type LoginErrorResponseType = { message: string }
export type LoginSuccessResponseType = { token: string }

export type LoginResponseType =
  | LoginErrorResponseType
  | LoginSuccessResponseType
