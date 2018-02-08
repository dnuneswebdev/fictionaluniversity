<?php

  if(!is_user_logged_in()) { //SE O USUARIO NÂO ESITVER LOGADO, ELE NAO TEM ACESSO A ESSA PAGE!
    wp_redirect(esc_url(site_url('/'))); //REDIRECIONA PRA HOME PAGE
    exit;
  }

  get_header();

  while(have_posts()) {
    the_post(); 
    pageBanner();
  ?>

    <div class="container container--narrow page-section">
      <ul id="my-notes" class="min-list link-list">
        <?php 

        $userNotes = new WP_Query(array(
          'post_type' => 'note',
          'posts_per_page' => -1, //MOSTRA TODOS OS NOTES
          'author' => get_current_user_id()
        ));

        while($userNotes->have_posts()) {
          $userNotes->the_post(); ?>
          <li data-id="<?php the_ID(); ?>"> <!-- ACHA O ID PRA USAR NO JAVASCRIPT CRUD-->
            <input readonly class="note-title-field" value="<?php echo esc_attr(get_the_title()) ?>">
            <span class="edit-note">
            <i class="fa fa-pencil" aria-hidden="true"></i> Edit
            </span>
            <span class="delete-note">
            <i class="fa fa-trash-o" aria-hidden="true"></i> Delete
            </span>
            <textarea readonly class="note-body-field" rows="5"><?php echo esc_attr(get_the_content()) ?>
            </textarea>
            <span class="update-note btn btn--blue btn--small">
            <i class="fa fa-arrow-right" aria-hidden="true"></i> Save
            </span>
          </li>
        <?php }
        
        ?>
      </ul>
    </div>
    
  <?php }
  get_footer();

?>