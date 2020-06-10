function changeContentTop() {
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    if(vw < 1200){
        var sidebar = document.getElementById('sidebar');
        var sidebarHeight = sidebar.offsetHeight;
        document.querySelector(".post-content").style.marginTop = sidebarHeight + "px";
    }
}
