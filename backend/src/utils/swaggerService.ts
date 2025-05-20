import { Express } from 'express';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

// Define the Swagger options interface
interface SwaggerOptions {
  definition: {
    openapi: string;
    info: {
      title: string;
      version: string;
      description: string;
    };
    servers?: {
      url: string;
      description: string;
    }[];
  };
  apis: string[];
}

const options: SwaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My API',
      version: '1.0.0',
      description: 'A sample API documentation',
    },
    // Optional: Add servers if you have specific environments
    // servers: [
    //   {
    //     url: 'http://localhost:3000',
    //     description: 'Development server',
    //   },
    // ],
  },
  apis: ['src/routes/news.routes.ts'], // Path to the API routes
};

const specs = swaggerJsdoc(options);

// Function to setup Swagger UI (optional)
export const setupSwagger = (app: Express, path: string = '/api-docs') => {
  app.use(path, swaggerUi.serve, swaggerUi.setup(specs));
};
