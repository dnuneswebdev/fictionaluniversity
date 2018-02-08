<?php

require get_theme_file_path('/inc/search-route.php'); //IMPORTA O SEARCH ROUTE COM O CUSTO API REST

//rest api custom field
function university_custom_rest() {
  register_rest_field('post', 'authorName', array( //cria author la no JSON pra aparecer na busca
    'get_callback' => function() {
      return get_the_author();
    }
  ));

  
}

add_action('rest_api_init', 'university_custom_rest');

//
function pageBanner($args = NULL) { //faz o argumento ser opcional
 if(!$args['title']) {
  $args['title'] = get_the_title();
 }

 if(!$args['subtitle']) {
  $args['subtitle'] = get_field('page_banner_subtitle');
 }

 if(!$args['photo']) {
   if(get_field('page_banner_background_image')) {
     $args['photo'] = get_field('page_banner_background_image') ['sizes'] ['pageBanner'];
   }
   else {
     $args['photo'] = get_theme_file_uri('/images/ocean.jpg');
   }
 }

 ?>
  <div class="page-banner">
      <div class="page-banner__bg-image" 
      style="background-image: url(<?php echo $args['photo']; ?>);"></div>
      <div class="page-banner__content container container--narrow">
        <h1 class="page-banner__title"><?php echo $args['title'] ?></h1>
        <div class="page-banner__intro">
          <p><?php echo $args['subtitle'] ?></p>
        </div>
      </div>  
    </div>

<?php }


//
function university_files() { //STYLES, SCRIPTS, FONTS
  wp_enqueue_script('googleMap', '//maps.googleapis.com/maps/api/js?key=AIzaSyBnlYnsmAMnKYrHoKHjmtMpnfFh9NhuR34', NULL, '1.0', true);
  wp_enqueue_script('main-university-js', get_theme_file_uri('/js/scripts-bundled.js'), NULL, '1.0', true);
  wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
  wp_enqueue_style('font-awesome', '//maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css');
  wp_enqueue_style('university_main_styles', get_stylesheet_uri());
  wp_localize_script('main-university-js', 'universityData', array( //MAKES URL FLEXIBLE
    'root_url' => get_site_url(),
    'nonce' => wp_create_nonce('wp_rest')
  ));
}

add_action('wp_enqueue_scripts', 'university_files');

//
function university_features() {
  add_theme_support('title-tag');
  add_theme_support('post-thumbnails'); //ADCIONA FEATURED IMAGES IN THE WP ADMIN PARA BLOG, PRECISA POR 'THUMBNAIL' la no functions quer voce quer do CUSTOM POSTS
  add_image_size('professorLandscape', 400, 260, true); //CROP THE IMAGE
  add_image_size('professorPortrait', 480, 650, true); //USA NA PAGINA QUE QUER DENTRO DO THUMBNAIL
  add_image_size('pageBanner', 1500, 350, true);
}

add_action('after_setup_theme', 'university_features');

//
function university_adjust_queries($query) {      // $query->is_main_query() BOAS PRATICAS, SAFE
  if(!is_admin() AND is_post_type_archive('campus') AND $query->is_main_query()) {
    $query->set('posts_per_page', -1); //MOSTRA TODOS OS PIN NO GOOGLEMAPS
  }

  if(!is_admin() AND is_post_type_archive('program') AND $query->is_main_query()) {
    $query->set('orderby', 'title');
    $query->set('order', 'ASC');
    $query->set('posts_per_page', -1);
  }

  if(!is_admin() AND is_post_type_archive('event') AND $query->is_main_query()) { 
    $today = date('Ymd');
    $query->set('meta_key', 'event_date');
    $query->set('orderby', 'meta_value_num');
    $query->set('order', 'ASC');
    $query->set('meta_query', array(
      array(
        'key' => 'event_date',
        'compare' => '>=',
        'value' => $today,
        'type' => 'numeric'
      )
      ));
  }
}

add_action('pre_get_posts', 'university_adjust_queries');

//REDIRECT SUBSCRIBERS TO THE FRONT PAGE
function redirectSubsToFrontEnd() {
  $ourCurrentUser = wp_get_current_user();
  
  if(count($ourCurrentUser->roles) == 1 AND $ourCurrentUser->roles[0] == 'subscriber') {
    wp_redirect(site_url('/'));
    exit; //FALA PRO WP PARAR DE RODAR DEPOIS QUE ELE REDIRECIONA O USER
  }
};

add_action('admin_init', 'redirectSubsToFrontEnd');

//TIRA O ADMIN BAR DOS USUARIOS
function noSubsAdminBar() {
  $ourCurrentUser = wp_get_current_user();
  
  if(count($ourCurrentUser->roles) == 1 AND $ourCurrentUser->roles[0] == 'subscriber') {
    show_admin_bar(false);
  }
};

add_action('wp_loaded', 'noSubsAdminBar');

//CUSTOM LOGIN BRAND LINK
function ourHeaderUrl() {
  return esc_url(site_url('/'));
}

add_filter('login_headerurl', 'ourHeaderUrl');

//CUSTOMIZE LOGIN PAGE CSS STYLE... INSPECIONA UM ELEMENTO NA PAGINA PRA DESCOBRIR A CLASSE EM USO
function  ourLoginCss() {
  wp_enqueue_style('university_main_styles', get_stylesheet_uri());
  wp_enqueue_style('custom-google-fonts', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
}

add_action('login_enqueue_scripts', 'ourLoginCss');

//TROCA O NOME QUANDO PASSA O MOUSE EM CIMA DO TITULO NA PAGINA DE LOGIN
function ourLoginHeaderTitle() {
  return get_bloginfo('name');
}

add_filter('login_headertitle', 'ourLoginHeaderTitle');

//GOOGLEMAPS API
function university_map_key($api) {
  $api['key']='AIzaSyBnlYnsmAMnKYrHoKHjmtMpnfFh9NhuR34';
  return $api;
}

add_filter('acf/fields/google_map/api', 'university_map_key');