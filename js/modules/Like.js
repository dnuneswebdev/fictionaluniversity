import $ from 'jquery';

class Like {
  //
  constructor() {
    this.events();
  }


  //
  events() {
    $('.like-box').on('click', this.ourClickDispatcher.bind(this));
  }


  //methods
  ourClickDispatcher(e) {
    let currentLikeBox = $(e.target).closest('.like-box'); // ACHA O PARENT MAIS PROXIMO QUE ESTA A CLASSE LIKE-BOX, TARGET DE WHOLE BOX NOT ONLY DE HEARTH, CLICKABLE

    if(currentLikeBox.attr('data-exists') == 'yes') {
      this.deleteLike(currentLikeBox);
    }
    else {
      this.createLike(currentLikeBox);
    }
  }

  createLike(currentLikeBox) {
    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', universityData.nonce); 
      }, 
      url: universityData.root_url + '/wp-json/university/v1/manageLike',
      type: 'POST', //QUAL O VERBO QUE VOCE QUER? GET, POST, ETC...
      data: {
        'professorId': currentLikeBox.data('professor') //ISSO VAI PRO FINAL DA URL 'manageLike?professorId: '
      },
      success: (response) => {
        currentLikeBox.attr('data-exists', 'yes');
        let likeCount = parseInt(currentLikeBox.find(".like-count").html(), 10); //CONVERTE STRING TO NUMBER
        likeCount++;
        currentLikeBox.find(".like-count").html(likeCount);
        currentLikeBox.attr('data-like', response);
      },
      error: (response) => {console.log(response)}
    });
  }

  deleteLike(currentLikeBox) {
    $.ajax({
      beforeSend: (xhr) => {
        xhr.setRequestHeader('X-WP-Nonce', universityData.nonce); 
      }, 
      url: universityData.root_url + '/wp-json/university/v1/manageLike',
      type: 'DELETE', //QUAL O VERBO QUE VOCE QUER? GET, POST, ETC...
      data: {'like': currentLikeBox.attr('data-like')},
      success: (response) => {
        currentLikeBox.attr('data-exists', 'no');
        let likeCount = parseInt(currentLikeBox.find(".like-count").html(), 10); //CONVERTE STRING TO NUMBER
        likeCount--;
        currentLikeBox.find(".like-count").html(likeCount);
        currentLikeBox.attr('data-like', '');
      },
      error: (response) => {console.log(response)}
    });
  }

}

export default Like;