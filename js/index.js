//
// MAIN JS FILE
//
$(function(){ 
    var articlesLoad = 12; // number of articles wanted

    //
    //loading articles
    // 
    $('.category').change(function(){
        getArticles();
    });

    //
    // function for getting parameters before calling Ajax
    //
    function getArticles() {
        articlesLoad = 12;
        $(".articles").addClass("loader");
        $("header").addClass("header-small");
        $("footer").addClass("footer-small");
        $(".search-bar").css("display", "flex");
        $(".articles").empty();
        var section = $(".category").val();
        var search = $(".search").val();
        var apiKey = "1f73ed52c30d4864bb4d5b310aec39fc";
        var url = "https://api.nytimes.com/svc/topstories/v2/" + section +".json?api-key=" + apiKey;
        callAjax(url, search);
    }

    //
    // Ajax call function
    //
    function callAjax(url, search) {  
        $.ajax({
            method: "GET",
            url: url,
          }).done(function(data) {
              var articles = data.results;
              for (var i = 0; i < articles.length; i++) {
                // finding the best quality picture (if there is any)
                if(articles[i].multimedia.length === 5){
                    var image = articles[i].multimedia[4].url;
                    if (image&&(articlesLoad>0)) {
                        var containsAbstract = isSubstring(articles[i].abstract, search);
                        var containsTitle = isSubstring(articles[i].title, search);
                        // filter articles
                        if (!search || containsAbstract || containsTitle) {
                            $(".articles").append("<a href='" + articles[i].url + "' class='article' style='background:url(" + image + ") no-repeat center/cover;'><li><p class='article-text'>" + articles[i].abstract + "</p></li></a>");
                            articlesLoad--;
                        }  
                    }
                    if (articlesLoad === 0) {
                        break;
                    }   
                }       
              }
              // if no articles with search filter
              if (articlesLoad === 12) {
                $(".articles").html("<p style='margin: auto'>Sorry, no article found.</p>");
              }
              $(".articles").removeClass("loader");
          }).fail(function(error) {
            throw error;
          });
    }

    //
    // Selectric initialization
    //
    $('.category').selectric();

    //
    // touchscreen detection
    // @source https://codeburst.io/the-only-way-to-detect-touch-with-javascript-7791a3346685/ 03/12/2018
    //
    window.addEventListener('touchstart', function() {
        $(".article-text").css("opacity", "1");
    });

    //
    // search input function
    //
    $(".search").keypress(function(event) {
        if(event.keyCode === 13) {
            event.preventDefault();
            getArticles();  
        }
    });

    $(".search").focus(function() {
        $(this).val(""); 
    });

    //
    // function for finding a substring (search input)
    // @source https://stackoverflow.com/questions/2854527/find-substring-with-jquery 03/15/2018
    //
    function isSubstring(haystack, needle) {
        return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
    }
});