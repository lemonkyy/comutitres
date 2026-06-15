# =========================
# BASE
# =========================
FROM php:8.5.2-fpm-alpine AS base

RUN apk add --no-cache \
    nginx \
    git \
    bash \
    multirun

COPY --from=mlocati/php-extension-installer /usr/bin/install-php-extensions /usr/local/bin/
RUN install-php-extensions \
    pdo_mysql \
    intl \
    opcache \
    zip

COPY --from=composer:latest /usr/bin/composer /usr/local/bin/composer

ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /app

COPY ./nginx.conf /etc/nginx/http.d/default.conf

# =========================
# DEV
# =========================
FROM base AS dev

COPY . /app

RUN composer install

CMD ["multirun", "php-fpm -R -F", "nginx -g 'daemon off;'"]

# =========================
# PROD
# =========================
FROM base AS prod

ENV APP_ENV=prod
ENV APP_DEBUG=0
COPY composer.json composer.lock /app/

RUN composer install \
    --no-dev \
    --optimize-autoloader \
    --no-scripts \
    --prefer-dist

COPY . /app

RUN php bin/console cache:clear \
 && php bin/console cache:warmup

CMD ["multirun", "php-fpm -R -F", "nginx -g 'daemon off;'"]
