<form method="get" class="search-form"
      action="<?php echo esc_url(site_url('/')); ?>"> <!-- esc_url deixa o link do que vem do DB mais seguro, SEMPRE USAR!!   -->
        <label class="headline headline--medium" for="s">Perform a new search:</label>
          <div class="search-form-row">
            <input class="s" id="s" type="search" name="s" placeholder="What are you looking for...">
            <input class="search-submit" type="submit" value="search">
          </div>           
</form>