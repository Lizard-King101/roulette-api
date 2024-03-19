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
import { PiService } from "./piService";
import { AuthRequest } from "../../modules/authentication";


@Tags("PI") // group endpoints
@Route("pi") // base route `/messages`
export class PiController extends Controller {

    @Post("approve")
    public async approve(
        @Body() body: {id: string}
    ) {
        return new PiService().approve(body.id);
    }

    @Post("confirm")
    public async confirm(
        @Body() body: {id: string, txid: string}
    ) {
        return new PiService().confirm(body.id, body.txid);
    }

    @Post("withdraw")
    public async withdraw(
        @Body() body: {uid: string, amount: number}
    ) {
        return new PiService().withdraw(body.uid, body.amount);
    }
    // /**
    //  * Get a test message.
    //  */
    // @Get("{messageId}")
    // public async getMessage(
    //     @Path() messageId: string
    // ): Promise<Message> {
    //     return new MessageService().get(messageId);
    // }

    // /**
    //  * Send a test message. <br>
    //  * Example AuthToken: abc123456
    //  */
    // @SuccessResponse("201", "Created") // Custom success response
    // @Security("AuthToken") // use authentication
    // @Post("send") // add sub route `/messages/send`
    // public async sendMessage(
    //     @Request() request: AuthRequest, // inject Express Request extended to include `user` object that is injected from the authentication module.
    //     @Body() requestBody: NewMessage // Body of the Request
    // ): Promise<Message> {
    //     this.setStatus(201); // set return status 201
    //     console.log('endpoint', request.user);
    

    //     return new MessageService().send(requestBody, request.user);
    // }
}