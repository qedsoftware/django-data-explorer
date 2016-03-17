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