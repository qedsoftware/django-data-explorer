Dependencies
============

Python
------

Install Python requirements with pip.

    pip install -r requirements.txt

Frontend
--------

To get frontend dependencies, you need to have `Node.js` installed.

After installing `Node.js`, install the frontend dependencies by running
the following from the root of your Django checkout:

    npm install
    npm run deps

Then build frontend files:

    npm run build

For development run

    npm run start

that way build will happen automatically each time you change any related files.

Django static files - important note
------------------------------------
Contents of the folders listed below are generated automatically.

    /django_querybuilder/static/django_querybuilder/libs
    /django_querybuilder/static/django_querybuilder/css

**Do not modify them manually.**

They are included to enable the package to work immediately after installing it via pip.

Running tests
=============

Django
------

    ./manage.py jenkins

Frontend
--------

    npm test

All tests
--------
    ./jenkins.py

Docs
====

Generate JavaScript docs into directory `js_docs`:

    npm run js-docs

In Python, see docstrings for documentation. You can also browse them using
`help` method and using:

    python -m pydoc django_querybuilder

Test coverage
=============

JavaScript test coverage is available in the test output. To see Python coverage
report, execute in directory `example`:

    coverage3 run ./manage.py test
    coverage3 html ../django_querybuilder/*py
