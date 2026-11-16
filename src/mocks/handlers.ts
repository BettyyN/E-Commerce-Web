import { authHandlers } from "./handlers/auth.handler";
import { bankHandlers } from "./handlers/bank.handler";
import { catHandlers } from "./handlers/cat.handler";
import { customerHandlers } from "./handlers/customer.handler";
import { employeeHandlers } from "./handlers/employee.handler";
import { roleHandlers } from "./handlers/role.handler";
import { userHandlers } from "./handlers/user.handler";
import { checkoutHandlers } from "./handlers/checkout.handler";
import { crdtPayHandlers } from "./handlers/crdtPay.handler";
import { creditHandlers } from "./handlers/credit.handler";
import { measTypeHandlers } from "./handlers/measType.handler";
import { nameListHandlers } from "./handlers/nameList.handler";
import { orderHandlers } from "./handlers/order.handler";
import { orderItemHandlers } from "./handlers/orderItem.handler";
import { packHandlers } from "./handlers/pack.handler";
import { payHandlers } from "./handlers/pay.handler";
import { proHandlers } from "./handlers/pro.handler";
import { proVarHandlers } from "./handlers/proVar.handler";
import { proDiscntHandlers } from "./handlers/proDiscnt.handler";
import { proImageHandlers } from "./handlers/proImage.handler";
import { proViewHandlers } from "./handlers/proView.handler";
import { myDataHandlers } from "./handlers/myData";

export const handlers = [
  ...authHandlers,
  ...customerHandlers,
  ...employeeHandlers,
  ...roleHandlers,
  ...userHandlers,
  ...bankHandlers,
  ...catHandlers,
  ...checkoutHandlers,
  ...crdtPayHandlers,
  ...creditHandlers,
  ...measTypeHandlers,
  ...nameListHandlers,
  ...orderHandlers,
  ...orderItemHandlers,
  ...packHandlers,
  ...payHandlers,
  ...proHandlers,
  ...proVarHandlers,
  ...proDiscntHandlers,
  ...proImageHandlers,
  ...proViewHandlers,
   ...myDataHandlers,
];
