"""
Django settings for dentest project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'q&(ymk$u0)=g9e3wukv6@qkly$&c-$=07ds#&jnt=0wicm@o^i'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

TEMPLATE_DEBUG = True

ALLOWED_HOSTS = ['mjkilian1992.pythonanywhere.com','www.dentests.co.uk']

SITE_ID = 1

# Application definition
INSTALLED_APPS = (
    'django.contrib.admin.apps.SimpleAdminConfig',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites',

    #CORS
    'corsheaders',

    #Third Party Apps#
    'sslify',
    'adminplus',
    'tinymce',
    'rest_framework',
    'rest_framework.authtoken',
    'djoser',
    'watson',
    'django_countries',

    #My Apps
    'questions',
    'restful_auth',
    'subscriptions',
)

#Security
SSLIFY_DISABLE = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True

MIDDLEWARE_CLASSES = (
    'sslify.middleware.SSLifyMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

CORS_ORIGIN_WHITELIST =[
    'dentests.co.uk'
]

ROOT_URLCONF = 'dentest.urls'

WSGI_APPLICATION = 'dentest.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mjkilian1992$default',
        'USER': 'mjkilian1992',
        'PASSWORD': 'dentest',
        'HOST': 'mjkilian1992.mysql.pythonanywhere-services.com',
        'TEST_NAME': 'mjkilian1992$test_default',
    }
}


# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/

STATIC_URL = '/static/'
STATIC_ROOT= '/var/www/static/'
STATICFILES_FINDERS = (
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
)

# Email Config
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'

EMAIL_HOST = "smtp.gmail.com"
EMAIL_HOST_USER = "dentest.reg@gmail.com"
EMAIL_HOST_PASSWORD = 'password196258'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
DEFAULT_FROM_EMAIL = EMAIL_HOST_USER


REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES':(
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
}

# TinyMCE config
TINYMCE_DEFAULT_CONFIG = {
    'plugins': "table,spellchecker,paste,searchreplace",
    'cleanup_on_startup': True,
    'custom_undo_redo_levels': 10,
}
TINYMCE_SPELLCHECKER = True


#===================================RESTFUL AUTH CONFIG===============================================================#

# Site info
USE_TZ = True # Allow timezones

DOMAIN = 'localhost:9001'
SITE_NAME = 'Dentest'
AUTHENTICATION_BACKENDS = (
    'django.contrib.auth.backends.ModelBackend',
    'restful_auth.backends.UsernameOrEmailBackend',
)
EMAIL_UNIQUE =True # Asserts that an email can only be used once for reg


# email confirmations & password resets
EMAIL_CONFIRMATION_DAYS_VALID = 3
ACTIVATION_URL = 'email_activation/{username}/{token}'
PASSWORD_RESET_DAYS_VALID = 3
PASSWORD_RESET_CONFIRM_URL = 'password_reset_confirm/{username}/{token}'
DEFAULT_PROTOCOL = 'http'
FROM_EMAIL = 'dentest.reg@gmail.com'


TEMPLATE_CONTEXT_PROCESSORS = ("django.contrib.auth.context_processors.auth",
                               "django.core.context_processors.debug",
                               "django.core.context_processors.i18n",
                               "django.core.context_processors.media",
                               "django.core.context_processors.static",
                               "django.core.context_processors.tz",
                               "django.contrib.messages.context_processors.messages",
)

TEMPLATE_DIRS = (
    '/restful_auth/templates/',
)

# Password Requirements
PASSWORD_MIN_LENGTH = 8
PASSWORD_COMPLEXITY = { # You can omit any or all of these for no limit for that particular set
    "UPPER": 1,        # Uppercase
    "LOWER": 1,        # Lowercase
    "LETTERS": 1,       # Either uppercase or lowercase letters
    "DIGITS": 1,       # Digits
    #"PUNCTUATION": 1,  # Punctuation (string.punctuation)
    #"SPECIAL": 1,      # Not alphanumeric, space or punctuation character
    #"WORDS": 1         # Words (alphanumeric sequences separated by a whitespace or punctuation character)
}

# LOGGING CONFIG
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '%(levelname)s %(asctime)s %(module)s %(process)d %(thread)d %(message)s'
        },
        'simple': {
            'format': '%(levelname)s %(message)s'
        },
    },
    'handlers': {
        'file':{
            'filename' : "./logs/dentest.log",
            'level': 'INFO',
            'class': 'logging.handlers.TimedRotatingFileHandler',
            'when': 'd',
            'interval': 1,
            'backupCount': 7,
            'formatter' : 'verbose'
        },

        'mail_admins': {
            'level': 'ERROR',
            'class': 'django.utils.log.AdminEmailHandler',
            'formatter' : 'verbose'
        }
    },
    'root':{
        'handlers': ['file'],
        'propagate': True,
        'level': 'INFO',
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'propagate': True,
            'level': 'INFO',
        },
        'django.request': {
            'handlers': ['mail_admins','file'],
            'level': 'INFO',
            'propagate': False,
        },
    }
}


