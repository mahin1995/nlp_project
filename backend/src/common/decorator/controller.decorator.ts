// import express, { Router, RequestHandler } from "express";
// import "reflect-metadata";
// import Container from "typedi";

// import Logger from "../../utils/Logger";
// import { RouteDefinition } from "./RouteDefinition";

// export const router = Router();

// export const Controller = (prefix: string): ClassDecorator => {
//   return (target: any) => {
//     // Try to resolve the controller instance from the DI container
//     let instance: any;
//     try {
//       instance = Container.get(target);
//     } catch (error) {
//       // Throw meaningful error if @Service() is missing
//       throw new Error(
//         `[Controller Error] ${target.name} must be decorated with @Service() to work with @Controller("${prefix}").`
//       );
//     }

//     // Ensure "routes" metadata exists
//     if (!Reflect.hasMetadata("routes", target)) {
//       Reflect.defineMetadata("routes", [], target);
//     }

//     // Get routes and middleware
//     const routes: RouteDefinition[] = Reflect.getMetadata("routes", target);
//     const middlewaresMap: Record<string, RequestHandler[]> =
//       Reflect.getMetadata("middlewares", target) || {};

//     // Register each route
//     for (const route of routes) {
//       const fullPath = `${prefix}${route.path}`;
//       const methodName = route.methodName;
//       const handler = instance[methodName].bind(instance);
//       const routeMiddlewares = middlewaresMap[methodName] || [];

//       // Validate Express router method
//       if (typeof router[route.method] === "function") {
//         router[route.method](fullPath, ...routeMiddlewares, handler);

//         Logger.logInfo(
//           `Registered route: ${JSON.stringify({
//             method: route.method.toUpperCase(),
//             path: fullPath,
//             controller: target.name,
//             handler: methodName,
//           })}`
//         );
//       } else {
//         Logger.logError(
//           `[Controller Warning] Unsupported HTTP method "${route.method}" for route "${fullPath}" in controller ${target.name}`
//         );
//       }
//     }
//   };
// };
import { RequestHandler, Router } from 'express';
import 'reflect-metadata';
import Container from 'typedi';

import Logger from '../../utils/Logger';
import { RouteDefinition } from './RouteDefinition';

export const router = Router();

export const Controller = (prefix: string): ClassDecorator => {
  return (target: any) => {
    // Register with typedi automatically
    if (!Container.has(target)) {
      Container.set({ id: target, type: target });
    }

    // Define metadata
    Reflect.defineMetadata('prefix', prefix, target);
    if (!Reflect.hasMetadata('routes', target)) {
      Reflect.defineMetadata('routes', [], target);
    }

    const routes: RouteDefinition[] = Reflect.getMetadata('routes', target);
    const middlewaresMap: Record<string, RequestHandler[]> =
      Reflect.getMetadata('middlewares', target) || {};

    let instance: any = Container.get(target);

    for (const route of routes) {
      const fullPath = `${prefix}${route.path}`;
      const methodName = route.methodName;
      const handler = instance[methodName].bind(instance);
      const routeMiddlewares = middlewaresMap[methodName] || [];

      if (typeof router[route.method] === 'function') {
        router[route.method](fullPath, ...routeMiddlewares, handler);

        Logger.logInfo(
          `Registered route: ${JSON.stringify({
            method: route.method.toUpperCase(),
            path: fullPath,
            controller: target.name,
            handler: methodName,
          })}`
        );
      } else {
        Logger.logWarning(
          `[Controller Warning] Unsupported method "${route.method}" on ${fullPath}`
        );
      }
    }
  };
};
