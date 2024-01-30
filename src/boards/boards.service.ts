import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { Board } from './board.entity';
import { BoardRepository } from './board.repository';
import { BoardStatus } from './board-status.enum';
import { User } from 'src/auth/user.entity';

@Injectable()
export class BoardsService {
  constructor(private boardRepository: BoardRepository) {}

  async createBoard(
    createBoardDto: CreateBoardDto,
    user: User,
  ): Promise<Board> {
    return await this.boardRepository.createBoard(createBoardDto, user);
  }

  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepository.findOne({ where: { id } });

    if (!found) {
      throw new NotFoundException(`Can't find board with id ${id}`);
    }

    return found;
  }
  async deleteBoard(
    id: number,
  ): Promise<{ message: string; statusCode: number }> {
    const result = await this.boardRepository.delete(id);

    if (result.affected) {
      // 게시물이 삭제되었으면 성공 메시지를 반환합니다.
      return { message: '게시물 삭제 성공!', statusCode: 200 };
    } else {
      // 게시물이 존재하지 않으면 예외를 발생시킵니다.
      throw new NotFoundException(`게시물이 존재하지 않습니다.`);
    }
  }
  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);
    board.status = status;
    await this.boardRepository.save(board);
    return board;
  }
  async getAllBoards() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const boards: Board[] = await this.boardRepository.find();
    return boards;
  }
}
