import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Chess } from 'chess.js';

interface ChessSquare {
  coord: string;
  piece: string | null;
  isWhite: boolean;
}

@Component({
  selector: 'app-chessboard',
  standalone: true,
  imports: [],
  templateUrl: './chessboard.component.html',
  styleUrl: './chessboard.component.scss'
})
export class ChessboardComponent implements OnInit {
  makeMove(from: any, to: any) {
    throw new Error('Method not implemented.');
  }
  private chess = new Chess();

  files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  boardGrid: ChessSquare[][] = [];

  selectedSquare: string | null = null;
  possibleMoves: string[] = [];

  // O'yin yon paneli va tarixiga yurishlarni xabar qilish uchun
  @Output() moveMade = new EventEmitter<{ san: string, history: any[] }>();

  // Unicode shaxmat figuralari xaritasi
  private pieceMap: { [key: string]: string } = {
    'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚',
    'P': '♙', 'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔'
  };

  ngOnInit() {
    this.updateBoardView();
  }

  // chess.js holatidan kelib chiqib taxtani vizual qayta chizish
  updateBoardView() {
    const chessBoard = this.chess.board();
    this.boardGrid = [];

    for (let r = 0; r < 8; r++) {
      const row: ChessSquare[] = [];
      for (let c = 0; c < 8; c++) {
        const piece = chessBoard[r][c];
        const coord = `${this.files[c]}${8 - r}`;

        row.push({
          coord: coord,
          piece: piece ? this.pieceMap[piece.color === 'w' ? piece.type.toUpperCase() : piece.type] : null,
          isWhite: piece ? piece.color === 'w' : false
        });
      }
      this.boardGrid.push(row);
    }
  }

  onSquareClick(coord: string) {
    // Agar foydalanuvchi marker qo'yilgan katakni bossa — u yerga yuradi
    if (this.possibleMoves.includes(coord) && this.selectedSquare) {
      try {
        const move = this.chess.move({
          from: this.selectedSquare,
          to: coord,
          promotion: 'q' // Peshka oxiriga yetsa avtomatik Farzinga aylanadi
        });

        if (move) {
          this.updateBoardView();
          this.moveMade.emit({
            san: move.san,
            history: this.chess.history()
          });

          // Bot harakatini simulyatsiya qilish (Keyingi qadamda Stockfish ulanadi)
          setTimeout(() => this.makeRandomBotMove(), 600);
        }
      } catch (e) {
        console.log("Yurishda xatolik:", e);
      }

      this.selectedSquare = null;
      this.possibleMoves = [];
      return;
    }

    // Katak tanlanganda uning yurish variantlarini olish
    const squareData = this.getSquareData(coord);
    if (squareData && squareData.piece && this.chess.turn() === (squareData.isWhite ? 'w' : 'b')) {
      this.selectedSquare = coord;
      const moves = this.chess.moves({ square: coord as any, verbose: true });
      this.possibleMoves = moves.map(m => m.to);
    } else {
      this.selectedSquare = null;
      this.possibleMoves = [];
    }
  }

  private getSquareData(coord: string): ChessSquare | null {
    for (const row of this.boardGrid) {
      const found = row.find(s => s.coord === coord);
      if (found) return found;
    }
    return null;
  }

  // Stockfish ulanguncha bot o'zgaruvchanligini tekshirish uchun oddiy harakat
  private makeRandomBotMove() {
    if (this.chess.isGameOver()) return;
    const moves = this.chess.moves();
    if (moves.length > 0) {
      const randomMove = moves[Math.floor(Math.random() * moves.length)];
      this.chess.move(randomMove);
      this.updateBoardView();
      this.moveMade.emit({
        san: randomMove,
        history: this.chess.history()
      });
    }
  }
  // FEN bo'yicha taxtani yangilash (Puzzles uchun kerak)
  loadPosition(fen: string) {
    this.chess.load(fen);
    this.selectedSquare = null;
    this.possibleMoves = [];
    this.updateBoardView();
  }

  // Hozirgi dynamic holatni tekshirish uchun (Yechimni tekshirishda asqatadi)
  getGameFen(): string {
    return this.chess.fen();
  }
  // O'yinni qayta boshlash funksiyasi
  resetGame() {
    this.chess.reset();
    this.selectedSquare = null;
    this.possibleMoves = [];
    this.updateBoardView();
  }
}