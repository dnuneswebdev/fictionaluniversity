import $ from 'jquery';


class Search {

  //1. DESCRIBE OUR OBJECT, SELECTORS, ETC...
  constructor() {
    this.addSearchHtml(); // TEM QUE CHAMAR EM PRIMEIRO PARA OS OUTROS EXISTIREM!!
    this.openButton = $('.js-search-trigger');
    this.closeButton = $('.search-overlay__close');
    this.searchOverlay = $('.search-overlay');
    this.searchField = $("#search-term");
    this.typingTimer;
    this.resultsDiv = $('#search-overlay__results'); //SELECT AN EMPTY DIV TO DISPLAY CONTENT FROM DB
    this.isSpinnerVisible = false;
    this.previousValue; //Keep tracks of the previous search value
    this.events(); //CHAMA OS EVENTOS LOGO QUE A PAGINA É CARREGADA (TIPO ngOnInit do Angular)
  }

  //2. EVENTS, CONNECT THE OBJECTS WITH THE METHODS
  events() {
    this.openButton.on('click', this.openOverlay.bind(this));
    this.closeButton.on('click', this.closeOverlay.bind(this));
    this.searchField.on('keyup', this.typingLogic.bind(this));
    $(document).on("keyup", this.keyPressDispatcher.bind(this));
  }


  //3. METHODS (function, action...)
  openOverlay() {
    this.searchOverlay.addClass('search-overlay--active'); //ADCIONA A CLASSE QUE ABRE O MODAL
    $("body").addClass('body-no-scroll'); //REMOVE O SCROLL DA PAGINA //OVERFLOW HIDDEN
    this.searchField.val('');
    setTimeout(() => this.searchField.focus(), 400);
    return false;
  }

  closeOverlay() {
    this.searchOverlay.removeClass('search-overlay--active');
    $("body").removeClass('body-no-scroll');
  }

  keyPressDispatcher(e) {
    if (e.keyCode == 27) {
      this.closeOverlay();
    }
  }

  typingLogic() {
    if (this.searchField.val() != this.previousValue) {
      clearTimeout(this.typingTimer); //reseta o tempo antes de tudo, BOAS PRATICAS!!!

      if (this.searchField.val()) {
        if (!this.isSpinnerVisible) { // Não faz com que a animaçãi fique ativando a cada tecla
          this.resultsDiv.html('<div class="spinner-loader"></div>');
          this.isSpinnerVisible = true;
        }
        this.typingTimer = setTimeout(this.getResults.bind(this), 800);
      } else {
        this.resultsDiv.html('');
        this.isSpinnerVisible = false;
      }
    }

    this.previousValue = this.searchField.val();
  }

  getResults() { //                //PEGA OQUE O USER DIGITOU E PROCURA
    $.getJSON(universityData.root_url + '/wp-json/university/v1/search?term=' + this.searchField.val(), (results) => {
      this.resultsDiv.html(`
        <div class="row">

          <div class="one-third">
            <h2 class="search-overlay__section-title">General Information</h2>
            ${results.generalInfo.length ? '<ul class="link-list min-list">' : '<p>No Matches....</p>' }
            ${results.generalInfo.map(item => `<li><a href="${item.permalink}">${item.title}</a> 
            ${item.postType == 'post' ? `by ${item.authorName}` : ''}</li>`).join('')}
            ${results.generalInfo.length ? '</ul>' : ''} 
          </div>

          <div class="one-third">
            <h2 class="search-overlay__section-title">Programs</h2>
            ${results.programs.length ? '<ul class="link-list min-list">' : `<p>No Programs match that search.<a href="${universityData.root_url}/programs">View all programs</a></p>`}
            ${results.programs.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join('')}
            ${results.programs.length ? '</ul>' : ''} 

            <h2 class="search-overlay__section-title">Professors</h2>
            ${results.professors.length ? '<ul class="professor-cards">' : `<p>No professors found...<a href="${universityData.root_url}/professors">View all professors</a></p>`}
            ${results.professors.map(item => `
            <li class="professor-card__list-item">
            <a class="professor-card" href="${item.permalink}">
              <img class="professor-card__image" src="${item.image}" alt="professor photo">
              <span class="professor-card__name">${item.title}</span>
            </a>
            </li>
            `).join('')}
            ${results.professors.length ? '</ul>' : ''} 

          </div>

          <div class="one-third">
            <h2 class="search-overlay__section-title">Campuses</h2>
            ${results.campuses.length ? '<ul class="link-list min-list">' : `<p>No Campuses match the search...<a href="${universityData.root_url}/campuses">View all campuses</a></p>`}
            ${results.campuses.map(item => `<li><a href="${item.permalink}">${item.title}</a></li>`).join('')}
            ${results.campuses.length ? '</ul>' : ''} 

            <h2 class="search-overlay__section-title">Events</h2>
            ${results.events.length ? '' : `<p>No Events found...<a href="${universityData.root_url}/events">View all events</a></p>`}
            ${results.events.map(item => `
            <div class="event-summary">
            <a class="event-summary__date t-center" href="<${item.permalink}">
              <span class="event-summary__month">${item.month}</span>
              <span class="event-summary__day">${item.day}</span>
            </a>
            <div class="event-summary__content">
              <h5 class="event-summary__title headline headline--tiny">
                <a href="${item.permalink}">${item.title}</a>
              </h5>
              <p>${item.description}<a href="${item.permalink}" class="nu gray">Learn more</a></p>
            </div>
          </div>
            `).join('')}
          </div>

        </div>

      `);
      this.isSpinnerVisible = false;
    });

  }

  addSearchHtml() { //.append adiciona html no fim do html
    $('body').append(`
      <div class="search-overlay">
        <div class="search-overlay__top">
          <div class="container">
          <i class="fa fa-search search-overlay__icon" aria-hidden="true"></i>
          <input type="text" class="search-term" placeholder="What are you looking for" id="search-term">
          <i class="fa fa-window-close search-overlay__close" aria-hidden="true"></i>
          </div>
        </div>

        <div class="container">
          <div id="search-overlay__results">
            
          </div>
        </div>
      </div>
    `);
  }
}


export default Search