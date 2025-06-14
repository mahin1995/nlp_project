import { Request, RequestHandler, Response, NextFunction, Router } from 'express';
import 'reflect-metadata';
import swaggerUi from 'swagger-ui-express';
import Container from 'typedi';
import Logger from '../../utils/Logger';
import { RouteDefinition } from './RouteDefinition';

export const router = Router();

// Global registry for Swagger documentation
const swaggerRegistry: any[] = [];

// Symbol for parameter metadata
const PARAM_METADATA_KEY = Symbol('paramMetadata');

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

// ====================== PARAMETER DECORATORS ======================
export function Req() {
  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    storeParamMetadata(target, propertyKey, parameterIndex, 'request');
  };
}

export function Res() {
  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    storeParamMetadata(target, propertyKey, parameterIndex, 'response');
  };
}

export function Next() {
  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    storeParamMetadata(target, propertyKey, parameterIndex, 'next');
  };
}

export function Body() {
  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    storeParamMetadata(target, propertyKey, parameterIndex, 'body');
  };
}

export function Param(paramName: string) {
  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    storeParamMetadata(target, propertyKey, parameterIndex, 'param', paramName);
  };
}

// NEW: Query parameter decorator
export function Query(paramName?: string) {
  return (target: any, propertyKey: string | symbol, parameterIndex: number) => {
    storeParamMetadata(target, propertyKey, parameterIndex, 'query', paramName);
  };
}

function storeParamMetadata(
  target: Object,
  propertyKey: string | symbol,
  parameterIndex: number,
  paramType: string,
  paramName?: string
) {
  const existingParams = Reflect.getOwnMetadata(PARAM_METADATA_KEY, target, propertyKey) || [];
  existingParams.push({
    index: parameterIndex,
    type: paramType,
    name: paramName
  });
  Reflect.defineMetadata(PARAM_METADATA_KEY, existingParams, target, propertyKey);
}

// ====================== CONTROLLER DECORATOR ======================
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
      const routeMiddlewares = middlewaresMap[methodName] || [];

      // Get parameter metadata for this method
      const paramMetadata: any[] = Reflect.getMetadata(
        PARAM_METADATA_KEY,
        target.prototype,
        methodName
      ) || [];

      // Create the Express handler
      const expressHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
          // Prepare arguments based on decorators
          const args = new Array(paramMetadata.length);
          
          for (const meta of paramMetadata) {
            switch (meta.type) {
              case 'request':
                args[meta.index] = req;
                break;
              case 'response':
                args[meta.index] = res;
                break;
              case 'next':
                args[meta.index] = next;
                break;
              case 'body':
                args[meta.index] = req.body;
                break;
              case 'param':
                args[meta.index] = meta.name ? req.params[meta.name] : req.params;
                break;
              // NEW: Handle query parameters
              case 'query':
                if (meta.name) {
                  // Get specific query parameter
                  args[meta.index] = req.query[meta.name];
                } else {
                  // Get entire query object
                  args[meta.index] = req.query;
                }
                break;
              default:
                args[meta.index] = undefined;
            }
          }
          
          // Call the controller method
          const result = await instance[methodName](...args);
          
          // Send response if not already sent
          if (!res.headersSent) {
            if (result === undefined) {
              res.status(204).end();
            } else {
              res.json(result);
            }
          }
        } catch (error) {
          next(error);
        }
      };

      if (typeof router[route.method] === 'function') {
        router[route.method](fullPath, ...routeMiddlewares, expressHandler);

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

// ====================== SWAGGER UTILITIES ======================
function convertExpressPathToOpenAPI(path: string): string {
  return path.replace(/:(\w+)/g, '{$1}');
}

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
    
    paths[path][method] = {
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
          bearerFormat: 'JWT',
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

export const setupSwagger = (app: any, path = '/api-docs') => {
  const swaggerSpec = generateSwaggerSpec();
  app.use(path, swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  Logger.logInfo(`Swagger UI available at ${path}`);
};

