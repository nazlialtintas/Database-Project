import { User } from "./User";

export class CreditCards {
  id: number;
  userEntity: User;
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;

  constructor() {
    cardName: '';
    cardNumber: '';
    expiryDate: '';
    cvv: '';
  }

}
