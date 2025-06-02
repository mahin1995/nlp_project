import { Container, ServiceOptions } from "typedi";

export function Repository(options?: ServiceOptions): ClassDecorator {
  return (target: any) => {
    Container.set(target, new target());
  };
}
