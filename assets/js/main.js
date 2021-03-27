// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyAgEiqwazhGak0L09mKLbE8-ozgW_sI1j8",
  authDomain: "theargeofeverything-arti.firebaseapp.com",
  projectId: "theargeofeverything-arti",
  storageBucket: "theargeofeverything-arti.appspot.com",
  messagingSenderId: "727699813881",
  appId: "1:727699813881:web:7c4e341084591bf961b928",
  measurementId: "G-21YPJEHQNJ",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

function getInputVal(id) {
  return document.getElementById(id).value;
}

$("#register").click(function () {
  var name = getInputVal("name");
  var surname = getInputVal("surname");
  var phone = getInputVal("phone");
  var email = getInputVal("email");
  var password = getInputVal("password");
  var passwordagain = getInputVal("passwordagain");
  var day = getInputVal("day");
  var month = getInputVal("month");
  var year = getInputVal("year");

  register(email, password, name, surname, phone, day, month, year);

  document.getElementById("name").value = "";
  document.getElementById("surname").value = "";
  document.getElementById("phone").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("passwordagain").value = "";
  document.getElementById("day").value = "";
  document.getElementById("month").value = "";
  document.getElementById("year").value = "";
});

$("#googlelogin").click(function () {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().useDeviceLanguage();

  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      loginApi();
    })
    .catch((error) => {
      console.log(error);
    });
});

$("#googlelogin").click(function () {
  var provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().useDeviceLanguage();

  firebase
    .auth()
    .signInWithPopup(provider)
    .then((result) => {
      loginApi();
    })
    .catch((error) => {
      console.log(error);
    });
});


$("#resetpassword").click(function () {
  resetPassword(getInputVal('email'));
});

$("#login").click(function () {
  console.log('login');
  login(getInputVal('email'), getInputVal('password'));
});

function resetPassword(email) {

firebase.auth().sendPasswordResetEmail(email).then(function() {
  alert('E-posta adresinize şifre sıfırlama e-postası gönderildi. Gelen kutunuzu kontrol edin.');
}).catch(function(error) {
  alert('Şifre sıfırlama işlemi sırasında bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
});

}

function login(email, password) {
  firebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then((result) => {
      loginApi();
    })
    .catch((error) => {
      console.log(error);
      switch (error.code) {
        case "auth/invalid-email":
          alert(
            "E-posta adresi geçersiz. Lütfen doğru yazdığınızdan emin olun."
          );
          break;
          case "auth/user-not-found":
            alert(
              "Girdiğiniz e-posta adresine ilişkin bir hesap bulunamadı. Bunun yerine kayıt olmayı deneyin."
            );
            break;
        case "auth/wrong-password":
          alert(
            "Girdiğiniz e-posta adresi ya da şifre yanlış. Bilgilerinizi kontrol edip tekrar deneyin."
          );

          break;
      }
    });
}

function register(
  email,
  password,
  name,
  lastName,
  phoneNumber,
  day,
  month,
  year
) {
  firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      registerInt(name, lastName, phoneNumber, year, month, day);
    })
    .catch((error) => {
      console.log(error);
      if (error.code == "auth/email-already-in-use") {
        registerInt(name, lastName, phoneNumber, year, month, day);
      } else if (error.code == "auth/weak-password") {
        alert(
          "Şifreniz çok kısa ya da güvenli değil. Şifrenizin en az 6 karakterden oluştuğundan, rakam ve harf içerdiğinden emin olun."
        );
      } else {
        alert("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
      }
    });
} 

function registerInt(name, lastName, phone, year, month, day){
  firebase.auth().currentUser
    .getIdToken(/* forceRefresh */ true)
    .then(function (idToken) {
      fetch("http://api.third.dashelvest.com/user/register", {
        method: "POST",
        headers: {
          Authorization: idToken,
          "Content-Type": "application/json",
          accept: "application/json",
        },
        body: JSON.stringify({
          name: name,
          last_name: lastName,
          phone: phone,
          birth_date: year + "-" + month + "-" + day,
        }),
      })
        .then((response) => {
          if (response.status == 409) {
            alert(
              "Girmiş olduğunuz e-posta adresi zaten kullanılıyor. Bunun yerine giriş yapmayı deneyin."
            );
            return;
          } else if (response.status == 200) {
            loginInt(idToken);
          } else {
            alert("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
            return;
          }
          var data = response.json;
          console.log(data);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
}

function loginInt(idToken){
  fetch("http://api.third.dashelvest.com/user/login", {
    headers: {
      Authorization: idToken,
      "Content-Type": "application/json",
      accept: "application/json",
    },
  })
    .then((response) => {
      if (response.status == 409) {
        alert(
          "Hesabınız bulunamadı. Kayıt olmayı deneyin."
        );
        location.href = 'register.html';
        return;
      } else if (response.status == 200) {
        location.href = 'whichone.html';
      } else {
        alert("Bir hata oluştu. Lütfen daha sonra tekrar deneyin.");
        return;
      }
      var data = response.json;
      console.log(data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function loginApi() {
  firebase.auth().currentUser
    .getIdToken(/* forceRefresh */ true)
    .then(function (idToken) {
      loginInt(idToken);
    });
}
