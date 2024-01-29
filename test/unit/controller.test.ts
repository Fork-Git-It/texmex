import { MetadataProperties } from "../../src/decorators/controller/metadataProperties";
import { MetadataProperties as injectMetadataProperties } from "../../src/decorators/inject/metadataProperties";
import { Controller } from "../../src/index";
import { itCreatesInstanceOfClass, itHasInitializationHook } from "./utils";

describe("Controller", () => {
  const kind = "class";
  const name = "Controller";
  const initializerFor =
    <T>(className: T) =>
    (initializer: Function) =>
      initializer.call(className);

  itCreatesInstanceOfClass(name, Controller("path", { Router: {} }));
  itHasInitializationHook(name, Controller("path", { Router: {} }));

  it("initialization hook to create instance of class", () => {
    const spy = jest.fn();

    class ControllerClass {
      constructor() {
        spy();
      }
    }

    Controller("path", { Router: {} })(ControllerClass, {
      kind,
      name,
      addInitializer: initializerFor(ControllerClass),
      metadata: {},
    });

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("sets injectables on class instance", () => {
    const key = "key";
    const value = null;
    const set = jest.fn();
    class ControllerClass {}

    Controller("path", { Router: {}, [key]: value })(class {}, {
      kind,
      name,
      addInitializer: initializerFor(ControllerClass),
      metadata: {
        [injectMetadataProperties.injectables]: [{ key, set }],
      },
    });

    expect(set).toHaveBeenCalledWith(expect.any(ControllerClass), value);
  });

  it("configures router with annotated methods", () => {
    const get = jest.fn();
    const controllerPath = "controller";
    const methodPath = "method";
    const handler = () => {};
    const boundFunction = jest.fn();
    const bind = jest.fn(() => boundFunction);
    handler.bind = bind;
    class ControllerClass {}

    Controller(controllerPath, { Router: { get } })(class {}, {
      kind,
      name,
      addInitializer: initializerFor(ControllerClass),
      metadata: {
        [MetadataProperties.methods]: [
          { path: methodPath, httpMethod: "Get", handler },
        ],
      },
    });

    expect(get).toHaveBeenCalledWith(
      `/${controllerPath}/${methodPath}`,
      boundFunction
    );
    expect(bind).toHaveBeenCalledWith(expect.any(ControllerClass));
  });
});
