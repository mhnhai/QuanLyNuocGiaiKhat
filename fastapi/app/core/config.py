import os

from dotenv import load_dotenv

load_dotenv()

AUTH0_DOMAIN = os.getenv("AUTH0_DOMAIN", "")
AUTH0_CLIENT_ID = os.getenv("AUTH0_CLIENT_ID", "")
AUTH0_CLIENT_SECRET = os.getenv("AUTH0_CLIENT_SECRET", "")
AUTH0_CALLBACK_URL = os.getenv(
    "AUTH0_CALLBACK_URL", "http://localhost:8000/api/auth/callback"
)
AUTH0_ISSUER = f"https://{AUTH0_DOMAIN}/" if AUTH0_DOMAIN else ""
AUTH0_AUTHORIZE_URL = f"https://{AUTH0_DOMAIN}/authorize" if AUTH0_DOMAIN else ""
AUTH0_TOKEN_URL = f"https://{AUTH0_DOMAIN}/oauth/token" if AUTH0_DOMAIN else ""
AUTH0_LOGOUT_URL = f"https://{AUTH0_DOMAIN}/v2/logout" if AUTH0_DOMAIN else ""
AUTH0_JWKS_URL = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json" if AUTH0_DOMAIN else ""

APP_URL_ADMIN = os.getenv("APP_URL_ADMIN", "http://localhost:3000")
APP_URL_CUSTOMER = os.getenv("APP_URL_CUSTOMER", "http://localhost:3001")
ALLOWED_RETURN_URLS = {APP_URL_ADMIN, APP_URL_CUSTOMER}

JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-change-in-production")
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "15"))

COOKIE_NAME = "access_token"
COOKIE_MAX_AGE = ACCESS_TOKEN_EXPIRE_MINUTES * 60

REFRESH_COOKIE_NAME = "auth0_refresh_token"
REFRESH_COOKIE_MAX_AGE = 30 * 86400

ACCOUNT_TYPE_COOKIE_NAME = "app_account_type"
