import $ from 'jquery';


class MyNotes {

  //SELECTORS
  constructor() {
    this.events();
  }

  //EVENTS
  events() {
    $(".delete-note").on('click', this.deleteNote.bind(this));
    $(".edit-note").on('click', this.editNote.bind(this));
    $(".update-note").on('click', this.updateNote.bind(this));

  }

  //METHODS
  deleteNote(e) { //MANDA UMA REQUISIÇÃO AJAX DE DELETE PARA A REST API DO WP
    let thisNote = $(e.target).parents("li"); //VARIABLE TO SELECT THE DATA-ID IN THE HTML

    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', universityData.nonce); 
      }, 
      url: universityData.root_url + '/wp-json/wp/v2/note/' + thisNote.data('id'),
      type: 'DELETE',
      success: (response) => {
        thisNote.slideUp(); //REMOVE ALGUM ITEM NA PAGINA COM UMA ANIMAÇÃO
        console.log('Congrats');
        console.log(response);
      },
      error: (response) => {
        console.log('Sorry');
        console.log(response);
      }
    });
  }

  updateNote(e) { //MANDA UMA REQUISIÇÃO AJAX DE UPDATE PARA A REST API DO WP
    let thisNote = $(e.target).parents("li"); //VARIABLE TO SELECT THE DATA-ID IN THE HTML
    let ourUpdatedPost = {
      'title': thisNote.find(".note-title-field").val(),
      'content': thisNote.find(".note-vody-field").val()
    };

    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', universityData.nonce); 
      }, 
      url: universityData.root_url + '/wp-json/wp/v2/note/' + thisNote.data('id'),
      type: 'POST',
      data: ourUpdatedPost,
      success: (response) => {
        this.makeNoteReadOnly(thisNote); //CHAMA A FUNÇÂO READONLY
        console.log('Congrats');
        console.log(response);
      },
      error: (response) => {
        console.log('Sorry');
        console.log(response);
      }
    });
  }

  editNote(e) {
    let thisNote = $(e.target).parents("li");

    if(thisNote.data("state") == 'editable') {
      this.makeNoteReadOnly(thisNote); //REFERENCIAR A VARIAVEL CRIADA PARA AS OUTRAS FUNÇOES PODEREM ACESSA-LA
    }
    else {
      this.makeNoteEditable(thisNote);
    }

  }

  makeNoteEditable(thisNote) { //VARIAVEL thisNote CRIADA EM OUTRA FUNÇÂO
    thisNote
    .find(".edit-note") //seleciona o botao de EDIT
    .html('<i class="fa fa-times" aria-hidden="true"></i> Cancel'); //TROCA O BOTAO EDIT POR UM CANCEL

    thisNote
    .find(".note-title-field, .note-body-field") //seleciona os inputs e torna editavel
    .removeAttr("readonly") //remove o readonly dos inputs
    .addClass("note-active-field");

    thisNote.find(".update-note") //
    .addClass("update-note--visible"); //faz aparecer o botao de save

    thisNote.data("state", "editable");
  }

  makeNoteReadOnly(thisNote) {
    thisNote
    .find(".edit-note") //seleciona o botao de EDIT
    .html('<i class="fa fa-pencil" aria-hidden="true"></i> Edit'); //TROCA O BOTAO DE VOLTA PARA EDIT

    thisNote
    .find(".note-title-field, .note-body-field") //seleciona os inputs
    .attr("readonly", "readonly") //adciona o readonly dos inputs
    .removeClass("note-active-field");

    thisNote.find(".update-note") //
    .removeClass("update-note--visible");//remove o botao de save

    thisNote.data("state", "cancel");
  }



}

export default MyNotes;