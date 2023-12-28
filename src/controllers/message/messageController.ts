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
  } from "tsoa";
import { Message, NewMessage } from "./message";
import { MessageService } from "./messageService";
import { AuthRequest } from "../../modules/authentication";


@Route('messages')
export class MessageController extends Controller {

    /**
     * Get a test message.
     */
    @Get("{messageId}")
    public async getMessage(
        @Path() messageId: string,
    ): Promise<Message> {
        return new MessageService().get(messageId);
    }

    /**
     * Send a test message. \n
     * Example AuthToken: abc123456
     */
    @SuccessResponse("201", "Created") // Custom success response
    @Security("authToken")
    @Post()
    public async sendMessage(
        @Request() request: AuthRequest,
        @Body() requestBody: NewMessage
    ): Promise<void> {
        this.setStatus(201); // set return status 201
        console.log('endpoint', request.user);
        
        new MessageService().send(requestBody);
        return;
    }
}