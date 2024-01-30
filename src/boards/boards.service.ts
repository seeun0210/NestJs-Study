import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
@Injectable()
export class BoardsService {
  constructor(private boardRepository: BoardRepository) {}

  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    return await this.boardRepository.createBoard(createBoardDto);
  }

  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepository.findOne({ where: { id } });

    if (!found) {
      throw new NotFoundException(`Can't find board with id ${id}`);
    }

    return found;
  }
}
