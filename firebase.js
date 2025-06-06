// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAzyLDVjy2hjnbIN82x-rYykJHpAhATWVc",
  authDomain: "italo-cakes.firebaseapp.com",
  projectId: "italo-cakes",
  storageBucket: "italo-cakes.appspot.com",
  messagingSenderId: "1065164711483",
  appId: "1:1065164711483:web:114b7f5813478ae46a5e1e",
  measurementId: "G-TZQEFZ0D23"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);

// Inicializa o Firestore
const db = firebase.firestore();