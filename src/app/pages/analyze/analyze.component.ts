import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChessboardComponent } from '../../shared/components/chessboard/chessboard.component';

@Component({
  selector: 'app-analyze',
  standalone: true,
  imports: [ChessboardComponent, FormsModule],
  templateUrl: './analyze.component.html',
  styleUrl: './analyze.component.scss'
})
export class AnalyzeComponent {
  pgnInput: string = '';
  isAnalyzing: boolean = false;
  analysisResult: boolean = false;

  startPgnAnalysis() {
    if (!this.pgnInput.trim()) return;

    this.isAnalyzing = true;
    this.analysisResult = false;

    // Dvijok tahlilini simulyatsiya qilish
    setTimeout(() => {
      this.isAnalyzing = false;
      this.analysisResult = true;
    }, 2000);
  }
}