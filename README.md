## Under the hood

Djanjucks uses Nunjucks as a template engine but extends the compiler and parser to align to Django's templating format.
It extends the Nunjucks Environment with the tags and filters with feature comparitiy to Django.

## Why does this exist?

I started looking for a library that could parse Django templates into static html with libraries like `Storybook`.
Nunjucks is inspired by Jinja, so it is a close match for Django's template syntax.

This project started off as multiple nested regex replacements that attempted to transform django templates into Nunjucks templates.
This required a custom webpack loader to precompile templates. Eventually I relaised I could extend the base compiler and parser to work with Django natively.

## What's not included

Djanjucks tries to implement all the default tags and filters that come built-in with Django. However some tags have been omitted because they don't make sense in a frontend context. These are `csrf_token`, `i18n`, `l10n`, `tz`, and `static`. Also the soon to be deprecated tags `ifequal` and `ifnotequal` are not included.

## Python support

Currently Djanjucks does not implement the `installJinjaCompat` Nunjucks extension. This could possibly be added in down the line with a custom implementation.

## Installation

```bash
npm install --save djanjucks
```

Installation follows the Nunjucks API:

```
import djanjucks from 'djanjucks';

djanjucks.configure({ autoescape: true });
djanjucks.renderString('Hello {{ username }}, { username: 'James' });
```

See more about methods, see [Nunjucks API Documentation](https://mozilla.github.io/nunjucks/api.html)

## Usage

For documentation on supported tags and filters, see [Django's Template Documentation](https://docs.djangoproject.com/en/2.2/ref/templates/builtins).
