import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  openHelp() {
    console.log("Aide ouverte");
    // Logique pour ouvrir l'aide (exemple : afficher une modale ou naviguer vers une page d'aide)
  }
}
