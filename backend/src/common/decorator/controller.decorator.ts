// // import express, { Router, RequestHandler } from "express";
// // import "reflect-metadata";
// // import Container from "typedi";

// // import Logger from "../../utils/Logger";
// // import { RouteDefinition } from "./RouteDefinition";

// // export const router = Router();

// // export const Controller = (prefix: string): ClassDecorator => {
// //   return (target: any) => {
// //     // Try to resolve the controller instance from the DI container
// //     let instance: any;
// //     try {
// //       instance = Container.get(target);
// //     } catch (error) {
// //       // Throw meaningful error if @Service() is missing
// //       throw new Error(
// //         `[Controller Error] ${target.name} must be decorated with @Service() to work with @Controller("${prefix}").`
// //       );
// //     }

// //     // Ensure "routes" metadata exists
// //     if (!Reflect.hasMetadata("routes", target)) {
// //       Reflect.defineMetadata("routes", [], target);
// //     }

// //     // Get routes and middleware
// //     const routes: RouteDefinition[] = Reflect.getMetadata("routes", target);
// //     const middlewaresMap: Record<string, RequestHandler[]> =
// //       Reflect.getMetadata("middlewares", target) || {};

// //     // Register each route
// //     for (const route of routes) {
// //       const fullPath = `${prefix}${route.path}`;
// //       const methodName = route.methodName;
// //       const handler = instance[methodName].bind(instance);
// //       const routeMiddlewares = middlewaresMap[methodName] || [];

// //       // Validate Express router method
// //       if (typeof router[route.method] === "function") {
// //         router[route.method](fullPath, ...routeMiddlewares, handler);

// //         Logger.logInfo(
// //           `Registered route: ${JSON.stringify({
// //             method: route.method.toUpperCase(),
// //             path: fullPath,
// //             controller: target.name,
// //             handler: methodName,
// //           })}`
// //         );
// //       } else {
// //         Logger.logError(
// //           `[Controller Warning] Unsupported HTTP method "${route.method}" for route "${fullPath}" in controller ${target.name}`
// //         );
// //       }
// //     }
// //   };
// // };
// import { RequestHandler, Router } from 'express';
// import 'reflect-metadata';
// import Container from 'typedi';

// import Logger from '../../utils/Logger';
// import { RouteDefinition } from './RouteDefinition';

// export const router = Router();

// export const Controller = (prefix: string): ClassDecorator => {
//   return (target: any) => {
//     // Register with typedi automatically
//     if (!Container.has(target)) {
//       Container.set({ id: target, type: target });
//     }

//     // Define metadata
//     Reflect.defineMetadata('prefix', prefix, target);
//     if (!Reflect.hasMetadata('routes', target)) {
//       Reflect.defineMetadata('routes', [], target);
//     }

//     const routes: RouteDefinition[] = Reflect.getMetadata('routes', target);
//     const middlewaresMap: Record<string, RequestHandler[]> =
//       Reflect.getMetadata('middlewares', target) || {};

//     let instance: any = Container.get(target);

//     for (const route of routes) {
//       const fullPath = `${prefix}${route.path}`;
//       const methodName = route.methodName;
//       const handler = instance[methodName].bind(instance);
//       const routeMiddlewares = middlewaresMap[methodName] || [];

//       if (typeof router[route.method] === 'function') {
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
//         Logger.logWarning(
//           `[Controller Warning] Unsupported method "${route.method}" on ${fullPath}`
//         );
//       }
//     }
//   };
// };
import { RequestHandler, Router } from 'express';
import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';
import Container from 'typedi';
import Logger from '../../utils/Logger';
import express from 'express';
import { RouteDefinition } from './RouteDefinition';
export const router = Router();

// Global registry for Swagger documentation
const swaggerRegistry: any[] = [];

// Interface for Swagger endpoint metadata
interface SwaggerEndpoint {
  summary: string;
  description?: string;
  parameters?: any[];
  responses?: Record<string, any>;
  requestBody?: any;
  bodyExample?: any;
}

// Decorator to add Swagger documentation to methods
export function SwaggerDoc(metadata: SwaggerEndpoint) {
  return (target: any, propertyKey: string) => {
    Reflect.defineMetadata('swagger', metadata, target, propertyKey);
  };
}

// Modified Controller decorator
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

        // Collect Swagger metadata for documentation
        const swaggerMeta =
          Reflect.getMetadata('swagger', target.prototype, methodName) || {};
        swaggerRegistry.push({
          path: convertExpressPathToOpenAPI(fullPath),
          method: route.method,
          metadata: {
            ...swaggerMeta,
            tags: [target.name.replace('Controller', '')],
          },
        });

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

// Function to generate Swagger specification
// Updated generateSwaggerSpec function
export const generateSwaggerSpec = () => {
  const paths: Record<string, any> = {};

  swaggerRegistry.forEach(({ path, method, metadata }) => {
    if (!paths[path]) paths[path] = {};
    // Auto-handle body parameters for PUT/POST
    if (['put', 'post'].includes(method)) {
      if (!metadata.parameters) metadata.parameters = [];

      const hasBodyParam = metadata.parameters.some(
        (p: any) => p.in === 'body'
      );
      if (!hasBodyParam) {
        metadata.requestBody = {
          required: true,
          content: {
            'application/json': {
              schema: metadata.bodyExample || { type: 'object' },
            },
          },
        };
        metadata.parameters.push({
          in: 'body',
          name: 'body',
          required: true,
          schema: metadata.bodyExample || { type: 'object' },
        });
      }
    }
    // path=convertExpressPathToOpenAPI(path);
    const openApiPath = path ? convertExpressPathToOpenAPI(path) : path;
    paths[openApiPath][method] = {
      summary: metadata.summary || `${method} ${path}`,
      description: metadata.description || '',
      parameters: metadata.parameters || [],
      responses: metadata.responses || {
        200: { description: 'Success' },
        500: { description: 'Server error' },
      },
      requestBody: metadata.requestBody,
      tags: metadata.tags,
    };
  });

  return {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT', // Optional, can be just 'bearer'
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    paths,
  };
};

// Function to setup Swagger UI
export const setupSwagger = (app: any, path = '/api-docs') => {
  const swaggerSpec = generateSwaggerSpec();
  app.use(path, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  Logger.logInfo(`Swagger UI available at ${path}`);
};
function convertExpressPathToOpenAPI(path: string): string {
  if (path.indexOf(':') != 0) {
    return path.replace(/:(\w+)/g, '{$1}');
  }
  return path;
}
