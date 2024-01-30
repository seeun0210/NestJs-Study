/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './board.entity';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { BoardStatus } from './board-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';

@Controller('/boards')
@UseGuards(AuthGuard())
export class BoardsController {
  private logger = new Logger('BoardController');
  constructor(private boardsService: BoardsService) {}
  @Post()
  @UsePipes(ValidationPipe)
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    this.logger.verbose(
      `User ${user.username} creating a new board. Payload: ${JSON.stringify(createBoardDto)}`,
    );
    return this.boardsService.createBoard(createBoardDto, user);
  }
  @Get('/:id')
  getBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardsService.getBoardById(id);
  }
  @Delete('/:id')
  async deleteBoard(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      const result = await this.boardsService.deleteBoard(id, user);
      return { message: result.message, statusCode: result.statusCode };
    } catch (error) {
      if (error.status === 404) {
        // NotFoundException
        throw new NotFoundException(error.message);
      } else {
        throw new InternalServerErrorException('Internal Server Error');
      }
    }
  }
  @Patch('/:id')
  async updateBoard(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ): Promise<Board> {
    return this.boardsService.updateBoardStatus(id, status, user);
  }
  @Get()
  async getAllBoards(@GetUser() user: User): Promise<Board[]> {
    this.logger.verbose(`User ${user.username} trying to get all boards`);
    return await this.boardsService.getAllBoards(user);
  }
}
