import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './board.entity';

@Controller('/boards')
export class BoardsController {
  constructor(private boardsService: BoardsService) {}

  // @Get()
  // getAllBoard(): Board[] {
  //   return this.boardsService.getAllBoards();
  // }
  // @Post()
  // @UsePipes(ValidationPipe)
  // createBoard(@Body() createBoardDto: CreateBoardDto): Board {
  //   return this.boardsService.createBoard(createBoardDto);
  // }
  @Post()
  @UsePipes(ValidationPipe)
  createBoard(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardsService.createBoard(createBoardDto);
  }
  // @Get('/:id')
  // getBoardById(@Param('id') id: string): Board {
  //   return this.boardsService.getBoardById(id);
  // }
  @Get('/:id')
  getBoardById(@Param('id') id: number): Promise<Board> {
    return this.boardsService.getBoardById(id);
  }
  // @Delete('/:id')
  // deleteBoard(@Param('id') id: string): void {
  //   this.boardsService.deleteBoard(id);
  // }
  @Delete('/:id')
  async deleteBoard(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; statusCode: number }> {
    try {
      const result = await this.boardsService.deleteBoard(id);
      return { message: result.message, statusCode: result.statusCode };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException('Internal Server Error');
    }
  }
  // @Patch('/:id')
  // updateBoardStatus(
  //   @Param('id') id: string,
  //   @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  // ) {
  //   return this.boardsService.updateBoardStatus(id, status);
  // }
}
