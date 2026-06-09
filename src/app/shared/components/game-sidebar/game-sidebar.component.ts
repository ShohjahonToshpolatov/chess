import { Component } from '@angular/core';
import { MoveHistoryComponent } from '../move-history/move-history.component';

@Component({
  selector: 'app-game-sidebar',
  standalone: true,
  imports: [MoveHistoryComponent],
  templateUrl: './game-sidebar.component.html',
  styleUrl: './game-sidebar.component.scss'
})
export class GameSidebarComponent {
  currentLevel = 2; // Dastlabki o'yin darajasi
}