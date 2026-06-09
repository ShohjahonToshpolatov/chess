import { Component, OnInit } from '@angular/core';

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
  files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  boardGrid: ChessSquare[][] = [];

  // Hozircha visual test uchun mock ma'lumotlar
  selectedSquare: string | null = null;
  possibleMoves: string[] = ['e3', 'e4', 'd4', 'f4'];

  ngOnInit() {
    this.generateInitialBoard();
  }

  generateInitialBoard() {
    // Shaxmat taxtasini boshlang'ich vizual holatda chizish (Mock)
    const initialPieces: { [key: string]: { char: string, isWhite: boolean } } = {
      'a8': { char: '♜', isWhite: false }, 'b8': { char: '♞', isWhite: false }, 'c8': { char: '♝', isWhite: false }, 'd8': { char: '♛', isWhite: false },
      'e8': { char: '♚', isWhite: false }, 'f8': { char: '♝', isWhite: false }, 'g8': { char: '♞', isWhite: false }, 'h8': { char: '♜', isWhite: false },
      'a7': { char: '♟', isWhite: false }, 'b7': { char: '♟', isWhite: false }, 'c7': { char: '♟', isWhite: false }, 'd7': { char: '♟', isWhite: false },
      'e7': { char: '♟', isWhite: false }, 'f7': { char: '♟', isWhite: false }, 'g7': { char: '♟', isWhite: false }, 'h7': { char: '♟', isWhite: false },

      'a2': { char: '♙', isWhite: true }, 'b2': { char: '♙', isWhite: true }, 'c2': { char: '♙', isWhite: true }, 'd2': { char: '♙', isWhite: true },
      'e2': { char: '♙', isWhite: true }, 'f2': { char: '♙', isWhite: true }, 'g2': { char: '♙', isWhite: true }, 'h2': { char: '♙', isWhite: true },
      'a1': { char: '♖', isWhite: true }, 'b1': { char: '♘', isWhite: true }, 'c1': { char: '♗', isWhite: true }, 'd1': { char: '♕', isWhite: true },
      'e1': { char: '♔', isWhite: true }, 'f1': { char: '♗', isWhite: true }, 'g1': { char: '♘', isWhite: true }, 'h1': { char: '♖', isWhite: true },
    };

    for (let r = 0; r < 8; r++) {
      const row: ChessSquare[] = [];
      const rank = 8 - r;
      for (let c = 0; c < 8; c++) {
        const file = this.files[c];
        const coord = `${file}${rank}`;
        const pieceData = initialPieces[coord];

        row.push({
          coord: coord,
          piece: pieceData ? pieceData.char : null,
          isWhite: pieceData ? pieceData.isWhite : false
        });
      }
      this.boardGrid.push(row);
    }
  }

  onSquareClick(coord: string) {
    if (this.selectedSquare === coord) {
      this.selectedSquare = null;
    } else {
      this.selectedSquare = coord;
    }
  }
}