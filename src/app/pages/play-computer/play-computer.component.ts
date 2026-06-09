import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChessboardComponent } from '../../shared/components/chessboard/chessboard.component';
import { GameSidebarComponent } from '../../shared/components/game-sidebar/game-sidebar.component';

interface MoveHistory {
  num: number;
  white: string;
  black: string;
}

@Component({
  selector: 'app-play-computer',
  standalone: true,
  imports: [
    CommonModule,
    ChessboardComponent,
    GameSidebarComponent
  ],
  templateUrl: './play-computer.component.html',
  styleUrl: './play-computer.component.scss'
})
export class PlayComputerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('chessBoard') chessBoard!: ChessboardComponent;

  // Asosiy shaxmat obyekti va bot parametrlari
  chess: any = null;
  botDifficulty: number = 1200;
  isBotThinking: boolean = false;

  // Game over modal parametrlari
  isGameOver: boolean = false;
  gameResultTitle: string = '';
  gameResultMessage: string = '';
  gameResultClass: string = ''; // 'victory' | 'defeat' | 'draw'

  // Yurishlar tarixi
  moveHistoryList: MoveHistory[] = [];

  // Sinxronizatsiya uchun taymer (Interval)
  private syncIntervalId: any;

  ngOnInit() { }

  ngAfterViewInit() {
    // Taxta to'liq render bo'lgach chess.js instansini aniqlab olamiz
    setTimeout(() => {
      if ((this.chessBoard as any)?.chess) {
        this.chess = (this.chessBoard as any).chess;
      }

      // Har 400ms da taxta holatini tekshirib turuvchi xavfsiz qobiq
      this.syncIntervalId = setInterval(() => {
        this.syncGameAndBot();
      }, 400);
    }, 500);
  }

  ngOnDestroy() {
    if (this.syncIntervalId) {
      clearInterval(this.syncIntervalId);
    }
  }

  // Taxtadagi real holat va bot yurishini sinxronlash
  syncGameAndBot() {
    if (!this.chess && (this.chessBoard as any)?.chess) {
      this.chess = (this.chessBoard as any).chess;
    }

    if (!this.chess || this.isGameOver) return;

    // Yurishlar sonini solishtirish orqali tarixdagi o'zgarishni tekshirish
    const currentMoves = this.chess.history();
    const UIHistoryCount = this.moveHistoryList.reduce((acc, curr) => {
      return acc + (curr.white ? 1 : 0) + (curr.black !== '...' ? 1 : 0);
    }, 0);

    if (currentMoves.length > UIHistoryCount) {
      this.updateMoveHistory(currentMoves);
      this.checkGameStatus();

      // Agar navbat qoralarda ('b') bo'lsa va bot hali o'ylamayotgan bo'lsa, uni yurgazamiz
      if (!this.isGameOver && this.chess.turn() === 'b' && !this.isBotThinking) {
        this.makeBotMove();
      }
    }
  }

  // Botning o'z darajasiga mos yurish qilish mantiqi
  makeBotMove() {
    if (this.isGameOver || !this.chess) return;

    this.isBotThinking = true;

    setTimeout(() => {
      const possibleMoves = this.chess.moves({ verbose: true });

      if (possibleMoves.length === 0) {
        this.isBotThinking = false;
        this.checkGameStatus();
        return;
      }

      // Default holatda ixtiyoriy tasodifiy yurish
      let selectedMove = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];

      // Agar daraja 1200 va undan baland bo'lsa, raqib figurasini urib olishga qaratilgan yurishni izlaydi
      if (this.botDifficulty >= 1200) {
        const captures = possibleMoves.filter((m: any) => m.captured);
        if (captures.length > 0) {
          selectedMove = captures[Math.floor(Math.random() * captures.length)];
        }
      }

      // Taxtada bot harakatini aks ettirish
      if (this.chessBoard && typeof this.chessBoard.makeMove === 'function') {
        this.chessBoard.makeMove(selectedMove.from, selectedMove.to);
      } else {
        this.chess.move({ from: selectedMove.from, to: selectedMove.to });
        if (this.chessBoard && typeof this.chessBoard.loadPosition === 'function') {
          this.chessBoard.loadPosition(this.chess.fen());
        }
      }

      this.isBotThinking = false;
      const currentMoves = this.chess.history();
      this.updateMoveHistory(currentMoves);
      this.checkGameStatus();
    }, 600);
  }

  // Yurishlar tarixini HTML jadvalga mos formatlash
  updateMoveHistory(moves: string[]) {
    const formatted: MoveHistory[] = [];
    for (let i = 0; i < moves.length; i += 2) {
      formatted.push({
        num: Math.floor(i / 2) + 1,
        white: moves[i],
        black: moves[i + 1] ? moves[i + 1] : '...'
      });
    }
    this.moveHistoryList = formatted;
  }

  // O'yinda Mot, Durang yoki Pat bo'lganini aniqlash
  checkGameStatus() {
    if (!this.chess) return;

    // chess.js metodlarini turli versiyalarga moslab xavfsiz chaqiramiz
    const isGameOver = typeof this.chess.isGameOver === 'function' ? this.chess.isGameOver() : this.chess.game_over();

    if (isGameOver) {
      this.isGameOver = true;

      const isCheckmate = typeof this.chess.isCheckmate === 'function' ? this.chess.isCheckmate() : this.chess.in_checkmate();
      const isDraw = typeof this.chess.isDraw === 'function' ? this.chess.isDraw() : this.chess.in_draw();
      const isStalemate = typeof this.chess.isStalemate === 'function' ? this.chess.isStalemate() : this.chess.in_stalemate();

      if (isCheckmate) {
        // Navbat kimdaligiga qarab yutgan/yutqazgan aniqlanadi
        const turn = this.chess.turn();
        if (turn === 'b') {
          this.gameResultTitle = '🎉 G\'alaba!';
          this.gameResultMessage = 'Ajoyib strategiya! Siz Stockfish sun\'iy intellektini mot qildingiz.';
          this.gameResultClass = 'victory';
        } else {
          this.gameResultTitle = '❌ Mag\'lubiyat';
          this.gameResultMessage = 'Bot sizni mot qildi. Quyidagi tugma orqali revansh oling!';
          this.gameResultClass = 'defeat';
        }
      } else if (isDraw || isStalemate) {
        this.gameResultTitle = '🤝 Durang';
        this.gameResultClass = 'draw';
        this.gameResultMessage = isStalemate
          ? 'O\'yin pat (Stalemate) holati bilan yakunlandi.'
          : 'Kuchlar teng keldi yoki bir xil pozitsiya takrorlanishi tufayli durang.';
      }
    }
  }

  // Qiyinchilik o'zgarganda o'yinni yangilash
  onDifficultyChange(elo: number) {
    this.botDifficulty = elo;
    this.restartGame();
  }

  // Taslim bo'lish funksiyasi
  resignGame() {
    if (this.isGameOver) return;
    this.isGameOver = true;
    this.gameResultTitle = '🏳️ Taslim bo\'lindi';
    this.gameResultMessage = 'Siz o\'yinni to\'xtatib, taslim bo\'lishni tanladingiz.';
    this.gameResultClass = 'defeat';
  }

  // O'yinni to'liq yangidan boshlash
  restartGame() {
    this.isGameOver = false;
    this.moveHistoryList = [];
    this.isBotThinking = false;
    this.gameResultTitle = '';
    this.gameResultMessage = '';
    this.gameResultClass = '';

    if (this.chess) {
      this.chess.reset();
    }
    if (this.chessBoard && typeof this.chessBoard.loadPosition === 'function') {
      this.chessBoard.loadPosition('start');
    }
  }
}