import $ from 'jquery';


class MyNotes {

  //SELECTORS
  constructor() {
    this.events();
  }

  //EVENTS
  events() { //TEM QUE POR O MY NOTES PRIMEIRO PARA O JS SABER QUE O NOTE FOI CRIADO E CONSEGUIR EDITAR, EXCLUIR SALVAR.
    $("#my-notes").on('click', '.delete-note', this.deleteNote.bind(this));
    $("#my-notes").on('click', '.edit-note',this.editNote.bind(this));
    $("#my-notes").on('click', '.update-note', this.updateNote.bind(this));
    $(".submit-note").on('click', this.createNote.bind(this));

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
        if(response.userNoteCount < 5) {
          $('.note-limit-message').removeClass('active');
      }
      error: (response) => {
        console.log('Sorry');
        console.log(response);
        }
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

  createNote(e) { //MANDA UMA REQUISIÇÃO AJAX DE CREATE PARA A REST API DO WP
    let ourNewPost = {
      'title': $(".new-note-title").val(),
      'content': $(".new-note-body").val(),
      'status': 'publish' //EXIBE COMO PUBLICADO NA PAGINA <FAZ APARECER>, PRA DEIXAR PRIVADO, MELHOR PRATICA É IR LA NO FUNCTIONS E CRIAR UM ADD_FILTER
    };

    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', universityData.nonce); 
      }, 
      url: universityData.root_url + '/wp-json/wp/v2/note/',
      type: 'POST',
      data: ourNewPost,
      success: (response) => {
        $(".new-note-title, .new-note-body").val(""); //SELECIONA E AO CRIAR NOTE DEIXA EM BRANCO
        $(`
        <li data-id="${response.id}" <!-- ACHA O ID PRA USAR NO JAVASCRIPT CRUD-->
          <input readonly class="note-title-field" value="${response.title.raw}">
        <span class="edit-note">
          <i class="fa fa-pencil" aria-hidden="true"></i> Edit
        </span>
        <span class="delete-note">
          <i class="fa fa-trash-o" aria-hidden="true"></i> Delete
        </span>
        <textarea readonly class="note-body-field" rows="5">${response.content.raw}</textarea>
        <span class="update-note btn btn--blue btn--small">
          <i class="fa fa-arrow-right" aria-hidden="true"></i> Save
        </span>
        </li>
        `) //CRIA UMA LI
        .prependTo("#my-notes") //LINKA COM A UL #MY-NOTES
        .hide() // ESCONDE PARA ANIMAÇÂO
        .slideDown(); // ANIMAÇÂO

        console.log('Congrats');
        console.log(response);
      },
      error: (response) => {
        if(response.responseText == "You have reached your note limit") {
          $('.note-limit-message').addClass('active');
        }
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