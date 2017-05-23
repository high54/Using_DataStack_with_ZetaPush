import { services } from 'zetapush-js';

export class StackProvider extends services.Macro {
  stackPush(msg)
  {
    return this.$publish('stackPush',{msg});
  }
  stackList()
  {
    return this.$publish('stackList',{});
  }
  stackSetListeners(test)
  {
    return this.$publish('stackSetListeners',{test});
  }
  stackGetListeners()
  {
    return this.$publish('stackGetListeners',{});
  }
}
