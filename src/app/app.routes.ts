import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomeComponent } from './pages/home/home.component';
import { PlayComputerComponent } from './pages/play-computer/play-computer.component';
import { PuzzlesComponent } from './pages/puzzles/puzzles.component';
import { AnalyzeComponent } from './pages/analyze/analyze.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', component: HomeComponent },
            { path: 'play', component: PlayComputerComponent },
            { path: 'puzzles', component: PuzzlesComponent },
            { path: 'analyze', component: AnalyzeComponent }
        ]
    },
    { path: '**', redirectTo: '' } // Noto'g'ri URL yozilsa, Home'ga otadi
];