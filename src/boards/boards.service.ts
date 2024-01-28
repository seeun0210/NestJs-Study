import { Injectable } from '@nestjs/common';

@Injectable()
export class BoardsService {
  private boards = ['ddd', 'ddd', 'ddd'];

  getAllBoards() {
    return this.boards;
  }
}
