import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
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
    user: User,
  ): Promise<{ message: string; statusCode: number }> {
    const board = await this.boardRepository.findOne({ where: { id } });

    if (!board) {
      throw new NotFoundException(`게시물이 존재하지 않습니다.`);
    }
    // console.log(board.user);
    //-> undefined 접근 불가능함 이렇게는
    const result = await this.boardRepository.delete({ id, user });

    if (result.affected) {
      return { message: '게시물 삭제 성공!', statusCode: 200 };
    } else {
      throw new NotFoundException(`게시물이 존재하지 않습니다.`);
    }
  }
  async updateBoardStatus(
    id: number,
    status: BoardStatus,
    user: User,
  ): Promise<Board> {
    try {
      const query = await this.boardRepository.createQueryBuilder('board');
      query.where('board.userId = :userId AND board.id = :id', {
        userId: user.id,
        id,
      });
      const board = await query.getOneOrFail();
      board.status = status;
      await this.boardRepository.save(board);
      return board;
    } catch (err) {
      throw new InternalServerErrorException(err);
    }
  }
  async getAllBoards(user: User) {
    //방법2) QueryBuilder 이용하기
    const query = this.boardRepository.createQueryBuilder('board');
    query.where('board.userId=:userId', { userId: user.id });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const boards: Board[] = await query.getMany();

    //방법1) typeORM 내장 API 활용하기
    // const boards: Board[] = await this.boardRepository.find({
    //   where: { user: user },
    // });

    return boards;
  }
}
