// js/protect_member.js
(function() {
    const token = localStorage.getItem('token');
    
    // If no token exists in the browser, redirect to login immediately
    if (!token) {
        window.location.replace('login.html');
    }
})();