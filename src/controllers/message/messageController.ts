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
import { Message, NewMessage } from "./message";
import { MessageService } from "./messageService";
import { AuthRequest } from "../../modules/authentication";


@Tags("Messages") // group endpoints
@Route("messages") // base route `/messages`
export class MessageController extends Controller {

    /**
     * Get a test message.
     */
    @Get("{messageId}")
    public async getMessage(
        @Path() messageId: string
    ): Promise<Message> {
        return new MessageService().get(messageId);
    }

    /**
     * Send a test message. <br>
     * Example AuthToken: abc123456
     */
    @SuccessResponse("201", "Created") // Custom success response
    @Security("AuthToken") // use authentication
    @Post("send") // add sub route `/messages/send`
    public async sendMessage(
        @Request() request: AuthRequest, // inject Express Request extended to include `user` object that is injected from the authentication module.
        @Body() requestBody: NewMessage // Body of the Request
    ): Promise<Message> {
        this.setStatus(201); // set return status 201
        console.log('endpoint', request.user);
    

        return new MessageService().send(requestBody, request.user);
    }
}