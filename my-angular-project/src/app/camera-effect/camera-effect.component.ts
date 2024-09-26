import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Renderer2,
  HostListener,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-camera-effect',
  templateUrl: './camera-effect.component.html',
  styleUrls: ['./camera-effect.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CameraEffectComponent implements AfterViewInit {
  @ViewChild('interactiveImage', { static: false }) interactiveImage!: ElementRef<SVGElement>;
  @ViewChild('contentElement', { static: false }) contentElement!: ElementRef;
  @ViewChild('logoSound', { static: false }) logoSound!: ElementRef<HTMLAudioElement>;
  @ViewChild('boxesSection', { static: false }) boxesSection!: ElementRef;
  @ViewChild('logoSection', { static: false }) logoSection!: ElementRef;
  @ViewChild('contentSection', { static: false }) contentSection!: ElementRef;
  @ViewChild('keyFeaturesSection', { static: false }) keyFeaturesSection!: ElementRef;

  letters: SVGElement[] = [];
  paths: SVGElement[] = [];

  private currentSectionIndex = 0; // 0: Logo, 1: Contenu, 2: Bento Grid, 3: Key Features
  private sections: HTMLElement[] = [];
  private isAnimating = false;

  // Contenu dynamique pour le survol
  contents = [
    'Contenu pour "Le tramway Jaune c’est sympa"',
    'Contenu pour "Le tramway Jaune c’est joli"',
    'Contenu pour "Le tramway Jaune c’est cool"',
    'Contenu pour "Le tramway Jaune c’est la vie de fou"',
    'Contenu pour "Le tramway Jaune c’est avant tout une amitié forte"',
  ];

  currentContent = 'Passez la souris sur un élément pour voir le contenu';

  // Propriétés pour le slider
  slides = [
    {
      title: 'Titre-section 1',
      content: 'Le tramway jaune c’est joli',
      description: 'Le tramway jaune c’est joli, regardez c’est de toute beauté',
      note: 'Le tramway jaune c’est joli',
      additionalContent: 'Le tramway jaune avance lentement dans le brouillard.',
      expanded: false,
    },
    {
      title: 'Titre-section 2',
      content: 'Contenu du slide 2',
      description: 'Description du slide 2',
      note: 'Note pour le slide 2',
      additionalContent: 'Contenu supplémentaire pour le slide 2',
      expanded: false,
    },
    {
      title: 'Titre-section 3',
      content: 'Contenu du slide 3',
      description: 'Description du slide 3',
      note: 'Note pour le slide 3',
      additionalContent: 'Contenu supplémentaire pour le slide 3',
      expanded: false,
    },
    // Slide 4
    {
      title: 'Titre-section 4',
      content: 'Nouveau contenu pour le slide 4',
      description: 'Description additionnelle pour le slide 4',
      note: 'Note spéciale pour le slide 4',
      additionalContent: 'Contenu supplémentaire pour le slide 4',
      expanded: false,
    },
    // Slide 5
    {
      title: 'Titre-section 5',
      content: 'Nouveau contenu pour le slide 5',
      description: 'Description additionnelle pour le slide 5',
      note: 'Note spéciale pour le slide 5',
      additionalContent: 'Contenu supplémentaire pour le slide 5',
      expanded: false,
    },
  ];

  currentSlideIndex = 0;
  maxSlideIndex = 0;
  sliderTransform = 'translateX(0%)';

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    const letterIds = ['letter1', 'letter2', 'letter3', 'letter4']; // De gauche à droite
    const pathIds = ['path1', 'path2'];

    // Initialiser les lettres
    this.letters = letterIds
      .map((id) => {
        const letter = this.interactiveImage.nativeElement.querySelector(`#${id}`) as SVGElement;
        return letter || null;
      })
      .filter((el) => el !== null) as SVGElement[];

    // Initialiser les chemins
    this.paths = pathIds
      .map((id) => {
        const path = this.interactiveImage.nativeElement.querySelector(`#${id}`) as SVGElement;
        return path || null;
      })
      .filter((el) => el !== null) as SVGElement[];

    // Jouer le son et lancer l'animation d'apparition du logo
    this.animateLogoWithSound();

    // Initialiser les sections
    this.sections = [
      this.logoSection.nativeElement,
      this.contentSection.nativeElement,
      this.boxesSection.nativeElement,
      this.keyFeaturesSection.nativeElement, // Ajout de la nouvelle section
    ];

    // Assurer que seules les sections actives sont visibles
    this.updateSectionsVisibility();

    // Calculer le maxSlideIndex pour le slider
    this.calculateMaxSlideIndex();
    this.updateSliderTransform();
  }

  // Fonction pour jouer le son et animer l'apparition du logo
  animateLogoWithSound() {
    const audioElement = this.logoSound.nativeElement;

    // Jouer le son
    audioElement.play().catch((error) => {
      console.error('Erreur lors de la lecture du son :', error);
    });

    // Apparition progressive des lettres de gauche à droite
    this.letters.forEach((letter, index) => {
      setTimeout(() => {
        this.renderer.setStyle(letter, 'opacity', '1');
        this.renderer.setStyle(letter, 'transform', 'translateX(0)'); // Animation smooth de gauche à droite
      }, index * 500); // Intervalle de 500ms entre chaque lettre
    });

    // Apparition des paths (logo)
    this.paths.forEach((path, index) => {
      setTimeout(() => {
        this.renderer.setStyle(path, 'opacity', '1');
        this.renderer.setStyle(path, 'transform', 'translateX(0)'); // Animation smooth de gauche à droite
      }, 2000); // Commence après l'apparition des lettres
    });
  }

  // Gestion des événements de défilement pour déclencher les transitions
  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    event.preventDefault(); // Empêche le comportement de défilement par défaut

    if (this.isAnimating) return; // Empêche les animations simultanées

    if (event.deltaY > 0) {
      this.navigateToNextSection();
    } else {
      this.navigateToPreviousSection();
    }
  }

  // Navigation vers la section suivante
  navigateToNextSection() {
    if (this.currentSectionIndex < this.sections.length - 1) {
      this.isAnimating = true;
      this.currentSectionIndex++;
      this.updateSectionsVisibility();
      setTimeout(() => {
        this.isAnimating = false;
      }, 1000); // Durée de l'animation
    }
  }

  // Navigation vers la section précédente
  navigateToPreviousSection() {
    if (this.currentSectionIndex > 0) {
      this.isAnimating = true;
      this.currentSectionIndex--;
      this.updateSectionsVisibility();
      setTimeout(() => {
        this.isAnimating = false;
      }, 1000); // Durée de l'animation
    }
  }

  // Mettre à jour la visibilité des sections
  updateSectionsVisibility() {
    this.sections.forEach((section, index) => {
      if (index === this.currentSectionIndex) {
        if (index === 0) {
          this.renderer.addClass(section, 'active');
          this.renderer.removeClass(section, 'hidden');
          this.renderer.removeClass(section, 'visible');
        } else {
          this.renderer.addClass(section, 'visible');
          this.renderer.removeClass(section, 'hidden');
          this.renderer.removeClass(section, 'active');
        }
      } else {
        this.renderer.removeClass(section, 'active');
        this.renderer.removeClass(section, 'visible');
        this.renderer.addClass(section, 'hidden');
      }
    });
  }

  // Méthode pour gérer le clic sur le bouton "Lire la suite"
  onReadMore() {
    console.log("Le bouton 'Lire la suite' a été cliqué!");
    // Vous pouvez ajouter ici la navigation ou l'ouverture d'une modal
  }

  // Méthodes pour gérer le survol des éléments
  onHoverItem(index: number) {
    this.currentContent = this.contents[index];
  }

  onLeaveItem() {
    this.currentContent = 'Passez la souris sur un élément pour voir le contenu';
  }

  // Méthodes pour contrôler le slider
  prevSlide() {
    if (this.currentSlideIndex > 0) {
      this.currentSlideIndex--;
      this.updateSliderTransform();
    }
  }

  nextSlide() {
    if (this.currentSlideIndex < this.maxSlideIndex) {
      this.currentSlideIndex++;
      this.updateSliderTransform();
    }
  }

  calculateMaxSlideIndex() {
    const baseSlideWidth = 55; // Largeur de base du slide en pourcentage
    const expandedSlideWidth = 80; // Largeur du slide lorsqu'il est étendu
    const visibleWidth = 100; // Largeur visible du conteneur en pourcentage

    // Calculer la largeur totale des slides
    let totalWidth = 0;
    this.slides.forEach((slide) => {
      totalWidth += slide.expanded ? expandedSlideWidth : baseSlideWidth;
    });

    // Calculer le nombre maximal de décalages
    const maxOffset = totalWidth - visibleWidth;
    this.maxSlideIndex = Math.ceil(maxOffset / baseSlideWidth);
  }

  updateSliderTransform() {
    const baseSlideWidth = 55;
    const expandedSlideWidth = 80;
    let translateX = 0;

    for (let i = 0; i < this.currentSlideIndex; i++) {
      translateX += this.slides[i].expanded ? expandedSlideWidth : baseSlideWidth;
    }

    this.sliderTransform = `translateX(-${translateX}%)`;
  }

  toggleDetails(index: number) {
    this.slides[index].expanded = !this.slides[index].expanded;
    this.calculateMaxSlideIndex();
    this.updateSliderTransform();
  }
}
