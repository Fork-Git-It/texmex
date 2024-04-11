import { keys } from "../../src/container/keys";
import { RequestScope } from "../../src/decorators/config/requestScope";
import {
  itExpectsAValidContainer,
  itThrowsErrorIfNotUsedOnAClass,
  itThrowsWhenUsedOnAnUnnamedClass,
} from "./utils/classDecorators";

describe("@RequestScope", () => {
  itExpectsAValidContainer(RequestScope);
  itThrowsErrorIfNotUsedOnAClass(RequestScope);
  itThrowsWhenUsedOnAnUnnamedClass(RequestScope);

  it("throws error when class is not a config class in the container", () => {
    class Config {}

    expect(() =>
      RequestScope({ [keys.configClasses]: [Config] })(
        class {},
        // @ts-expect-error not a valid context
        {
          kind: "class",
          name: "NotConfig",
        },
      ),
    ).toThrow();
  });

  it("has an initialization hook", () => {
    class Config {}
    const spy = jest.fn();

    RequestScope({ [keys.configClasses]: [Config] })(
      class {},
      // @ts-expect-error not a valid context
      {
        kind: "class",
        name: Config.name,
        addInitializer: spy,
      },
    );

    expect(spy).toHaveBeenCalledWith(expect.any(Function));
  });
});
