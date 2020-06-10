function changeContentTop() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);

    var sidebar = document.getElementById('sidebar');

    var image = document.getElementById('main');
    var header = document.querySelector(".site-header");
    sidebar.style.marginTop = (header.offsetHeight + image.offsetHeight + 20) + "px";

    if(vw < 1200) {
        var sidebarHeight = sidebar.offsetHeight;
        document.querySelector(".post-content").style.marginTop = (sidebarHeight + 10) + "px";
    } else {
        document.querySelector(".post-content").style.marginTop = "0px";
    }
}
