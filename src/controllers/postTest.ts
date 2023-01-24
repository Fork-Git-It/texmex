import { Awaitable, RouteContext } from "@worker-tools/router";
import { Controller } from "../decorators/class/controller";
import { Post } from "../decorators/method/post";

@Controller("/test")
class PostTest {
  @Post("/post")
  test(req: Request, ctx: RouteContext): Awaitable<Response> {
    return new Response(req.body);
  }
}
