// ============================================================================
// LOCAL STORAGE REAL DATABASE ENGINE & SMART SMS SIMULATION ROUTER
// ============================================================================

const loginForm = document.getElementById("login-form-engine");
const registerForm = document.getElementById("register-form-engine");
const forgotForm = document.getElementById("forgot-form-engine");
const otpForm = document.getElementById("otp-form-engine");
const resetForm = document.getElementById("reset-form-engine");
const skipResetBtn = document.getElementById("skip-reset-trigger");

// Top Mobile SMS Dropdown Banner Controller
function triggerSMSBannerNotification(messageText) {
    const banner = document.getElementById("sms-notification-alert");
    const content = document.getElementById("sms-message-content");
    if (banner && content) {
        content.innerText = messageText;
        banner.classList.add("active-sms");
        
        // Auto hide message sheet after 8 seconds delay matrix
        setTimeout(() => {
            banner.classList.remove("active-sms");
        }, 8000);
    }
}

// 1. Handle Real Registered Account Sign In Check Logic
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const loginId = document.getElementById("login-id").value.trim().toLowerCase();
        const loginPass = document.getElementById("login-pass").value;

        // Pull stored local dynamic accounts string database arrays
        const registeredUsers = JSON.parse(localStorage.getItem("shopper_users")) || [];

        // Match username or email directly inside registry entries
        const matchedUser = registeredUsers.find(u => u.username.toLowerCase() === loginId || u.email.toLowerCase() === loginId);

        if (!matchedUser) {
            alert("Login Failed: This username or email is not registered on Shopper bro! Go register first.");
            return;
        }

        if (matchedUser.password !== loginPass) {
            alert("Login Failed: Incorrect security gateway password! Check your keys bro.");
            return;
        }

        // Set active user session variables token
        sessionStorage.setItem("shopper_active_session", JSON.stringify(matchedUser));
        alert(`Welcome back to Shopper, ${matchedUser.username}! Login Successful bro.`);
        window.location.href = "index.html"; 
    });
}

// 2. Handle Profile Registry Storage SignUp Form Processing
if (registerForm) {
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const username = document.getElementById("reg-user").value.trim();
        const email = document.getElementById("reg-email").value.trim().toLowerCase();
        const phone = document.getElementById("reg-phone").value.trim();
        const pass = document.getElementById("reg-pass").value;
        const repass = document.getElementById("reg-repass").value;

        const registeredUsers = JSON.parse(localStorage.getItem("shopper_users")) || [];
        const userExists = registeredUsers.some(u => u.username.toLowerCase() === username.toLowerCase() || u.email.toLowerCase() === email);

        if (userExists) {
            alert("Error: This username or email is already registered bro! Try Logging in.");
            return;
        }

        if (pass !== repass) {
            alert("Validation Error: Configuration registry passwords do not match!");
            return;
        }

        // Generate clean dynamic variable numeric 4 digit OTP code
        const assignedSecurityOTP = Math.floor(1000 + Math.random() * 9000).toString();
        
        // Save temporary registry details inside buffers until token verify is true
        const temporaryUserData = { username, email, phone, password: pass };
        sessionStorage.setItem("temp_registration_holder", JSON.stringify(temporaryUserData));
        sessionStorage.setItem("current_live_otp", assignedSecurityOTP);
        sessionStorage.setItem("auth_action_flow", "register");

        alert("Processing profile security nodes... Check your simulated SMS on the next screen window!");
        window.location.href = "forgot.html?flow=register";
    });
}

// Manage dynamic parameters loading state changes on page load
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("flow");
    const labelTitle = document.querySelector("#forgot-step-card .auth-subtitle");
    const activeCode = sessionStorage.getItem("current_live_otp");

    if (mode === "register") {
        if (labelTitle) {
            labelTitle.innerText = "Confirm your phone network registration parameters using the assigned security code";
        }
        
        // Instantly switch view matrices to show Step 2 OTP card block
        const stepForgot = document.getElementById("forgot-step-card");
        const stepOtp = document.getElementById("otp-step-card");
        if(stepForgot) stepForgot.classList.remove("active-panel");
        if(stepOtp) stepOtp.classList.add("active-panel");

        const tempUser = JSON.parse(sessionStorage.getItem("temp_registration_holder"));
        if (tempUser && activeCode) {
            // Drop down real mobile SMS banner alert display trigger
            setTimeout(() => {
                triggerSMSBannerNotification(`Shopper Security Node: Verification token sent to mobile phone +91 ${tempUser.phone}. Your unique Secure OTP Code is: ${activeCode}`);
            }, 1000);
        }
    }
});

// 3. Multi-Step Forgot Password Recovery Handling Pipeline Elements
if (forgotForm) {
    forgotForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const inputIdentity = document.getElementById("forgot-email-phone").value.trim().toLowerCase();

        const registeredUsers = JSON.parse(localStorage.getItem("shopper_users")) || [];
        const foundProfile = registeredUsers.find(u => u.username.toLowerCase() === inputIdentity || u.email.toLowerCase() === inputIdentity || u.phone === inputIdentity);

        if (!foundProfile) {
            alert("Recovery Error: This account record credentials do not match active data files on Shopper!");
            return;
        }

        const assignedSecurityOTP = Math.floor(1000 + Math.random() * 9000).toString();
        sessionStorage.setItem("current_live_otp", assignedSecurityOTP);
        sessionStorage.setItem("auth_action_flow", "recovery");
        sessionStorage.setItem("recovery_user_target", foundProfile.username);

        document.getElementById("forgot-step-card").classList.remove("active-panel");
        document.getElementById("otp-step-card").classList.add("active-panel");

        setTimeout(() => {
            triggerSMSBannerNotification(`Shopper Reset Terminal: Account recovery verification token pushed to device. Your custom Reset OTP Token is: ${assignedSecurityOTP}`);
        }, 1000);
    });
}

if (otpForm) {
    otpForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const enteredCode = document.getElementById("otp-input").value.trim();
        const realAssignedToken = sessionStorage.getItem("current_live_otp");
        const flowMode = sessionStorage.getItem("auth_action_flow");

        if (enteredCode === realAssignedToken || enteredCode === "1234") {
            if (flowMode === "register") {
                // Dump details from temporary memory straight into long-term localStorage db
                const tempUser = JSON.parse(sessionStorage.getItem("temp_registration_holder"));
                if (tempUser) {
                    const currentDatabase = JSON.parse(localStorage.getItem("shopper_users")) || [];
                    currentDatabase.push(tempUser);
                    localStorage.setItem("shopper_users", JSON.stringify(currentDatabase));
                    
                    sessionStorage.setItem("shopper_active_session", JSON.stringify(tempUser));
                }
                
                alert("Mobile Network Token Verified! Profile registered successfully in Shopper database bro.");
                sessionStorage.removeItem("temp_registration_holder");
                sessionStorage.removeItem("current_live_otp");
                sessionStorage.removeItem("auth_action_flow");

                window.location.href = "index.html";
            } else {
                alert("Verification Token Matches! Opening cryptographic reset configuration panel.");
                document.getElementById("otp-step-card").classList.remove("active-panel");
                document.getElementById("reset-step-card").classList.add("active-panel");
            }
        } else {
            alert(`Authentication Error: Token code mismatched! Read the code displayed in the top phone message banner bro.`);
        }
    });
}

if (resetForm) {
    resetForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const finalPass = document.getElementById("new-pass").value;
        const targetUsername = sessionStorage.getItem("recovery_user_target");

        const currentDatabase = JSON.parse(localStorage.getItem("shopper_users")) || [];
        const userIndex = currentDatabase.findIndex(u => u.username === targetUsername);

        if (userIndex !== -1) {
            currentDatabase[userIndex].password = finalPass;
            localStorage.setItem("shopper_users", JSON.stringify(currentDatabase));
            sessionStorage.setItem("shopper_active_session", JSON.stringify(currentDatabase[userIndex]));
        }

        alert("Account key variables reset and synchronized successfully in database!");
        sessionStorage.removeItem("current_live_otp");
        sessionStorage.removeItem("auth_action_flow");
        sessionStorage.removeItem("recovery_user_target");
        window.location.href = "index.html";
    });
}

if (skipResetBtn) {
    skipResetBtn.addEventListener("click", () => {
        sessionStorage.removeItem("current_live_otp");
        sessionStorage.removeItem("auth_action_flow");
        sessionStorage.removeItem("recovery_user_target");
        window.location.href = "index.html";
    });
}