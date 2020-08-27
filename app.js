const AuthModel = (() => {
  // Establece el auth para mejorias en lectura
  const auth = firebase.auth();

  return {
    // Guarda el registro de los nuevo usuarios en firebase por medio de email y pw
    register: (email, password) => {
      auth.createUserWithEmailAndPassword(email, password).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
    },

    // Logueo de los usuarios de acuerdo a su posterior registro en firebase
    login: async (email, password) => {
      await auth.signInWithEmailAndPassword(email, password).catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;

        console.log(errorCode, errorMessage);
      });
    },

    // Permite actualizar los datos más immportantes del usuario (Email y PW)
    update: (userData) => {
      const user = auth.currentUser;
      const { displayName, phoneNumber } = userData;

      user.updateProfile({
        displayName: "Daniel",
      });
    },

    // Funcion para cerrar la sesión o desconectar el usuario (PW y Email)
    signOut: () => {
      auth.signOut();
      console.log("La sesion se ha cerrado exitosamente");
    },
  };
})();

const UIController = (() => {
  // Etiquetas, Clases, Contenedores del DOM (HTML)
  const DOMTags = {
    loginForm: "form_login",
    navMenu: ".menu",
    nav: "nav",
    menuItem: "menu__link",
    registerForm: "form_register",
    submitButton: "button__submit",
    activeCard: ".active_card",
    logout: "cerrarSesion",
    email: ".email",
    password: ".password",
    logoLink: ".logo__link",
    wrapperContent: ".wrapper",
    registerButton: "registerButton",
    loginButton: "loginButton",
    closeAlert: "alert__close",
    navHmb: ".hmb",
    navClose: "nav__close",
  };

  // Función para reemplazar contenido de una etiqueta (tag html)
  const innerHTML = (tag, content) => {
    document.querySelector(tag).innerHTML = content;
  };

  // Función para inyectar contenido de una etiqueta (tag html)
  const adjacentHTML = (tag, position, html) => {
    document.querySelector(tag).insertAdjacentHTML(position, html);
  };

  // Muestra el nombre del usuario en el navbar
  const showUser = (user) => {
    if (user) {
      innerHTML(DOMTags.logoLink, user.email);
    } else {
      innerHTML(DOMTags.logoLink, "FidApp");
    }
  };

  // Función para mostrar el contenido dentro del wrapper (contendor principal)
  const showContent = (html) => {
    innerHTML(DOMTags.wrapperContent, html);
  };

  const alertHTML = (type = "default", text) => {
    let icon;
    switch (type) {
      case "info":
        icon = "fa-info";
        break;
      case "success":
        icon = "thumbs-up";
        break;
      case "danger":
        icon = "radiation-alt";
        break;
      case "default":
        icon = "piggy-bank";
        break;
      default:
        break;
    }

    const html = `
      <div class="alert alert--${type}">
        <div class="alert__content">
          <i class="fas fa-${icon}"></i>
          <p class="alert__text">
            ${text}
          </p>
        </div>
        <span class="alert__close"><i class="fas fa-times"></i></span>
      </div>
    `;

    adjacentHTML("body", "beforeend", html);
  };

  // Función para mostrar formulario (login y registro) según evento de botón
  const formCard = (type) => {
    let html = `
      <div class="card">
        <div class="card__form">
          <form id="form_${type}" class="form form_${type}">
            <div class="form__group input">
              <input
                type="text"
                name="email"
                class="form__input email"
                required
              />
              <label for="email" class="form__label">Email</label>
            </div>
            <div class="form__group input">
              <input
                type="password"
                name="password"
                class="form__input password"
                required
              />
              <label for="password" class="form__label">Contraseña</label>
            </div>
            <button class="button button__submit">
              ${type === "login" ? "Ingresar" : "Registrarse"}
            </button>
          </form>
        </div>
      </div>
    `;

    innerHTML(DOMTags.wrapperContent, html);
  };

  // Función para mostrar botones en el navbar (logueado o usuario nuevo)
  const showButtons = (user) => {
    let html;

    if (!user || user === "undefined") {
      html = `
        <li class="menu__item">
          <i class="fas fa-tachometer-alt"></i>
          <a href="" class="menu__link home">Inicio</a>
        </li>
        <li class="menu__item">
          <i class="fas fa-key"></i>
          <a href="" class="menu__link loginButton">Iniciar Sesión</a>
        </li>
        <li class="menu__item">
          <i class="fas fa-sign-in-alt"></i>
          <a href="" class="menu__link registerButton">Registrarse</a>
        </li>
      `;
    } else {
      html = `
        <li class="menu__item">
          <i class="fas fa-tachometer-alt"></i>
          <a href="" class="menu__link dash">Dashboard</a>
        </li>
        <li class="menu__item">
          <i class="fas fa-sign-out-alt"></i>
          <a href="" class="menu__link cerrarSesion">Salir</a>
        </li>
      `;
    }
    return html;
  };

  // Función que retorna los datos de formulario login o registro
  const userFormLogin = () => {
    const email = document.querySelector(DOMTags.email).value;
    const password = document.querySelector(DOMTags.password).value;

    return { email, password };
  };

  return {
    // Inicialización del DOM Controller
    init: (user) => {
      innerHTML(DOMTags.navMenu, showButtons(user));
      showUser(user);
    },

    // Permite insertar HTML en el Wrapper Contenedor
    content: (html) => {
      showContent(html);
    },

    showAlert: (type, text) => {
      alertHTML(type, text);
      document.querySelector(".alert").classList.add("active");
    },

    // Función para insertar el formulario solicitado por el cliente
    showFormCard: (type) => {
      formCard(type);
    },

    // Retorna todas las etiquetas del DOM
    DOMTags: () => {
      return DOMTags;
    },

    // Retorna la información de Password y Email de los formularios
    userDataForm: () => {
      return userFormLogin();
    },
  };
})();

const MainController = ((Auth, UI) => {
  const authorization = () => {
    const Tags = UI.DOMTags();

    firebase.auth().onAuthStateChanged((user) => {
      // 1. Inicializa los botones de acceso para los usuarios
      UI.init(user);
      eventInitializer("click", Tags.closeAlert, closeAlert);
      eventInitializer("click", "fa-times", closeAlert);

      // Navigation Menu Open and Close Functions
      navFunction(Tags);

      // 2. Comprobar que exista o no un usuario activo o con sesión iniciada
      if (user) {
        // 2.1 Muestra el contenido para el usuario logueado
        UI.content(`<h1>Bienvenido</h1>`);
        // 2.2 Activa el botón de cierre de sesión
        eventInitializer("click", Tags.logout, logout);
      } else {
        // 2.3 Habilita los botones y formularios para registro y login
        // Nota: Si y solo si el usuario no se ha logueado o registrado nunca
        eventInitializer("submit", Tags.loginForm, loginForm);
        eventInitializer("submit", Tags.registerForm, registerForm);
        eventInitializer("click", Tags.loginButton, loginCard);
        eventInitializer("click", Tags.registerButton, registerCard);
        const html = `
        <div class="card">
          <div class="card__content">
            <h3 class="card__title">Bienvenido!</h3>
            <div class="card__text">
            <p>
            Recuerda registrarte o iniciar sesión para gestionar tus finanzas y que puedas tener un seguimiento completo
            </p>
            <p>
            Da click en el menu para que puedas acceder facilmente a tu usuario.
            </p>
            </div>
          </div>
        </div>        
        `;
        UI.content(html);
        console.log("No se tiene usuario activo");
      }
    });
  };

  // Añade eventos a elementos activos //// NO SE UTILIZA EN DOM DINAMICO
  const addEvent = (element, type, fn) => {
    document.querySelector(element).addEventListener(type, fn);
  };

  // DOM Card para el login (Formulario)
  const loginCard = () => {
    UI.showFormCard("login");
  };

  // DOM Card para el login (Formulario)
  const registerCard = () => {
    UI.showFormCard("register");
  };

  // Acción para login de usuarios
  const loginForm = () => {
    const formData = UI.userDataForm();
    Auth.login(formData.email, formData.password);
  };

  // Acción para registro de usuarios según Modelo
  const registerForm = () => {
    const formData = UI.userDataForm();
    Auth.register(formData.email, formData.password);
    console.log("Usuario registrado!");
  };

  // Cerrar la sesión activa para el usuario
  const logout = () => {
    Auth.signOut();
    UI.showAlert("success", "Ha cerrado sesión correctamente");
  };

  const navFunction = ({ menuItem, navHmb }) => {
    addEvent(navHmb, "click", () => {
      document.querySelector(".nav").classList.add("active");
    });
    eventInitializer("click", menuItem, () => {
      document.querySelector(".nav").classList.remove("active");
    });
    addEvent(".nav__close", "click", (e) => {
      document.querySelector(".nav").classList.remove("active");
    });
  };

  // Funcion para cerrar las alertas en pantalla (Screen)
  const closeAlert = () => {
    const el = document.querySelector(".alert__close");
    el.parentNode.classList.remove("active");
  };

  // Método para inicializar eventos del DOM Dinámicos
  const eventInitializer = (type, tag, fn) => {
    document.addEventListener(type, (event) => {
      if (event.target.classList.contains(tag)) {
        event.preventDefault();
        fn();
      }
    });
  };

  return {
    // Función para iniciar la aplicación
    init: () => {
      console.log("Aplicación iniciada correctamente");
      authorization();
    },
  };
})(AuthModel, UIController);

MainController.init();
