import os
from pathlib import Path
from dotenv import load_dotenv
import dj_database_url
from datetime import timedelta

# ==============================================================================
# CORE PATHS & ENVIRONMENT LOADING
# ==============================================================================

BASE_DIR = Path(__file__).resolve().parent.parent

# Load .env file from the base directory
load_dotenv(BASE_DIR / ".env")

# Detect environment ('local' or 'prod')
ENVIRONMENT = os.getenv("ENVIRONMENT", "local").strip().lower()

# Load environment-specific .env file to override settings
if ENVIRONMENT == "local":
    load_dotenv(BASE_DIR / ".env.local", override=True)
elif ENVIRONMENT == "prod":
    load_dotenv(BASE_DIR / ".env.docker", override=True)

# ==============================================================================
# SECURITY & CORE CONFIGURATION
# ==============================================================================

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise ValueError("No SECRET_KEY set for Django application")

DEBUG = ENVIRONMENT == "local"
if ENVIRONMENT == "prod" and DEBUG:
    raise ValueError("DEBUG must be False in production!")

ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "").split(",")
ALLOWED_HOSTS = [host.strip() for host in ALLOWED_HOSTS if host.strip()]
if ENVIRONMENT == "local" and not ALLOWED_HOSTS:
    ALLOWED_HOSTS = ["127.0.0.1", "localhost"]
if ENVIRONMENT == "prod" and not ALLOWED_HOSTS:
    raise ValueError("ALLOWED_HOSTS must be set in production!")

# CORS
CORS_ALLOWED_ORIGINS = os.getenv("CORS_ALLOWED_ORIGINS", "").split(",")
CORS_ALLOWED_ORIGINS = [
    origin.strip() for origin in CORS_ALLOWED_ORIGINS if origin.strip()
]
if ENVIRONMENT == "local" and not CORS_ALLOWED_ORIGINS:
    CORS_ALLOW_ALL_ORIGINS = True
    CORS_ALLOW_CREDENTIALS = True
else:
    if ENVIRONMENT == "prod" and not CORS_ALLOWED_ORIGINS:
        raise ValueError("CORS_ALLOWED_ORIGINS must be set in production!")
    CORS_ALLOW_CREDENTIALS = True

# CSRF TRUSTED ORIGINS
CSRF_TRUSTED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("CSRF_TRUSTED_ORIGINS", "").split(",")
    if origin.strip()
]

if ENVIRONMENT == "local" and not CSRF_TRUSTED_ORIGINS:
    CSRF_TRUSTED_ORIGINS = [
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://localhost:3000",
    ]


# ==============================================================================
# INSTALLED APPS
# ==============================================================================

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # Your apps
    "blogs.apps.BlogsConfig",
    "students.apps.StudentsConfig",
    "api.apps.ApiConfig",
    # Third-party apps
    "rest_framework",
    "rest_framework.authtoken",
    "rest_framework_simplejwt",
    "rest_framework_simplejwt.token_blacklist",
    "django_filters",
    "corsheaders",
    "django_extensions",
    # Allauth & dj-rest-auth
    "django.contrib.sites",
    "allauth",
    "allauth.account",
    "allauth.socialaccount",
    "dj_rest_auth",
    "dj_rest_auth.registration",
]

if DEBUG:
    INSTALLED_APPS += ["debug_toolbar", "django_browser_reload"]

# ==============================================================================
# MIDDLEWARE
# ==============================================================================

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "allauth.account.middleware.AccountMiddleware",
]

if DEBUG:
    MIDDLEWARE += [
        "debug_toolbar.middleware.DebugToolbarMiddleware",
        "django_browser_reload.middleware.BrowserReloadMiddleware",
    ]

# ==============================================================================
# URLS, TEMPLATES, AND WSGI
# ==============================================================================

ROOT_URLCONF = "django_rest_main.urls"
WSGI_APPLICATION = "django_rest_main.wsgi.application"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# ==============================================================================
# DATABASE
# ==============================================================================

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is required")

DATABASES = {
    "default": dj_database_url.config(
        default=DATABASE_URL,
        conn_max_age=600,
        ssl_require=(ENVIRONMENT == "prod"),
    )
}

# ==============================================================================
# AUTHENTICATION & API CONFIGURATION
# ==============================================================================

SITE_ID = 1
AUTH_USER_MODEL = "students.UserProfile"
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]

ACCOUNT_LOGIN_METHODS = {"email", "username"}
ACCOUNT_SIGNUP_FIELDS = ["email*", "username*", "password1*", "password2*"]
ACCOUNT_EMAIL_VERIFICATION = "none"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "dj_rest_auth.jwt_auth.JWTCookieAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ),
    "DEFAULT_PAGINATION_CLASS": "api.pagination.SmallResultsSetPagination",
    "PAGE_SIZE": 2,  # optional fallback, but not needed if your class sets page_size
    "DEFAULT_FILTER_BACKENDS": ("django_filters.rest_framework.DjangoFilterBackend",),
}

# ==============================================================================
# SIMPLE JWT CONFIGURATION (cleaned up)
# ==============================================================================

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),  # Increased for better UX
    "REFRESH_TOKEN_LIFETIME": timedelta(days=7),
    "ROTATE_REFRESH_TOKENS": True,  # Better security
    "BLACKLIST_AFTER_ROTATION": True,  # Better security
    "UPDATE_LAST_LOGIN": False,
    # Removed cookie settings since dj-rest-auth handles them
}

# ==============================================================================
# JWT COOKIES CONFIG FOR LOCAL AND PROD (fixed)
# ==============================================================================

REST_AUTH = {
    "USE_JWT": True,
    "TOKEN_MODEL": None,
    "SESSION_LOGIN": False,
    "JWT_AUTH_COOKIE": "jwt-access-token",
    "JWT_AUTH_REFRESH_COOKIE": "jwt-refresh-token",
    "JWT_AUTH_HTTPONLY": True,
    "SIGNUP_FIELDS": {"email": {"required": True}, "username": {"required": True}},
    "JWT_AUTH_REFRESH_COOKIE_MAX_AGE": 7 * 24 * 60 * 60,  # 7 days
}

# Proper cookie & security settings based on environment
if DEBUG:
    # Local dev - same domain (127.0.0.1), simpler settings
    REST_AUTH["JWT_AUTH_SAMESITE"] = "Lax"  # Fixed: was "None"
    REST_AUTH["JWT_AUTH_SECURE"] = False  # Fixed: was True (no HTTPS in local)
    SESSION_COOKIE_SECURE = False  # Fixed: was True
    CSRF_COOKIE_SECURE = False  # Fixed: was True
    SECURE_SSL_REDIRECT = False
else:
    # Production - with HTTPS
    REST_AUTH["JWT_AUTH_SAMESITE"] = "Strict"  # More secure for same domain
    REST_AUTH["JWT_AUTH_SECURE"] = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_SSL_REDIRECT = True

# ==============================================================================
# PASSWORD VALIDATION
# ==============================================================================

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"
    },
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# ==============================================================================
# INTERNATIONALIZATION & STATIC FILES
# ==============================================================================

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
MEDIA_URL = "media/"
MEDIA_ROOT = BASE_DIR / "media"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
