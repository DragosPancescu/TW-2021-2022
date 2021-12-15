window.addEventListener('load',function(){
    function switch_gallery() {
        var statica = document.getElementById("galerie_statica");
        var animata = document.getElementById("galerie_animata");

        if (animata.style.display === "none") {
            animata.style.display = "block";
            statica.style.display = "none";
        } else {
            animata.style.display = "none";
            statica.style.display = "block";
        }
    }

    var switch_btn = document.getElementById("switch");
    if (switch_btn) {
        switch_btn.addEventListener("click", switch_gallery);
    }
});

