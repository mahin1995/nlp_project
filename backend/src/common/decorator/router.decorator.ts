import "reflect-metadata";
import { RouteDefinition } from "./RouteDefinition";

export function Get(path: string) {
  return (target: any, propertyKey: string): void => {
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }
    const routes = Reflect.getMetadata(
      "routes",
      target.constructor
    ) as RouteDefinition[];
    routes.push({
      method: "get",
      path,
      methodName: propertyKey,
    });
    Reflect.defineMetadata("routes", routes, target.constructor);
  };
}

export function Post(path: string) {
  return (target: any, propertyKey: string): void => {
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }
    const routes = Reflect.getMetadata(
      "routes",
      target.constructor
    ) as RouteDefinition[];
    routes.push({
      method: "post",
      path,
      methodName: propertyKey,
    });
    Reflect.defineMetadata("routes", routes, target.constructor);
  };
}

export function Delete(path: string) {
  return (target: any, propertyKey: string): void => {
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }
    const routes = Reflect.getMetadata(
      "routes",
      target.constructor
    ) as RouteDefinition[];
    routes.push({
      method: "delete",
      path,
      methodName: propertyKey,
    });
    Reflect.defineMetadata("routes", routes, target.constructor);
  };
}

export function Put(path: string) {
  return (target: any, propertyKey: string): void => {
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }
    const routes = Reflect.getMetadata(
      "routes",
      target.constructor
    ) as RouteDefinition[];
    routes.push({
      method: "put",
      path,
      methodName: propertyKey,
    });
    Reflect.defineMetadata("routes", routes, target.constructor);
  };
}
// PATCH method decorator
export const Patch = (path: string): MethodDecorator => {
  return (target, propertyKey: string | symbol): void => {
    if (!Reflect.hasMetadata("routes", target.constructor)) {
      Reflect.defineMetadata("routes", [], target.constructor);
    }

    const routes = Reflect.getMetadata("routes", target.constructor) as RouteDefinition[];

    routes.push({
      method: "patch",
      path,
      methodName: propertyKey as string,
    });
    Reflect.defineMetadata("routes", routes, target.constructor);
  };
};
