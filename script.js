      // Binding DOM elements
    var $search = $('#search'); // Search input
    var $submit = $('#submit'); // Submit button
    var $pro = $('#pro'); // Pro-only checkbox
    var $sort = $('#sort'); // Sorting dropdown
    var $rel = $('#rel'); // Relevance item
    var $views = $('#views'); // Views item
    var $likes = $('#likes'); // Likes item
    var $date = $('#date'); // Date item
    var $instant = $('#instant'); // Button to activate-deactivate instant-search
    var $results = $('.results'); // Div where results will be appended
    var filter = '';  // Index filters

    // Creating the callback used for each search
    function searchCallback(err, content) {
      if (err) {
        console.error(err);
        return;
      }

      $results.empty(); // Emptying the results list at each run before appending the new results
      for (var i = 0; i < content.hits.length; i++) { // Appending each result according to a grid template
        $results.append(
          '<div class="col-sm-6 col-md-3">' +
            '<div class="thumbnail">' + 
            '<ul class="img-list">' +
              '<li>' +
                '<a href="' + content.hits[i].html_url + '">' + 
                  '<img src=' + content.hits[i].images.teaser + '></a>' + 
                    '<a href=' + content.hits[i].html_url + '><span class="text-content"><span>' + content.hits[i].title + '</span></span></a>' +
              '</li>' +
            '</ul>' +
                '<div class="caption">' +
                  '<small><span class="glyphicon glyphicon-eye-open" aria-hidden="true"></span> '+ content.hits[i].views_count + ' | <span class="glyphicon glyphicon-heart" aria-hidden="true"></span> ' + content.hits[i].likes_count + ' | <span class="glyphicon glyphicon-comment" aria-hidden="true"></span> ' + content.hits[i].comments_count +'</small><br>' + 
                  '<small><a href="' + content.hits[i].user.html_url + '">' + content.hits[i].user.name + '</a></small>' +
                '</div>' +
            '</div>' +
          '</div>');     
        }

        // Printing the number of results & the processing time in milliseconds
      $('.processing').text(content.nbHits +' results in ' + content.processingTimeMS + 'ms');
      }

    $(document).ready(function() {
      // Calling Algolia API and creating index
      var client = algoliasearch('9BY4TLBNFW', 'ecea183d022d19d7ae046088b410e11c');
      var index = client.initIndex('test_dribbble_shots');
      
      // Loading bootstrap switch
      $instant.bootstrapSwitch();

      // Turning submit button on/off according to the instant search switch
      $instant.on('switchChange.bootstrapSwitch', function() {
        $submit.toggleClass("disabled");
        $search.focus();
      });

      // pro function checks if "Pro only" is checked
      var pro = function() { 
        if ($pro.prop('checked')) {
            filter = ['user.pro:true'];
                    }
        else {
          filter = '';
        }
      }
      
      // Creating dribbble, the search function. Index & filter parameter will be used for the pro-only restriction & to use slave indexes
      var dribbble = function(index, filter){ 
        index.search($search.val(), {
          hitsPerPage: 40,
          facets: '*',
          facetFilters: filter
        }, searchCallback)};
      
      // Sorting on relevance through the master index & running the search
    $rel.click(function(){
      $sort.html($(this).text() + '<span class="caret"></span>');
      index = client.initIndex('test_dribbble_shots');
      if ($submit.hasClass("disabled")) { // Running the search only on instant mode
      pro();
      dribbble(index, filter);
      }
   });

      // Sorting on views through the views slave index & running the search
    $views.click(function(){
      $sort.html($(this).text() + '<span class="caret"></span>');
      index = client.initIndex('views_descending');
      if ($submit.hasClass("disabled")) { // Running the search only on instant mode
      pro();
      dribbble(index, filter);
      }
   });

      // Sorting on likes through the likes slave index & running the search
    $likes.click(function(){
      $sort.html($(this).text() + '<span class="caret"></span>');
      index = client.initIndex('likes_descending');
      if ($submit.hasClass("disabled")) { // Running the search only on instant mode
      pro();
      dribbble(index, filter);
    }
   });

      // Sorting on date through the date slave index & running the search
    $date.click(function(){
      $sort.html($(this).text() + '<span class="caret"></span>');
      index = client.initIndex('date_recent');
      if ($submit.hasClass("disabled")) { // Running the search only on instant mode
      pro();
      dribbble(index, filter);
    }
   });

      // Filtering on pro users as soon as the button is clicked; through the pro() function
    $pro.change(function() {
      if ($submit.hasClass("disabled")) { // Running the search only on instant mode
      pro();
      dribbble(index,filter);
    }
      $search.focus();
      });

      // Running the search on each keystroke
      $search.keyup(function() {
        if ($submit.hasClass("disabled")) { // Running the search only on instant mode
      dribbble(index,filter);
        }
      }).focus();

      // Running the search on submit & checking if pro only is active
      $submit.click(function() {
        pro();
        dribbble(index,filter);
        $search.focus();
      });
    // end of (document).ready
    });
