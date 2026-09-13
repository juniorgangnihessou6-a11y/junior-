// Configuration Supabase - Remplacez avec vos clés Supabase
const SUPABASE_URL = "https://nekvagwbrxiijnysibjp.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5la3ZhZ3dicnhpaWpueXNpYmpwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg5MDQ1ODMsImV4cCI6MjEwNDQ4MDU4M30.OkQedalGsw2L0RHmFj_eSp00MLLyfAG-_Hl9e9cUPfg";

// Initialisation du client Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Gestion de l'état du formulaire (Inscription vs Connexion)
let isSignUp = false;

// Fonction de bascule entre Inscription et Connexion
function toggleAuthMode() {
    isSignUp = !isSignUp;
    
    const title = document.getElementById("auth-title");
    const submitBtn = document.getElementById("submit-btn");
    const toggleLink = document.getElementById("toggle-link");
    const toggleText = document.getElementById("toggle-text");
    const nameGroup = document.getElementById("name-group");

    if (isSignUp) {
        if (title) title.innerText = "Créer un compte";
        if (submitBtn) submitBtn.innerText = "S'inscrire";
        if (toggleText) toggleText.innerText = "Déjà un compte ?";
        if (toggleLink) toggleLink.innerText = "Se connecter";
        if (nameGroup) nameGroup.style.display = "block";
    } else {
        if (title) title.innerText = "Connexion";
        if (submitBtn) submitBtn.innerText = "Se connecter";
        if (toggleText) toggleText.innerText = "Pas encore de compte ?";
        if (toggleLink) toggleLink.innerText = "S'inscrire";
        if (nameGroup) nameGroup.style.display = "none";
    }
}

// Gestion de la soumission du formulaire (Auth)
async function handleAuth(event) {
    event.preventDefault();

    const email = document.getElementById("email")?.value;
    const password = document.getElementById("password")?.value;
    const name = document.getElementById("fullName")?.value;
    const alertBox = document.getElementById("alert-box");

    if (!email || !password) {
        showAlert("Veuillez remplir tous les champs obligatoires.", "error");
        return;
    }

    try {
        if (isSignUp) {
            // Inscription
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: { full_name: name }
                }
            });

            if (error) throw error;

            showAlert("Inscription réussie ! Vérifiez votre boîte mail pour confirmer.", "success");
        } else {
            // Connexion
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            showAlert("Connexion réussie !", "success");
            // Redirection après connexion si besoin :
            // window.location.href = "/dashboard.html";
        }
    } catch (err) {
        showAlert(err.message || "Une erreur est survenue.", "error");
    }
}

// Utilitaire pour afficher les messages d'erreur ou de succès
function showAlert(message, type) {
    const alertBox = document.getElementById("alert-box");
    if (!alertBox) {
        alert(message);
        return;
    }
    
    alertBox.innerText = message;
    alertBox.className = `alert ${type}`;
    alertBox.style.display = "block";
}

// Exposer la fonction globalement pour les événements onclick HTML
window.toggleAuthMode = toggleAuthMode;
window.handleAuth = handleAuth;
