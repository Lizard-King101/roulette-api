import {
    Body,
    Controller,
    Get,
    Path,
    Post,
    Query,
    Request,
    Response,
    Route,
    Security,
    SuccessResponse,
    Tags
  } from "tsoa";
import { AccountService } from "./accountService";

@Tags("Account") // group endpoints
@Route("account") // base route `/messages`
export class AccountController extends Controller {
    /**
     * Get a test message.
     */
    @Get("{uid}")
    public async getMessage(
        @Path() uid: string
    ) {
        return new AccountService().getAccount(uid);
    }
}