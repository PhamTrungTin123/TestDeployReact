// document.addEventListener('DOMContentLoaded', () => {
//     const loginAgainBtn = document.getElementById('login-again-btn');
//
//     loginAgainBtn.addEventListener('click', () => {
//         // Chuyển hướng người dùng đến trang đăng nhập
//         window.location.href = 'login.html';
//     });
// });

document.addEventListener('DOMContentLoaded', () => {
    const loginAgainBtn = document.getElementById('login-again-btn');

    if (loginAgainBtn) {
        loginAgainBtn.addEventListener('click', () => {
            // Chuyển hướng người dùng đến trang đăng nhập
            window.location.href = 'login.html';
        });
    } else {
        console.error('Element with ID "login-again-btn" not found.');
    }
});
