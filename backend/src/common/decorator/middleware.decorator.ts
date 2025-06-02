import express from "express";

export const Middleware = (
  middleware: express.RequestHandler
): MethodDecorator => {
  return (target, propertyKey: string | symbol) => {
    if (!Reflect.hasMetadata("middlewares", target.constructor)) {
      Reflect.defineMetadata("middlewares", {}, target.constructor);
    }
    const middlewares = Reflect.getMetadata("middlewares", target.constructor);
    middlewares[propertyKey] = middlewares[propertyKey] || [];
    middlewares[propertyKey].push(middleware);
    Reflect.defineMetadata("middlewares", middlewares, target.constructor);
  };
};
