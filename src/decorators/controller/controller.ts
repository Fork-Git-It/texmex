import { container as defaultContainer } from "../../container/container";
import { keys } from "../../container/keys";
import { validateContainer } from "../../container/utils/validateContainer";
import type { Class, ClassDecorator } from "../types";
import { addClassToContainer } from "../utils/addClassToContainer";
import { validateKind } from "../utils/validateKind";
import { getInitializer } from "./getInitializer";

/**
 * A class decorator that encapsulates API endpoints
 *
 * @remarks
 *
 * `@Controller` represents a specific API entrypoint. It expects the API path as a parameter
 *
 * The HTTP method annotations `@Get`, `@Put`, `@Post`, `@Patch`, `@Delete` take the API endpoint path as an optional paramater
 *
 * @example
 * ```ts
 * import {
 *   Controller,
 *   Get,
 *   Put,
 *   Post,
 *   Patch,
 *   Delete,
 * } from "@fork-git-it/annotatedjs";
 *
 * @Controller("/items")
 * export class ExampleController {
 *   @Get()
 *   async getItems(req: Request): Promise<Response> {}
 *
 *   @Get("/:id")
 *   async getItem(req: Request): Promise<Response> {}
 *
 *   @Put("/:id")
 *   async putItem(req: Request): Promise<Response> {}
 *
 *   @Post("/:id")
 *   async postItem(req: Request): Promise<Response> {}
 *
 *   @Patch("/:id")
 *   async patchItem(req: Request): Promise<Response> {}
 *
 *   @Delete()
 *   async deleteItems(req: Request): Promise<Response> {}
 *
 *   @Delete("/:id")
 *   async deleteItem(req: Request): Promise<Response> {}
 * }
 * ```
 *
 * @typeParam T - Type of the annotated class
 *
 * @param controllerPath - Base path of the API endpoints
 *
 * @param container - Object that stores injectables
 */
export const Controller = <T extends Class<object>>(
  controllerPath: string,
  container = defaultContainer,
) =>
  ((constructor, context) => {
    validateContainer(container);

    const annotationName = `@${Controller.name}`;
    validateKind(annotationName, context, "class");

    if (typeof controllerPath !== "string") {
      throw new Error(
        `Invalid Controller path argument ${JSON.stringify(
          controllerPath,
        )}. Argument must be a string`,
      );
    }

    if (controllerPath.length === 0) {
      throw new Error("Controller path argument is an empty string");
    }

    context.addInitializer(
      getInitializer(annotationName, context, container, controllerPath),
    );

    addClassToContainer(container, keys.controllerClasses, constructor);
  }) as ClassDecorator<T>;
