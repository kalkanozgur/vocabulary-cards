// translated card types
//
// Path: src\components\Card\Card.types.ts
// Compare this snippet from src\server\api\routers\translateWithGoogle.ts:

export type CardProps = {
  tr: string;
  en: string;
  id: string | number;
  context?: string;
};
